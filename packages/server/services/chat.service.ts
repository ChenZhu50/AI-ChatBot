import fs from 'fs';
import path from 'path';
import { conversationRepository } from '../repositories/conversation.repository';
import OpenAI from 'openai';
import template from '../prompts/chatbot.txt';

//Implementation detail, so not exported
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
   'utf-8'
);
const instruction = template.replace('{{parkInfo}}', parkInfo);

interface ChatResponse {
   id: string;
   message: string;
}

//public interface
//leaky abstraction,
// for example: we are calling output_text at index.ts which let ppl know that we are using openai

export const chatService = {
   sendMessage: async (
      conversationId: string,
      prompt: string
   ): Promise<ChatResponse> => {
      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         instructions: instruction,
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 100,
         previous_response_id:
            conversationRepository.getLastResponseId(conversationId),
      });

      conversationRepository.setLastResponseId(conversationId, response.id);
      return {
         id: response.id,
         message: response.output_text, //if we want to change the LLM, this the only place we need to change
      };
   },
};
