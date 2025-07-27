/**
 * Simple Business Cases API
 * 
 * Reads and processes the 8 core AIME business case documents directly
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

interface BusinessCaseDocument {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  priority: 'flagship' | 'core' | 'emerging';
  target_audience: string;
  tags: string[];
  hoodies: number;
  phases: number;
  impact_score: number;
  created_at: string;
  key_outcomes: string[];
}

// Load and process business case documents
function loadBusinessCaseDocuments(): BusinessCaseDocument[] {
  try {
    const casesDirectory = path.join(process.cwd(), 'docs', 'business_cases');
    
    const caseFiles = [
      { file: 'AIME Business cases.md', id: 'joy-corps', priority: 'flagship' as const },
      { file: 'AIME Business cases (1).md', id: 'presidents', priority: 'core' as const },
      { file: 'AIME Business cases (2).md', id: 'citizens', priority: 'core' as const },
      { file: 'AIME Business cases (3).md', id: 'imagi-labs', priority: 'core' as const },
      { file: 'AIME Business cases (4).md', id: 'indigenous-labs', priority: 'core' as const },
      { file: 'AIME Business cases (5).md', id: 'custodians', priority: 'flagship' as const },
      { file: 'AIME Business cases (6).md', id: 'mentor-credit', priority: 'emerging' as const },
      { file: 'AIME Business cases (7).md', id: 'systems-residency', priority: 'emerging' as const }
    ];

    const processedCases: BusinessCaseDocument[] = [];

    for (const { file, id, priority } of caseFiles) {
      try {
        const casePath = path.join(casesDirectory, file);
        const content = fs.readFileSync(casePath, 'utf-8');
        const processedCase = processSingleCase(content, id, priority);
        processedCases.push(processedCase);
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
      }
    }

    return processedCases;
  } catch (error) {
    console.error('Failed to load business case documents:', error);
    return [];
  }
}

// Process a single business case document
function processSingleCase(content: string, id: string, priority: 'flagship' | 'core' | 'emerging'): BusinessCaseDocument {
  // Extract title
  const titleMatch = content.match(/^#\s*\*\*(.+?)\*\*/m);
  const title = titleMatch ? titleMatch[1] : `Business Case ${id}`;

  // Extract subtitle
  const subtitleMatch = content.match(/^\*(.+?)\*/m);
  const subtitle = subtitleMatch ? subtitleMatch[1] : '';

  // Extract executive summary for description
  const execSummaryMatch = content.match(/##\s*\*\*Executive Summary\*\*\s*\n\n(.*?)(?=\n##|\n---|\n\*\*Target Audience)/s);
  const description = execSummaryMatch ? 
    generateSummary(execSummaryMatch[1]) : 
    `This document outlines the ${title} approach to organizational transformation through AIME's Indigenous wisdom framework.`;

  // Extract target audience
  const targetAudienceMatch = content.match(/\*\*Target Audience:\*\*\s*(.+?)(?=\n\n|\n---|$)/s);
  const target_audience = targetAudienceMatch ? targetAudienceMatch[1].trim() : 'Organizations and Leaders';

  // Extract tags from content
  const tags = extractTags(title, content);

  // Count phases and hoodies
  const phases = (content.match(/###\s*\*\*Phase\s+\d+/g) || []).length;
  const hoodies = (content.match(/\*\*(.+?Badge)\*\*/g) || []).length;

  // Calculate impact score
  const impact_score = calculateImpactScore(content, priority);

  // Extract key outcomes
  const key_outcomes = extractKeyOutcomes(content);

  return {
    id,
    title,
    subtitle,
    description,
    priority,
    target_audience,
    tags,
    hoodies,
    phases,
    impact_score,
    created_at: new Date().toISOString(),
    key_outcomes
  };
}

// Generate a 3-sentence summary
function generateSummary(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  // Get first sentence for context
  const firstSentence = sentences[0]?.trim() + '.';
  
  // Find a sentence with key transformation concepts
  const transformationSentence = sentences.find(s => 
    s.toLowerCase().includes('transform') || 
    s.toLowerCase().includes('approach') || 
    s.toLowerCase().includes('framework')
  )?.trim() + '.' || sentences[1]?.trim() + '.';
  
  // Find a sentence about impact or outcomes
  const impactSentence = sentences.find(s => 
    s.toLowerCase().includes('impact') || 
    s.toLowerCase().includes('result') || 
    s.toLowerCase().includes('outcome') ||
    s.toLowerCase().includes('benefit')
  )?.trim() + '.' || sentences[2]?.trim() + '.';
  
  return [firstSentence, transformationSentence, impactSentence]
    .filter(Boolean)
    .slice(0, 3)
    .join(' ');
}

// Extract tags from content
function extractTags(title: string, content: string): string[] {
  const commonTags = [
    'transformation', 'leadership', 'systems-change', 'relational-economics',
    'education', 'mentoring', 'indigenous-knowledge', 'youth-development',
    'organizational-change', 'network-governance', 'custodianship', 'imagination',
    'joy-corps', 'innovation', 'community', 'sustainability'
  ];
  
  const contentLower = (title + ' ' + content).toLowerCase();
  const foundTags = commonTags.filter(tag => 
    contentLower.includes(tag.replace('-', ' ')) || contentLower.includes(tag)
  );
  
  return foundTags.slice(0, 8); // Limit to 8 tags
}

// Calculate impact score based on content analysis
function calculateImpactScore(content: string, priority: 'flagship' | 'core' | 'emerging'): number {
  let score = 0;
  
  // Base score by priority
  const priorityScores = { flagship: 90, core: 75, emerging: 60 };
  score += priorityScores[priority];
  
  // Bonus for transformation indicators
  if (content.toLowerCase().includes('transform')) score += 5;
  if (content.toLowerCase().includes('measurable')) score += 5;
  if (content.toLowerCase().includes('sustainable')) score += 5;
  if (content.toLowerCase().includes('innovation')) score += 3;
  if (content.toLowerCase().includes('community')) score += 3;
  
  // Bonus for specific outcomes
  const outcomes = (content.match(/\d+%/g) || []).length;
  score += Math.min(outcomes * 2, 10);
  
  return Math.min(score, 100);
}

// Extract key outcomes from content
function extractKeyOutcomes(content: string): string[] {
  const outcomes: string[] = [];
  
  // Look for bullet points that describe outcomes
  const bulletMatches = content.match(/^\*\s+(.+?)$/gm);
  if (bulletMatches) {
    const outcomePoints = bulletMatches
      .map(match => match.replace(/^\*\s+/, ''))
      .filter(point => 
        point.toLowerCase().includes('improve') ||
        point.toLowerCase().includes('increase') ||
        point.toLowerCase().includes('demonstrate') ||
        point.toLowerCase().includes('achieve') ||
        point.toLowerCase().includes('result')
      )
      .slice(0, 3);
    
    outcomes.push(...outcomePoints);
  }
  
  // If no specific outcomes found, generate generic ones
  if (outcomes.length === 0) {
    outcomes.push(
      'Demonstrates measurable transformation in organizational culture and practices',
      'Provides framework for sustainable change implementation',
      'Creates pathways for ongoing development and growth'
    );
  }
  
  return outcomes;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'overview';
    
    const documents = loadBusinessCaseDocuments();
    
    if (documents.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No business case documents found'
      }, { status: 500 });
    }
    
    switch (type) {
      case 'overview':
        return NextResponse.json({
          success: true,
          data: {
            summary: {
              totalCases: documents.length,
              totalOrganizations: new Set(documents.map(d => d.target_audience)).size,
              categories: new Set(documents.map(d => d.priority)).size,
              avgImpactScore: documents.reduce((sum, d) => sum + d.impact_score, 0) / documents.length
            },
            topThemes: extractTopThemes(documents),
            categories: extractCategories(documents),
            recentCases: documents.slice(0, 5).map(d => ({
              id: d.id,
              title: d.title,
              category: d.priority,
              impactScore: d.impact_score,
              organization: d.target_audience
            }))
          }
        });
        
      case 'library':
        return NextResponse.json({
          success: true,
          data: documents
        });
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter'
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Business cases API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Helper functions for overview data
function extractTopThemes(documents: BusinessCaseDocument[]) {
  const themes = new Map();
  documents.forEach(doc => {
    doc.tags.forEach(tag => {
      themes.set(tag, (themes.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(themes.entries())
    .map(([name, frequency]) => ({ name, frequency, categories: ['business'] }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);
}

function extractCategories(documents: BusinessCaseDocument[]) {
  const categories = new Map();
  documents.forEach(doc => {
    const category = doc.priority;
    if (categories.has(category)) {
      const existing = categories.get(category);
      categories.set(category, {
        ...existing,
        caseCount: existing.caseCount + 1,
        totalImpact: existing.totalImpact + doc.impact_score
      });
    } else {
      categories.set(category, {
        name: category,
        caseCount: 1,
        uniqueThemes: new Set(doc.tags).size,
        totalImpact: doc.impact_score
      });
    }
  });
  
  return Array.from(categories.values()).map(cat => ({
    ...cat,
    avgImpactScore: cat.totalImpact / cat.caseCount
  }));
}