import { FaStar } from 'react-icons/fa';
import { FaRegStar } from 'react-icons/fa';

type Props = {
   value: number;
};

const StartRating = ({ value }: Props) => {
   const placeholderArray = [1, 2, 3, 4, 5];

   return (
      <div className="flex gap-1 text-yellow-500">
         {placeholderArray.map((p) =>
            p <= value ? <FaStar key={p} /> : <FaRegStar key={p} />
         )}
      </div>
   );
};

export default StartRating;
