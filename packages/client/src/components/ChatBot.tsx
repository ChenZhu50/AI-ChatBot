import axios from 'axios';
import { useRef, type KeyboardEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

type Message = {
   role: 'user' | 'bot';
   content: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const conversationId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
      reset();
      const { data } = await axios.post<ChatResponse>('/api/chat', {
         prompt,
         conversationId: conversationId.current,
      });
      setMessages((prev) => [...prev, { role: 'bot', content: data.message }]);
   };

   //when we take this onKeyDown function out
   //we need to explicitly say what type is our e
   //since inside form element, e is for sure a form event
   const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         handleSubmit(onSubmit)();
         e.preventDefault();
      }
   };

   return (
      <div>
         <div className="flex flex-col gap-4 mb-4 max-h-[500px] overflow-y-auto">
            {messages.map((msg, index) => (
               <p
                  key={index}
                  className={`px-3 py-1 rounded-3xl max-w-[70%] whitespace-pre-wrap
                  ${
                     msg.role === 'user'
                        ? 'bg-blue-600 text-white self-end rounded-l-3xl rounded-tr-3xl'
                        : 'bg-gray-200 text-black self-start rounded-r-3xl rounded-tl-3xl'
                  }`}
               >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
               </p>
            ))}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 0,
               })}
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="Ask me anything..."
               maxLength={1000}
            ></textarea>
            <Button
               disabled={!formState.isValid}
               className="rounded-full w-9 h-9"
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default ChatBot;
