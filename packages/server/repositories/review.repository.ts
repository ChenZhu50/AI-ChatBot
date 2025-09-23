import { PrismaClient } from '../generated/prisma';
import type { Review } from '../generated/prisma';
import dayjs from 'dayjs';

const prisma = new PrismaClient();
export const reviewRepository = {
   async getReviews(productId: number, limit?: number): Promise<Review[]> {
      return prisma.review.findMany({
         where: { productID: productId },
         orderBy: { createdAt: 'desc' },
         take: limit,
      });
   },

   storeReviewSummary: async (productId: number, summary: string) => {
      const now = new Date();
      const expiresAt = dayjs().add(7, 'day').toDate();
      const data = {
         content: summary,
         expiresAt,
         createdAt: now,
         productID: productId,
      };

      return prisma.summary.upsert({
         where: { productID: productId },
         create: data,
         update: data,
      });
   },

   async getReviewSummary(productId: number): Promise<string | null> {
      const summary = await prisma.summary.findFirst({
         where: {
            AND: [{ productID: productId }, { expiresAt: { gt: new Date() } }],
         },
      });
      return summary ? summary.content : null;
   },
};
