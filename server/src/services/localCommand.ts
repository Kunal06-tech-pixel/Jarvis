import { prisma } from '../db/prisma';

type ParsedDateTime = {
  value: Date | null;
  hasDate: boolean;
  hasTime: boolean;
};

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function cleanCommand(command: string) {
  return command
    .trim()
    .replace(/^hey\s+jarvis[,:\s]*/i, '')
    .replace(/^jarvis[,:\s]*/i, '')
    .trim();
}

function isValidDate(date: Date) {
  return !Number.isNaN(date.getTime());
}

function applyTime(date: Date, hour: number, minute: number, hasMeridiem: boolean) {
  let normalizedHour = hour;

  if (!hasMeridiem && normalizedHour >= 1 && normalizedHour <= 7) {
    normalizedHour += 12;
  }

  date.setHours(normalizedHour, minute, 0, 0);
}

function parseDateTime(command: string): ParsedDateTime {
  const lower = command.toLowerCase();
  const now = new Date();
  const result = new Date(now);
  let hasDate = false;
  let hasTime = false;

  const relativeMatch = lower.match(/\bin\s+(\d+)\s*(minute|minutes|hour|hours|day|days|week|weeks)\b/);
  if (relativeMatch) {
    const amount = Number(relativeMatch[1]);
    const unit = relativeMatch[2];
    const relativeDate = new Date(now);

    if (unit.startsWith('minute')) relativeDate.setMinutes(relativeDate.getMinutes() + amount);
    if (unit.startsWith('hour')) relativeDate.setHours(relativeDate.getHours() + amount);
    if (unit.startsWith('day')) relativeDate.setDate(relativeDate.getDate() + amount);
    if (unit.startsWith('week')) relativeDate.setDate(relativeDate.getDate() + amount * 7);

    return { value: relativeDate, hasDate: true, hasTime: true };
  }

  if (/\btomorrow\b/.test(lower)) {
    result.setDate(result.getDate() + 1);
    result.setHours(9, 0, 0, 0);
    hasDate = true;
    hasTime = true;
  } else if (/\btoday\b/.test(lower)) {
    hasDate = true;
  } else if (/\btonight\b/.test(lower)) {
    result.setHours(20, 0, 0, 0);
    hasDate = true;
    hasTime = true;
  }

  const weekdayIndex = WEEKDAYS.findIndex((weekday) => new RegExp(`\\b${weekday}\\b`).test(lower));
  if (weekdayIndex >= 0) {
    const daysUntil = (weekdayIndex - result.getDay() + 7) % 7 || 7;
    result.setDate(result.getDate() + daysUntil);
    result.setHours(9, 0, 0, 0);
    hasDate = true;
    hasTime = true;
  }

  const isoDateMatch = lower.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (isoDateMatch) {
    const [year, month, day] = isoDateMatch[1].split('-').map(Number);
    result.setFullYear(year, month - 1, day);
    hasDate = true;
  }

  const timeMatch = lower.match(/\b(?:at\s*)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/) ||
    lower.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\b/);

  if (timeMatch) {
    let hour = Number(timeMatch[1]);
    const minute = timeMatch[2] ? Number(timeMatch[2]) : 0;
    const meridiem = timeMatch[3];

    if (meridiem === 'pm' && hour < 12) hour += 12;
    if (meridiem === 'am' && hour === 12) hour = 0;

    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      applyTime(result, hour, minute, Boolean(meridiem));
      hasTime = true;
    }
  }

  if (!hasDate && hasTime && result <= now) {
    result.setDate(result.getDate() + 1);
  }

  return {
    value: hasDate || hasTime ? result : null,
    hasDate,
    hasTime,
  };
}

function removeDateTimeWords(text: string) {
  return text
    .replace(/\bin\s+\d+\s*(minute|minutes|hour|hours|day|days|week|weeks)\b/gi, '')
    .replace(/\b(today|tomorrow|tonight|sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/gi, '')
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, '')
    .replace(/\b(?:at\s*)?\d{1,2}(?::\d{2})?\s*(am|pm)\b/gi, '')
    .replace(/\bat\s+\d{1,2}(?::\d{2})?\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleFromReminder(command: string) {
  return removeDateTimeWords(
    command
      .replace(/^remind\s+me\s+(to|about|for)?\s*/i, '')
      .replace(/^set\s+(a\s+)?reminder\s+(to|about|for)?\s*/i, '')
  );
}

function titleFromTask(command: string) {
  return removeDateTimeWords(
    command
      .replace(/^(add|create|make)\s+(a\s+)?(task|todo|to-do)\s+(to|for)?\s*/i, '')
      .replace(/^(add|create|make)\s*/i, '')
  );
}

function titleFromEvent(command: string) {
  return removeDateTimeWords(
    command
      .replace(/^(schedule|create|add)\s+(an?\s+)?(event|meeting|appointment)\s+(called|named|for)?\s*/i, '')
      .replace(/^(schedule|create|add)\s*/i, '')
  );
}

export async function processLocalCommand(command: string, userId: string) {
  const cleaned = cleanCommand(command);
  const lower = cleaned.toLowerCase();

  // 1. Direct Wake Word / Greeting Calling
  if (
    !cleaned ||
    /^(hey|hello|hi|yo|greetings|jarvis|hey jarvis|ok jarvis|wake up|are you there|you there)\b/i.test(lower) && lower.length < 20
  ) {
    const greetings = [
      "Yes? I'm online and listening. How can I help you?",
      "At your service. What would you like me to do?",
      "Jarvis online. What's on your mind?",
      "I'm here. Go ahead with your command."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // 2. Persona & Capability Queries
  if (/^(who are you|what are you|introduce yourself)\b/i.test(lower)) {
    return "I am Jarvis, your neural AI productivity assistant. I manage your tasks, schedule calendar events, set smart reminders, and organize your day.";
  }

  if (/^(what can you do|help|capabilities|how does this work)\b/i.test(lower)) {
    return "You can speak to me naturally to create tasks, set reminders, book calendar meetings, or ask 'What is on my schedule today?'.";
  }

  if (/^(how are you|how's it going|how are things)\b/i.test(lower)) {
    return "All neural subsystems are operating at peak efficiency. Ready for your directives.";
  }

  // 3. Conversational Closures & Gratitude
  if (/^(thank you|thanks|thanks jarvis|appreciate it)\b/i.test(lower)) {
    return "You're very welcome, sir. Let me know if you need anything else.";
  }

  if (/^(that'?s all|that is all|nothing else|goodbye|bye|see you|sleep|dismissed|stand down)\b/i.test(lower)) {
    return "Understood. Standing by in the background.";
  }

  // 4. Schedule & Overview Queries
  if (/^(what('| i)?s|show|get|tell me).*\b(schedule|agenda|reminders|tasks|events)\b/.test(lower)) {
    const now = new Date();
    const [tasks, events, reminders] = await Promise.all([
      prisma.task.findMany({ where: { userId, status: 'TODO' }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.event.findMany({ where: { userId, startTime: { gte: now } }, orderBy: { startTime: 'asc' }, take: 5 }),
      prisma.reminder.findMany({ where: { userId, remindAt: { gte: now }, status: 'ACTIVE' }, orderBy: { remindAt: 'asc' }, take: 5 }),
    ]);

    return `You have ${tasks.length} open tasks, ${events.length} upcoming events, and ${reminders.length} active reminders. Anything you'd like me to update?`;
  }

  // 5. Reminders
  if (/^(remind\s+me|set\s+(a\s+)?reminder)\b/i.test(cleaned)) {
    const title = titleFromReminder(cleaned);
    const parsedTime = parseDateTime(cleaned);

    if (!title) {
      return 'What should I remind you about?';
    }

    if (!parsedTime.value || !parsedTime.hasDate || !parsedTime.hasTime || !isValidDate(parsedTime.value)) {
      return 'What date and time should I set the reminder for?';
    }

    await prisma.reminder.create({
      data: {
        userId,
        title,
        remindAt: parsedTime.value,
      },
    });

    return `Reminder set for ${parsedTime.value.toLocaleString()}. Anything else?`;
  }

  // 6. Tasks
  if (/^(add|create|make)\s+(a\s+)?(task|todo|to-do)\b/i.test(cleaned)) {
    const title = titleFromTask(cleaned);
    const parsedTime = parseDateTime(cleaned);

    if (!title) {
      return 'What task should I add?';
    }

    await prisma.task.create({
      data: {
        userId,
        title,
        priority: 'MEDIUM',
        dueDate: parsedTime.value && isValidDate(parsedTime.value) ? parsedTime.value : null,
      },
    });

    return 'I have added that to your tasks. What next?';
  }

  // 7. Calendar Events
  if (/^(schedule|create|add)\s+(an?\s+)?(event|meeting|appointment)\b/i.test(cleaned)) {
    const title = titleFromEvent(cleaned);
    const parsedTime = parseDateTime(cleaned);

    if (!title) {
      return 'What should I call the event?';
    }

    if (!parsedTime.value || !parsedTime.hasDate || !parsedTime.hasTime || !isValidDate(parsedTime.value)) {
      return 'What date and time should I schedule it for?';
    }

    const endTime = new Date(parsedTime.value.getTime() + 60 * 60 * 1000);
    await prisma.event.create({
      data: {
        userId,
        title,
        startTime: parsedTime.value,
        endTime,
      },
    });

    return 'Your event has been scheduled. Anything else for your calendar?';
  }

  return null;
}
