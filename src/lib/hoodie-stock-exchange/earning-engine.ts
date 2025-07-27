/**
 * Hoodie Stock Exchange Earning Engine
 * 
 * Implements the logic for how hoodies are earned based on the exact Airtable criteria.
 * This connects learning activities to hoodie earning as designed in the system.
 */

import { getDatabase, getSupabaseClient } from '@/lib/database/connection';
import { HoodieStockExchangeData } from '@/lib/integrations/hoodie-stock-exchange-data';

export interface EarningCriteria {
  hoodie_id: string;
  hoodie_name: string;
  category_area: string;
  type: string;
  who_can_earn: string;
  impact_baseline: string;
  required_actions: EarningAction[];
  prerequisites: string[];
  imagination_credits_awarded: number;
  impact_multiplier: number;
}

export interface EarningAction {
  action_type: 'content_engagement' | 'mentorship_activity' | 'community_contribution' | 'real_world_impact';
  specific_requirement: string;
  measurement_criteria: string;
  completion_threshold: number;
}

export interface EarningEvent {
  learner_id: string;
  learner_name: string;
  learner_email?: string;
  hoodie_id: string;
  earning_method: 'content_completion' | 'mentorship' | 'community_validation' | 'impact_demonstration';
  completion_evidence: {
    content_engaged?: string[];
    mentorship_provided?: string;
    community_contribution?: string;
    impact_story?: string;
    validation_source?: string;
  };
  earned_at: string;
  imagination_credits_earned: number;
  acquisition_story: string;
}

/**
 * Hoodie Earning Engine
 * Processes earning criteria from Airtable and determines when hoodies should be awarded
 */
export class HoodieEarningEngine {

  /**
   * Parse Airtable earning criteria into structured requirements
   */
  parseEarningCriteria(hoodieData: HoodieStockExchangeData): EarningCriteria {
    const whoCanEarn = hoodieData.acquisition_story || '';
    const impactBaseline = hoodieData.base_impact_value.toString();
    
    return {
      hoodie_id: hoodieData.id,
      hoodie_name: hoodieData.name,
      category_area: hoodieData.associated_content || '',
      type: hoodieData.tags[0] || 'Tool',
      who_can_earn: whoCanEarn,
      impact_baseline: impactBaseline,
      required_actions: this.extractRequiredActions(whoCanEarn, hoodieData.category),
      prerequisites: hoodieData.prerequisites || [],
      imagination_credits_awarded: hoodieData.impact_contribution,
      impact_multiplier: hoodieData.imagination_credit_multiplier
    };
  }

  /**
   * Extract specific earning actions from "Who can earn the hoodie" text
   */
  private extractRequiredActions(whoCanEarn: string, category: string): EarningAction[] {
    const actions: EarningAction[] = [];
    const text = whoCanEarn.toLowerCase();

    // Content engagement requirements
    if (text.includes('complete') || text.includes('watch') || text.includes('study')) {
      actions.push({
        action_type: 'content_engagement',
        specific_requirement: 'Complete related AIME content',
        measurement_criteria: 'Video watch completion, tool usage, business case study',
        completion_threshold: 1
      });
    }

    // Mentorship requirements
    if (text.includes('mentor') || text.includes('guide') || text.includes('support')) {
      actions.push({
        action_type: 'mentorship_activity',
        specific_requirement: 'Provide mentorship to others',
        measurement_criteria: 'Documented mentoring sessions or guidance provided',
        completion_threshold: 1
      });
    }

    // Community contribution requirements
    if (text.includes('community') || text.includes('contribute') || text.includes('share')) {
      actions.push({
        action_type: 'community_contribution',
        specific_requirement: 'Contribute to community knowledge',
        measurement_criteria: 'Knowledge sharing, peer support, community building',
        completion_threshold: 1
      });
    }

    // Real-world impact requirements
    if (text.includes('impact') || text.includes('transformation') || text.includes('change')) {
      actions.push({
        action_type: 'real_world_impact',
        specific_requirement: 'Demonstrate real-world application',
        measurement_criteria: 'Documented outcomes, transformation stories, measurable change',
        completion_threshold: 1
      });
    }

    // Category-specific requirements
    if (category === 'transformation' && actions.length === 0) {
      actions.push({
        action_type: 'real_world_impact',
        specific_requirement: 'Lead or facilitate transformation process',
        measurement_criteria: 'Documented organizational or community change',
        completion_threshold: 1
      });
    }

    if (category === 'knowledge' && actions.length === 0) {
      actions.push({
        action_type: 'content_engagement',
        specific_requirement: 'Master knowledge domain content',
        measurement_criteria: 'Complete learning path, demonstrate understanding',
        completion_threshold: 1
      });
    }

    // Default requirement if no specific actions found
    if (actions.length === 0) {
      actions.push({
        action_type: 'content_engagement',
        specific_requirement: 'Engage with related AIME content',
        measurement_criteria: 'Content completion and reflection',
        completion_threshold: 1
      });
    }

    return actions;
  }

  /**
   * Check if a learner is eligible to earn a specific hoodie
   */
  async checkEarningEligibility(
    learnerId: string, 
    hoodieId: string,
    completedActions: {
      content_engaged: string[];
      mentorship_provided?: string;
      community_contributions: string[];
      impact_demonstrations: string[];
    }
  ): Promise<{
    eligible: boolean;
    missing_requirements: string[];
    progress_percentage: number;
    next_steps: string[];
  }> {
    try {
      const db = await getDatabase();
      
      // Get hoodie criteria
      const hoodie = await db.get(
        'SELECT * FROM hoodies WHERE id = ?',
        [hoodieId]
      );

      if (!hoodie) {
        return {
          eligible: false,
          missing_requirements: ['Hoodie not found'],
          progress_percentage: 0,
          next_steps: []
        };
      }

      const criteria = this.parseEarningCriteria(hoodie);
      const missingRequirements: string[] = [];
      const nextSteps: string[] = [];
      let completedRequirements = 0;

      // Check each required action
      for (const action of criteria.required_actions) {
        let actionCompleted = false;

        switch (action.action_type) {
          case 'content_engagement':
            actionCompleted = completedActions.content_engaged.length >= action.completion_threshold;
            if (!actionCompleted) {
              missingRequirements.push(`Complete ${action.completion_threshold} content item(s)`);
              nextSteps.push(`Engage with ${criteria.category_area} content`);
            }
            break;

          case 'mentorship_activity':
            actionCompleted = !!completedActions.mentorship_provided;
            if (!actionCompleted) {
              missingRequirements.push('Provide mentorship to community member');
              nextSteps.push('Find someone to mentor in your area of expertise');
            }
            break;

          case 'community_contribution':
            actionCompleted = completedActions.community_contributions.length >= action.completion_threshold;
            if (!actionCompleted) {
              missingRequirements.push('Make community contribution');
              nextSteps.push('Share knowledge or support others in the community');
            }
            break;

          case 'real_world_impact':
            actionCompleted = completedActions.impact_demonstrations.length >= action.completion_threshold;
            if (!actionCompleted) {
              missingRequirements.push('Demonstrate real-world impact');
              nextSteps.push('Document how your learning created positive change');
            }
            break;
        }

        if (actionCompleted) {
          completedRequirements++;
        }
      }

      // Check prerequisites
      for (const prerequisite of criteria.prerequisites) {
        const hasPrerequisite = await this.checkLearnerHasPrerequisite(learnerId, prerequisite);
        if (!hasPrerequisite) {
          missingRequirements.push(`Prerequisite: ${prerequisite}`);
          nextSteps.push(`Complete prerequisite: ${prerequisite}`);
        } else {
          completedRequirements++;
        }
      }

      const totalRequirements = criteria.required_actions.length + criteria.prerequisites.length;
      const progressPercentage = totalRequirements > 0 ? (completedRequirements / totalRequirements) * 100 : 0;
      const eligible = missingRequirements.length === 0;

      return {
        eligible,
        missing_requirements: missingRequirements,
        progress_percentage: Math.round(progressPercentage),
        next_steps: nextSteps
      };

    } catch (error) {
      console.error('Error checking earning eligibility:', error);
      return {
        eligible: false,
        missing_requirements: ['System error during eligibility check'],
        progress_percentage: 0,
        next_steps: ['Contact support']
      };
    }
  }

  /**
   * Award a hoodie to a learner
   */
  async awardHoodie(earningEvent: EarningEvent): Promise<{
    success: boolean;
    holder_id?: string;
    error?: string;
  }> {
    try {
      const db = await getDatabase();
      
      // Check if already earned
      const existingAward = await db.get(
        'SELECT id FROM hoodie_holders WHERE hoodie_id = ? AND holder_id = ? AND is_active = 1',
        [earningEvent.hoodie_id, earningEvent.learner_id]
      );

      if (existingAward) {
        return {
          success: false,
          error: 'Hoodie already earned by this learner'
        };
      }

      // Create holder record
      const holderId = `holder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      await db.run(`
        INSERT INTO hoodie_holders (
          id, hoodie_id, holder_id, holder_name, holder_email,
          acquired_method, acquisition_story, current_impact_contribution,
          utilization_rate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        holderId,
        earningEvent.hoodie_id,
        earningEvent.learner_id,
        earningEvent.learner_name,
        earningEvent.learner_email || '',
        earningEvent.earning_method,
        earningEvent.acquisition_story,
        earningEvent.imagination_credits_earned,
        100 // Full utilization for newly earned hoodies
      ]);

      // Update hoodie holder count
      await db.run(
        'UPDATE hoodies SET current_holders = current_holders + 1 WHERE id = ?',
        [earningEvent.hoodie_id]
      );

      // Update learner's imagination credits
      await db.run(`
        INSERT OR REPLACE INTO imagination_credits (
          id, holder_id, credits_balance, credits_earned_lifetime,
          last_credit_activity_at
        ) VALUES (?, ?, 
          COALESCE((SELECT credits_balance FROM imagination_credits WHERE holder_id = ?), 0) + ?,
          COALESCE((SELECT credits_earned_lifetime FROM imagination_credits WHERE holder_id = ?), 0) + ?,
          ?
        )
      `, [
        `credits-${earningEvent.learner_id}`,
        earningEvent.learner_id,
        earningEvent.learner_id,
        earningEvent.imagination_credits_earned,
        earningEvent.learner_id,
        earningEvent.imagination_credits_earned,
        earningEvent.earned_at
      ]);

      // Log earning event
      await db.run(`
        INSERT INTO achievement_earned_events (
          id, achievement_id, learner_id, earned_at, earning_story,
          content_completed, community_contribution, impact_demonstrated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        earningEvent.hoodie_id,
        earningEvent.learner_id,
        earningEvent.earned_at,
        earningEvent.acquisition_story,
        JSON.stringify(earningEvent.completion_evidence.content_engaged || []),
        earningEvent.completion_evidence.community_contribution || '',
        earningEvent.completion_evidence.impact_story || ''
      ]);

      console.log(`✅ Hoodie awarded: ${earningEvent.hoodie_id} to ${earningEvent.learner_name}`);

      return {
        success: true,
        holder_id: holderId
      };

    } catch (error) {
      console.error('Error awarding hoodie:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Process automatic hoodie earning based on content completion
   */
  async processContentCompletionEarning(
    learnerId: string,
    learnerName: string,
    contentId: string,
    contentType: string,
    completionData: any
  ): Promise<void> {
    try {
      const db = await getDatabase();
      
      // Find hoodies that could be earned through this content
      const eligibleHoodies = await db.all(`
        SELECT h.* FROM hoodies h
        WHERE h.associated_content_id = ? 
           OR h.category = ?
           OR h.unlock_criteria LIKE ?
      `, [
        contentId,
        this.mapContentTypeToCategory(contentType),
        `%${contentType}%`
      ]);

      for (const hoodie of eligibleHoodies) {
        // Check if learner meets all criteria
        const eligibility = await this.checkEarningEligibility(learnerId, hoodie.id, {
          content_engaged: [contentId],
          community_contributions: [],
          impact_demonstrations: []
        });

        if (eligibility.eligible) {
          // Award the hoodie
          await this.awardHoodie({
            learner_id: learnerId,
            learner_name: learnerName,
            hoodie_id: hoodie.id,
            earning_method: 'content_completion',
            completion_evidence: {
              content_engaged: [contentId]
            },
            earned_at: new Date().toISOString(),
            imagination_credits_earned: hoodie.base_impact_value * hoodie.imagination_credit_multiplier,
            acquisition_story: `Earned through completion of ${contentType}: ${contentId}`
          });
        }
      }

    } catch (error) {
      console.error('Error processing content completion earning:', error);
    }
  }

  /**
   * Sync earned hoodies back to Airtable
   */
  async syncEarningToAirtable(earningEvent: EarningEvent): Promise<void> {
    const apiKey = process.env.AIRTABLE_API_KEY;
    if (!apiKey) {
      console.warn('No Airtable API key, skipping sync');
      return;
    }

    try {
      // Update the "Latest 5 earners" and "Life time hoodie earners" fields
      const baseId = 'appkGLUAFOIGUhvoF';
      const tableName = 'HOODIE STOCK EXCHANGE';
      
      // Get current record
      const getUrl = `https://api.airtable.com/v0/${baseId}/${tableName}/${earningEvent.hoodie_id}`;
      const getResponse = await fetch(getUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (getResponse.ok) {
        const record = await getResponse.json();
        const currentEarners = record.fields['Latest 5 earners'] || '';
        const currentCount = record.fields['Life time hoodie earners'] || 0;

        // Update earners list (add new earner to beginning, keep only 5)
        const earnersList = currentEarners.split(',').map((e: string) => e.trim()).filter(Boolean);
        earnersList.unshift(earningEvent.learner_name);
        const updatedEarners = earnersList.slice(0, 5).join(', ');

        // Update the record
        const updateUrl = `https://api.airtable.com/v0/${baseId}/${tableName}/${earningEvent.hoodie_id}`;
        await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              'Latest 5 earners': updatedEarners,
              'Life time hoodie earners': currentCount + 1
            }
          })
        });

        console.log(`✅ Updated Airtable with new earner: ${earningEvent.learner_name}`);
      }

    } catch (error) {
      console.error('Error syncing to Airtable:', error);
    }
  }

  /**
   * Helper methods
   */
  private async checkLearnerHasPrerequisite(learnerId: string, prerequisite: string): Promise<boolean> {
    try {
      const db = await getDatabase();
      
      // Check if learner has completed a hoodie that matches the prerequisite
      const hasPrerequisite = await db.get(`
        SELECT 1 FROM hoodie_holders hh
        JOIN hoodies h ON hh.hoodie_id = h.id
        WHERE hh.holder_id = ? AND hh.is_active = 1
        AND (h.name LIKE ? OR h.category LIKE ? OR h.description LIKE ?)
      `, [
        learnerId,
        `%${prerequisite}%`,
        `%${prerequisite}%`,
        `%${prerequisite}%`
      ]);

      return !!hasPrerequisite;
    } catch (error) {
      console.error('Error checking prerequisite:', error);
      return false;
    }
  }

  private mapContentTypeToCategory(contentType: string): string {
    const mapping: Record<string, string> = {
      'video': 'knowledge',
      'tool': 'tools',
      'business_case': 'transformation',
      'newsletter': 'community',
      'story': 'transformation'
    };
    return mapping[contentType] || 'general';
  }
}

// Singleton instance
export const hoodieEarningEngine = new HoodieEarningEngine();