import type { Review } from '../generated/prisma/index.js';
import { reviewRepository } from '../repositories/review.repository.js';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },

   async summarizeReviews(productId: number): Promise<string> {
      //get last 10 reviews for the product(cuz 1000 maybe too much for gpt/ most recent is enough)
      const reviews = await reviewRepository.getReviews(productId, 10);

      //map them, and combine them into a single string
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      //send to gpt for summarization
      //for now just hard code it
      return `Summary of reviews for product ${productId}:\n\n${joinedReviews}`;
   },
};
