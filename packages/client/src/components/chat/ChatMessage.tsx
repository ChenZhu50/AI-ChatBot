import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
   role: 'user' | 'bot';
   content: string;
};

type Props = {
   messages: Message[];
};

const ChatMessage = ({ messages }: Props) => {
   const lastMessageRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const onCopyMessage = (e: React.ClipboardEvent) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };

   return (
      <div className="flex flex-col gap-4">
         {messages.map((msg, index) => (
            <div
               key={index}
               onCopy={onCopyMessage}
               ref={index === messages.length - 1 ? lastMessageRef : null}
               className={`px-3 py-1 rounded-3xl max-w-md 
                  ${
                     msg.role === 'user'
                        ? 'bg-blue-600 text-white self-end rounded-l-3xl rounded-tr-3xl'
                        : 'bg-gray-200 text-black self-start rounded-r-3xl rounded-tl-3xl'
                  }`}
            >
               <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
         ))}
      </div>
   );
};

export default ChatMessage;
