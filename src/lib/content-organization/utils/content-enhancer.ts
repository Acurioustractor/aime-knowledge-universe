/**
 * Content Enhancer Utility
 * 
 * This utility enhances content items with purpose information.
 */

import { ContentItem } from '../../content-integration/models/content-item';
import { PurposeContentItem } from '../models/purpose-content';
import { PurposeClassifier } from '../classifiers/purpose-classifier';

/**
 * Content enhancer interface
 */
export interface ContentEnhancer {
  /**
   * Enhance a content item with purpose information
   */
  enhanceWithPurpose(content: ContentItem): PurposeContentItem;
  
  /**
   * Enhance multiple content items with purpose information
   */
  enhanceMultipleWithPurpose(content: ContentItem[]): PurposeContentItem[];
}

/**
 * Default content enhancer implementation
 */
export class DefaultContentEnhancer implements ContentEnhancer {
  private purposeClassifier: PurposeClassifier;
  
  constructor(purposeClassifier: PurposeClassifier) {
    this.purposeClassifier = purposeClassifier;
  }
  
  /**
   * Enhance a content item with purpose information
   */
  enhanceWithPurpose(content: ContentItem): PurposeContentItem {
    return this.purposeClassifier.classifyContent(content);
  }
  
  /**
   * Enhance multiple content items with purpose information
   */
  enhanceMultipleWithPurpose(content: ContentItem[]): PurposeContentItem[] {
    return content.map(item => this.enhanceWithPurpose(item));
  }
}