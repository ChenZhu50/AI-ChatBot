import axios from 'axios';
import React, { useEffect, useState } from 'react';

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

   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      setReviews(data);
   };

   useEffect(() => {
      fetchReviews();
   }, []);

   return (
      <div className="flex flex-col gap-5">
         {reviews?.reviews.map((review) => (
            <div key={review.id}>
               <div className="font-semibold">{review.author}</div>
               <div>Rating: {review.rating}/5</div>
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
