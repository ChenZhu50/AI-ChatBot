type Props = {
   error: string;
   setError: (error: string | null) => void;
};

const ChatError = ({ error, setError }: Props) => {
   return (
      <div className="flex justify-center">
         <div
            className="px-3 py-1 rounded-3xl max-w-[70%] bg-red-200 text-red-800 self-center"
            onClick={() => setError(null)}
         >
            {error} (click to dismiss)
         </div>
      </div>
   );
};

export default ChatError;
