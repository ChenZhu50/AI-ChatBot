import type { Review } from '../generated/prisma/index.js';
import { llmClient } from '../llm/client.js';
import { reviewRepository } from '../repositories/review.repository.js';
import template from '../prompts/summarize-reviews.txt';

export const reviewService = {
   async summarizeReviews(productId: number): Promise<string> {
      //check if we have a recent summary in the db
      const existingSummary =
         await reviewRepository.getReviewSummary(productId);

      if (existingSummary) {
         return existingSummary;
      }

      //get last 10 reviews for the product(cuz 1000 maybe too much for gpt/ most recent is enough)
      const reviews = await reviewRepository.getReviews(productId, 10);

      //map them, and combine them into a single string
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      //send to gpt for summarization
      //for now just hard code it

      const prompt = template.replace('{{reviews}}', joinedReviews);

      const response = await llmClient.generateText({
         model: 'gpt-4o-mini',
         prompt,
         temperature: 0.2,
         maxTokens: 500,
      });

      //store the summary in the db with an expiration date of 7 days from now
      const summary = response.text;

      await reviewRepository.storeReviewSummary(productId, summary);

      return summary;
   },
};
