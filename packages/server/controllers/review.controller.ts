import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';

export const reviewController = {
   async getReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         return res.status(400).json({ error: 'Invalid product ID' });
      }
      try {
         const reviews = await reviewService.getReviews(productId);
         res.json(reviews);
      } catch (error) {
         console.error('Error fetching reviews:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   },
   async summarizeReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         return res.status(400).json({ error: 'Invalid product ID' });
      }

      const summary = await reviewService.summarizeReviews(productId);
      res.json({ summary });
   },
};
