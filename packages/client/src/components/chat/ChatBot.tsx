import axios from 'axios';
import { useRef, useState } from 'react';
import TypingIndicator from './TypingIndicator';
import type { Message } from './ChatMessage';
import ChatMessage from './ChatMessage';
import ChatInput, { type ChatFormData } from './ChatInput';
import ChatError from './ChatError';

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const conversationId = useRef(crypto.randomUUID());

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
         setIsBotTyping(true);
         setError(null);

         const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt,
            conversationId: conversationId.current,
         });
         setMessages((prev) => [
            ...prev,
            { role: 'bot', content: data.message },
         ]);
         setIsBotTyping(false);
      } catch (error) {
         console.error('Error fetching chat response:', error);
         setError('Failed to get response. Please try again.');
      } finally {
         setIsBotTyping(false);
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-4 mb-4 overflow-y-auto">
            <ChatMessage messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && <ChatError error={error} setError={setError} />}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;
