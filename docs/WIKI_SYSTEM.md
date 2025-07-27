# AIME Knowledge Wiki System

## 🎯 Overview

The AIME Knowledge Wiki is a GitBook-inspired comprehensive knowledge repository that provides users with a traditional, hierarchical way to explore all AIME content. It serves as an alternative to the journey-based discovery interfaces, offering a "back to the old days" search and browse experience.

## 🏗️ Architecture

### GitBook-Inspired Design
- **Clean, minimal interface** without main site header/footer
- **Hierarchical navigation** with expandable sections
- **Comprehensive search** across all content types
- **Breadcrumb navigation** for easy orientation
- **Content type organization** with visual indicators

### Key Components

#### 1. WikiSidebar (`src/components/wiki/WikiSidebar.tsx`)
- **Hierarchical Navigation**: 9 main sections with sub-pages
- **Content Counters**: Shows number of resources per section
- **Expandable Sections**: Collapsible navigation tree
- **Content Type Indicators**: Visual badges for different content types
- **Knowledge Stats**: Live statistics panel

#### 2. WikiSearch (`src/components/wiki/WikiSearch.tsx`)
- **Intelligent Search**: Auto-suggestions and popular searches
- **Quick Filters**: Content type filtering buttons
- **Search History**: Recent and popular search terms
- **Expandable Interface**: Grows on focus for better UX

#### 3. WikiContent (`src/components/wiki/WikiContent.tsx`)
- **Dynamic Content Loading**: Fetches relevant resources per section
- **Search Results Integration**: Seamless search experience
- **Content Rendering**: Structured presentation of wiki pages

#### 4. WikiSearchResults (`src/components/wiki/WikiSearchResults.tsx`)
- **Advanced Filtering**: Content type, date, relevance filters
- **Highlighted Results**: Query term highlighting
- **Rich Metadata**: Content relationships and cultural sensitivity
- **Sorting Options**: Multiple sort criteria

## 📚 Content Organization

### 9 Main Knowledge Areas

1. **Getting Started** 🏠
   - Introduction to AIME
   - Philosophy and approach
   - How to use the wiki
   - Quick start guide

2. **Indigenous Knowledge Systems** 🏛️
   - Traditional wisdom and protocols
   - Systems thinking approaches
   - Cultural sensitivity guidelines
   - Seven generation thinking

3. **Mentoring & Education** 🎓
   - AIME methodology
   - Reverse mentoring models
   - Imagination curriculum
   - Impact measurement

4. **Hoodie Economics** 👕
   - Alternative economic systems
   - Imagination credits
   - Trading mechanisms
   - Digital economy integration

5. **Systems Change** 🔄
   - Organizational transformation
   - Joy Corps methodology
   - Leadership models
   - Network effects

6. **Tools & Frameworks** 🛠️
   - Assessment tools
   - Planning frameworks
   - Facilitation guides
   - Digital tools

7. **Business Cases** 💼
   - Real-world implementations
   - Sector-specific examples
   - Partnership models
   - Impact stories

8. **Media & Content** 🎬
   - Video library
   - Newsletter archive
   - Podcasts and audio
   - Publications

9. **Research & Insights** 🔬
   - Academic research
   - Impact studies
   - Methodology research
   - Future directions

## 🔍 Search Capabilities

### Unified Search Integration
- **All Content Types**: Knowledge, business cases, tools, hoodies, videos, newsletters
- **Intelligent Ranking**: Relevance, semantic similarity, cultural sensitivity
- **Query Expansion**: Automatic term expansion for better results
- **Indigenous Content Detection**: Special handling for culturally sensitive content

### Search Features
- **Real-time Suggestions**: As-you-type search suggestions
- **Popular Searches**: Curated list of common queries
- **Advanced Filters**: Content type, date range, relevance thresholds
- **Result Highlighting**: Query terms highlighted in results
- **Related Content**: Cross-references and relationships

## 🎨 User Experience

### GitBook-Style Interface
- **Clean Typography**: Readable fonts and spacing
- **Minimal Distractions**: Focus on content discovery
- **Intuitive Navigation**: Familiar wiki-style browsing
- **Responsive Design**: Works on all device sizes

### Navigation Patterns
- **Sidebar Navigation**: Always-visible content tree
- **Breadcrumbs**: Clear path indication
- **Search-First**: Prominent search functionality
- **Content Relationships**: Links between related resources

## 🚀 Access Points

### Footer Integration
The wiki is accessible via a prominent link in the main site footer:
```
📚 Visit the Wiki
```
- **Highlighted Position**: Top of resources section
- **Visual Distinction**: Yellow accent color
- **Clear Purpose**: "In case you just want to search like in the old days"

### Direct URL
- **Route**: `/wiki`
- **Clean URL Structure**: `/wiki?section=mentoring&page=methodology`
- **Search URLs**: `/wiki?search=indigenous+systems`

## 📊 Content Statistics

### Live Data Integration
- **2,700+ Total Resources**
- **156 Business Cases**
- **234 Tools & Frameworks**
- **423 Video Content Items**
- **100 Digital Hoodies**
- **561 Newsletter Items**

### Dynamic Counters
Each section shows live counts of available resources, helping users understand the depth of content in each area.

## 🔧 Technical Implementation

### API Integration
- **Unified Search API**: `/api/unified-search`
- **Real-time Data**: Live content counts and statistics
- **Performance Optimized**: Fast search and navigation
- **Error Handling**: Graceful degradation

### Component Architecture
```
WikiPage (Main Container)
├── WikiSidebar (Navigation)
├── WikiSearch (Search Interface)
├── WikiBreadcrumbs (Navigation Aid)
└── WikiContent
    ├── WikiContentRenderer (Static Pages)
    └── WikiSearchResults (Search Results)
```

### State Management
- **URL-based State**: Section, page, and search state in URL
- **Local State**: UI interactions and temporary data
- **Search State**: Query, filters, and results

## 🎯 Use Cases

### 1. Traditional Researchers
Users who prefer hierarchical browsing and comprehensive search capabilities.

### 2. Content Auditors
People who need to see all available content in a structured format.

### 3. Quick Reference
Users looking for specific information without journey-based discovery.

### 4. Comprehensive Overview
Anyone wanting to understand the full scope of AIME knowledge.

## 🔮 Future Enhancements

### Planned Features
1. **Bookmarking System**: Save favorite pages and searches
2. **Content Contributions**: Community-driven content additions
3. **Advanced Analytics**: Usage patterns and popular content
4. **Export Capabilities**: PDF generation and content export
5. **Offline Access**: Progressive Web App capabilities

### Integration Opportunities
1. **Learning Pathways**: Connect wiki content to guided journeys
2. **Personalization**: Customized content recommendations
3. **Collaboration Tools**: Comments and community features
4. **API Extensions**: External system integrations

## 📈 Success Metrics

### User Engagement
- **Time on Wiki**: Average session duration
- **Page Views**: Most popular sections and pages
- **Search Usage**: Query patterns and success rates
- **Return Visits**: User retention and repeat usage

### Content Discovery
- **Search Success Rate**: Queries that find relevant results
- **Content Coverage**: How much content is being discovered
- **Cross-References**: Usage of related content links
- **Deep Exploration**: Multi-page session patterns

## 🎉 Conclusion

The AIME Knowledge Wiki provides a comprehensive, traditional approach to content discovery that complements the platform's journey-based interfaces. It serves users who prefer structured browsing and comprehensive search capabilities, ensuring that all of AIME's knowledge is accessible through familiar, intuitive patterns.

The wiki successfully bridges the gap between modern discovery experiences and traditional knowledge repositories, providing the best of both worlds for different user preferences and use cases.