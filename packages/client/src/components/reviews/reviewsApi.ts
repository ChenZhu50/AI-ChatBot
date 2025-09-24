import axios from 'axios';

export type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

export type GetReviewsResponse = {
   reviews: Review[];
   summary: string | null;
};

export type SummarizeResponse = {
   summary: string;
};

export const reviewApi = {
   fetchReviews(productId: number) {
      return axios
         .get(`/api/reviews?productId=${productId}`)
         .then((response) => response.data);
   },

   summarizeReviews(productId: number) {
      return axios
         .post(`/api/reviews/summarize`, { productId })
         .then((response) => response.data);
   },
};

export default reviewApi;
