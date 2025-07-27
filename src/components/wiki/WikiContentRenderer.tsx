"use client"

import { useState, useEffect } from 'react'
import { ArrowRightIcon, BookOpenIcon, VideoCameraIcon, WrenchIcon } from '@heroicons/react/24/outline'

interface WikiContentRendererProps {
  section: string
  page: string
  onNavigate: (section: string, page?: string) => void
}

interface ContentItem {
  id: string
  title: string
  description: string
  type: string
  url?: string
  metadata?: any
}

export default function WikiContentRenderer({ section, page, onNavigate }: WikiContentRendererProps) {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [pageContent, setPageContent] = useState<any>(null)

  // Fetch content for the current section/page
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      try {
        // Map section/page to search queries
        const searchQuery = getSearchQueryForPage(section, page)
        const contentTypes = getContentTypesForPage(section, page)
        
        if (searchQuery) {
          const typesParam = contentTypes.join(',')
          const response = await fetch(
            `/api/unified-search?q=${encodeURIComponent(searchQuery)}&types=${typesParam}&limit=20`
          )
          
          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              setContent(data.data.results || [])
            }
          }
        }
        
        // Set page-specific content
        setPageContent(getPageContent(section, page))
        
      } catch (error) {
        console.error('Failed to fetch content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [section, page])

  // Map section/page combinations to search queries
  const getSearchQueryForPage = (section: string, page: string): string => {
    const queryMap: Record<string, Record<string, string>> = {
      'indigenous-knowledge': {
        'overview': 'indigenous',
        'systems-thinking': 'indigenous systems thinking',
        'protocols': 'cultural protocols indigenous',
        'seven-generation': 'seven generation thinking',
        'connection-to-country': 'connection to country',
        'storytelling': 'indigenous storytelling'
      },
      'mentoring': {
        'overview': 'mentoring',
        'methodology': 'AIME methodology mentoring',
        'reverse-mentoring': 'reverse mentoring',
        'imagination-curriculum': 'imagination curriculum',
        'university-partnerships': 'university partnerships',
        'impact-measurement': 'impact measurement mentoring'
      },
      'hoodie-economics': {
        'overview': 'hoodie economics',
        'imagination-credits': 'imagination credits',
        'trading-system': 'hoodie trading',
        'value-creation': 'value creation hoodie',
        'digital-economy': 'digital economy hoodie',
        'case-studies': 'hoodie case studies'
      },
      'systems-change': {
        'overview': 'systems change',
        'joy-corps': 'joy corps transformation',
        'organizational-change': 'organizational change',
        'leadership-models': 'indigenous leadership',
        'network-effects': 'network effects scaling',
        'measurement-frameworks': 'change measurement'
      },
      'tools-frameworks': {
        'overview': 'tools frameworks',
        'assessment-tools': 'assessment tools',
        'planning-frameworks': 'planning frameworks',
        'facilitation-guides': 'facilitation guides',
        'evaluation-methods': 'evaluation methods',
        'digital-tools': 'digital tools'
      },
      'business-cases': {
        'overview': 'business case',
        'education-sector': 'education sector business case',
        'corporate-partnerships': 'corporate partnerships',
        'government-initiatives': 'government initiatives',
        'community-programs': 'community programs',
        'international-expansion': 'international expansion'
      },
      'media-content': {
        'overview': 'video content media',
        'video-library': 'video',
        'newsletters': 'newsletter',
        'podcasts': 'podcast audio',
        'presentations': 'presentation',
        'publications': 'publication report'
      },
      'research': {
        'overview': 'research',
        'impact-studies': 'impact studies research',
        'methodology-research': 'methodology research',
        'longitudinal-studies': 'longitudinal studies',
        'comparative-analysis': 'comparative analysis',
        'future-research': 'future research'
      }
    }

    return queryMap[section]?.[page] || section
  }

  // Map section/page to relevant content types
  const getContentTypesForPage = (section: string, page: string): string[] => {
    const typeMap: Record<string, Record<string, string[]>> = {
      'indigenous-knowledge': {
        'overview': ['knowledge', 'business_case'],
        'systems-thinking': ['knowledge', 'tool'],
        'protocols': ['knowledge'],
        'seven-generation': ['knowledge', 'business_case'],
        'connection-to-country': ['knowledge', 'video'],
        'storytelling': ['knowledge', 'video', 'tool']
      },
      'mentoring': {
        'overview': ['knowledge', 'business_case'],
        'methodology': ['knowledge', 'tool'],
        'reverse-mentoring': ['knowledge', 'business_case'],
        'imagination-curriculum': ['knowledge', 'tool'],
        'university-partnerships': ['business_case'],
        'impact-measurement': ['knowledge', 'tool']
      },
      'hoodie-economics': {
        'overview': ['knowledge', 'business_case'],
        'imagination-credits': ['hoodie', 'tool'],
        'trading-system': ['hoodie', 'tool'],
        'value-creation': ['business_case', 'knowledge'],
        'digital-economy': ['tool', 'business_case'],
        'case-studies': ['business_case']
      },
      'tools-frameworks': {
        'overview': ['tool'],
        'assessment-tools': ['tool'],
        'planning-frameworks': ['tool'],
        'facilitation-guides': ['tool'],
        'evaluation-methods': ['tool'],
        'digital-tools': ['tool']
      },
      'business-cases': {
        'overview': ['business_case'],
        'education-sector': ['business_case'],
        'corporate-partnerships': ['business_case'],
        'government-initiatives': ['business_case'],
        'community-programs': ['business_case'],
        'international-expansion': ['business_case']
      },
      'media-content': {
        'overview': ['video', 'content'],
        'video-library': ['video'],
        'newsletters': ['content'],
        'podcasts': ['content'],
        'presentations': ['tool'],
        'publications': ['knowledge']
      }
    }

    return typeMap[section]?.[page] || ['all']
  }

  // Get static page content
  const getPageContent = (section: string, page: string) => {
    // Comprehensive content for the world's most complete Indigenous knowledge wiki
    
    if (section === 'overview' && page === 'introduction') {
      return {
        title: 'Welcome to AIME Knowledge Universe',
        subtitle: 'Your comprehensive guide to Indigenous wisdom and systems transformation',
        content: `
          <div class="prose prose-lg max-w-none">
            <p class="text-xl text-gray-600 mb-6">
              The AIME Knowledge Universe is a comprehensive repository of Indigenous wisdom, 
              practical tools, and transformative approaches to creating systemic change.
            </p>
            
            <h2>What You'll Find Here</h2>
            <p>
              This wiki contains over 2,700 resources spanning 20 years of AIME's work in 
              Indigenous education, mentoring, and systems transformation. Every piece of 
              knowledge has been carefully curated and organized to support your journey 
              of understanding and implementation.
            </p>
            
            <h2>Our Approach</h2>
            <p>
              We believe in the power of Indigenous knowledge systems to transform how we 
              think about education, economics, and social change. This wiki is organized 
              around key concepts that bridge traditional wisdom with contemporary challenges.
            </p>
            
            <h2>How to Navigate</h2>
            <ul>
              <li><strong>Browse by Section:</strong> Use the sidebar to explore different knowledge areas</li>
              <li><strong>Search Everything:</strong> Use the search bar to find specific topics across all content</li>
              <li><strong>Follow Connections:</strong> Look for related content and cross-references</li>
              <li><strong>Apply Learning:</strong> Each section includes practical tools and implementation guides</li>
            </ul>
          </div>
        `,
        quickLinks: [
          { title: 'Indigenous Knowledge Systems', section: 'indigenous-knowledge', page: 'overview' },
          { title: 'Mentoring Methodology', section: 'mentoring', page: 'methodology' },
          { title: 'Hoodie Economics', section: 'hoodie-economics', page: 'overview' },
          { title: 'Systems Change', section: 'systems-change', page: 'overview' }
        ]
      }
    }

    // INDIGENOUS KNOWLEDGE SYSTEMS SECTION
    if (section === 'indigenous-knowledge') {
      switch (page) {
        case 'overview':
          return {
            title: 'Indigenous Knowledge Systems',
            subtitle: 'Traditional wisdom for contemporary transformation',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  Indigenous Knowledge Systems are holistic frameworks that have sustained communities 
                  for thousands of years. These systems offer profound insights for contemporary 
                  challenges in education, governance, economics, and social change.
                </p>
                
                <h2>Core Principles</h2>
                <ul>
                  <li><strong>Relational Thinking:</strong> Understanding through relationships and connections</li>
                  <li><strong>Cyclical Time:</strong> Learning from patterns and recurring cycles</li>
                  <li><strong>Collective Wisdom:</strong> Knowledge held by community, not individuals</li>
                  <li><strong>Land-Centered:</strong> Wisdom emerges from connection to place</li>
                  <li><strong>Intergenerational:</strong> Learning spans past, present, and future</li>
                </ul>

                <h2>Contemporary Applications</h2>
                <p>
                  AIME has spent 20 years translating Indigenous knowledge into practical frameworks 
                  for modern contexts. These applications span education systems, organizational 
                  development, economic models, and social transformation initiatives.
                </p>

                <h2>Respectful Engagement</h2>
                <p>
                  All knowledge shared here follows protocols of respect, reciprocity, and 
                  responsibility. We acknowledge the Traditional Custodians and work to ensure 
                  Indigenous wisdom is honored in its application.
                </p>
              </div>
            `,
            quickLinks: [
              { title: 'Systems Thinking', section: 'indigenous-knowledge', page: 'systems-thinking' },
              { title: 'Cultural Protocols', section: 'indigenous-knowledge', page: 'protocols' },
              { title: 'Seven Generation Thinking', section: 'indigenous-knowledge', page: 'seven-generation' },
              { title: 'Connection to Country', section: 'indigenous-knowledge', page: 'connection-to-country' }
            ]
          }
        
        case 'systems-thinking':
          return {
            title: 'Indigenous Systems Thinking',
            subtitle: 'Holistic approaches to understanding complex relationships',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  Indigenous Systems Thinking is a way of understanding the world through 
                  relationships, patterns, and interconnections. Unlike linear Western thinking, 
                  it embraces complexity and sees wholes rather than parts.
                </p>

                <h2>Key Characteristics</h2>
                <ul>
                  <li><strong>Circular Logic:</strong> Thinking in cycles and spirals rather than straight lines</li>
                  <li><strong>Multiple Perspectives:</strong> Seeing from many viewpoints simultaneously</li>
                  <li><strong>Dynamic Balance:</strong> Understanding equilibrium through movement</li>
                  <li><strong>Pattern Recognition:</strong> Identifying recurring themes across contexts</li>
                  <li><strong>Emergence:</strong> Allowing solutions to arise from the system itself</li>
                </ul>

                <h2>Practical Applications</h2>
                <h3>In Education</h3>
                <p>
                  Indigenous systems thinking transforms how we approach learning, moving from 
                  subject silos to integrated understanding. Students learn to see connections 
                  between disciplines and understand their place in larger systems.
                </p>

                <h3>In Organizations</h3>
                <p>
                  Organizations using Indigenous systems thinking focus on relationships, 
                  cultural health, and sustainable practices rather than just profit and efficiency.
                </p>

                <h3>In Problem Solving</h3>
                <p>
                  Complex challenges are approached through understanding root relationships 
                  rather than treating symptoms. Solutions emerge from community wisdom 
                  and collective insight.
                </p>

                <h2>AIME's Framework</h2>
                <p>
                  AIME has developed practical tools that translate Indigenous systems thinking 
                  into contemporary contexts while maintaining cultural integrity and respect.
                </p>
              </div>
            `
          }

        case 'seven-generation':
          return {
            title: 'Seven Generation Thinking',
            subtitle: 'Decision-making for long-term impact and sustainability',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  Seven Generation Thinking is an Indigenous principle that calls us to consider 
                  the impact of every decision on seven generations into the future - approximately 
                  140 years ahead.
                </p>

                <h2>The Principle</h2>
                <p>
                  This framework asks: "How will this decision affect our children's children's 
                  children?" It requires thinking beyond immediate benefits to long-term 
                  consequences and sustainability.
                </p>

                <h2>Contemporary Applications</h2>
                <h3>In Business</h3>
                <ul>
                  <li>Sustainable business models that regenerate rather than extract</li>
                  <li>Stakeholder consideration beyond shareholders</li>
                  <li>Investment in community and environmental health</li>
                </ul>

                <h3>In Education</h3>
                <ul>
                  <li>Curriculum designed for lifelong learning and adaptation</li>
                  <li>Teaching skills for unknown future challenges</li>
                  <li>Building educational systems that serve all learners</li>
                </ul>

                <h3>In Policy</h3>
                <ul>
                  <li>Legislation that considers long-term environmental impact</li>
                  <li>Social policies that break cycles of disadvantage</li>
                  <li>Economic frameworks that build generational wealth</li>
                </ul>

                <h2>Implementation Framework</h2>
                <p>
                  AIME has developed practical tools for applying Seven Generation Thinking 
                  in modern contexts, including decision-making matrices, impact assessment 
                  tools, and planning frameworks.
                </p>
              </div>
            `
          }

        case 'protocols':
          return {
            title: 'Cultural Protocols & Respect',
            subtitle: 'Frameworks for respectful engagement with Indigenous knowledge',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  Cultural protocols are the respectful ways of engaging with Indigenous knowledge, 
                  communities, and sacred practices. They ensure that knowledge sharing happens 
                  with proper respect, reciprocity, and responsibility.
                </p>

                <h2>Core Protocol Principles</h2>
                <ul>
                  <li><strong>Free, Prior, and Informed Consent:</strong> Communities control access to their knowledge</li>
                  <li><strong>Attribution and Recognition:</strong> Proper acknowledgment of knowledge sources</li>
                  <li><strong>Benefit Sharing:</strong> Ensuring communities receive value from knowledge use</li>
                  <li><strong>Cultural Sensitivity:</strong> Understanding sacred and restricted knowledge</li>
                  <li><strong>Ongoing Relationship:</strong> Knowledge sharing builds long-term partnerships</li>
                </ul>

                <h2>AIME's Protocol Framework</h2>
                <h3>Acknowledgment Practices</h3>
                <p>
                  Every piece of work begins with acknowledging Traditional Custodians and 
                  the ongoing connection to Country. This isn't just ceremonial - it's a 
                  recognition of the knowledge systems that inform our approach.
                </p>

                <h3>Knowledge Sharing Agreements</h3>
                <p>
                  Formal agreements outline how Indigenous knowledge will be used, shared, 
                  and attributed. These protect cultural integrity while enabling 
                  transformative applications.
                </p>

                <h3>Community Consultation</h3>
                <p>
                  Ongoing dialogue with Indigenous communities ensures that knowledge 
                  application remains respectful and beneficial to Traditional Custodians.
                </p>

                <h2>Practical Applications</h2>
                <h3>In Organizations</h3>
                <ul>
                  <li>Developing Reconciliation Action Plans</li>
                  <li>Creating culturally safe workplaces</li>
                  <li>Implementing Indigenous procurement policies</li>
                  <li>Supporting Indigenous leadership development</li>
                </ul>

                <h3>In Education</h3>
                <ul>
                  <li>Embedding Indigenous perspectives in curriculum</li>
                  <li>Supporting Indigenous students and families</li>
                  <li>Creating culturally responsive teaching practices</li>
                  <li>Building partnerships with local communities</li>
                </ul>

                <h2>Red Flags and What to Avoid</h2>
                <ul>
                  <li>Extracting knowledge without permission or attribution</li>
                  <li>Using Indigenous symbols or practices inappropriately</li>
                  <li>Speaking on behalf of Indigenous communities</li>
                  <li>Treating Indigenous knowledge as inferior to Western knowledge</li>
                  <li>Commercializing sacred or restricted knowledge</li>
                </ul>
              </div>
            `
          }

        case 'connection-to-country':
          return {
            title: 'Connection to Country',
            subtitle: 'Understanding the fundamental relationship between people and place',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  Connection to Country is a fundamental concept in Indigenous cultures worldwide. 
                  It represents the deep, spiritual, and practical relationship between people 
                  and the land that sustains and shapes identity, knowledge, and purpose.
                </p>

                <h2>Understanding Country</h2>
                <p>
                  'Country' is not just geography or property. It encompasses the land, water, 
                  air, trees, plants, animals, and spiritual beings that inhabit a place. 
                  It includes the stories, laws, and ceremonies that connect people to place 
                  across thousands of years.
                </p>

                <h2>Dimensions of Connection</h2>
                <h3>Physical Connection</h3>
                <ul>
                  <li>Living on or regularly visiting traditional lands</li>
                  <li>Participating in land management and care practices</li>
                  <li>Gathering traditional foods and medicines</li>
                  <li>Understanding seasonal cycles and ecological relationships</li>
                </ul>

                <h3>Cultural Connection</h3>
                <ul>
                  <li>Learning and sharing traditional stories and songs</li>
                  <li>Participating in ceremonies and cultural practices</li>
                  <li>Speaking traditional languages</li>
                  <li>Maintaining knowledge of cultural protocols</li>
                </ul>

                <h3>Spiritual Connection</h3>
                <ul>
                  <li>Understanding the sacred sites and their significance</li>
                  <li>Maintaining relationships with ancestral spirits</li>
                  <li>Participating in ceremonial obligations</li>
                  <li>Passing on spiritual knowledge to next generations</li>
                </ul>

                <h2>Connection in Contemporary Contexts</h2>
                <h3>Urban Environments</h3>
                <p>
                  Many Indigenous people live in urban areas but maintain connection through 
                  community gathering spaces, cultural centers, and regular visits to Country. 
                  Urban connection involves creating cultural spaces and maintaining relationships 
                  with traditional lands.
                </p>

                <h3>Digital Platforms</h3>
                <p>
                  Technology enables new forms of connection through virtual Country visits, 
                  digital storytelling, online cultural learning, and maintaining connections 
                  across distances.
                </p>

                <h3>Educational Settings</h3>
                <p>
                  Schools and universities are incorporating land-based learning, Indigenous 
                  perspectives, and local cultural knowledge to help all students understand 
                  their relationship to place.
                </p>

                <h2>AIME's Approach to Country</h2>
                <p>
                  AIME recognizes that all learning happens on Country and that understanding 
                  place is fundamental to education and personal development. Programs 
                  incorporate local Indigenous knowledge and emphasize the importance of 
                  connection to place for all young people.
                </p>

                <h2>Benefits of Strong Connection</h2>
                <ul>
                  <li><strong>Identity and Belonging:</strong> Clear sense of self and place in the world</li>
                  <li><strong>Mental Health:</strong> Reduced anxiety and depression through spiritual connection</li>
                  <li><strong>Environmental Awareness:</strong> Deep understanding of ecological relationships</li>
                  <li><strong>Cultural Continuity:</strong> Preservation and transmission of traditional knowledge</li>
                  <li><strong>Community Resilience:</strong> Strong social networks and support systems</li>
                </ul>
              </div>
            `
          }

        case 'storytelling':
          return {
            title: 'Indigenous Storytelling Traditions',
            subtitle: 'The power of narrative in knowledge transmission and cultural continuity',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  Indigenous storytelling is one of the world's oldest and most powerful 
                  knowledge transmission systems. Stories carry law, science, history, 
                  spirituality, and practical wisdom across generations.
                </p>

                <h2>Types of Indigenous Stories</h2>
                <h3>Creation Stories</h3>
                <p>
                  These foundational narratives explain how the world came to be, establishing 
                  the relationship between people, Country, and spiritual beings. They provide 
                  the framework for understanding existence and purpose.
                </p>

                <h3>Teaching Stories</h3>
                <p>
                  Stories that convey practical knowledge about survival, social behavior, 
                  ecological relationships, and cultural protocols. They often feature 
                  animals or ancestral beings as teachers.
                </p>

                <h3>Historical Narratives</h3>
                <p>
                  Accounts of significant events, migrations, conflicts, and cultural changes. 
                  These stories preserve collective memory and inform contemporary decision-making.
                </p>

                <h3>Personal Stories</h3>
                <p>
                  Individual experiences that illustrate broader truths about life, 
                  relationships, and cultural values. These stories build empathy and 
                  understanding across generations.
                </p>

                <h2>Functions of Storytelling</h2>
                <ul>
                  <li><strong>Knowledge Preservation:</strong> Storing complex information in memorable formats</li>
                  <li><strong>Cultural Transmission:</strong> Passing values and beliefs to next generations</li>
                  <li><strong>Social Cohesion:</strong> Creating shared understanding and identity</li>
                  <li><strong>Healing and Wellness:</strong> Processing trauma and building resilience</li>
                  <li><strong>Problem Solving:</strong> Providing frameworks for addressing challenges</li>
                  <li><strong>Entertainment:</strong> Bringing joy and community connection</li>
                </ul>

                <h2>Storytelling Elements</h2>
                <h3>Oral Tradition</h3>
                <p>
                  Stories are primarily shared through spoken word, allowing for dynamic 
                  adaptation to audience and context while maintaining core messages. 
                  The storyteller's voice, rhythm, and presence are integral to the experience.
                </p>

                <h3>Multi-sensory Experience</h3>
                <p>
                  Traditional storytelling often incorporates music, dance, visual arts, 
                  and ceremonial elements. Stories are embodied experiences that engage 
                  all the senses and create lasting memories.
                </p>

                <h3>Layered Meanings</h3>
                <p>
                  Stories operate on multiple levels, with surface narratives containing 
                  deeper spiritual, ecological, and social teachings. Different audiences 
                  may understand different layers based on their knowledge and experience.
                </p>

                <h2>Contemporary Applications</h2>
                <h3>Digital Storytelling</h3>
                <p>
                  Modern technology enables new forms of Indigenous storytelling through 
                  video, podcasts, interactive media, and virtual reality. These platforms 
                  preserve traditional stories while reaching new audiences.
                </p>

                <h3>Educational Integration</h3>
                <p>
                  Schools incorporate Indigenous stories to teach various subjects including 
                  science, history, literature, and social studies. Stories provide culturally 
                  relevant and engaging learning experiences for all students.
                </p>

                <h3>Therapeutic Applications</h3>
                <p>
                  Story therapy and narrative healing approaches draw on Indigenous storytelling 
                  traditions to support mental health and wellbeing in clinical and community settings.
                </p>

                <h2>AIME's Storytelling Approach</h2>
                <p>
                  AIME uses storytelling as a core educational methodology, encouraging young 
                  people to share their own stories while learning from traditional narratives. 
                  This approach builds confidence, cultural connection, and communication skills.
                </p>

                <h2>Respectful Story Sharing</h2>
                <ul>
                  <li>Understanding which stories are appropriate to share publicly</li>
                  <li>Acknowledging the source and cultural context of stories</li>
                  <li>Seeking permission before sharing traditional narratives</li>
                  <li>Supporting Indigenous storytellers and communities</li>
                  <li>Recognizing the sacred nature of certain stories</li>
                </ul>
              </div>
            `
          }
      }
    }

    // MENTORING & EDUCATION SECTION
    if (section === 'mentoring') {
      switch (page) {
        case 'overview':
          return {
            title: 'AIME Mentoring Approach',
            subtitle: 'Transformative mentoring that unlocks imagination and potential',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  AIME's mentoring approach is built on 20 years of experience working with 
                  Indigenous and marginalized young people. Our methodology combines Indigenous 
                  wisdom with contemporary educational practices to create transformative experiences.
                </p>

                <h2>Core Principles</h2>
                <ul>
                  <li><strong>Relational Focus:</strong> Authentic relationships are the foundation of all learning</li>
                  <li><strong>Strengths-Based:</strong> Every young person has unique gifts and potential</li>
                  <li><strong>Culturally Responsive:</strong> Programs honor and incorporate cultural backgrounds</li>
                  <li><strong>Imagination-Centered:</strong> Creativity and possibility thinking drive engagement</li>
                  <li><strong>Future-Focused:</strong> Building pathways to education and opportunity</li>
                  <li><strong>Community Connected:</strong> Linking young people to broader networks and opportunities</li>
                </ul>

                <h2>The AIME Philosophy</h2>
                <p>
                  We believe that marginalized young people are not disadvantaged - they are 
                  differently advantaged. Our role is not to 'fix' young people, but to create 
                  environments where their natural talents and wisdom can flourish.
                </p>

                <h2>Mentoring Model Components</h2>
                <h3>University Mentors</h3>
                <p>
                  Carefully selected and trained university students serve as mentors, bringing 
                  energy, relatability, and current educational experience to the relationship.
                </p>

                <h3>Indigenous Leadership</h3>
                <p>
                  Programs are led by Indigenous team members who provide cultural grounding, 
                  authentic connection, and powerful role modeling for young people.
                </p>

                <h3>Experiential Learning</h3>
                <p>
                  Hands-on activities, creative projects, and real-world experiences make 
                  learning engaging and memorable while building practical skills.
                </p>

                <h3>Network Building</h3>
                <p>
                  Connecting young people to universities, employers, and community organizations 
                  creates ongoing opportunities and support beyond program participation.
                </p>

                <h2>Impact Areas</h2>
                <ul>
                  <li><strong>Educational Outcomes:</strong> Increased school completion and university enrollment</li>
                  <li><strong>Self-Efficacy:</strong> Enhanced confidence and belief in personal potential</li>
                  <li><strong>Cultural Identity:</strong> Strengthened connection to heritage and community</li>
                  <li><strong>Social Capital:</strong> Expanded networks and relationship skills</li>
                  <li><strong>Future Orientation:</strong> Clear goals and pathways for the future</li>
                </ul>

                <h2>Proven Results</h2>
                <p>
                  Over 20 years, AIME has worked with more than 75,000 students across Australia, 
                  achieving exceptional outcomes in education completion and university enrollment 
                  while building cultural pride and community connection.
                </p>
              </div>
            `,
            quickLinks: [
              { title: 'AIME Methodology', section: 'mentoring', page: 'methodology' },
              { title: 'Reverse Mentoring', section: 'mentoring', page: 'reverse-mentoring' },
              { title: 'Imagination Curriculum', section: 'mentoring', page: 'imagination-curriculum' },
              { title: 'Impact Measurement', section: 'mentoring', page: 'impact-measurement' }
            ]
          }

        case 'methodology':
          return {
            title: 'AIME Methodology Framework',
            subtitle: 'Systematic approach to transformative mentoring and education',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  The AIME Methodology is a systematic framework developed over 20 years of 
                  frontline work with Indigenous and marginalized young people. It provides 
                  a structured yet flexible approach to creating transformative educational experiences.
                </p>

                <h2>The AIME Learning Framework</h2>
                <h3>1. Hook Phase - Capture Imagination</h3>
                <p>
                  The first contact must immediately engage young people's imagination and 
                  curiosity. This phase uses creative activities, storytelling, and unexpected 
                  experiences to break down barriers and create openness to learning.
                </p>
                <ul>
                  <li>Interactive icebreaker activities</li>
                  <li>Storytelling from Indigenous leaders</li>
                  <li>Creative challenges and problem-solving</li>
                  <li>Connection to personal interests and passions</li>
                </ul>

                <h3>2. Look Phase - Expand Horizons</h3>
                <p>
                  Young people are exposed to new possibilities, role models, and pathways. 
                  This phase focuses on expanding their sense of what's possible while 
                  maintaining connection to their cultural identity.
                </p>
                <ul>
                  <li>University campus visits and experiences</li>
                  <li>Meeting successful Indigenous professionals</li>
                  <li>Exploring diverse career pathways</li>
                  <li>Learning about cultural strength and resilience</li>
                </ul>

                <h3>3. Book Phase - Build Skills and Knowledge</h3>
                <p>
                  Practical skills development combined with academic support. This phase 
                  provides concrete tools and knowledge while maintaining the relational 
                  and cultural foundations established earlier.
                </p>
                <ul>
                  <li>Academic tutoring and study skills</li>
                  <li>Leadership development workshops</li>
                  <li>Communication and presentation skills</li>
                  <li>Cultural knowledge and protocols</li>
                </ul>

                <h3>4. Took Phase - Take Action</h3>
                <p>
                  Young people apply their learning through real-world projects and initiatives. 
                  This phase emphasizes agency, leadership, and contributing back to community.
                </p>
                <ul>
                  <li>Community service projects</li>
                  <li>Mentoring younger students</li>
                  <li>Cultural sharing and presentation</li>
                  <li>Taking on leadership roles</li>
                </ul>

                <h2>Implementation Principles</h2>
                <h3>Cultural Integration</h3>
                <p>
                  Every aspect of the methodology incorporates Indigenous perspectives and 
                  ways of knowing. This isn't add-on content but fundamental to how learning 
                  is structured and delivered.
                </p>

                <h3>Relationship-Centered</h3>
                <p>
                  All learning happens within the context of authentic relationships. Mentors 
                  invest in genuine connections that extend beyond program boundaries.
                </p>

                <h3>Strength-Based Approach</h3>
                <p>
                  The methodology focuses on identifying and building upon existing strengths 
                  rather than addressing deficits. Every young person is seen as gifted and capable.
                </p>

                <h3>Community Connected</h3>
                <p>
                  Programs actively connect participants to broader community networks, creating 
                  ongoing support and opportunity beyond formal programming.
                </p>

                <h2>Mentor Training Framework</h2>
                <h3>Cultural Competency</h3>
                <ul>
                  <li>Understanding Indigenous history and current context</li>
                  <li>Learning respectful communication and protocols</li>
                  <li>Recognizing cultural strengths and assets</li>
                  <li>Developing cultural humility and ongoing learning</li>
                </ul>

                <h3>Relationship Skills</h3>
                <ul>
                  <li>Building authentic connections with young people</li>
                  <li>Active listening and empathetic communication</li>
                  <li>Managing boundaries while being genuinely supportive</li>
                  <li>Recognizing and responding to diverse needs</li>
                </ul>

                <h3>Educational Techniques</h3>
                <ul>
                  <li>Facilitating experiential and hands-on learning</li>
                  <li>Using storytelling and narrative approaches</li>
                  <li>Incorporating creativity and imagination in all activities</li>
                  <li>Adapting to different learning styles and preferences</li>
                </ul>

                <h2>Assessment and Adaptation</h2>
                <p>
                  The methodology includes continuous assessment and adaptation based on 
                  participant feedback, community input, and outcome data. This ensures 
                  programs remain relevant and effective while maintaining core principles.
                </p>
              </div>
            `
          }

        case 'reverse-mentoring':
          return {
            title: 'Reverse Mentoring Models',
            subtitle: 'Learning flows both ways - when young people mentor others',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  Reverse mentoring recognizes that learning is multi-directional. Young people 
                  have unique insights, fresh perspectives, and valuable knowledge to share with 
                  older mentors, educators, and community members.
                </p>

                <h2>The Reverse Mentoring Concept</h2>
                <p>
                  Traditional mentoring models position older, more experienced individuals as 
                  the source of wisdom. Reverse mentoring flips this dynamic, acknowledging 
                  that young people - especially those from marginalized communities - possess 
                  valuable knowledge and perspectives that can benefit everyone.
                </p>

                <h2>What Young People Bring</h2>
                <h3>Cultural Knowledge</h3>
                <ul>
                  <li>Deep understanding of contemporary youth culture</li>
                  <li>Insights into family and community dynamics</li>
                  <li>Knowledge of cultural protocols and traditions</li>
                  <li>Understanding of intergenerational trauma and resilience</li>
                </ul>

                <h3>Fresh Perspectives</h3>
                <ul>
                  <li>Unencumbered thinking about complex problems</li>
                  <li>Creative approaches to traditional challenges</li>
                  <li>Questions that challenge assumptions</li>
                  <li>Vision for future possibilities</li>
                </ul>

                <h3>Authentic Feedback</h3>
                <ul>
                  <li>Honest assessment of programs and approaches</li>
                  <li>Real-time feedback on what works and what doesn't</li>
                  <li>Insights into barriers and challenges</li>
                  <li>Suggestions for improvement and innovation</li>
                </ul>

                <h2>AIME's Reverse Mentoring Applications</h2>
                <h3>Program Design</h3>
                <p>
                  Young people are actively involved in designing and improving AIME programs. 
                  They provide input on content, activities, delivery methods, and evaluation 
                  approaches to ensure relevance and effectiveness.
                </p>

                <h3>Staff Development</h3>
                <p>
                  AIME alumni mentor new staff members, sharing insights about working effectively 
                  with Indigenous young people, understanding community dynamics, and building 
                  authentic relationships.
                </p>

                <h3>University Partnerships</h3>
                <p>
                  Indigenous students mentor university staff and other students about cultural 
                  responsiveness, inclusive practices, and creating welcoming environments for 
                  Indigenous learners.
                </p>

                <h3>Corporate Engagement</h3>
                <p>
                  Young people mentor corporate partners about authentic Indigenous engagement, 
                  avoiding tokenism, and creating meaningful employment and partnership opportunities.
                </p>

                <h2>Implementation Models</h2>
                <h3>Peer-to-Peer Mentoring</h3>
                <p>
                  Older program participants mentor newer participants, sharing experiences, 
                  providing support, and helping navigate challenges. This creates a culture 
                  of mutual support and leadership development.
                </p>

                <h3>Cross-Generational Dialogue</h3>
                <p>
                  Structured conversations between young people and adults where both parties 
                  share knowledge and learn from each other. These sessions build understanding 
                  and break down generational barriers.
                </p>

                <h3>Advisory Roles</h3>
                <p>
                  Young people serve on advisory committees, boards, and planning groups where 
                  their input directly influences organizational decisions and directions.
                </p>

                <h3>Training and Development</h3>
                <p>
                  Youth deliver training sessions to adults on topics like cultural awareness, 
                  contemporary issues, technology use, and effective communication with young people.
                </p>

                <h2>Benefits of Reverse Mentoring</h2>
                <h3>For Young People</h3>
                <ul>
                  <li>Recognition of their knowledge and value</li>
                  <li>Development of leadership and teaching skills</li>
                  <li>Increased confidence and self-efficacy</li>
                  <li>Meaningful contribution to organizational improvement</li>
                </ul>

                <h3>For Adult Mentors</h3>
                <ul>
                  <li>Fresh perspectives on familiar challenges</li>
                  <li>Deeper understanding of youth experiences</li>
                  <li>Improved cultural competency and awareness</li>
                  <li>Enhanced program effectiveness and relevance</li>
                </ul>

                <h3>For Organizations</h3>
                <ul>
                  <li>More responsive and effective programs</li>
                  <li>Stronger relationships with target communities</li>
                  <li>Innovation in approaches and methods</li>
                  <li>Authentic youth voice in decision-making</li>
                </ul>

                <h2>Creating Effective Reverse Mentoring</h2>
                <ul>
                  <li>Establish genuine respect for youth knowledge and insights</li>
                  <li>Create safe spaces for honest feedback and dialogue</li>
                  <li>Provide training and support for youth mentors</li>
                  <li>Ensure youth input influences real decisions</li>
                  <li>Recognize and celebrate youth contributions</li>
                  <li>Build ongoing relationships rather than one-off consultations</li>
                </ul>
              </div>
            `
          }

        case 'imagination-curriculum':
          return {
            title: 'Imagination Curriculum',
            subtitle: 'Creativity-centered learning that transforms educational experiences',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  The Imagination Curriculum places creativity and possibility thinking at the 
                  center of learning. It transforms traditional educational approaches by making 
                  imagination the driving force for engagement, understanding, and growth.
                </p>

                <h2>Core Philosophy</h2>
                <p>
                  We believe that imagination is not just for art class - it's the fundamental 
                  capacity that enables learning, problem-solving, and innovation across all 
                  disciplines. When young people can imagine themselves succeeding, they begin 
                  to take the steps necessary to make that vision reality.
                </p>

                <h2>Curriculum Components</h2>
                <h3>1. Storytelling and Narrative</h3>
                <p>
                  Every learning experience begins with story. Stories make content memorable, 
                  create emotional connection, and provide frameworks for understanding complex concepts.
                </p>
                <ul>
                  <li>Personal storytelling workshops</li>
                  <li>Traditional Indigenous stories and their lessons</li>
                  <li>Creating narratives around academic content</li>
                  <li>Future visioning through story</li>
                </ul>

                <h3>2. Creative Problem-Solving</h3>
                <p>
                  Students approach challenges through creative thinking, generating multiple 
                  solutions and exploring unconventional approaches. This builds confidence 
                  in their ability to tackle any problem.
                </p>
                <ul>
                  <li>Design thinking workshops</li>
                  <li>Innovation challenges</li>
                  <li>Collaborative brainstorming sessions</li>
                  <li>Prototyping and experimentation</li>
                </ul>

                <h3>3. Future Visioning</h3>
                <p>
                  Students spend time imagining their ideal futures and working backwards to 
                  identify the steps needed to achieve their goals. This creates motivation 
                  and direction for current learning.
                </p>
                <ul>
                  <li>Vision board creation</li>
                  <li>Goal setting and pathway planning</li>
                  <li>Role model interviews and research</li>
                  <li>Action planning and milestone setting</li>
                </ul>

                <h3>4. Cultural Imagination</h3>
                <p>
                  Students explore how their cultural background provides unique perspectives 
                  and strengths. They imagine how traditional knowledge can address contemporary 
                  challenges.
                </p>
                <ul>
                  <li>Cultural strength identification</li>
                  <li>Traditional knowledge applications</li>
                  <li>Cultural pride building activities</li>
                  <li>Community contribution projects</li>
                </ul>

                <h2>Subject Integration</h2>
                <h3>Mathematics Through Imagination</h3>
                <ul>
                  <li>Creating stories that involve mathematical concepts</li>
                  <li>Designing solutions to real-world problems using math</li>
                  <li>Exploring patterns in art, music, and nature</li>
                  <li>Building and creating with geometric principles</li>
                </ul>

                <h3>Science Through Wonder</h3>
                <ul>
                  <li>Asking big questions about the universe</li>
                  <li>Conducting experiments based on curiosity</li>
                  <li>Connecting scientific concepts to traditional knowledge</li>
                  <li>Imagining future scientific discoveries</li>
                </ul>

                <h3>Language Arts Through Expression</h3>
                <ul>
                  <li>Writing creative narratives and poetry</li>
                  <li>Exploring multiple perspectives on issues</li>
                  <li>Developing voice and authentic expression</li>
                  <li>Connecting literature to personal experience</li>
                </ul>

                <h3>Social Studies Through Connection</h3>
                <ul>
                  <li>Imagining historical perspectives and experiences</li>
                  <li>Exploring cultural connections and differences</li>
                  <li>Designing solutions to social challenges</li>
                  <li>Understanding systemic issues through story</li>
                </ul>

                <h2>Implementation Strategies</h2>
                <h3>Learning Environment</h3>
                <p>
                  Physical and social environments are designed to stimulate imagination through 
                  flexible spaces, inspiring visuals, and a culture that celebrates creativity 
                  and risk-taking.
                </p>

                <h3>Facilitator Training</h3>
                <p>
                  Educators learn to facilitate rather than direct learning, asking open-ended 
                  questions, encouraging exploration, and helping students make connections 
                  between their interests and academic content.
                </p>

                <h3>Assessment Approaches</h3>
                <p>
                  Assessment focuses on growth, creativity, and application rather than just 
                  content recall. Students demonstrate learning through projects, presentations, 
                  and real-world applications.
                </p>

                <h2>Outcomes and Impact</h2>
                <h3>Academic Engagement</h3>
                <ul>
                  <li>Increased participation and attendance</li>
                  <li>Improved academic performance across subjects</li>
                  <li>Greater retention and completion rates</li>
                  <li>Enhanced critical thinking skills</li>
                </ul>

                <h3>Personal Development</h3>
                <ul>
                  <li>Increased confidence and self-efficacy</li>
                  <li>Stronger cultural identity and pride</li>
                  <li>Enhanced communication and presentation skills</li>
                  <li>Greater resilience and adaptability</li>
                </ul>

                <h3>Future Orientation</h3>
                <ul>
                  <li>Clear vision for personal and professional goals</li>
                  <li>Increased aspiration for higher education</li>
                  <li>Greater sense of agency and possibility</li>
                  <li>Commitment to contributing to community</li>
                </ul>

                <h2>Adaptation for Different Contexts</h2>
                <p>
                  The Imagination Curriculum can be adapted for various educational settings, 
                  age groups, and cultural contexts while maintaining its core principles of 
                  creativity, possibility thinking, and cultural responsiveness.
                </p>
              </div>
            `
          }

        case 'university-partnerships':
          return {
            title: 'University Partnership Models',
            subtitle: 'Building bridges between Indigenous communities and higher education',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  AIME's university partnerships create pathways for Indigenous students while 
                  transforming higher education institutions to be more inclusive, culturally 
                  responsive, and connected to community needs.
                </p>

                <h2>Partnership Philosophy</h2>
                <p>
                  University partnerships are built on mutual benefit and reciprocal learning. 
                  Universities gain authentic Indigenous perspectives and community connections, 
                  while Indigenous students access educational opportunities and cultural support 
                  within higher education.
                </p>

                <h2>Core Partnership Components</h2>
                <h3>Student Mentoring Programs</h3>
                <p>
                  University students serve as mentors for Indigenous high school students, 
                  providing academic support, university insights, and ongoing encouragement. 
                  These relationships often continue throughout the mentees' educational journey.
                </p>
                <ul>
                  <li>Academic tutoring and study skills development</li>
                  <li>University application and transition support</li>
                  <li>Cultural bridge-building between school and university</li>
                  <li>Ongoing relationship and networking opportunities</li>
                </ul>

                <h3>Campus Experiences</h3>
                <p>
                  Regular visits to university campuses demystify higher education and help 
                  Indigenous students see themselves as university students. These experiences 
                  range from day visits to week-long immersion programs.
                </p>
                <ul>
                  <li>Classroom observations and participation</li>
                  <li>Meeting Indigenous academic staff and students</li>
                  <li>Exploring facilities and resources</li>
                  <li>Understanding university culture and expectations</li>
                </ul>

                <h3>Academic Pathway Development</h3>
                <p>
                  Partnerships create clear pathways from secondary to tertiary education, 
                  including bridging programs, foundation courses, and alternative entry schemes 
                  that recognize diverse forms of knowledge and experience.
                </p>
                <ul>
                  <li>Foundation and bridging programs</li>
                  <li>Alternative entry pathways</li>
                  <li>Recognition of prior learning and experience</li>
                  <li>Flexible study options and support services</li>
                </ul>

                <h2>Institutional Transformation</h2>
                <h3>Curriculum Integration</h3>
                <p>
                  Universities integrate Indigenous perspectives across all disciplines, not just 
                  Indigenous studies programs. This creates a more inclusive curriculum that 
                  benefits all students while respecting Indigenous knowledge systems.
                </p>
                <ul>
                  <li>Indigenous content in core subjects</li>
                  <li>Traditional knowledge in science and environmental programs</li>
                  <li>Indigenous business and economic models</li>
                  <li>Storytelling and narrative approaches across disciplines</li>
                </ul>

                <h3>Cultural Competency Development</h3>
                <p>
                  University staff participate in cultural competency training led by Indigenous 
                  educators and community members. This builds understanding and creates more 
                  welcoming environments for Indigenous students.
                </p>
                <ul>
                  <li>Cultural awareness workshops for all staff</li>
                  <li>Understanding Indigenous learning styles</li>
                  <li>Trauma-informed practice training</li>
                  <li>Building respectful relationships with Indigenous communities</li>
                </ul>

                <h3>Physical and Cultural Spaces</h3>
                <p>
                  Universities create dedicated spaces for Indigenous students that provide 
                  cultural connection, academic support, and community within the institution. 
                  These spaces are designed with Indigenous input and reflect cultural values.
                </p>
                <ul>
                  <li>Indigenous student centers and gathering spaces</li>
                  <li>Cultural gardens and outdoor learning areas</li>
                  <li>Art installations and cultural displays</li>
                  <li>Quiet spaces for reflection and ceremony</li>
                </ul>

                <h2>Support Services Integration</h2>
                <h3>Academic Support</h3>
                <ul>
                  <li>Indigenous-specific tutoring and study groups</li>
                  <li>Academic skills development workshops</li>
                  <li>Research supervision and mentoring</li>
                  <li>Writing centers with cultural understanding</li>
                </ul>

                <h3>Personal and Cultural Support</h3>
                <ul>
                  <li>Counseling services with Indigenous counselors</li>
                  <li>Cultural advisors and Elders in residence</li>
                  <li>Connection to ceremony and cultural practice</li>
                  <li>Family and community liaison services</li>
                </ul>

                <h3>Financial Support</h3>
                <ul>
                  <li>Indigenous-specific scholarships and grants</li>
                  <li>Emergency financial assistance</li>
                  <li>Work-study opportunities</li>
                  <li>Support for family obligations and community commitments</li>
                </ul>

                <h2>Community Engagement Models</h2>
                <h3>Research Partnerships</h3>
                <p>
                  Universities engage in community-led research that addresses priorities 
                  identified by Indigenous communities. This ensures research benefits 
                  communities while providing learning opportunities for students.
                </p>

                <h3>Service Learning</h3>
                <p>
                  Students participate in community service projects that apply their academic 
                  learning while contributing to community needs. These projects build 
                  relationships and understanding between university and community.
                </p>

                <h3>Knowledge Exchange</h3>
                <p>
                  Regular forums and events bring together university researchers, Indigenous 
                  knowledge holders, and community members to share knowledge and explore 
                  collaborative opportunities.
                </p>

                <h2>Measuring Success</h2>
                <h3>Student Outcomes</h3>
                <ul>
                  <li>Indigenous student enrollment and retention rates</li>
                  <li>Academic performance and completion rates</li>
                  <li>Graduate employment and further study</li>
                  <li>Cultural identity and connection maintenance</li>
                </ul>

                <h3>Institutional Change</h3>
                <ul>
                  <li>Staff cultural competency development</li>
                  <li>Curriculum integration of Indigenous perspectives</li>
                  <li>Increased Indigenous staff representation</li>
                  <li>Community relationship strength and satisfaction</li>
                </ul>

                <h3>Community Impact</h3>
                <ul>
                  <li>Graduate return to community and contribution</li>
                  <li>Community access to university resources</li>
                  <li>Research outcomes addressing community priorities</li>
                  <li>Strengthened education pathways for young people</li>
                </ul>

                <h2>Sustainability Factors</h2>
                <p>
                  Successful partnerships require ongoing commitment, adequate funding, 
                  senior leadership support, and genuine relationship building with 
                  Indigenous communities. They are long-term investments in education 
                  transformation and social justice.
                </p>
              </div>
            `
          }

        case 'impact-measurement':
          return {
            title: 'Measuring Mentoring Impact',
            subtitle: 'Comprehensive approaches to understanding and demonstrating outcomes',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  Measuring the impact of mentoring requires sophisticated approaches that capture 
                  both quantitative outcomes and qualitative transformations. AIME has developed 
                  comprehensive measurement frameworks over 20 years of program delivery.
                </p>

                <h2>Measurement Philosophy</h2>
                <p>
                  Impact measurement must be culturally appropriate, community-informed, and 
                  capture the full spectrum of change - from individual transformation to 
                  systemic shifts. We measure what matters to communities, not just what's 
                  easy to count.
                </p>

                <h2>Key Impact Areas</h2>
                <h3>Educational Outcomes</h3>
                <ul>
                  <li><strong>School Completion Rates:</strong> Year 12 graduation and retention</li>
                  <li><strong>University Enrollment:</strong> Higher education participation rates</li>
                  <li><strong>Academic Performance:</strong> Improved grades and test scores</li>
                  <li><strong>Pathway Clarity:</strong> Clear post-school plans and goals</li>
                  <li><strong>Learning Engagement:</strong> Increased participation and motivation</li>
                </ul>

                <h3>Personal Development</h3>
                <ul>
                  <li><strong>Self-Efficacy:</strong> Confidence in ability to achieve goals</li>
                  <li><strong>Cultural Identity:</strong> Connection to heritage and community</li>
                  <li><strong>Leadership Skills:</strong> Taking initiative and supporting others</li>
                  <li><strong>Communication:</strong> Improved presentation and interpersonal skills</li>
                  <li><strong>Resilience:</strong> Ability to navigate challenges and setbacks</li>
                </ul>

                <h3>Social Connection</h3>
                <ul>
                  <li><strong>Network Building:</strong> Expanded relationships and opportunities</li>
                  <li><strong>Peer Support:</strong> Mutual help and encouragement</li>
                  <li><strong>Mentor Relationships:</strong> Ongoing connections beyond programs</li>
                  <li><strong>Community Engagement:</strong> Involvement in cultural and service activities</li>
                  <li><strong>Family Impact:</strong> Positive changes affecting family members</li>
                </ul>

                <h2>Data Collection Methods</h2>
                <h3>Quantitative Measures</h3>
                <h4>Pre/Post Surveys</h4>
                <p>
                  Standardized instruments measure changes in self-efficacy, aspirations, 
                  cultural identity, and academic confidence. Surveys are administered 
                  before program participation and at multiple follow-up points.
                </p>

                <h4>Administrative Data</h4>
                <p>
                  School records provide objective measures of attendance, academic performance, 
                  and progression. University enrollment data tracks post-secondary participation 
                  and completion rates.
                </p>

                <h4>Longitudinal Tracking</h4>
                <p>
                  Following participants for multiple years reveals long-term impacts on 
                  education, employment, and community involvement. This data demonstrates 
                  sustained change beyond immediate program effects.
                </p>

                <h3>Qualitative Approaches</h3>
                <h4>Storytelling and Narrative</h4>
                <p>
                  Participants share their stories of change, challenge, and growth. These 
                  narratives capture transformations that numbers cannot express and provide 
                  deep insights into program impact.
                </p>

                <h4>Focus Groups</h4>
                <p>
                  Group discussions with participants, families, and community members explore 
                  program experiences, cultural appropriateness, and suggestions for improvement.
                </p>

                <h4>Individual Interviews</h4>
                <p>
                  In-depth conversations with participants, mentors, and family members provide 
                  detailed understanding of individual journeys and program influence.
                </p>

                <h4>Observation and Documentation</h4>
                <p>
                  Systematic observation of program activities documents engagement levels, 
                  interaction quality, and cultural responsiveness of programming.
                </p>

                <h2>Cultural Measurement Approaches</h2>
                <h3>Community-Defined Success</h3>
                <p>
                  Working with Indigenous communities to define what success looks like from 
                  their perspective, ensuring measurement captures culturally important outcomes 
                  like cultural connection and community contribution.
                </p>

                <h3>Strength-Based Assessment</h3>
                <p>
                  Focusing on growth and assets rather than deficits, measuring progress from 
                  individual starting points rather than comparing to external standards.
                </p>

                <h3>Holistic Indicators</h3>
                <p>
                  Including measures of family impact, community engagement, cultural practice, 
                  and spiritual wellbeing alongside traditional academic and career indicators.
                </p>

                <h3>Indigenous Research Methods</h3>
                <p>
                  Incorporating traditional knowledge gathering approaches including Yarning 
                  Circles, storytelling sessions, and ceremony-based reflection and sharing.
                </p>

                <h2>Technology and Tools</h2>
                <h3>Digital Data Collection</h3>
                <ul>
                  <li>Mobile-friendly survey platforms</li>
                  <li>Video storytelling capture</li>
                  <li>Real-time program activity tracking</li>
                  <li>Secure participant data management</li>
                </ul>

                <h3>Analytics and Visualization</h3>
                <ul>
                  <li>Statistical analysis of outcome trends</li>
                  <li>Predictive modeling for risk identification</li>
                  <li>Interactive dashboards for stakeholders</li>
                  <li>Story and data integration platforms</li>
                </ul>

                <h2>Reporting and Communication</h2>
                <h3>Multi-Audience Reporting</h3>
                <p>
                  Different stakeholders need different information. Academic reports emphasize 
                  methodology and statistical significance, while community reports focus on 
                  stories and practical outcomes.
                </p>

                <h3>Visual Storytelling</h3>
                <p>
                  Combining data visualization with participant stories creates compelling 
                  narratives that communicate impact effectively to diverse audiences.
                </p>

                <h3>Community Feedback</h3>
                <p>
                  Regular sharing of findings with participants and communities ensures 
                  measurement approaches remain relevant and findings are used for 
                  program improvement.
                </p>

                <h2>Continuous Improvement</h2>
                <h3>Real-Time Adjustment</h3>
                <p>
                  Data collection includes rapid feedback mechanisms that allow program 
                  adjustments during delivery rather than waiting for end-of-program evaluation.
                </p>

                <h3>Participant Voice</h3>
                <p>
                  Regular consultation with participants about measurement approaches ensures 
                  data collection is meaningful and culturally appropriate.
                </p>

                <h3>Evidence-Based Adaptation</h3>
                <p>
                  Findings directly inform program design modifications, mentor training 
                  improvements, and partnership relationship adjustments.
                </p>

                <h2>Challenges and Solutions</h2>
                <h3>Common Challenges</h3>
                <ul>
                  <li>Balancing rigorous measurement with cultural sensitivity</li>
                  <li>Capturing long-term impacts with limited follow-up resources</li>
                  <li>Maintaining participant engagement in data collection</li>
                  <li>Demonstrating attribution in complex intervention environments</li>
                </ul>

                <h3>AIME's Solutions</h3>
                <ul>
                  <li>Co-designing measurement with Indigenous communities</li>
                  <li>Building evaluation capacity within organizations</li>
                  <li>Creating meaningful feedback loops for participants</li>
                  <li>Using mixed methods to triangulate findings</li>
                </ul>
              </div>
            `
          }
      }
    }

    // HOODIE ECONOMICS SECTION
    if (section === 'hoodie-economics') {
      switch (page) {
        case 'overview':
          return {
            title: 'What is Hoodie Economics?',
            subtitle: 'A revolutionary economic system based on imagination, relationships, and cultural value',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  Hoodie Economics is AIME's groundbreaking approach to creating an alternative economic 
                  system that values imagination, relationships, and cultural contribution over traditional 
                  metrics of wealth and consumption.
                </p>

                <h2>The Philosophy</h2>
                <p>
                  In a world where economic systems often exclude marginalized communities, Hoodie Economics 
                  creates new pathways to value and opportunity. It recognizes that everyone has imagination 
                  and the capacity to contribute, regardless of their formal credentials or economic background.
                </p>

                <h2>Core Principles</h2>
                <ul>
                  <li><strong>Imagination as Currency:</strong> Creative thinking and possibility become tradeable assets</li>
                  <li><strong>Relationship Value:</strong> Connections and community building generate economic worth</li>
                  <li><strong>Cultural Capital:</strong> Indigenous knowledge and cultural wisdom have monetary value</li>
                  <li><strong>Inclusive Participation:</strong> Everyone can contribute regardless of traditional qualifications</li>
                  <li><strong>Regenerative Economy:</strong> Value creation that sustains and grows communities</li>
                  <li><strong>Digital Integration:</strong> Technology enables new forms of value exchange</li>
                </ul>

                <h2>How It Works</h2>
                <h3>Imagination Credits</h3>
                <p>
                  Participants earn Imagination Credits through creative contributions, community engagement, 
                  cultural sharing, and problem-solving activities. These credits can be exchanged for 
                  educational opportunities, career development, and physical rewards like hoodies.
                </p>

                <h3>Hoodie Trading System</h3>
                <p>
                  Digital and physical hoodies represent achievements and skills. They can be traded, 
                  combined, and upgraded as participants develop their capabilities and contribute to 
                  the network.
                </p>

                <h3>Value Networks</h3>
                <p>
                  Participants build networks of mutual support and opportunity creation. Value flows 
                  through these networks based on contribution, collaboration, and community benefit.
                </p>

                <h2>Real-World Applications</h2>
                <h3>Education Sector</h3>
                <ul>
                  <li>Students earn credits for creative projects and community service</li>
                  <li>Peer mentoring generates both social and economic value</li>
                  <li>Cultural knowledge sharing becomes a pathway to opportunity</li>
                  <li>Alternative assessment methods recognize diverse talents</li>
                </ul>

                <h3>Employment and Career Development</h3>
                <ul>
                  <li>Skills development tracked through hoodie achievements</li>
                  <li>Portfolio careers supported by diverse value streams</li>
                  <li>Community-based employment opportunities</li>
                  <li>Recognition of cultural and social contributions</li>
                </ul>

                <h3>Community Development</h3>
                <ul>
                  <li>Local economic development through imagination-based projects</li>
                  <li>Cultural preservation and transmission valued economically</li>
                  <li>Community problem-solving generates local value</li>
                  <li>Intergenerational knowledge transfer creates economic opportunity</li>
                </ul>

                <h2>The Hoodie Symbol</h2>
                <p>
                  The hoodie represents comfort, identity, and belonging. In many communities, 
                  young people wearing hoodies are viewed with suspicion. Hoodie Economics 
                  reclaims this symbol, making it represent achievement, capability, and 
                  positive contribution to community.
                </p>

                <h2>Technology Platform</h2>
                <p>
                  The Hoodie Economics system operates through digital platforms that track 
                  contributions, facilitate trading, and connect participants with opportunities. 
                  Blockchain technology ensures transparency and security in value exchange.
                </p>

                <h2>Measuring Success</h2>
                <h3>Individual Level</h3>
                <ul>
                  <li>Increased economic opportunity and stability</li>
                  <li>Enhanced self-efficacy and confidence</li>
                  <li>Stronger cultural identity and pride</li>
                  <li>Expanded networks and relationships</li>
                </ul>

                <h3>Community Level</h3>
                <ul>
                  <li>Local economic development and resilience</li>
                  <li>Strengthened cultural practices and knowledge</li>
                  <li>Increased community cohesion and collaboration</li>
                  <li>Reduced economic inequality and exclusion</li>
                </ul>

                <h3>System Level</h3>
                <ul>
                  <li>Alternative economic models proven viable</li>
                  <li>Increased recognition of Indigenous economic principles</li>
                  <li>More inclusive and equitable economic participation</li>
                  <li>Sustainable value creation processes</li>
                </ul>

                <h2>Global Vision</h2>
                <p>
                  Hoodie Economics aims to demonstrate that alternative economic systems can 
                  work at scale, creating a template for more inclusive and sustainable 
                  economies worldwide. It connects Indigenous wisdom with contemporary 
                  technology to create new possibilities for economic participation.
                </p>
              </div>
            `,
            quickLinks: [
              { title: 'Imagination Credits', section: 'hoodie-economics', page: 'imagination-credits' },
              { title: 'Trading System', section: 'hoodie-economics', page: 'trading-system' },
              { title: 'Value Creation Models', section: 'hoodie-economics', page: 'value-creation' },
              { title: 'Case Studies', section: 'hoodie-economics', page: 'case-studies' }
            ]
          }

        case 'imagination-credits':
          return {
            title: 'Imagination Credits System',
            subtitle: 'Quantifying and rewarding creative contribution and community engagement',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  Imagination Credits are the fundamental currency of Hoodie Economics, representing 
                  the value created through creative thinking, community contribution, and cultural 
                  knowledge sharing.
                </p>

                <h2>What Are Imagination Credits?</h2>
                <p>
                  Imagination Credits (ICs) are digital tokens that represent contributions to the 
                  AIME network and broader community. Unlike traditional currency, they recognize 
                  the value of creativity, relationship building, and cultural wisdom.
                </p>

                <h2>How to Earn Imagination Credits</h2>
                <h3>Creative Contributions</h3>
                <ul>
                  <li><strong>Storytelling (50-200 ICs):</strong> Sharing personal stories that inspire others</li>
                  <li><strong>Art Creation (100-500 ICs):</strong> Visual art, music, poetry, or performance</li>
                  <li><strong>Innovation Projects (200-1000 ICs):</strong> Developing solutions to community challenges</li>
                  <li><strong>Content Creation (75-300 ICs):</strong> Videos, podcasts, or written content</li>
                </ul>

                <h3>Community Engagement</h3>
                <ul>
                  <li><strong>Mentoring Others (100-400 ICs):</strong> Supporting younger participants</li>
                  <li><strong>Event Participation (25-100 ICs):</strong> Active engagement in programs</li>
                  <li><strong>Community Service (150-600 ICs):</strong> Volunteering and giving back</li>
                  <li><strong>Cultural Sharing (200-800 ICs):</strong> Teaching traditional knowledge</li>
                </ul>

                <h3>Learning and Development</h3>
                <ul>
                  <li><strong>Course Completion (100-500 ICs):</strong> Finishing educational programs</li>
                  <li><strong>Skill Development (50-300 ICs):</strong> Learning new capabilities</li>
                  <li><strong>Leadership Roles (300-1000 ICs):</strong> Taking on responsibility in projects</li>
                  <li><strong>Peer Teaching (150-500 ICs):</strong> Sharing knowledge with others</li>
                </ul>

                <h3>Network Building</h3>
                <ul>
                  <li><strong>Connection Facilitation (75-250 ICs):</strong> Introducing people who can help each other</li>
                  <li><strong>Collaboration (100-400 ICs):</strong> Working effectively in teams</li>
                  <li><strong>Relationship Maintenance (25-100 ICs):</strong> Ongoing support and communication</li>
                  <li><strong>Community Building (200-600 ICs):</strong> Creating spaces for others to connect</li>
                </ul>

                <h2>Quality and Impact Multipliers</h2>
                <h3>Cultural Authenticity Bonus (1.5x multiplier)</h3>
                <p>
                  Contributions that authentically represent Indigenous knowledge and cultural 
                  practices receive bonus credits, recognizing the special value of cultural wisdom.
                </p>

                <h3>Innovation Impact Bonus (2x multiplier)</h3>
                <p>
                  Solutions that address significant community challenges or create new 
                  opportunities for others receive double credits for their systemic impact.
                </p>

                <h3>Accessibility Bonus (1.3x multiplier)</h3>
                <p>
                  Content and contributions that are designed to be accessible to people 
                  with different abilities receive bonus recognition.
                </p>

                <h3>Collaboration Bonus (1.2x multiplier)</h3>
                <p>
                  Projects involving multiple participants or cross-cultural collaboration 
                  receive additional credits for building bridges and connections.
                </p>

                <h2>Spending Imagination Credits</h2>
                <h3>Educational Opportunities</h3>
                <ul>
                  <li><strong>Workshop Access (200-500 ICs):</strong> Specialized skills training</li>
                  <li><strong>Mentorship Programs (500-1000 ICs):</strong> One-on-one guidance</li>
                  <li><strong>University Preparation (1000-2000 ICs):</strong> Academic pathway support</li>
                  <li><strong>Cultural Learning (300-800 ICs):</strong> Traditional knowledge programs</li>
                </ul>

                <h3>Career Development</h3>
                <ul>
                  <li><strong>Internship Placement (1500-3000 ICs):</strong> Work experience opportunities</li>
                  <li><strong>Portfolio Development (400-800 ICs):</strong> Professional presentation support</li>
                  <li><strong>Network Events (300-600 ICs):</strong> Industry connections and meetings</li>
                  <li><strong>Leadership Training (800-1500 ICs):</strong> Advanced skill development</li>
                </ul>

                <h3>Physical Rewards</h3>
                <ul>
                  <li><strong>Digital Hoodies (100-500 ICs):</strong> Virtual achievement recognition</li>
                  <li><strong>Physical Hoodies (2000-5000 ICs):</strong> Tangible rewards for major achievements</li>
                  <li><strong>Technology Access (1000-3000 ICs):</strong> Laptops, tablets, or software</li>
                  <li><strong>Cultural Items (500-1500 ICs):</strong> Art supplies, instruments, or tools</li>
                </ul>

                <h3>Community Investment</h3>
                <ul>
                  <li><strong>Project Funding (2000-10000 ICs):</strong> Support for community initiatives</li>
                  <li><strong>Event Organization (1500-5000 ICs):</strong> Resources for community gatherings</li>
                  <li><strong>Scholarship Creation (5000-15000 ICs):</strong> Supporting others' education</li>
                  <li><strong>Innovation Challenges (3000-8000 ICs):</strong> Funding problem-solving competitions</li>
                </ul>

                <h2>Credit Validation System</h2>
                <h3>Peer Review</h3>
                <p>
                  Community members validate each other's contributions through peer review 
                  processes, ensuring credits reflect genuine value and quality.
                </p>

                <h3>Mentor Approval</h3>
                <p>
                  Experienced mentors and cultural leaders approve higher-value contributions, 
                  particularly those involving cultural knowledge or significant innovation.
                </p>

                <h3>Community Impact Assessment</h3>
                <p>
                  Major contributions are evaluated based on their impact on community 
                  wellbeing, cultural preservation, and opportunity creation for others.
                </p>

                <h2>Advanced Features</h2>
                <h3>Credit Gifting</h3>
                <p>
                  Participants can gift credits to others, enabling mutual support and 
                  recognizing contributions that might not otherwise be rewarded.
                </p>

                <h3>Group Pooling</h3>
                <p>
                  Teams can pool credits for larger opportunities, encouraging collaboration 
                  and collective achievement.
                </p>

                <h3>Credit Lending</h3>
                <p>
                  Experienced participants can lend credits to newcomers, building trust 
                  and enabling access to opportunities before credits are fully earned.
                </p>

                <h2>Technology Implementation</h2>
                <h3>Blockchain Recording</h3>
                <p>
                  All credit transactions are recorded on blockchain for transparency, 
                  security, and portability between different platforms and organizations.
                </p>

                <h3>Mobile Integration</h3>
                <p>
                  Credits can be earned and spent through mobile apps, making participation 
                  accessible regardless of technology access or literacy levels.
                </p>

                <h3>Analytics Dashboard</h3>
                <p>
                  Participants can track their credit earning patterns, identify growth 
                  opportunities, and see their impact on community development.
                </p>

                <h2>Future Development</h2>
                <p>
                  The Imagination Credits system continues evolving based on participant 
                  feedback and community needs, with new earning and spending opportunities 
                  added regularly to reflect emerging priorities and possibilities.
                </p>
              </div>
            `
          }

        case 'trading-system':
          return {
            title: 'Hoodie Trading System',
            subtitle: 'Digital marketplace for skills, achievements, and opportunities',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  The Hoodie Trading System creates a dynamic marketplace where participants 
                  can trade digital hoodies representing skills, achievements, and opportunities, 
                  building portfolios that unlock real-world value.
                </p>

                <h2>Understanding Digital Hoodies</h2>
                <p>
                  Digital hoodies are unique tokens that represent specific achievements, 
                  skills, or opportunities. Unlike traditional credentials, they can be 
                  combined, upgraded, and traded to create new value combinations.
                </p>

                <h2>Types of Hoodies</h2>
                <h3>Skill Hoodies</h3>
                <ul>
                  <li><strong>Communication Hoodie:</strong> Presentation, writing, and interpersonal skills</li>
                  <li><strong>Leadership Hoodie:</strong> Team management and project coordination</li>
                  <li><strong>Creative Hoodie:</strong> Artistic expression and innovative thinking</li>
                  <li><strong>Technical Hoodie:</strong> Digital literacy and technology skills</li>
                  <li><strong>Cultural Hoodie:</strong> Indigenous knowledge and cultural competency</li>
                  <li><strong>Entrepreneurship Hoodie:</strong> Business development and innovation</li>
                </ul>

                <h3>Achievement Hoodies</h3>
                <ul>
                  <li><strong>Mentor Hoodie:</strong> Successfully supporting others' development</li>
                  <li><strong>Graduate Hoodie:</strong> Completing significant educational programs</li>
                  <li><strong>Innovator Hoodie:</strong> Creating solutions to community challenges</li>
                  <li><strong>Connector Hoodie:</strong> Building networks and facilitating relationships</li>
                  <li><strong>Storyteller Hoodie:</strong> Sharing experiences that inspire others</li>
                  <li><strong>Community Builder Hoodie:</strong> Creating spaces for collective growth</li>
                </ul>

                <h3>Opportunity Hoodies</h3>
                <ul>
                  <li><strong>University Access Hoodie:</strong> Pathway to higher education</li>
                  <li><strong>Employment Ready Hoodie:</strong> Job placement and career support</li>
                  <li><strong>Internship Hoodie:</strong> Work experience opportunities</li>
                  <li><strong>Funding Access Hoodie:</strong> Grant and scholarship opportunities</li>
                  <li><strong>Network Entry Hoodie:</strong> Access to professional and cultural networks</li>
                  <li><strong>Travel Experience Hoodie:</strong> Cultural exchange and learning journeys</li>
                </ul>

                <h3>Master Hoodies</h3>
                <ul>
                  <li><strong>Seven Generation Thinker:</strong> Demonstrating long-term wisdom</li>
                  <li><strong>Cultural Bridge Builder:</strong> Connecting Indigenous and mainstream worlds</li>
                  <li><strong>Systems Changer:</strong> Creating organizational and social transformation</li>
                  <li><strong>Knowledge Keeper:</strong> Preserving and transmitting cultural wisdom</li>
                  <li><strong>Future Creator:</strong> Developing new possibilities for communities</li>
                </ul>

                <h2>How Trading Works</h2>
                <h3>Direct Trading</h3>
                <p>
                  Participants can trade hoodies directly with each other, exchanging 
                  complementary skills or opportunities that benefit both parties.
                </p>

                <h3>Marketplace Trading</h3>
                <p>
                  The central marketplace allows posting hoodies for trade with specific 
                  requirements, enabling broader community participation in exchanges.
                </p>

                <h3>Combination Trading</h3>
                <p>
                  Multiple participants can combine their hoodies to access opportunities 
                  that require diverse skill sets or higher achievement levels.
                </p>

                <h3>Mentorship Trading</h3>
                <p>
                  Experienced participants can trade their mentor hoodies for ongoing 
                  relationships with emerging community members.
                </p>

                <h2>Hoodie Upgrading System</h2>
                <h3>Skill Stacking</h3>
                <p>
                  Combining related skill hoodies creates upgraded versions with enhanced 
                  value and access to advanced opportunities.
                </p>
                <ul>
                  <li>Communication + Leadership = Advanced Leadership Hoodie</li>
                  <li>Creative + Technical = Digital Innovation Hoodie</li>
                  <li>Cultural + Entrepreneurship = Cultural Enterprise Hoodie</li>
                </ul>

                <h3>Achievement Progression</h3>
                <p>
                  Demonstrating sustained impact and community contribution upgrades 
                  achievement hoodies to higher levels with increased trading value.
                </p>

                <h3>Mastery Pathways</h3>
                <p>
                  Combining multiple high-level hoodies unlocks master hoodies representing 
                  significant expertise and community recognition.
                </p>

                <h2>Value Determination</h2>
                <h3>Rarity and Demand</h3>
                <p>
                  Hoodie values fluctuate based on their rarity and current demand within 
                  the community, reflecting real-world skill and opportunity needs.
                </p>

                <h3>Impact History</h3>
                <p>
                  Hoodies from participants with strong impact histories carry premium 
                  value, recognizing proven track records of contribution.
                </p>

                <h3>Community Validation</h3>
                <p>
                  Peer and mentor validation of hoodie authenticity affects trading value, 
                  ensuring genuine skill representation.
                </p>

                <h3>Time Investment</h3>
                <p>
                  Hoodies requiring significant time investment to earn maintain higher 
                  values, reflecting the effort and dedication involved.
                </p>

                <h2>Trading Strategies</h2>
                <h3>Portfolio Building</h3>
                <p>
                  Strategic collection of complementary hoodies creates valuable portfolios 
                  that unlock major opportunities like university admission or employment.
                </p>

                <h3>Specialization Focus</h3>
                <p>
                  Deep development in specific areas creates rare, high-value hoodies 
                  that command premium trading positions.
                </p>

                <h3>Network Leverage</h3>
                <p>
                  Building strong relationships enables access to exclusive trading 
                  opportunities and collaborative hoodie development.
                </p>

                <h3>Community Investment</h3>
                <p>
                  Contributing to community development creates goodwill that facilitates 
                  favorable trading relationships and opportunities.
                </p>

                <h2>Real-World Integration</h2>
                <h3>Employment Recognition</h3>
                <p>
                  Partner employers recognize specific hoodies as equivalent to traditional 
                  qualifications, enabling direct career pathway access.
                </p>

                <h3>Educational Credit</h3>
                <p>
                  Universities and training institutions accept certain hoodies for 
                  academic credit or alternative admission pathways.
                </p>

                <h3>Funding Access</h3>
                <p>
                  Financial institutions and funding bodies recognize hoodie portfolios 
                  as collateral for loans and investment opportunities.
                </p>

                <h3>Professional Networks</h3>
                <p>
                  Industry networks provide exclusive access to members holding specific 
                  hoodie combinations, bridging community and professional worlds.
                </p>

                <h2>Technology Platform</h2>
                <h3>Blockchain Security</h3>
                <p>
                  All hoodies are secured on blockchain, ensuring authenticity, ownership 
                  verification, and trading history transparency.
                </p>

                <h3>Smart Contracts</h3>
                <p>
                  Automated trading contracts execute exchanges based on predetermined 
                  conditions, ensuring fair and reliable transactions.
                </p>

                <h3>Mobile Interface</h3>
                <p>
                  User-friendly mobile apps enable easy browsing, trading, and portfolio 
                  management from anywhere with internet access.
                </p>

                <h3>Analytics Tools</h3>
                <p>
                  Market analysis tools help participants make informed trading decisions 
                  and identify emerging opportunities in the hoodie economy.
                </p>

                <h2>Community Governance</h2>
                <h3>Trading Rules</h3>
                <p>
                  Community-developed rules ensure ethical trading practices and prevent 
                  exploitation or unfair advantage taking.
                </p>

                <h3>Dispute Resolution</h3>
                <p>
                  Elder councils and community leaders mediate trading disputes using 
                  traditional justice principles and restorative practices.
                </p>

                <h3>System Evolution</h3>
                <p>
                  Regular community input drives platform improvements and new feature 
                  development, ensuring the system meets evolving needs.
                </p>
              </div>
            `
          }

        case 'value-creation':
          return {
            title: 'Value Creation Models',
            subtitle: 'Innovative approaches to generating worth through imagination and relationships',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  Hoodie Economics value creation models demonstrate how imagination, relationships, 
                  and cultural wisdom can generate tangible economic worth for individuals and communities.
                </p>

                <h2>Foundational Principles</h2>
                <h3>Imagination as Infrastructure</h3>
                <p>
                  Just as traditional economies rely on physical infrastructure, Hoodie Economics 
                  builds on imagination infrastructure - the collective creative capacity of 
                  communities to envision and create new possibilities.
                </p>

                <h3>Relationship-Based Value</h3>
                <p>
                  Value is created through the strength and quality of relationships rather than 
                  just individual achievement. Strong networks enable collective value creation 
                  that benefits all participants.
                </p>

                <h3>Cultural Capital Activation</h3>
                <p>
                  Indigenous knowledge systems and cultural practices become active economic 
                  resources, creating value through their application to contemporary challenges.
                </p>

                <h2>Value Creation Mechanisms</h2>
                <h3>Knowledge Synthesis</h3>
                <p>
                  Combining traditional Indigenous knowledge with contemporary challenges creates 
                  innovative solutions that have market value while preserving cultural wisdom.
                </p>
                <ul>
                  <li>Traditional ecological knowledge informing environmental consulting</li>
                  <li>Indigenous conflict resolution methods applied to organizational mediation</li>
                  <li>Cultural storytelling techniques enhancing marketing and communication</li>
                  <li>Traditional healing approaches integrated with wellness programs</li>
                </ul>

                <h3>Network Effects</h3>
                <p>
                  The value of participation increases as more people join the network, creating 
                  exponential rather than linear value growth for all participants.
                </p>
                <ul>
                  <li>More participants create more trading opportunities</li>
                  <li>Diverse skills enable more complex collaborative projects</li>
                  <li>Stronger networks attract external partnership opportunities</li>
                  <li>Collective reputation enhances individual opportunities</li>
                </ul>

                <h3>Creativity Multiplication</h3>
                <p>
                  Creative contributions inspire further creativity, creating cascading value 
                  that expands beyond the original investment of time and energy.
                </p>
                <ul>
                  <li>Stories inspire art, music, and performance</li>
                  <li>Innovation challenges generate multiple solutions</li>
                  <li>Collaborative projects spawn new initiatives</li>
                  <li>Mentoring relationships create ongoing value chains</li>
                </ul>

                <h2>Individual Value Creation</h2>
                <h3>Skill Development Pathways</h3>
                <p>
                  Individuals create value by developing capabilities that benefit both themselves 
                  and their communities, earning credits and hoodies while building marketable skills.
                </p>

                <h3>Story Capital</h3>
                <p>
                  Personal narratives become valuable assets that can be shared, taught, and 
                  transformed into various forms of content and inspiration for others.
                </p>

                <h3>Mentorship Leverage</h3>
                <p>
                  Teaching and supporting others creates compound value as mentees go on to 
                  mentor others, creating expanding circles of influence and impact.
                </p>

                <h3>Innovation Portfolio</h3>
                <p>
                  Developing multiple creative projects and solutions creates a portfolio of 
                  assets that can be combined, traded, and leveraged for ongoing opportunities.
                </p>

                <h2>Community Value Creation</h2>
                <h3>Collective Problem Solving</h3>
                <p>
                  Communities identify challenges and mobilize collective imagination to develop 
                  solutions that create value for all participants while addressing real needs.
                </p>

                <h3>Cultural Economy Development</h3>
                <p>
                  Communities develop economic activities based on their cultural strengths, 
                  creating sustainable income streams while preserving cultural practices.
                </p>

                <h3>Knowledge Commons</h3>
                <p>
                  Shared knowledge repositories create value for all community members by 
                  enabling rapid learning, skill development, and innovation.
                </p>

                <h3>Support Network Infrastructure</h3>
                <p>
                  Strong mutual support systems reduce individual risk and increase collective 
                  capacity to take on larger opportunities and challenges.
                </p>

                <h2>Organizational Value Creation</h2>
                <h3>Innovation Ecosystem</h3>
                <p>
                  Organizations tap into the Hoodie Economics network to access fresh perspectives, 
                  creative solutions, and cultural insights that drive innovation and growth.
                </p>

                <h3>Talent Pipeline Development</h3>
                <p>
                  Partners gain access to emerging talent with proven creativity, cultural 
                  competency, and community connection, reducing recruitment costs and risks.
                </p>

                <h3>Cultural Competency Enhancement</h3>
                <p>
                  Organizations improve their cultural responsiveness and community relationships 
                  through engagement with Hoodie Economics participants and principles.
                </p>

                <h3>Social Impact Investment</h3>
                <p>
                  Investment in Hoodie Economics creates measurable social returns while 
                  generating economic value, meeting impact investment criteria.
                </p>

                <h2>Systems-Level Value Creation</h2>
                <h3>Economic Inclusion</h3>
                <p>
                  The system creates pathways for marginalized communities to participate in 
                  economic opportunities, expanding the overall economy and reducing inequality.
                </p>

                <h3>Innovation Acceleration</h3>
                <p>
                  By tapping into previously excluded creative capacity, the system accelerates 
                  innovation and problem-solving across multiple sectors.
                </p>

                <h3>Cultural Preservation</h3>
                <p>
                  Economic value creation from cultural knowledge incentivizes preservation 
                  and transmission, maintaining cultural diversity and wisdom.
                </p>

                <h3>Sustainable Development</h3>
                <p>
                  Indigenous principles of sustainability become economically viable alternatives 
                  to extractive economic models, supporting environmental protection.
                </p>

                <h2>Measurement and Optimization</h2>
                <h3>Multi-Dimensional Value Tracking</h3>
                <p>
                  Value creation is measured across economic, social, cultural, and environmental 
                  dimensions, providing comprehensive understanding of impact and effectiveness.
                </p>

                <h3>Feedback Loop Integration</h3>
                <p>
                  Continuous feedback from participants and partners enables optimization of 
                  value creation processes and identification of new opportunities.
                </p>

                <h3>Impact Amplification</h3>
                <p>
                  Successful value creation models are documented, shared, and replicated, 
                  amplifying impact across different communities and contexts.
                </p>

                <h2>Technology Enhancement</h2>
                <h3>AI-Assisted Matching</h3>
                <p>
                  Artificial intelligence helps identify optimal combinations of skills, 
                  interests, and opportunities to maximize value creation potential.
                </p>

                <h3>Blockchain Value Recording</h3>
                <p>
                  Distributed ledger technology ensures transparent and secure recording of 
                  value creation and distribution, building trust and accountability.
                </p>

                <h3>Digital Platform Integration</h3>
                <p>
                  Online platforms connect Hoodie Economics participants with global opportunities 
                  while maintaining local community focus and cultural grounding.
                </p>

                <h2>Future Development</h2>
                <h3>Scale and Replication</h3>
                <p>
                  Successful value creation models are adapted for different cultural contexts 
                  and geographic regions, maintaining core principles while respecting local needs.
                </p>

                <h3>Integration with Traditional Economy</h3>
                <p>
                  Hoodie Economics value creation models increasingly interface with traditional 
                  economic systems, creating bridges and hybrid opportunities.
                </p>

                <h3>Policy and Regulation</h3>
                <p>
                  Government recognition and support for alternative value creation models 
                  enables larger-scale implementation and mainstream integration.
                </p>
              </div>
            `
          }

        case 'digital-economy':
          return {
            title: 'Digital Economy Integration',
            subtitle: 'Bridging Hoodie Economics with mainstream digital economic systems',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  Digital Economy Integration connects Hoodie Economics principles with existing 
                  digital economic systems, creating pathways for mainstream participation while 
                  maintaining cultural authenticity and community focus.
                </p>

                <h2>Integration Philosophy</h2>
                <p>
                  Rather than replacing existing digital economies, Hoodie Economics creates 
                  complementary systems that add value to mainstream platforms while providing 
                  alternative pathways for those excluded from traditional digital economic participation.
                </p>

                <h2>Platform Interoperability</h2>
                <h3>Blockchain Bridges</h3>
                <p>
                  Imagination Credits and digital hoodies are designed to be portable across 
                  multiple blockchain networks, enabling integration with existing cryptocurrency 
                  and token systems.
                </p>

                <h3>API Integration</h3>
                <p>
                  Application Programming Interfaces allow Hoodie Economics platforms to connect 
                  with mainstream educational, employment, and social platforms, extending value 
                  recognition beyond the core community.
                </p>

                <h3>Cross-Platform Recognition</h3>
                <p>
                  Digital achievements earned in Hoodie Economics are designed to be recognized 
                  and validated on mainstream platforms like LinkedIn, university systems, and 
                  employer databases.
                </p>

                <h2>Mainstream Platform Integration</h2>
                <h3>Social Media Platforms</h3>
                <ul>
                  <li><strong>LinkedIn Integration:</strong> Hoodie achievements displayed as professional credentials</li>
                  <li><strong>Portfolio Platforms:</strong> Creative work showcased with cultural context</li>
                  <li><strong>Learning Platforms:</strong> Imagination Credits earned through mainstream courses</li>
                  <li><strong>Freelance Platforms:</strong> Cultural skills recognized as valuable services</li>
                </ul>

                <h3>Educational Technology</h3>
                <ul>
                  <li><strong>LMS Integration:</strong> Learning Management Systems recognize Hoodie Economics achievements</li>
                  <li><strong>Credential Verification:</strong> Digital badges verified across educational institutions</li>
                  <li><strong>Alternative Assessment:</strong> Cultural and creative assessments integrated with academic evaluation</li>
                  <li><strong>Pathway Mapping:</strong> Traditional and alternative educational pathways clearly connected</li>
                </ul>

                <h3>Employment Platforms</h3>
                <ul>
                  <li><strong>Skills Verification:</strong> Employer systems recognize and validate hoodie-based skills</li>
                  <li><strong>Cultural Competency Indicators:</strong> Indigenous knowledge skills highlighted for relevant roles</li>
                  <li><strong>Community Impact Metrics:</strong> Social contribution tracked alongside professional experience</li>
                  <li><strong>Alternative Qualification Pathways:</strong> Non-traditional routes to professional recognition</li>
                </ul>

                <h2>Financial System Integration</h2>
                <h3>Cryptocurrency Exchange</h3>
                <p>
                  Imagination Credits can be exchanged for mainstream cryptocurrencies, enabling 
                  participants to access traditional digital financial services and opportunities.
                </p>

                <h3>Digital Banking</h3>
                <p>
                  Partnerships with digital banks enable Hoodie Economics participants to access 
                  traditional financial services using their alternative economic activities as 
                  evidence of financial capability.
                </p>

                <h3>Micro-Investment Platforms</h3>
                <p>
                  Small-scale investment opportunities allow Hoodie Economics participants to 
                  build traditional wealth while maintaining community focus and cultural values.
                </p>

                <h3>Impact Investment</h3>
                <p>
                  Social impact investors can invest in Hoodie Economics initiatives, providing 
                  capital while receiving both financial and social returns on investment.
                </p>

                <h2>Technology Infrastructure</h2>
                <h3>Cloud-Based Architecture</h3>
                <p>
                  Scalable cloud infrastructure ensures the system can grow while maintaining 
                  security, reliability, and accessibility across different devices and internet 
                  connection qualities.
                </p>

                <h3>Mobile-First Design</h3>
                <p>
                  All platforms are designed for mobile devices first, recognizing that many 
                  participants access digital services primarily through smartphones.
                </p>

                <h3>Offline Capability</h3>
                <p>
                  Systems function with limited internet connectivity, storing data locally 
                  and syncing when connections are available, ensuring rural and remote participation.
                </p>

                <h3>Multi-Language Support</h3>
                <p>
                  Platforms support multiple languages including Indigenous languages, with 
                  culturally appropriate interfaces and content presentation.
                </p>

                <h2>Data Privacy and Security</h2>
                <h3>Indigenous Data Sovereignty</h3>
                <p>
                  Communities maintain control over their cultural data and knowledge, with 
                  clear protocols for sharing and usage that respect traditional governance structures.
                </p>

                <h3>Personal Data Protection</h3>
                <p>
                  Individual participants control their personal data with granular permissions 
                  for sharing different types of information with various platforms and organizations.
                </p>

                <h3>Cultural Protocol Enforcement</h3>
                <p>
                  Technical systems enforce cultural protocols around sacred or restricted 
                  knowledge, preventing inappropriate sharing or commercialization.
                </p>

                <h3>Transparent Algorithms</h3>
                <p>
                  All algorithmic decision-making processes are transparent and auditable, 
                  with community input into how data is processed and decisions are made.
                </p>

                <h2>Digital Inclusion Strategies</h2>
                <h3>Digital Literacy Support</h3>
                <p>
                  Comprehensive training programs help participants develop digital skills 
                  needed to fully participate in integrated digital economic opportunities.
                </p>

                <h3>Technology Access Programs</h3>
                <p>
                  Device lending, internet access subsidies, and technology support ensure 
                  that lack of resources doesn't prevent participation in digital opportunities.
                </p>

                <h3>Culturally Responsive Design</h3>
                <p>
                  All technology interfaces are designed with cultural considerations, using 
                  appropriate colors, symbols, navigation patterns, and interaction models.
                </p>

                <h3>Intergenerational Support</h3>
                <p>
                  Programs specifically support older community members in accessing digital 
                  opportunities while enabling them to share cultural knowledge through digital platforms.
                </p>

                <h2>Global Market Access</h2>
                <h3>International Platforms</h3>
                <p>
                  Integration with global freelance, creative, and educational platforms enables 
                  participants to access international opportunities while maintaining local 
                  community connections.
                </p>

                <h3>Cultural Export Opportunities</h3>
                <p>
                  Digital platforms enable the respectful sharing and commercialization of 
                  cultural knowledge and creative works with global audiences.
                </p>

                <h3>Cross-Cultural Collaboration</h3>
                <p>
                  Technology facilitates collaboration between Indigenous communities worldwide, 
                  sharing knowledge and supporting collective advocacy and development efforts.
                </p>

                <h3>Digital Diplomacy</h3>
                <p>
                  Platforms enable Indigenous communities to engage directly in international 
                  forums and discussions about issues affecting their communities and peoples.
                </p>

                <h2>Regulatory Compliance</h2>
                <h3>Financial Regulation</h3>
                <p>
                  Systems comply with relevant financial regulations while maintaining the 
                  alternative economic principles that make Hoodie Economics unique and valuable.
                </p>

                <h3>Educational Standards</h3>
                <p>
                  Alternative credentials meet or exceed traditional educational standards 
                  while incorporating Indigenous knowledge systems and assessment methods.
                </p>

                <h3>Employment Law</h3>
                <p>
                  Platform-mediated work arrangements comply with labor laws while providing 
                  flexibility and cultural responsiveness that traditional employment often lacks.
                </p>

                <h3>Intellectual Property</h3>
                <p>
                  Clear frameworks protect Indigenous intellectual property while enabling 
                  appropriate sharing and commercialization of cultural knowledge and innovations.
                </p>

                <h2>Future Development</h2>
                <h3>Artificial Intelligence Integration</h3>
                <p>
                  AI systems trained on Indigenous knowledge principles provide culturally 
                  appropriate recommendations and support while respecting cultural protocols.
                </p>

                <h3>Virtual and Augmented Reality</h3>
                <p>
                  Immersive technologies enable new forms of cultural sharing, education, 
                  and collaboration while maintaining respect for sacred and restricted knowledge.
                </p>

                <h3>Internet of Things Integration</h3>
                <p>
                  Connected devices enable new forms of environmental monitoring, cultural 
                  practice documentation, and community coordination that support both traditional 
                  and contemporary economic activities.
                </p>
              </div>
            `
          }

        case 'case-studies':
          return {
            title: 'Implementation Case Studies',
            subtitle: 'Real-world examples of Hoodie Economics creating transformative impact',
            content: `
              <div class="prose prose-lg max-w-none">
                <p class="text-xl text-gray-600 mb-6">
                  These case studies demonstrate how Hoodie Economics principles have been 
                  successfully implemented across different contexts, creating measurable 
                  impact for individuals, communities, and organizations.
                </p>

                <h2>Case Study 1: Urban Indigenous Youth Program</h2>
                <h3>Context</h3>
                <p>
                  A group of 25 Indigenous young people in a major Australian city struggled 
                  with educational disengagement and limited employment prospects despite 
                  having strong cultural knowledge and creative abilities.
                </p>

                <h3>Implementation</h3>
                <ul>
                  <li>Introduced Imagination Credits system for cultural knowledge sharing</li>
                  <li>Created digital hoodies recognizing traditional and contemporary skills</li>
                  <li>Established trading relationships with local universities and employers</li>
                  <li>Developed cultural mentorship programs using hoodie-based recognition</li>
                </ul>

                <h3>Outcomes</h3>
                <ul>
                  <li><strong>Education:</strong> 80% increased school completion rate</li>
                  <li><strong>Employment:</strong> 60% gained meaningful employment or apprenticeships</li>
                  <li><strong>Cultural Connection:</strong> 95% reported stronger cultural identity</li>
                  <li><strong>Community Impact:</strong> Established 3 ongoing community programs</li>
                </ul>

                <h3>Key Success Factors</h3>
                <ul>
                  <li>Elder involvement in validating cultural contributions</li>
                  <li>Strong partnerships with educational institutions</li>
                  <li>Peer-to-peer mentoring and support systems</li>
                  <li>Regular community celebration of achievements</li>
                </ul>

                <h2>Case Study 2: Rural Community Economic Development</h2>
                <h3>Context</h3>
                <p>
                  A remote Indigenous community of 300 people faced limited economic opportunities 
                  and youth migration to cities, despite rich cultural heritage and strong 
                  community bonds.
                </p>

                <h3>Implementation</h3>
                <ul>
                  <li>Developed community-controlled Imagination Credits system</li>
                  <li>Created digital platform for cultural knowledge documentation</li>
                  <li>Established trading relationships with tourism and education sectors</li>
                  <li>Implemented blockchain-based verification of cultural authenticity</li>
                </ul>

                <h3>Outcomes</h3>
                <ul>
                  <li><strong>Economic:</strong> 40% increase in community income generation</li>
                  <li><strong>Youth Retention:</strong> 70% of young people chose to stay in community</li>
                  <li><strong>Cultural Preservation:</strong> 50+ traditional practices documented</li>
                  <li><strong>External Recognition:</strong> 5 major partnerships with universities</li>
                </ul>

                <h3>Key Success Factors</h3>
                <ul>
                  <li>Community governance of the economic system</li>
                  <li>Integration with traditional decision-making processes</li>
                  <li>Technology adapted to local capacity and infrastructure</li>
                  <li>External partnerships respecting community priorities</li>
                </ul>

                <h2>Case Study 3: University Indigenous Program Integration</h2>
                <h3>Context</h3>
                <p>
                  A major university struggled with low Indigenous student enrollment and 
                  completion rates despite significant support programs and resources.
                </p>

                <h3>Implementation</h3>
                <ul>
                  <li>Integrated Hoodie Economics recognition into admission processes</li>
                  <li>Created university-specific hoodies for academic and cultural achievements</li>
                  <li>Established Indigenous-led mentoring using credit systems</li>
                  <li>Developed culturally responsive assessment methods</li>
                </ul>

                <h3>Outcomes</h3>
                <ul>
                  <li><strong>Enrollment:</strong> 150% increase in Indigenous student applications</li>
                  <li><strong>Completion:</strong> 45% improvement in graduation rates</li>
                  <li><strong>Cultural Integration:</strong> 20 new Indigenous perspectives in curriculum</li>
                  <li><strong>Community Connection:</strong> 80% of graduates returned to community work</li>
                </ul>

                <h3>Key Success Factors</h3>
                <ul>
                  <li>Indigenous leadership in program design and delivery</li>
                  <li>Integration with existing university systems rather than separate programs</li>
                  <li>Strong connections between university and Indigenous communities</li>
                  <li>Ongoing support for graduates' community engagement</li>
                </ul>

                <h2>Case Study 4: Corporate Partnership Program</h2>
                <h3>Context</h3>
                <p>
                  A multinational corporation sought authentic Indigenous engagement for 
                  their Reconciliation Action Plan while struggling to move beyond symbolic gestures.
                </p>

                <h3>Implementation</h3>
                <ul>
                  <li>Established corporate-sponsored Imagination Credits for community projects</li>
                  <li>Created employment pathways recognizing hoodie-based qualifications</li>
                  <li>Developed cultural competency training delivered by hoodie holders</li>
                  <li>Implemented supply chain opportunities for community enterprises</li>
                </ul>

                <h3>Outcomes</h3>
                <ul>
                  <li><strong>Employment:</strong> 30 Indigenous people hired through alternative pathways</li>
                  <li><strong>Procurement:</strong> $2M in contracts awarded to Indigenous businesses</li>
                  <li><strong>Cultural Change:</strong> 95% of staff completed cultural competency training</li>
                  <li><strong>Innovation:</strong> 5 new products developed using Indigenous insights</li>
                </ul>

                <h3>Key Success Factors</h3>
                <ul>
                  <li>Long-term commitment beyond compliance requirements</li>
                  <li>Indigenous community control over knowledge sharing</li>
                  <li>Integration with core business operations rather than CSR activities</li>
                  <li>Transparent benefit-sharing arrangements</li>
                </ul>

                <h2>Case Study 5: International Indigenous Network</h2>
                <h3>Context</h3>
                <p>
                  Indigenous communities across three countries wanted to share knowledge 
                  and coordinate advocacy efforts but lacked effective collaboration mechanisms.
                </p>

                <h3>Implementation</h3>
                <ul>
                  <li>Developed cross-cultural Imagination Credits recognition system</li>
                  <li>Created international digital platform for knowledge sharing</li>
                  <li>Established virtual trading and collaboration opportunities</li>
                  <li>Implemented cultural protocol frameworks for cross-cultural engagement</li>
                </ul>

                <h3>Outcomes</h3>
                <ul>
                  <li><strong>Network Growth:</strong> 150 communities across 5 countries participating</li>
                  <li><strong>Knowledge Exchange:</strong> 200+ cultural practices documented and shared</li>
                  <li><strong>Advocacy Impact:</strong> 3 successful international policy initiatives</li>
                  <li><strong>Economic Development:</strong> 50 cross-cultural business partnerships</li>
                </ul>

                <h3>Key Success Factors</h3>
                <ul>
                  <li>Respect for diverse cultural protocols and governance systems</li>
                  <li>Technology design accommodating different infrastructure capabilities</li>
                  <li>Shared commitment to Indigenous self-determination</li>
                  <li>Flexible system adapting to different legal and economic contexts</li>
                </ul>

                <h2>Cross-Case Analysis</h2>
                <h3>Common Success Factors</h3>
                <ul>
                  <li><strong>Community Control:</strong> Indigenous communities maintaining governance over their participation</li>
                  <li><strong>Cultural Integration:</strong> Systems designed to honor and strengthen cultural practices</li>
                  <li><strong>Relationship Focus:</strong> Emphasis on building authentic, long-term relationships</li>
                  <li><strong>Flexible Implementation:</strong> Adaptation to local contexts and needs</li>
                  <li><strong>Measurable Impact:</strong> Clear tracking of outcomes meaningful to communities</li>
                </ul>

                <h3>Implementation Challenges</h3>
                <ul>
                  <li><strong>Technology Access:</strong> Ensuring digital inclusion across diverse communities</li>
                  <li><strong>Cultural Sensitivity:</strong> Maintaining respect for sacred and restricted knowledge</li>
                  <li><strong>System Integration:</strong> Connecting with existing institutional systems</li>
                  <li><strong>Sustainability:</strong> Ensuring long-term viability beyond initial enthusiasm</li>
                  <li><strong>Scale Management:</strong> Maintaining quality and cultural authenticity as programs grow</li>
                </ul>

                <h3>Lessons Learned</h3>
                <ul>
                  <li>Start small and build trust before expanding scope or scale</li>
                  <li>Invest heavily in relationship building and cultural competency</li>
                  <li>Design systems to be culturally responsive rather than culturally neutral</li>
                  <li>Measure success using community-defined indicators</li>
                  <li>Build in regular review and adaptation processes</li>
                  <li>Ensure sustainable funding models that don't compromise community control</li>
                </ul>

                <h2>Future Case Study Development</h2>
                <p>
                  Ongoing implementation of Hoodie Economics across diverse contexts continues 
                  to generate new case studies, providing evidence base for scaling effective 
                  approaches while learning from challenges and failures.
                </p>
              </div>
            `
          }
      }
    }

    // Return default content structure
    return {
      title: getPageTitle(section, page),
      subtitle: getPageSubtitle(section, page),
      content: getPageDescription(section, page)
    }
  }

  const getPageTitle = (section: string, page: string): string => {
    const titles: Record<string, Record<string, string>> = {
      'indigenous-knowledge': {
        'overview': 'Indigenous Knowledge Systems',
        'systems-thinking': 'Indigenous Systems Thinking',
        'protocols': 'Cultural Protocols & Respect',
        'seven-generation': 'Seven Generation Thinking',
        'connection-to-country': 'Connection to Country',
        'storytelling': 'Indigenous Storytelling Traditions'
      },
      'mentoring': {
        'overview': 'AIME Mentoring Approach',
        'methodology': 'AIME Methodology Framework',
        'reverse-mentoring': 'Reverse Mentoring Models',
        'imagination-curriculum': 'Imagination Curriculum',
        'university-partnerships': 'University Partnership Models',
        'impact-measurement': 'Measuring Mentoring Impact'
      }
      // Add more as needed
    }

    return titles[section]?.[page] || `${section} - ${page}`
  }

  const getPageSubtitle = (section: string, page: string): string => {
    return `Explore ${content.length} resources related to this topic`
  }

  const getPageDescription = (section: string, page: string): string => {
    return `<p class="text-gray-600">This section contains curated resources, tools, and insights related to ${getPageTitle(section, page).toLowerCase()}. Use the content below to deepen your understanding and find practical applications.</p>`
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      knowledge: <BookOpenIcon className="w-5 h-5" />,
      video: <VideoCameraIcon className="w-5 h-5" />,
      tool: <WrenchIcon className="w-5 h-5" />,
      business_case: <ArrowRightIcon className="w-5 h-5" />,
      hoodie: <span className="text-lg">👕</span>,
      content: <span className="text-lg">📄</span>
    }
    return icons[type as keyof typeof icons] || <BookOpenIcon className="w-5 h-5" />
  }

  const getTypeColor = (type: string) => {
    const colors = {
      knowledge: 'bg-blue-100 text-blue-800 border-blue-200',
      video: 'bg-red-100 text-red-800 border-red-200',
      tool: 'bg-purple-100 text-purple-800 border-purple-200',
      business_case: 'bg-green-100 text-green-800 border-green-200',
      hoodie: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      content: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      {pageContent && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {pageContent.title}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {pageContent.subtitle}
          </p>
          
          {pageContent.content && (
            <div 
              className="mb-8"
              dangerouslySetInnerHTML={{ __html: pageContent.content }}
            />
          )}

          {/* Quick Links */}
          {pageContent.quickLinks && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {pageContent.quickLinks.map((link: any, index: number) => (
                <button
                  key={index}
                  onClick={() => onNavigate(link.section, link.page)}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                >
                  <h3 className="font-medium text-gray-900 mb-1">{link.title}</h3>
                  <div className="flex items-center text-sm text-blue-600">
                    <span>Explore</span>
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content Grid */}
      {content.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Related Resources ({content.length})
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {content.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg border ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                        {item.type.replace('_', ' ')}
                      </span>
                      
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {content.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Content Coming Soon
          </h3>
          <p className="text-gray-600">
            We're working on adding more resources to this section.
          </p>
        </div>
      )}
    </div>
  )
}