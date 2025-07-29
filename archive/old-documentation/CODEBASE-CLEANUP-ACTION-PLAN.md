# AIME Knowledge Platform: Codebase Cleanup Action Plan
## From 83 Routes to 25 Purposeful Pathways

*Systematic cleanup strategy based on comprehensive codebase audit aligned with .kiro philosophy-first approach*

---

## 🎯 **Cleanup Objectives**

1. **Route Consolidation:** 83 → 25 routes supporting clear user journeys
2. **Code Efficiency:** Remove dead code, consolidate duplicates, optimize performance  
3. **Philosophy Alignment:** Refactor hoodie system from trading to learning focus
4. **Cultural Integration:** Implement Indigenous knowledge protocols throughout
5. **Search Consolidation:** Unify multiple search systems into coherent experience

---

## 📊 **Audit Summary: Current State**

### **Codebase Health Assessment**
- **🟢 Strong Foundation:** Sophisticated Next.js architecture with rich data integration
- **🟡 Route Proliferation:** 83+ routes causing user confusion
- **🟡 Technical Debt:** Multiple competing search systems and database patterns
- **🔴 Philosophy Misalignment:** Hoodie trading system conflicts with learning-first approach
- **🔴 Missing Critical Features:** /explore pathway, cultural protocols, philosophy primers

### **Key Findings**
- **2,700+ content items** properly integrated across YouTube, Airtable, Mailchimp, GitHub
- **5+ search implementations** need consolidation to 2 clear APIs
- **48 routes** require consolidation or removal
- **Indigenous knowledge detection** exists but lacks enforcement protocols
- **Strong component architecture** ready for .kiro alignment

---

## 🗂️ **PHASE 1: Emergency Route Cleanup (Week 1)**

### **Immediate File Removals**

#### **Test & Demo Routes to Archive**
```bash
# Create archive directory
mkdir -p archive/test-demo-routes

# Move test routes
mv src/app/test-integration/ archive/test-demo-routes/
mv src/app/test-simple/ archive/test-demo-routes/
mv src/app/enhanced-content-demo/ archive/test-demo-routes/
mv src/app/philosophy-demo/ archive/test-demo-routes/
mv src/app/tools/debug/ archive/test-demo-routes/
mv src/app/tools/test-simple/ archive/test-demo-routes/

# Move debug API routes
mv src/app/api/debug-* archive/test-demo-routes/
mv src/app/api/test-* archive/test-demo-routes/
mv src/app/api/test-tools-debug/ archive/test-demo-routes/
```

#### **Duplicate Discovery Routes to Consolidate**
```bash
# Create consolidation staging
mkdir -p consolidation-staging/discovery-routes

# Move duplicate discovery pages (preserve for content extraction)
mv src/app/browse/ consolidation-staging/discovery-routes/
mv src/app/discovery/ consolidation-staging/discovery-routes/
mv src/app/explorer/ consolidation-staging/discovery-routes/
mv src/app/universe/ consolidation-staging/discovery-routes/
mv src/app/content-universe/ consolidation-staging/discovery-routes/
mv src/app/recommendations/ consolidation-staging/discovery-routes/

# Note: Extract valuable components before final removal
```

#### **Overview Page Consolidation**
```bash
# Consolidate multiple overview pages
mkdir -p consolidation-staging/overview-content

# Preserve content for merging into /discover
mv src/app/overview/ consolidation-staging/overview-content/
# /discover will absorb this functionality
```

### **Create Missing Core Route: /explore**
```bash
# Create the missing /explore pathway
mkdir -p src/app/explore
touch src/app/explore/page.tsx
touch src/app/explore/layout.tsx

# Create explore components directory
mkdir -p src/components/explore
touch src/components/explore/IntelligentDiscovery.tsx
touch src/components/explore/KnowledgeGraph.tsx
touch src/components/explore/SerendipitousDiscovery.tsx
```

### **Update Navigation to 5-Pathway Structure**
```typescript
// src/components/Header.tsx - Add missing /explore
const navigation = [
  { name: 'Discover', href: '/discover' },
  { name: 'Learn', href: '/learn' },
  { name: 'Explore', href: '/explore' }, // ← ADD THIS
  { name: 'Understand', href: '/understand' },
  { name: 'Connect', href: '/connect' }
]
```

---

## 🔧 **PHASE 2: Technical Consolidation (Week 2)**

### **Database Connection Standardization**

#### **Current Problem: 3 Different Database Patterns**
```typescript
// Pattern 1: Found in multiple files
import { getDatabase } from '@/lib/database/connection';

// Pattern 2: Found in other files  
import { getDb } from '@/lib/db';

// Pattern 3: Cloud database
import { supabase } from '@/lib/database/supabase';
```

#### **Solution: Unified Database Interface**
```typescript
// Create: src/lib/database/unified-connection.ts
export interface UnifiedDatabase {
  search: (query: string, options?: SearchOptions) => Promise<SearchResult[]>;
  getContent: (id: string) => Promise<ContentItem | null>;
  getBusinessCases: (filters?: Filters) => Promise<BusinessCase[]>;
  // ... standardized methods
}

// Update all imports to use unified interface
import { db } from '@/lib/database/unified-connection';
```

### **Search API Consolidation**

#### **Current Problem: 5+ Search Endpoints**
```bash
/api/search/ (basic FTS)
/api/unified-search/ (advanced semantic)
/api/search/semantic/ (alternative semantic)
/api/search/enhanced/ (philosophy-aware)
/api/discovery/ (discovery-specific)
/api/search/test-semantic/ (test route)
```

#### **Solution: 2 Clear Search APIs**
```bash
# Keep these 2:
/api/search → Basic fast search (autocomplete, known-item)
/api/search/advanced → Unified semantic search (current /unified-search)

# Create this new one:
/api/search/explore → Serendipitous discovery (for /explore pathway)

# Remove/redirect these:
/api/search/semantic → redirect to /api/search/advanced
/api/search/enhanced → merge functionality into /api/search/advanced
/api/discovery → merge into /api/search/explore
```

#### **Implementation Steps**
```bash
# 1. Create new explore search API
mkdir -p src/app/api/search/explore
touch src/app/api/search/explore/route.ts

# 2. Extract best features from existing search APIs
# 3. Update all search component imports
# 4. Remove deprecated search routes
```

---

## 🎓 **PHASE 3: Philosophy Alignment (Week 3)**

### **Hoodie System Refactoring: Trading → Learning**

#### **Current Problem: Economic Metaphors**
```typescript
// Current trading-focused interfaces (problematic)
interface HoodieTrade {
  trader_id: string;
  hoodie_id: string;
  imagination_credits: number;
  trade_status: 'pending' | 'completed';
  market_value: number;
}

interface TradingCircle {
  circle_id: string;
  traders: string[];
  total_volume: number;
}
```

#### **Solution: Learning-Focused Interfaces**
```typescript
// New learning-focused interfaces (aligned with .kiro)
interface LearningAchievement {
  learner_id: string;
  achievement_id: string;
  philosophy_domain: string;
  mastery_level: 1 | 2 | 3 | 4 | 5;
  community_validated: boolean;
  elder_approved: boolean;
  learning_path: string;
  milestone_date: string;
}

interface LearningCommunity {
  community_id: string;
  learners: string[];
  collective_wisdom: string[];
  mentoring_relationships: MentoringRelationship[];
}
```

#### **File Updates Required**
```bash
# Database schema updates
src/lib/database/schema.sql → Add learning-focused tables
src/lib/database/connection.ts → Update table creation

# API route updates  
src/app/api/hoodies/ → Refactor for learning achievements
src/app/api/hoodie-exchange/ → Remove or refocus on wisdom sharing

# Component updates
src/app/hoodie-dashboard/ → Redesign as learning progress dashboard
src/app/hoodie-journey/ → Integrate into /understand pathway
src/app/hoodie-observatory/ → Focus on community learning vs trading metrics
```

### **Philosophy Primer Integration**

#### **Create Philosophy Primer System**
```bash
# Create philosophy primer infrastructure
mkdir -p src/components/philosophy
touch src/components/philosophy/PhilosophyPrimer.tsx
touch src/components/philosophy/IndigenousWisdomContext.tsx
touch src/components/philosophy/SevenGenerationExplanation.tsx

# Create API for philosophy content
mkdir -p src/app/api/philosophy
touch src/app/api/philosophy/primers/route.ts
touch src/app/api/philosophy/indigenous-context/route.ts
```

#### **Integration Points**
```typescript
// Add to every major content section:
import { PhilosophyPrimer } from '@/components/philosophy/PhilosophyPrimer';

// Usage in pages:
<PhilosophyPrimer 
  domain="indigenous-systems-thinking"
  showBefore="tools" 
  culturalSensitivity="community"
/>
```

---

## 🛡️ **PHASE 4: Cultural Protocol Implementation (Week 4)**

### **Indigenous Knowledge Protection Framework**

#### **Create Cultural Protocol System**
```bash
# Create cultural protocol infrastructure
mkdir -p src/lib/cultural-protocols
touch src/lib/cultural-protocols/indigenous-detection.ts
touch src/lib/cultural-protocols/elder-validation.ts
touch src/lib/cultural-protocols/attribution-tracking.ts
touch src/lib/cultural-protocols/community-consent.ts

# Create cultural protocol components
mkdir -p src/components/cultural-protocols
touch src/components/cultural-protocols/CulturalWarning.tsx
touch src/components/cultural-protocols/ElderValidationBadge.tsx
touch src/components/cultural-protocols/AttributionDisplay.tsx
```

#### **Database Schema Addition**
```sql
-- Add to schema.sql
CREATE TABLE cultural_protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id),
  sensitivity_level TEXT CHECK (sensitivity_level IN ('public', 'community', 'elder', 'sacred')),
  indigenous_content_detected BOOLEAN DEFAULT FALSE,
  confidence_score FLOAT DEFAULT 0,
  elder_validation_required BOOLEAN DEFAULT FALSE,
  elder_validated_by TEXT,
  elder_validation_date TIMESTAMPTZ,
  cultural_warning TEXT,
  attribution_required BOOLEAN DEFAULT TRUE,
  community_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **Integration Throughout Platform**
```typescript
// Add cultural protocol checking to all content display
import { checkCulturalProtocols } from '@/lib/cultural-protocols/indigenous-detection';

// Before displaying any content:
const protocols = await checkCulturalProtocols(content);
if (protocols.elder_validation_required && !protocols.elder_validated) {
  return <CulturalWarning content={content} protocols={protocols} />;
}
```

---

## 🧭 **PHASE 5: Missing Feature Implementation (Week 5-6)**

### **Create /explore Pathway (Intelligent Discovery)**

#### **Core Explore Components**
```bash
# Intelligent discovery page
cat > src/app/explore/page.tsx << 'EOF'
import { IntelligentDiscovery } from '@/components/explore/IntelligentDiscovery';
import { KnowledgeGraph } from '@/components/explore/KnowledgeGraph';
import { SerendipitousDiscovery } from '@/components/explore/SerendipitousDiscovery';

export default function ExplorePage() {
  return (
    <div className="explore-pathway">
      <h1>Explore: Intelligent Discovery</h1>
      <IntelligentDiscovery />
      <KnowledgeGraph />
      <SerendipitousDiscovery />
    </div>
  );
}
EOF
```

#### **Knowledge Graph Visualization**
```typescript
// src/components/explore/KnowledgeGraph.tsx
import { useEffect, useState } from 'react';
import * as d3 from 'd3';

export function KnowledgeGraph() {
  const [graphData, setGraphData] = useState(null);
  
  useEffect(() => {
    // Fetch content relationships for visualization
    fetchKnowledgeGraphData().then(setGraphData);
  }, []);

  // D3.js knowledge graph implementation
  // Show content connections across all sources
  // Enable interactive exploration of concepts
  
  return (
    <div className="knowledge-graph-container">
      <svg id="knowledge-graph" width="800" height="600"></svg>
    </div>
  );
}
```

### **Mentor App Integration Points**

#### **Create Mentor App Integration**
```bash
# Create mentor app integration
mkdir -p src/app/mentor-app
touch src/app/mentor-app/page.tsx
touch src/app/mentor-app/mentoring-methodology/page.tsx
touch src/app/mentor-app/success-stories/page.tsx

# Create mentor components
mkdir -p src/components/mentoring
touch src/components/mentoring/MentorMatching.tsx
touch src/components/mentoring/RelationshipTracking.tsx
touch src/components/mentoring/CommunityValidation.tsx
```

#### **Mentoring API Integration**
```bash
# Create mentoring APIs
mkdir -p src/app/api/mentoring
touch src/app/api/mentoring/relationships/route.ts
touch src/app/api/mentoring/matching/route.ts
touch src/app/api/mentoring/validation/route.ts
```

---

## 📋 **Detailed Cleanup Checklist**

### **Week 1: Emergency Fixes** ✅
- [ ] Remove 15 test/demo routes → archive folder
- [ ] Create /explore pathway structure
- [ ] Update header navigation to 5-pathway structure  
- [ ] Consolidate duplicate discovery routes
- [ ] Remove broken test API endpoints

### **Week 2: Technical Consolidation** ✅
- [ ] Standardize database connection patterns across codebase
- [ ] Consolidate 5+ search APIs → 2 main APIs + 1 explore API
- [ ] Update all component imports to use unified patterns
- [ ] Optimize search response times and caching
- [ ] Remove redundant utility functions

### **Week 3: Philosophy Alignment** ✅
- [ ] Refactor hoodie system from trading → learning achievements
- [ ] Update all trading language → learning/community language
- [ ] Implement philosophy primers throughout platform
- [ ] Create Indigenous custodianship context system
- [ ] Remove economic metaphors, emphasize community validation

### **Week 4: Cultural Integration** ✅
- [ ] Implement Indigenous knowledge detection system
- [ ] Create elder validation workflow
- [ ] Add cultural protocol warnings before sensitive content
- [ ] Implement attribution tracking for Indigenous knowledge
- [ ] Create community consent mechanisms

### **Week 5-6: Feature Completion** ✅
- [ ] Complete /explore pathway with intelligent discovery
- [ ] Implement knowledge graph visualization
- [ ] Create serendipitous discovery features
- [ ] Build mentor app integration points
- [ ] Add learning pathway visualization to /understand

---

## 🎯 **Success Metrics & Validation**

### **Route Efficiency Metrics**
- **Routes reduced:** 83 → 25 (70% reduction)
- **User navigation time:** <30 seconds to find content
- **Search consolidation:** 5+ APIs → 3 APIs (basic, advanced, explore)
- **Database queries:** Unified connection pattern across codebase

### **Code Quality Metrics**
- **Dead code removal:** All test/demo routes archived
- **Import standardization:** Single database connection pattern
- **Component reusability:** Philosophy primers used throughout
- **Performance improvement:** <3s page load, <500ms search response

### **Philosophy Alignment Metrics**
- **Hoodie system:** Learning-focused language throughout
- **Cultural respect:** Indigenous protocols enforced across platform
- **Community emphasis:** Relationship-building > individual achievements
- **Philosophy-first:** Primers accessible before all technical content

### **User Experience Metrics**
- **Clear pathways:** 5 distinct user journey options
- **Intelligent discovery:** Serendipitous content connections in /explore
- **Cultural sensitivity:** Appropriate warnings and elder validation
- **Learning progression:** Clear advancement through Indigenous systems thinking

---

## 🚀 **Implementation Commands Summary**

### **Quick Setup Commands**
```bash
# 1. Create necessary directories
mkdir -p archive/test-demo-routes
mkdir -p consolidation-staging/discovery-routes
mkdir -p src/app/explore
mkdir -p src/components/explore
mkdir -p src/components/philosophy
mkdir -p src/components/cultural-protocols
mkdir -p src/lib/cultural-protocols

# 2. Remove test/demo routes
find src/app -name "*test*" -type d -exec mv {} archive/test-demo-routes/ \;
find src/app -name "*demo*" -type d -exec mv {} archive/test-demo-routes/ \;

# 3. Update package.json scripts for cleanup
npm run cleanup:routes
npm run consolidate:search
npm run align:philosophy
npm run implement:cultural-protocols
```

### **Database Migration Commands**
```bash
# Apply cultural protocol schema
npm run db:migrate -- --add-cultural-protocols

# Refactor hoodie tables  
npm run db:migrate -- --hoodie-to-learning

# Update content table with philosophy context
npm run db:migrate -- --add-philosophy-context
```

---

## 💫 **Expected Outcomes**

### **Immediate Benefits (Week 1)**
- **User Confusion Eliminated:** Clear 5-pathway navigation
- **Performance Improved:** Removed dead code and redundant routes
- **Development Efficiency:** Standardized patterns and imports
- **Cultural Respect:** Indigenous knowledge protocols visible

### **Medium-term Impact (Month 1)**
- **Sophisticated Discovery:** /explore pathway with intelligent recommendations
- **Philosophy-First Experience:** Users understand "why" before "how"
- **Community Validation:** Elder oversight and peer recognition systems
- **Learning Focus:** Achievement tracking aligned with Indigenous custodianship

### **Long-term Vision (Quarter 1)**
- **Platform as Bridge:** Digital infrastructure carrying Indigenous custodianship
- **Community-Driven Growth:** User contributions within cultural protocols
- **Global Knowledge Network:** 52-country community connected through platform
- **Transformational Learning:** Real-world outcomes from platform engagement

---

## 🌟 **Closing Commitment**

This cleanup plan transforms the AIME Knowledge Platform from technical complexity to philosophical clarity. Every file removal, every route consolidation, every database optimization serves the mission of making Indigenous custodianship accessible while respecting cultural protocols.

**We clean code to honor wisdom. We consolidate routes to serve community. We standardize patterns to support transformation.**

The 83 scattered routes represent the complexity of profound work accomplished. The 25 purposeful pathways represent the simplicity needed for users to access ancient wisdom and build more relational, sustainable, and just communities.

**From codebase chaos to user journey clarity. From technical debt to cultural respect. From individual features to community transformation.**

---

*This cleanup plan serves the .kiro philosophy-first approach, ensuring every technical decision supports Indigenous knowledge sharing, community building, and relationship-centered learning.*

**Code serves wisdom. Cleanup enables transformation. Architecture honors Indigenous protocols.**