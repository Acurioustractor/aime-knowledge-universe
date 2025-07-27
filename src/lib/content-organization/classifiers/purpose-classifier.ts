/**
 * Purpose Classifier
 * 
 * This module provides a classifier for determining the purpose of content.
 */

import { ContentItem } from '../../content-integration/models/content-item';
import { 
  ContentPurpose, 
  PurposeContentItem,
  StoryDetails,
  ToolDetails,
  ResearchDetails,
  EventDetails,
  UpdateDetails
} from '../models/purpose-content';

/**
 * Purpose classifier interface
 */
export interface PurposeClassifier {
  /**
   * Classify content by purpose
   */
  classifyContent(content: ContentItem): PurposeContentItem;
  
  /**
   * Get the primary purpose of content
   */
  getPrimaryPurpose(content: ContentItem): ContentPurpose;
  
  /**
   * Get the secondary purposes of content
   */
  getSecondaryPurposes(content: ContentItem): ContentPurpose[];
  
  /**
   * Calculate the purpose relevance score for content
   */
  getPurposeScore(content: ContentItem, purpose: ContentPurpose): number;
}

/**
 * Default purpose classifier implementation
 */
export class DefaultPurposeClassifier implements PurposeClassifier {
  // Purpose keywords for classification
  private purposeKeywords = {
    story: ['story', 'journey', 'personal', 'narrative', 'experience', 'impact story'],
    research: ['research', 'findings', 'analysis', 'data', 'study', 'report', 'insights'],
    tool: ['tool', 'toolkit', 'worksheet', 'guide', 'template', 'implementation', 'resource'],
    event: ['event', 'workshop', 'webinar', 'training', 'program', 'conference', 'meeting'],
    update: ['update', 'newsletter', 'announcement', 'news', 'release']
  };
  
  /**
   * Classify content by purpose
   */
  classifyContent(content: ContentItem): PurposeContentItem {
    // Calculate purpose scores
    const storyScore = this.getPurposeScore(content, 'story');
    const researchScore = this.getPurposeScore(content, 'research');
    const toolScore = this.getPurposeScore(content, 'tool');
    const eventScore = this.getPurposeScore(content, 'event');
    const updateScore = this.getPurposeScore(content, 'update');
    
    // Determine primary purpose (highest score)
    const scores = [
      { purpose: 'story', score: storyScore },
      { purpose: 'research', score: researchScore },
      { purpose: 'tool', score: toolScore },
      { purpose: 'event', score: eventScore },
      { purpose: 'update', score: updateScore }
    ];
    
    scores.sort((a, b) => b.score - a.score);
    
    const primaryPurpose = scores[0].purpose as ContentPurpose;
    const purposeRelevance = scores[0].score;
    
    // Determine secondary purposes (score > 30 and not primary)
    const secondaryPurposes = scores
      .filter(item => item.purpose !== primaryPurpose && item.score > 30)
      .map(item => item.purpose as ContentPurpose);
    
    // Create purpose-specific details
    const purposeDetails = this.createPurposeDetails(content, primaryPurpose);
    
    // Return classified content
    return {
      ...content,
      primaryPurpose,
      purposeRelevance,
      secondaryPurposes: secondaryPurposes.length > 0 ? secondaryPurposes : undefined,
      ...purposeDetails
    };
  }
  
  /**
   * Get the primary purpose of content
   */
  getPrimaryPurpose(content: ContentItem): ContentPurpose {
    // Calculate purpose scores
    const storyScore = this.getPurposeScore(content, 'story');
    const researchScore = this.getPurposeScore(content, 'research');
    const toolScore = this.getPurposeScore(content, 'tool');
    const eventScore = this.getPurposeScore(content, 'event');
    const updateScore = this.getPurposeScore(content, 'update');
    
    // Determine primary purpose (highest score)
    const scores = [
      { purpose: 'story', score: storyScore },
      { purpose: 'research', score: researchScore },
      { purpose: 'tool', score: toolScore },
      { purpose: 'event', score: eventScore },
      { purpose: 'update', score: updateScore }
    ];
    
    scores.sort((a, b) => b.score - a.score);
    
    return scores[0].purpose as ContentPurpose;
  }
  
  /**
   * Get the secondary purposes of content
   */
  getSecondaryPurposes(content: ContentItem): ContentPurpose[] {
    // Calculate purpose scores
    const storyScore = this.getPurposeScore(content, 'story');
    const researchScore = this.getPurposeScore(content, 'research');
    const toolScore = this.getPurposeScore(content, 'tool');
    const eventScore = this.getPurposeScore(content, 'event');
    const updateScore = this.getPurposeScore(content, 'update');
    
    // Determine primary purpose (highest score)
    const scores = [
      { purpose: 'story', score: storyScore },
      { purpose: 'research', score: researchScore },
      { purpose: 'tool', score: toolScore },
      { purpose: 'event', score: eventScore },
      { purpose: 'update', score: updateScore }
    ];
    
    scores.sort((a, b) => b.score - a.score);
    
    const primaryPurpose = scores[0].purpose as ContentPurpose;
    
    // Determine secondary purposes (score > 30 and not primary)
    return scores
      .filter(item => item.purpose !== primaryPurpose && item.score > 30)
      .map(item => item.purpose as ContentPurpose);
  }
  
  /**
   * Calculate the purpose relevance score for content
   */
  getPurposeScore(content: ContentItem, purpose: ContentPurpose): number {
    let score = 0;
    
    // Check title for purpose keywords
    if (content.title) {
      const titleLower = content.title.toLowerCase();
      this.purposeKeywords[purpose].forEach(keyword => {
        if (titleLower.includes(keyword.toLowerCase())) {
          score += 20;
        }
      });
    }
    
    // Check description for purpose keywords
    if (content.description) {
      const descriptionLower = content.description.toLowerCase();
      this.purposeKeywords[purpose].forEach(keyword => {
        if (descriptionLower.includes(keyword.toLowerCase())) {
          score += 10;
        }
      });
    }
    
    // Check tags for purpose keywords
    if (content.tags) {
      content.tags.forEach(tag => {
        if (this.purposeKeywords[purpose].includes(tag.toLowerCase())) {
          score += 15;
        }
      });
    }
    
    // Check content type
    if (purpose === 'story' && content.contentType === 'video') {
      score += 10;
    } else if (purpose === 'research' && content.contentType === 'document') {
      score += 10;
    } else if (purpose === 'tool' && content.contentType === 'document') {
      score += 10;
    } else if (purpose === 'event' && content.contentType === 'event') {
      score += 20;
    } else if (purpose === 'update' && content.contentType === 'newsletter') {
      score += 20;
    }
    
    // Check source
    if (purpose === 'story' && content.source === 'youtube') {
      score += 10;
    } else if (purpose === 'update' && content.source === 'mailchimp') {
      score += 10;
    }
    
    return Math.min(score, 100);
  }
  
  /**
   * Create purpose-specific details
   */
  private createPurposeDetails(content: ContentItem, purpose: ContentPurpose): {
    storyDetails?: StoryDetails;
    toolDetails?: ToolDetails;
    researchDetails?: ResearchDetails;
    eventDetails?: EventDetails;
    updateDetails?: UpdateDetails;
  } {
    switch (purpose) {
      case 'story':
        return {
          storyDetails: this.createStoryDetails(content)
        };
      case 'tool':
        return {
          toolDetails: this.createToolDetails(content)
        };
      case 'research':
        return {
          researchDetails: this.createResearchDetails(content)
        };
      case 'event':
        return {
          eventDetails: this.createEventDetails(content)
        };
      case 'update':
        return {
          updateDetails: this.createUpdateDetails(content)
        };
      default:
        return {};
    }
  }
  
  /**
   * Create story details
   */
  private createStoryDetails(content: ContentItem): StoryDetails {
    // Determine story type
    let storyType: 'personal' | 'case_study' | 'impact' | 'journey' = 'journey';
    
    if (content.title) {
      const titleLower = content.title.toLowerCase();
      if (titleLower.includes('personal') || titleLower.includes('my journey')) {
        storyType = 'personal';
      } else if (titleLower.includes('case study')) {
        storyType = 'case_study';
      } else if (titleLower.includes('impact')) {
        storyType = 'impact';
      }
    }
    
    if (content.tags) {
      if (content.tags.includes('personal')) {
        storyType = 'personal';
      } else if (content.tags.includes('case study')) {
        storyType = 'case_study';
      } else if (content.tags.includes('impact')) {
        storyType = 'impact';
      }
    }
    
    return {
      storyType
    };
  }
  
  /**
   * Create tool details
   */
  private createToolDetails(content: ContentItem): ToolDetails {
    // Determine tool type
    let toolType: 'implementation' | 'worksheet' | 'guide' | 'toolkit' | 'template' = 'guide';
    
    if (content.title) {
      const titleLower = content.title.toLowerCase();
      if (titleLower.includes('implementation')) {
        toolType = 'implementation';
      } else if (titleLower.includes('worksheet')) {
        toolType = 'worksheet';
      } else if (titleLower.includes('toolkit')) {
        toolType = 'toolkit';
      } else if (titleLower.includes('template')) {
        toolType = 'template';
      }
    }
    
    if (content.tags) {
      if (content.tags.includes('implementation')) {
        toolType = 'implementation';
      } else if (content.tags.includes('worksheet')) {
        toolType = 'worksheet';
      } else if (content.tags.includes('toolkit')) {
        toolType = 'toolkit';
      } else if (content.tags.includes('template')) {
        toolType = 'template';
      }
    }
    
    return {
      toolType
    };
  }
  
  /**
   * Create research details
   */
  private createResearchDetails(content: ContentItem): ResearchDetails {
    // Determine research type
    let researchType: 'finding' | 'analysis' | 'synthesis' | 'data' | 'report' = 'report';
    
    if (content.title) {
      const titleLower = content.title.toLowerCase();
      if (titleLower.includes('finding')) {
        researchType = 'finding';
      } else if (titleLower.includes('analysis')) {
        researchType = 'analysis';
      } else if (titleLower.includes('synthesis')) {
        researchType = 'synthesis';
      } else if (titleLower.includes('data')) {
        researchType = 'data';
      }
    }
    
    if (content.tags) {
      if (content.tags.includes('finding')) {
        researchType = 'finding';
      } else if (content.tags.includes('analysis')) {
        researchType = 'analysis';
      } else if (content.tags.includes('synthesis')) {
        researchType = 'synthesis';
      } else if (content.tags.includes('data')) {
        researchType = 'data';
      }
    }
    
    return {
      researchType
    };
  }
  
  /**
   * Create event details
   */
  private createEventDetails(content: ContentItem): EventDetails {
    // Determine event type
    let eventType: 'workshop' | 'webinar' | 'training' | 'conference' | 'meeting' = 'meeting';
    
    if (content.title) {
      const titleLower = content.title.toLowerCase();
      if (titleLower.includes('workshop')) {
        eventType = 'workshop';
      } else if (titleLower.includes('webinar')) {
        eventType = 'webinar';
      } else if (titleLower.includes('training')) {
        eventType = 'training';
      } else if (titleLower.includes('conference')) {
        eventType = 'conference';
      }
    }
    
    if (content.tags) {
      if (content.tags.includes('workshop')) {
        eventType = 'workshop';
      } else if (content.tags.includes('webinar')) {
        eventType = 'webinar';
      } else if (content.tags.includes('training')) {
        eventType = 'training';
      } else if (content.tags.includes('conference')) {
        eventType = 'conference';
      }
    }
    
    return {
      eventType
    };
  }
  
  /**
   * Create update details
   */
  private createUpdateDetails(content: ContentItem): UpdateDetails {
    // Determine update type
    let updateType: 'newsletter' | 'announcement' | 'news' | 'release' = 'news';
    
    if (content.title) {
      const titleLower = content.title.toLowerCase();
      if (titleLower.includes('newsletter')) {
        updateType = 'newsletter';
      } else if (titleLower.includes('announcement')) {
        updateType = 'announcement';
      } else if (titleLower.includes('release')) {
        updateType = 'release';
      }
    }
    
    if (content.tags) {
      if (content.tags.includes('newsletter')) {
        updateType = 'newsletter';
      } else if (content.tags.includes('announcement')) {
        updateType = 'announcement';
      } else if (content.tags.includes('release')) {
        updateType = 'release';
      }
    }
    
    return {
      updateType
    };
  }
}