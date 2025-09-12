import { chatService } from '../services/chat.service';
import type { Request, Response } from 'express';
import z from 'zod';

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required.')
      .max(1000, 'Prompt is too long.'),

   conversationId: z.string().uuid(),
});

export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parseResult = chatSchema.safeParse(req.body);

      if (!parseResult.success) {
         res.status(400).json({ errors: parseResult.error.format() });
         return;
      }

      try {
         const { prompt, conversationId } = req.body;
         const response = await chatService.sendMessage(conversationId, prompt);

         res.json({ message: response.message });
      } catch (error) {
         res.status(500).json({
            error: 'An error occurred while processing your request.',
         });
      }
   },
};
