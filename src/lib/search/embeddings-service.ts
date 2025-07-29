/**
 * OpenAI Embeddings Service
 * 
 * Handles content vectorization and similarity search using OpenAI embeddings
 */

import OpenAI from 'openai';
import { ContentItem } from '@/lib/database/enhanced-supabase';

export interface EmbeddingResult {
  contentId: string;
  embedding: number[];
  embeddingType: 'content' | 'title' | 'summary';
  modelVersion: string;
}

export interface SimilarityResult {
  contentId: string;
  similarity: number;
  content: ContentItem;
}

/**
 * OpenAI Embeddings Service for content vectorization
 */
export class EmbeddingsService {
  private openai: OpenAI;
  private modelVersion = 'text-embedding-3-small'; // More cost-effective than ada-002

  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY
    });
  }

  /**
   * Generate embeddings for content text
   */
  async generateEmbedding(text: string, type: 'content' | 'title' | 'summary' = 'content'): Promise<number[]> {
    try {
      // Clean and prepare text
      const cleanText = this.prepareTextForEmbedding(text, type);
      
      if (!cleanText.trim()) {
        throw new Error('Empty text provided for embedding');
      }

      const response = await this.openai.embeddings.create({
        model: this.modelVersion,
        input: cleanText,
        encoding_format: 'float'
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('No embedding data returned from OpenAI');
      }

      return response.data[0].embedding;

    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async generateBatchEmbeddings(
    texts: Array<{ text: string; type: 'content' | 'title' | 'summary'; contentId: string }>
  ): Promise<EmbeddingResult[]> {
    const batchSize = 100; // OpenAI batch limit
    const results: EmbeddingResult[] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      
      try {
        const cleanTexts = batch.map(item => this.prepareTextForEmbedding(item.text, item.type));
        
        const response = await this.openai.embeddings.create({
          model: this.modelVersion,
          input: cleanTexts,
          encoding_format: 'float'
        });

        if (response.data && response.data.length === batch.length) {
          for (let j = 0; j < batch.length; j++) {
            results.push({
              contentId: batch[j].contentId,
              embedding: response.data[j].embedding,
              embeddingType: batch[j].type,
              modelVersion: this.modelVersion
            });
          }
        }

      } catch (error) {
        console.error(`Error generating batch embeddings for batch ${i / batchSize + 1}:`, error);
        // Continue with next batch rather than failing completely
      }
    }

    return results;
  }

  /**
   * Generate embedding for search query with intent understanding
   */
  async generateQueryEmbedding(query: string, searchIntent?: string): Promise<number[]> {
    // Enhance query with intent context for better matching
    let enhancedQuery = query;
    
    if (searchIntent) {
      switch (searchIntent) {
        case 'implementation':
          enhancedQuery = `How to implement: ${query}`;
          break;
        case 'philosophy':
          enhancedQuery = `Philosophy and principles of: ${query}`;
          break;
        case 'examples':
          enhancedQuery = `Examples and case studies of: ${query}`;
          break;
        case 'conceptual':
          enhancedQuery = `Understanding and explanation of: ${query}`;
          break;
      }
    }

    return this.generateEmbedding(enhancedQuery, 'content');
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same dimension');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
    
    if (magnitude === 0) {
      return 0;
    }

    return dotProduct / magnitude;
  }

  /**
   * Find most similar content based on embedding similarity
   */
  async findSimilarContent(
    queryEmbedding: number[],
    contentEmbeddings: Array<{ contentId: string; embedding: number[]; content: ContentItem }>,
    threshold: number = 0.7,
    limit: number = 10
  ): Promise<SimilarityResult[]> {
    const similarities: SimilarityResult[] = [];

    for (const item of contentEmbeddings) {
      try {
        const similarity = this.calculateCosineSimilarity(queryEmbedding, item.embedding);
        
        if (similarity >= threshold) {
          similarities.push({
            contentId: item.contentId,
            similarity,
            content: item.content
          });
        }
      } catch (error) {
        console.error(`Error calculating similarity for content ${item.contentId}:`, error);
        // Continue with other items
      }
    }

    // Sort by similarity score (highest first) and limit results
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  /**
   * Prepare text for embedding generation
   */
  private prepareTextForEmbedding(text: string, type: 'content' | 'title' | 'summary'): string {
    if (!text) return '';

    // Clean the text
    let cleanText = text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s\-.,!?;:()"']/g, '') // Remove special characters
      .trim();

    // Truncate based on type to stay within token limits
    const maxLength = type === 'title' ? 200 : type === 'summary' ? 1000 : 8000;
    
    if (cleanText.length > maxLength) {
      cleanText = cleanText.substring(0, maxLength).trim();
      
      // Try to end at a word boundary
      const lastSpace = cleanText.lastIndexOf(' ');
      if (lastSpace > maxLength * 0.8) {
        cleanText = cleanText.substring(0, lastSpace);
      }
    }

    return cleanText;
  }

  /**
   * Generate content summary for embedding
   */
  generateContentSummary(content: ContentItem): string {
    const parts = [
      content.title,
      content.description,
      content.philosophy_domain ? `Philosophy: ${content.philosophy_domain}` : '',
      content.key_concepts.length > 0 ? `Concepts: ${content.key_concepts.join(', ')}` : '',
      content.themes.length > 0 ? `Themes: ${content.themes.join(', ')}` : '',
      content.tags.length > 0 ? `Tags: ${content.tags.join(', ')}` : ''
    ].filter(Boolean);

    return parts.join('. ');
  }

  /**
   * Check if embeddings service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return false;
      }

      // Test with a simple embedding
      await this.generateEmbedding('test', 'title');
      return true;
    } catch (error) {
      console.error('Embeddings service not available:', error);
      return false;
    }
  }

  /**
   * Get embedding model information
   */
  getModelInfo(): { model: string; dimensions: number; maxTokens: number } {
    return {
      model: this.modelVersion,
      dimensions: 1536, // text-embedding-3-small dimensions
      maxTokens: 8191
    };
  }
}

// Singleton instance
export const embeddingsService = new EmbeddingsService();