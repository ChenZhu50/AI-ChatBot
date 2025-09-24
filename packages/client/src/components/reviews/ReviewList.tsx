import axios from 'axios';
import StartRating from './StartRating';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import { HiSparkles } from 'react-icons/hi2';
import { useState } from 'react';
import { Button } from '../ui/button';
import ReviewSkeleton from './ReviewSkeleton';

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

type SummarizeResponse = {
   summary: string;
};

const ReviewList = ({ productId }: Props) => {
   const [summarized, setSummarized] = useState('');
   const [isSummarizing, setIsSummarizing] = useState(false);

   const [summaryError, setSummaryError] = useState('');

   const {
      data: reviews,
      isLoading,
      error,
   } = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => fetchReviews(),
   });

   const handleSummarize = async () => {
      try {
         setIsSummarizing(true);
         setSummaryError('');
         const { data } = await axios.post<SummarizeResponse>(
            `/api/products/${productId}/reviews/summarize`
         );
         setSummarized(data.summary);
         setIsSummarizing(false);
      } catch (error) {
         console.error('Error summarizing reviews:', error);
         setSummaryError('Failed to summarize reviews');
      } finally {
         setIsSummarizing(false);
      }
   };

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
               <ReviewSkeleton key={placeholder} />
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

   const currentSummary = summarized || reviews.summary;

   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={handleSummarize}
                     className="cursor-pointer"
                     disabled={isSummarizing}
                  >
                     <HiSparkles />
                     Summarize Reviews
                  </Button>
                  {isSummarizing && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {summaryError && (
                     <div className="text-red-500">{summaryError}</div>
                  )}
               </div>
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
