import { Request, Response } from 'express';
import { GroqService } from '../services/groq';
import fs from 'fs';

export const assistantController = {
  async handleCommand(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

      let commandText = '';

      // If audio file is uploaded
      if (req.file) {
        commandText = await GroqService.transcribeAudio(req.file.path, req.file.originalname);
        
        // Clean up the temp file asynchronously
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Failed to delete temp audio file:', err);
        });
      } 
      // If text command is sent
      else if (req.body.command) {
        commandText = req.body.command;
      } 
      else {
        return res.status(400).json({ error: { message: 'No command or audio provided' } });
      }

      if (!commandText.trim()) {
        return res.status(400).json({ error: { message: 'Empty command' } });
      }

      // Get user's timezone from request headers if available
      const timezone = req.headers['x-timezone'] as string || 'UTC';

      // Process the command via LLM + Function Calling
      const reply = await GroqService.processCommand(commandText, userId, timezone);

      res.json({
        data: {
          transcript: req.file ? commandText : undefined,
          reply
        }
      });
    } catch (error: any) {
      console.error('Assistant error:', error);
      res.status(500).json({ error: { message: error.message || 'Failed to process command' } });
    }
  }
};
