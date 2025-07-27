# AIME Framing Documentation System

## 🎯 Purpose

The Framing Documentation System serves as the foundational narrative and strategic context for the entire AIME Knowledge Platform. These documents provide the philosophical, economic, and strategic framework that guides all platform development and content organization.

## 📚 Document Categories

### **1. Vision & Philosophy**
- **Letter to Humanity** - Core philosophical foundation
- **AIME's Vision Foundation** - Organizational purpose and direction
- **No Shame at AIME** - Cultural and operational principles
- **We-full** - Community and collective approach

### **2. Economic Framework**
- **Hoodie Economics** - Alternative economic system
- **100M Capital Shift Global Economics** - Economic transformation model
- **IMAGI-NATION GRP $1 Trillion** - Scale and impact vision
- **Letter to Billionaires** - Economic partnership approach

### **3. Strategic Implementation**
- **AIME Imagi-Nation Summary** - Strategic overview
- **AIME IMAGI-NATION Investment Deck** - Investment and scaling strategy
- **Federal Government AIME Proposal 2022-24** - Government partnership model
- **AIME's IMAGI-NATION $100m Funder Invitation** - Funding strategy

### **4. Operational Context**
- **AIME Full Report - Year 1** - Implementation results and learnings
- **About AIME Website 2023** - Digital presence and communication
- **Patnering letter** - Partnership approach and methodology
- **Lightning Dec 2024** - Recent strategic updates

### **5. Communication & Engagement**
- **IMAGI-NATION Tour Transcript** - Public engagement approach
- **The Global Need IMAGI-NATION TV Sept 2024** - Media and communication strategy
- **Townhall Transcript** - Community engagement model
- **Earth Commons Interview Asterix** - External perspective and validation

## 🔄 Integration Process

### **Phase 1: Document Processing**
1. **Content Analysis** - Extract key themes, concepts, and frameworks
2. **Relationship Mapping** - Identify connections between documents
3. **Concept Extraction** - Pull out core ideas for platform integration
4. **Narrative Threading** - Create coherent story across documents

### **Phase 2: Platform Integration**
1. **Philosophy Integration** - Embed core concepts into user experience
2. **Content Tagging** - Tag all platform content with framing concepts
3. **Navigation Enhancement** - Use framing to guide user journeys
4. **Search Enhancement** - Make framing concepts searchable

### **Phase 3: Dynamic Application**
1. **Context-Aware Content** - Show relevant framing based on user path
2. **Progressive Disclosure** - Reveal deeper framing as users engage
3. **Cross-Reference System** - Link content back to foundational documents
4. **Living Documentation** - Keep framing current and relevant

## 🛠️ Technical Implementation

### **Framing API Endpoints**
- `/api/framing/concepts` - Core concepts and themes
- `/api/framing/documents` - Document metadata and relationships
- `/api/framing/context` - Contextual framing for specific content
- `/api/framing/search` - Search within framing documents

### **Component Integration**
- **FramingContext** - React context for framing data
- **ConceptTooltips** - Hover explanations of key concepts
- **FramingBreadcrumbs** - Show philosophical context of current page
- **RelatedFraming** - Show relevant framing documents for content

### **Data Structure**
```typescript
interface FramingDocument {
  id: string
  title: string
  category: FramingCategory
  concepts: string[]
  keyQuotes: string[]
  relationships: string[]
  lastUpdated: string
  content: string
}

interface FramingConcept {
  id: string
  name: string
  definition: string
  sourceDocuments: string[]
  relatedConcepts: string[]
  applicationAreas: string[]
}
```

## 📊 Success Metrics

### **Integration Metrics**
- **Concept Coverage** - % of platform content tagged with framing concepts
- **User Engagement** - Time spent with framing-enhanced content
- **Cross-References** - Usage of framing document links
- **Search Integration** - Framing concept search usage

### **Impact Metrics**
- **Understanding Depth** - User progression through framing levels
- **Concept Retention** - Return visits to framing content
- **Application Success** - User implementation of framing concepts
- **Community Alignment** - Consistency of community discussions with framing

## 🎯 Next Steps

1. **Document Processing** - Analyze and categorize all framing documents
2. **Concept Extraction** - Identify core themes and concepts
3. **Technical Setup** - Build framing API and components
4. **Integration Planning** - Map framing to existing platform content
5. **User Testing** - Validate framing integration with users

## 🔮 Future Vision

The framing system will evolve into a living, breathing foundation that:
- **Guides Development** - All new features align with framing
- **Educates Users** - Progressive revelation of AIME's depth
- **Builds Community** - Shared understanding of core concepts
- **Drives Impact** - Clear connection between philosophy and action