# Business Cases Implementation

This directory contains the business cases functionality for the AIME wiki.

## Quick Reference

📋 **Analysis Framework**: See `/BUSINESS_CASE_ANALYSIS_GUIDE.md` in the project root for the complete methodology and templates for creating business cases.

## Directory Structure

- `business-cases-repository.ts` - Database operations for business cases
- `business-cases-schema.sql` - Database schema for cases and relationships
- `relationship-detector.ts` - Automatic content relationship detection

## Usage

1. **Creating Cases**: Use the analysis guide template in the root directory
2. **Adding Cases**: POST to `/api/business-cases` with case data
3. **Seeding Examples**: POST to `/api/business-cases/seed`

## Key Features

- Automatic relationship detection with tools and videos
- Full-text search across all case content
- Filtering by industry, region, program type, year
- Metrics tracking and visualization
- Cross-content linking and knowledge graph integration