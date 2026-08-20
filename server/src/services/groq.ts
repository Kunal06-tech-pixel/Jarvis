import Groq, { toFile } from 'groq-sdk';
import fs from 'fs';
import { prisma } from '../db/prisma';
import { processLocalCommand } from './localCommand';
import { scheduleReminderJob } from './worker';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'MISSING_API_KEY',
});

const TOOLS: Groq.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'create_task',
      description: 'Creates a new task in the user\'s to-do list.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'The name or description of the task.' },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
          dueDate: { type: 'string', description: 'ISO-8601 datetime string for when the task is due, if specified.' },
          tags: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Infer 1-3 contextual tags for the task (e.g. work, personal, shopping, urgent).'
          }
        },
        required: ['title']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'create_reminder',
      description: 'Creates a reminder alert for a specific time. Can also handle recurring reminders.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'What to remind the user about.' },
          time: { type: 'string', description: 'ISO-8601 datetime string for when the reminder should trigger.' },
          recurrence: { type: 'string', description: 'If recurring, specify the pattern (e.g., "daily", "weekly:mon,wed,fri", "monthly:15"). Otherwise omit.' }
        },
        required: ['title', 'time']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'create_event',
      description: 'Schedules a calendar event or meeting. Will warn of conflicts unless forced.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'The title of the event.' },
          startTime: { type: 'string', description: 'ISO-8601 datetime string for when the event starts.' },
          endTime: { type: 'string', description: 'ISO-8601 datetime string for when the event ends. Defaults to 1 hour after startTime if not specified.' },
          location: { type: 'string', description: 'Physical location or meeting link.' },
          force: { type: 'boolean', description: 'Set to true to force scheduling even if there is a conflict. Default is false.' }
        },
        required: ['title', 'startTime']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_schedule',
      description: 'Retrieves the user\'s upcoming tasks, events, and reminders to answer questions about their schedule.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
];

export class GroqService {
  /**
   * Transcribes an audio file using Groq's Whisper API.
   */
  static async transcribeAudio(filePath: string, originalName: string = 'recording.webm'): Promise<string> {
    try {
      const fileObj = await toFile(fs.createReadStream(filePath), originalName);
      const transcription = await groq.audio.transcriptions.create({
        file: fileObj,
        model: 'whisper-large-v3-turbo',
        response_format: 'json',
      });
      return transcription.text;
    } catch (error: any) {
      console.error('Transcription error:', error);
      if (error?.message?.includes('too short')) {
        return '';
      }
      throw new Error('Failed to transcribe audio');
    }
  }

  /**
   * Processes a text command using Llama 3 with tool calling.
   */
  static async processCommand(command: string, userId: string, timezone: string = 'UTC') {
    const localReply = await processLocalCommand(command, userId);
    if (localReply) {
      return localReply;
    }

    const systemPrompt = `You are Jarvis, an advanced AI personal task assistant. 
The current date and time is ${new Date().toISOString()}. The user's timezone is ${timezone}.
Your job is to interpret the user's natural language command and execute the appropriate actions using the provided tools.
You can create tasks, reminders, and events, or retrieve the user's schedule.
If the user asks you to do something that requires a tool, call the tool. 
After calling the tool, respond briefly and professionally confirming the action (e.g., "I've added that to your tasks." or "Your meeting is scheduled.").
Do not output markdown or long explanations unless asked. Keep it conversational and concise as this will be read aloud or displayed in a quick UI.`;

    const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: command }
    ];

    try {
      const response = await groq.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        messages: messages,
        tools: TOOLS,
        tool_choice: 'auto',
        max_tokens: 1024,
      });

      const responseMessage = response.choices[0].message;

      // If the model decided to call a tool
      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        messages.push(responseMessage); // append the assistant's tool call message

        for (const toolCall of responseMessage.tool_calls) {
          const functionName = toolCall.function.name;
          const args = JSON.parse(toolCall.function.arguments);
          let functionResult = '';

          try {
            if (functionName === 'create_task') {
              const task = await prisma.task.create({
                data: {
                  userId,
                  title: args.title,
                  priority: args.priority || 'MEDIUM',
                  dueDate: args.dueDate ? new Date(args.dueDate) : null,
                  tags: args.tags || [],
                }
              });
              functionResult = JSON.stringify({ success: true, task });
            } 
            else if (functionName === 'create_reminder') {
              const reminder = await prisma.reminder.create({
                data: {
                  userId,
                  title: args.title,
                  remindAt: new Date(args.time),
                  recurrence: args.recurrence || null,
                }
              });
              await scheduleReminderJob(reminder);
              functionResult = JSON.stringify({ success: true, reminder });
            }
            else if (functionName === 'create_event') {
              const startTime = new Date(args.startTime);
              const endTime = args.endTime ? new Date(args.endTime) : new Date(startTime.getTime() + 60 * 60 * 1000);
              
              if (!args.force) {
                const conflicts = await prisma.event.findMany({
                  where: {
                    userId,
                    status: 'CONFIRMED',
                    OR: [
                      { startTime: { lt: endTime, gte: startTime } },
                      { endTime: { gt: startTime, lte: endTime } },
                      { startTime: { lte: startTime }, endTime: { gte: endTime } }
                    ]
                  }
                });
                
                if (conflicts.length > 0) {
                  functionResult = JSON.stringify({ 
                    success: false, 
                    conflict: true, 
                    message: 'Event conflicts with existing schedule.', 
                    conflictingEvents: conflicts 
                  });
                }
              }

              if (!functionResult) {
                const event = await prisma.event.create({
                  data: {
                    userId,
                    title: args.title,
                    startTime,
                    endTime,
                    location: args.location,
                  }
                });
                functionResult = JSON.stringify({ success: true, event });
              }
            }
            else if (functionName === 'get_schedule') {
              const [tasks, events, reminders] = await Promise.all([
                prisma.task.findMany({ where: { userId, status: 'TODO' } }),
                prisma.event.findMany({ where: { userId, startTime: { gte: new Date() } } }),
                prisma.reminder.findMany({ where: { userId, remindAt: { gte: new Date() }, status: 'ACTIVE' } })
              ]);
              functionResult = JSON.stringify({ tasks, events, reminders });
            }
          } catch (e: any) {
            functionResult = JSON.stringify({ error: e.message });
          }

          messages.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            content: functionResult,
          });
        }

        // Get the final response from the model after the tool execution
        const finalResponse = await groq.chat.completions.create({
          model: 'openai/gpt-oss-120b',
          messages: messages,
        });

        return finalResponse.choices[0].message.content;
      }

      // If no tool was called, just return the text response
      return responseMessage.content;
    } catch (error) {
      console.error('Groq LLM error:', error);
      throw new Error('Failed to process command');
    }
  }
}


