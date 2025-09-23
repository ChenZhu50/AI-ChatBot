import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { productRepository } from '../repositories/product.repository';
import { reviewRepository } from '../repositories/review.repository';

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

      const product = await productRepository.getProduct(productId);
      if (!product) {
         return res.status(400).json({ error: 'Invalid product ID' });
      }

      const reviews = await reviewRepository.getReviews(productId);
      if (!reviews.length) {
         res.status(400).json({ error: 'No reviews for this product' });
         return;
      }

      const summary = await reviewService.summarizeReviews(productId);
      res.json({ summary });
   },
};
