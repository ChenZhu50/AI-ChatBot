import axios from 'axios';
import StartRating from './StartRating';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import { HiSparkles } from 'react-icons/hi2';

type Props = {
   productId: number;
};

type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

type GetReviewsResponse = {
   reviews: Review[];
   summary: string | null;
};

const ReviewList = ({ productId }: Props) => {
   const {
      data: reviews,
      isLoading,
      error,
   } = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => fetchReviews(),
   });

   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((placeholder) => (
               <div key={placeholder}>
                  <Skeleton width={150} />
                  <Skeleton width={100} />
                  <Skeleton count={2} />
               </div>
            ))}
         </div>
      );
   }

   if (error) {
      return <div className="text-red-500">Error: {error.message}</div>;
   }

   if (!reviews?.reviews.length) {
      return null;
   }

   return (
      <div>
         <div className="mb-5">
            {reviews?.summary ? (
               <p>{reviews.summary}</p>
            ) : (
               <button>
                  <HiSparkles />
                  Summarize Reviews
               </button>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviews?.reviews.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  <div>
                     <StartRating value={review.rating} />
                  </div>
                  <div>{review.content}</div>
                  <div>
                     Reviewed on:{' '}
                     {new Date(review.createdAt).toLocaleDateString()}
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReviewList;
