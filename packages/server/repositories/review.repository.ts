import { PrismaClient } from '../generated/prisma';
import type { Review } from '../generated/prisma';

export const reviewRepository = {
   async getReviews(productId: number): Promise<Review[]> {
      const prisma = new PrismaClient();

      return prisma.review.findMany({
         where: { productID: productId },
         orderBy: { createdAt: 'desc' },
      });
   },
};
