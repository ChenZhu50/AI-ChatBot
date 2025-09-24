import axios from 'axios';
import StartRating from './StartRating';
import { useMutation, useQuery } from '@tanstack/react-query';
import { HiSparkles } from 'react-icons/hi2';
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
   const summaryMutation = useMutation({
      mutationFn: () => summarizeReviews(),
   });

   const reviewsQuery = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => fetchReviews(),
   });

   const summarizeReviews = async () => {
      const { data } = await axios.post<SummarizeResponse>(
         `/api/products/${productId}/reviews/summarize`
      );
      return data;
   };

   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };

   if (reviewsQuery.isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((placeholder) => (
               <ReviewSkeleton key={placeholder} />
            ))}
         </div>
      );
   }

   if (reviewsQuery.error) {
      return (
         <div className="text-red-500">Error: {reviewsQuery.error.message}</div>
      );
   }

   if (!reviewsQuery.data?.reviews.length) {
      return null;
   }

   const currentSummary =
      summaryMutation.data?.summary || reviewsQuery.data?.summary;

   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={() => summaryMutation.mutate()}
                     className="cursor-pointer"
                     disabled={summaryMutation.isPending}
                  >
                     <HiSparkles />
                     Summarize Reviews
                  </Button>
                  {summaryMutation.isPending && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {summaryMutation.isError && (
                     <div className="text-red-500">
                        {summaryMutation.error.message}
                     </div>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewsQuery.data?.reviews.map((review) => (
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
