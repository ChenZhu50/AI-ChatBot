import type { Review } from '../generated/prisma/index.js';
import { reviewRepository } from '../repositories/review.repository.js';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },
};
