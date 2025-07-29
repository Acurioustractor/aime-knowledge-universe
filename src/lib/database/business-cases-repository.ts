/**
 * Business Cases Repository
 * Handles all database operations for business cases and content relationships
 */

import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

export interface BusinessCase {
  id: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  impact: string;
  metrics: Record<string, any>;
  industry: string;
  region: string;
  program_type: string;
  year: number;
  featured_image_url?: string;
  related_tools: string[];
  related_videos: string[];
  related_content: string[];
  tags: string[];
  source_url?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentRelationship {
  id?: number;
  source_type: string;
  source_id: string;
  target_type: string;
  target_id: string;
  relationship_type: string;
  strength: number;
  metadata?: Record<string, any>;
}

export class BusinessCasesRepository {
  constructor(private db: Database<sqlite3.Database, sqlite3.Statement>) {}

  /**
   * Initialize business cases schema
   */
  async initializeSchema(): Promise<void> {
    // Check if business_cases table exists
    const tables = await this.db.all(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='business_cases'
    `);
    
    if (tables.length > 0) {
      console.log('📋 Business cases schema already exists');
      return;
    }

    // Execute the schema SQL
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(process.cwd(), 'src/lib/database/business-cases-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    await this.db.exec(schema);
    console.log('✅ Business cases schema initialized');
  }

  /**
   * Create or update a business case
   */
  async upsertBusinessCase(data: Partial<BusinessCase>): Promise<BusinessCase> {
    const id = data.id || uuidv4();
    const now = new Date().toISOString();
    
    const businessCase: BusinessCase = {
      id,
      title: data.title || '',
      summary: data.summary || '',
      challenge: data.challenge || '',
      solution: data.solution || '',
      impact: data.impact || '',
      metrics: data.metrics || {},
      industry: data.industry || '',
      region: data.region || '',
      program_type: data.program_type || '',
      year: data.year || new Date().getFullYear(),
      featured_image_url: data.featured_image_url || '',
      related_tools: data.related_tools || [],
      related_videos: data.related_videos || [],
      related_content: data.related_content || [],
      tags: data.tags || [],
      source_url: data.source_url || '',
      is_featured: data.is_featured || false,
      created_at: data.created_at || now,
      updated_at: now
    };

    await this.db.run(`
      INSERT OR REPLACE INTO business_cases (
        id, title, summary, challenge, solution, impact, metrics,
        industry, region, program_type, year, featured_image_url,
        related_tools, related_videos, related_content, tags,
        source_url, is_featured, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      businessCase.id,
      businessCase.title,
      businessCase.summary,
      businessCase.challenge,
      businessCase.solution,
      businessCase.impact,
      JSON.stringify(businessCase.metrics),
      businessCase.industry,
      businessCase.region,
      businessCase.program_type,
      businessCase.year,
      businessCase.featured_image_url,
      JSON.stringify(businessCase.related_tools),
      JSON.stringify(businessCase.related_videos),
      JSON.stringify(businessCase.related_content),
      JSON.stringify(businessCase.tags),
      businessCase.source_url,
      businessCase.is_featured ? 1 : 0,
      businessCase.created_at,
      businessCase.updated_at
    ]);

    // Update FTS
    await this.updateSearchIndex(businessCase);

    // Create relationships
    await this.createRelationshipsForCase(businessCase);

    return businessCase;
  }

  /**
   * Get business cases with filters
   */
  async getBusinessCases(options: {
    limit?: number;
    offset?: number;
    industry?: string;
    region?: string;
    program_type?: string;
    year?: number;
    search?: string;
    featured_only?: boolean;
  } = {}): Promise<{ cases: BusinessCase[], total: number }> {
    const {
      limit = 12,
      offset = 0,
      industry,
      region,
      program_type,
      year,
      search,
      featured_only
    } = options;

    let query = `SELECT * FROM business_cases WHERE 1=1`;
    const params: any[] = [];

    if (industry) {
      query += ` AND industry = ?`;
      params.push(industry);
    }

    if (region) {
      query += ` AND region = ?`;
      params.push(region);
    }

    if (program_type) {
      query += ` AND program_type = ?`;
      params.push(program_type);
    }

    if (year) {
      query += ` AND year = ?`;
      params.push(year);
    }

    if (featured_only) {
      query += ` AND is_featured = 1`;
    }

    if (search) {
      query += ` AND id IN (
        SELECT id FROM business_cases_fts 
        WHERE business_cases_fts MATCH ?
      )`;
      params.push(search);
    }

    // Get total count
    const countResult = await this.db.get(
      query.replace('SELECT *', 'SELECT COUNT(*) as total'),
      params
    );
    const total = countResult?.total || 0;

    // Add ordering and pagination
    query += ` ORDER BY is_featured DESC, year DESC, created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const rows = await this.db.all(query, params);
    
    const cases = rows.map(row => this.parseBusinessCase(row));

    return { cases, total };
  }

  /**
   * Get single business case with all relationships
   */
  async getBusinessCase(id: string): Promise<BusinessCase | null> {
    const row = await this.db.get(
      `SELECT * FROM business_cases WHERE id = ?`,
      id
    );

    if (!row) return null;

    return this.parseBusinessCase(row);
  }

  /**
   * Get related content for a business case
   */
  async getRelatedContent(caseId: string): Promise<{
    tools: any[],
    videos: any[],
    cases: any[]
  }> {
    // Get all relationships
    const relationships = await this.db.all(`
      SELECT * FROM content_relationships
      WHERE (source_type = 'business_case' AND source_id = ?)
         OR (target_type = 'business_case' AND target_id = ?)
    `, [caseId, caseId]);

    const toolIds = new Set<string>();
    const videoIds = new Set<string>();
    const caseIds = new Set<string>();

    relationships.forEach(rel => {
      if (rel.source_type === 'business_case' && rel.source_id === caseId) {
        if (rel.target_type === 'tool') toolIds.add(rel.target_id);
        if (rel.target_type === 'video') videoIds.add(rel.target_id);
        if (rel.target_type === 'business_case') caseIds.add(rel.target_id);
      } else if (rel.target_type === 'business_case' && rel.target_id === caseId) {
        if (rel.source_type === 'tool') toolIds.add(rel.source_id);
        if (rel.source_type === 'video') videoIds.add(rel.source_id);
        if (rel.source_type === 'business_case') caseIds.add(rel.source_id);
      }
    });

    // Fetch actual content
    const tools = toolIds.size > 0 ? await this.db.all(
      `SELECT * FROM content WHERE id IN (${Array(toolIds.size).fill('?').join(',')})`,
      Array.from(toolIds)
    ) : [];

    const videos = videoIds.size > 0 ? await this.db.all(
      `SELECT * FROM content WHERE id IN (${Array(videoIds.size).fill('?').join(',')})`,
      Array.from(videoIds)
    ) : [];

    const cases = caseIds.size > 0 ? await this.db.all(
      `SELECT * FROM business_cases WHERE id IN (${Array(caseIds.size).fill('?').join(',')})`,
      Array.from(caseIds)
    ) : [];

    return {
      tools: tools.map(t => ({ ...t, tags: JSON.parse(t.tags || '[]') })),
      videos: videos.map(v => ({ ...v, tags: JSON.parse(v.tags || '[]') })),
      cases: cases.map(c => this.parseBusinessCase(c))
    };
  }

  /**
   * Create content relationship
   */
  async createRelationship(relationship: ContentRelationship): Promise<void> {
    await this.db.run(`
      INSERT OR REPLACE INTO content_relationships (
        source_type, source_id, target_type, target_id,
        relationship_type, strength, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      relationship.source_type,
      relationship.source_id,
      relationship.target_type,
      relationship.target_id,
      relationship.relationship_type,
      relationship.strength || 1.0,
      JSON.stringify(relationship.metadata || {})
    ]);
  }

  /**
   * Get aggregate stats
   */
  async getStats(): Promise<{
    total_cases: number;
    by_industry: Record<string, number>;
    by_region: Record<string, number>;
    by_year: Record<number, number>;
  }> {
    const total = await this.db.get('SELECT COUNT(*) as count FROM business_cases');
    
    const byIndustry = await this.db.all(`
      SELECT industry, COUNT(*) as count 
      FROM business_cases 
      GROUP BY industry
    `);

    const byRegion = await this.db.all(`
      SELECT region, COUNT(*) as count 
      FROM business_cases 
      GROUP BY region
    `);

    const byYear = await this.db.all(`
      SELECT year, COUNT(*) as count 
      FROM business_cases 
      GROUP BY year
      ORDER BY year DESC
    `);

    return {
      total_cases: total?.count || 0,
      by_industry: Object.fromEntries(byIndustry.map(r => [r.industry, r.count])),
      by_region: Object.fromEntries(byRegion.map(r => [r.region, r.count])),
      by_year: Object.fromEntries(byYear.map(r => [r.year, r.count]))
    };
  }

  /**
   * Private helper methods
   */
  private parseBusinessCase(row: any): BusinessCase {
    return {
      ...row,
      metrics: JSON.parse(row.metrics || '{}'),
      related_tools: JSON.parse(row.related_tools || '[]'),
      related_videos: JSON.parse(row.related_videos || '[]'),
      related_content: JSON.parse(row.related_content || '[]'),
      tags: JSON.parse(row.tags || '[]'),
      is_featured: row.is_featured === 1
    };
  }

  private async updateSearchIndex(businessCase: BusinessCase): Promise<void> {
    await this.db.run(`
      INSERT OR REPLACE INTO business_cases_fts (
        id, title, summary, challenge, solution, impact, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      businessCase.id,
      businessCase.title,
      businessCase.summary,
      businessCase.challenge,
      businessCase.solution,
      businessCase.impact,
      businessCase.tags.join(' ')
    ]);
  }

  private async createRelationshipsForCase(businessCase: BusinessCase): Promise<void> {
    // Create tool relationships
    for (const toolId of businessCase.related_tools) {
      await this.createRelationship({
        source_type: 'business_case',
        source_id: businessCase.id,
        target_type: 'tool',
        target_id: toolId,
        relationship_type: 'uses',
        strength: 1.0
      });
    }

    // Create video relationships
    for (const videoId of businessCase.related_videos) {
      await this.createRelationship({
        source_type: 'business_case',
        source_id: businessCase.id,
        target_type: 'video',
        target_id: videoId,
        relationship_type: 'features',
        strength: 1.0
      });
    }
  }
}