import axios from 'axios';
import { useEffect, useState } from 'react';
import StartRating from './StartRating';
import Skeleton from 'react-loading-skeleton';

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
   const [reviews, setReviews] = useState<GetReviewsResponse>();
   const [loading, setLoading] = useState<boolean>(false);

   const fetchReviews = async () => {
      setLoading(true);
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      setReviews(data);
      setLoading(false);
   };

   useEffect(() => {
      fetchReviews();
   }, []);

   if (loading) {
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

   return (
      <div className="flex flex-col gap-5">
         {reviews?.reviews.map((review) => (
            <div key={review.id}>
               <div className="font-semibold">{review.author}</div>
               <div>
                  <StartRating value={review.rating} />
               </div>
               <div>{review.content}</div>
               <div>
                  Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
               </div>
            </div>
         ))}
      </div>
   );
};

export default ReviewList;
