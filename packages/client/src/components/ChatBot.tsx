import axios from 'axios';
import { useRef, type KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';

type FormData = {
   prompt: string;
};

const ChatBot = () => {
   const conversationId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      reset();
      const { data } = await axios.post('/api/chat', {
         prompt,
         conversationId: conversationId.current,
      });
      console.log(data);
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
         >
            <Button
               disabled={!formState.isValid}
               className="rounded-full w-9 h-9"
            >
               <FaArrowUp />
            </Button>
         </textarea>
      </form>
   );
};

export default ChatBot;
