"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'

export default function ProjectOverviewPage() {
  const [content, setContent] = useState<string>('')
  
  useEffect(() => {
    // In a real app, you'd fetch this from an API
    // For now, we'll use the content from the overview page component
    setContent(`
# IMAGI-NATION Research Synthesis Plan

## Project Vision
Transform 250+ IMAGI-NATION {TV} episodes and workshops into a landmark research synthesis that captures the collective intelligence of a global imagination generation designing the future from the depths of the pandemic.

## Core Mission
This research synthesis will demonstrate that AIME didn't just study the future—they built it with the very people who will inhabit it. The 250+ conversations weren't focus groups; they were activation ceremonies for a new relational economy.

## Key Differentiators
- **Live co-design** captured in real-time
- **Planetary scope** with local depth
- **Youth-led** with intergenerational wisdom
- **Action-oriented** with built solutions (IMAGI-NATION)
- **Culturally grounded** in Indigenous systems thinking
- **Relationally distributed** not transactionally marketed

## Timeline Overview
- **December 2024**: Research Consolidation
- **December 2024 - January 2025**: Deep Analysis & Synthesis
- **January 2025**: Creative Production
- **January 26, 2025**: Strategic Global Release

## Research Phases

### Phase 1: Research Consolidation (December 2024)
#### 1.1 Content Audit & Organization
- Catalog all 250+ episodes with metadata (participants, themes, demographics)
- Identify key participant categories: Young people, Indigenous knowledge holders, prime ministers, educators, artists, systems thinkers
- Map geographic representation: Document voices from 52 countries
- Create searchable archive of all content

#### 1.2 AI-Powered Analysis Setup
- Transcribe all video content using AI tools
- Develop thematic coding framework based on AIME's core principles
- Train AI assistant on AIME's philosophy to ensure culturally appropriate analysis

### Phase 2: Deep Analysis & Synthesis (December 2024 - January 2025)
#### 2.1 Thematic Extraction
Extract and validate the top 10 recommendations already identified:
1. Film/TV industry that nurtures rather than mines attention
2. Healthy relational networks without advertising/data theft
3. Schools as imagination labs (link to Hoodie Economics principles)
4. Relational economies (7 principles from Hoodie Economics)
5. Kindness as core societal value
6. Universal imagination curriculum
7. Nature-centered governance
8. Decentralized knowledge systems
9. Youth leadership in systems design
10. Intentional organizational death cycles

#### 2.2 Cross-Referenced Insights
- IMAGI-NATION co-design sessions (50 x 1-hour dialogues)
- Imagination Declaration from Garma
- Dreams Embassy findings
- School workshop outcomes
- Hoodie Economics research (20 years across 500 schools)

### Phase 3: Creative Production (January 2025)
#### 3.1 Core Deliverables
**A. Executive Summary Report (10 pages)**
- 3-point summary for quick digestion
- 10-point detailed recommendations
- Visual infographics showing global participation
- Quote highlights from diverse voices

**B. Full Research Report (50-100 pages)**
- Methodology: Relational research approach
- Participant demographics & representation
- Thematic analysis with supporting quotes
- Case studies from different regions
- Implementation roadmap

**C. Policy Brief Series**
- Treasury submission format for economic transformation
- Education ministry brief for imagination curriculum
- Technology policy for healthy networks
- Environmental policy for custodial economies

**D. Creative Artifacts**
- Documentary short (15-20 min) featuring key moments
- Interactive digital experience showcasing the journey
- Poster series with key insights for schools/organizations
- Social media toolkit for relational sharing (not advertising)

### Phase 4: Strategic Release (January 26, 2025)
#### 4.1 Launch Strategy
- Coordinate with IMAGINE film release
- Simultaneous global embassy activations
- Direct delivery to key stakeholders

#### 4.2 Amplification Through Relational Networks
- IMAGI-NATION citizen activation
- School network distribution
- Indigenous Knowledge Systems Labs
- JOY Corps organizations
- Systems change citizens

## Impact Vision
This will be more than research—it's a blueprint for transformation that governments, educators, and communities can immediately implement.
    `)
  }, [])

  return (
    <div className="py-12 bg-gray-50">
      <div className="container-wiki">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><span>/</span></li>
              <li><Link href="/overview" className="hover:text-primary-600">Overview</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">Project Overview</li>
            </ol>
          </nav>
          
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden h-64 mb-6">
              <Image 
                src="/assets/images/logo.png" 
                alt="IMAGI-NATION collaborative research" 
                fill
                style={{objectFit: 'contain'}}
              />
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </div>
          
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/research" className="btn btn-primary">
              Explore Research Methodology
            </Link>
            <Link href="/recommendations" className="btn btn-outline">
              View Key Recommendations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}