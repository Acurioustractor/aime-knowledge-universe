import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database/connection';
import { BusinessCasesRepository } from '@/lib/database/business-cases-repository';

// The 8 AIME Business Case Pathways - Core transformation programs
const aimeBusinessCases = [
  {
    id: "presidents",
    title: "Presidents: Young Leaders Reimagining Custodial Economies",
    summary: "A transformative pathway for young people—particularly Indigenous youth—to move from climate protest to constructive action by developing custodial economies that center nature in economic development.",
    challenge: "Young people inherit unprecedented environmental challenges while feeling powerless to create meaningful change. Traditional responses position them as future victims rather than current solution creators.",
    solution: "Structured mentorship connecting young leaders with Indigenous knowledge holders and systems change practitioners, providing resources for developing custodial economy projects that demonstrate alternatives to extractive models.",
    impact: "Young leaders develop practical skills for environmental restoration and regenerative economics while building agency and hope for systemic change.",
    metrics: {
      "Youth Leaders": 200,
      "Custodial Projects": 45,
      "Environmental Impact": "12 ecosystems restored",
      "Economic Value Created": "$2.3M"
    },
    industry: "Youth Development",
    region: "Global",
    program_type: "Leadership Development",
    year: 2024,
    tags: ["youth-leadership", "environmental-restoration", "custodial-economics", "indigenous-knowledge", "climate-action"],
    related_tools: [],
    related_videos: [],
    is_featured: true
  },
  {
    id: "citizens",
    title: "Citizens: From Entrepreneur to Relational Change-Maker",
    summary: "Transform entrepreneurs into relational systems change leaders who create lasting impact through relationship-centered approaches rather than heroic individual efforts.",
    challenge: "Entrepreneurs often become trapped in individualistic models that limit systemic impact and create burnout. The heroic leadership model prevents collaborative solutions to complex challenges.",
    solution: "Comprehensive transformation journey helping entrepreneurs recognize patterns, develop relational approaches, and build collaborative networks for systems change implementation.",
    impact: "Entrepreneurs shift from extractive to regenerative business models, creating sustainable value for all stakeholders while building resilient collaborative networks.",
    metrics: {
      "Entrepreneurs Transformed": 150,
      "Collaborative Networks": 25,
      "Systems Change Projects": 60,
      "Collective Impact Ratio": "8.5:1"
    },
    industry: "Social Enterprise",
    region: "Global", 
    program_type: "Leadership Transformation",
    year: 2024,
    tags: ["entrepreneurship", "systems-change", "relational-leadership", "collaboration", "transformation"],
    related_tools: [],
    related_videos: [],
    is_featured: true
  },
  {
    id: "custodians",
    title: "Custodians: Governing the Relational Network",
    summary: "Stewardship and governance framework for maintaining the integrity and sustainability of AIME's relational network and ensuring decisions serve seven generations.",
    challenge: "Traditional governance models based on hierarchy and control are inadequate for stewarding complex relational networks that require wisdom, care, and long-term thinking.",
    solution: "Indigenous-informed governance structures that prioritize relationship maintenance, collective wisdom, and intergenerational responsibility in all network decisions.",
    impact: "Sustainable network governance that maintains cultural integrity while enabling rapid growth and adaptation to changing global conditions.",
    metrics: {
      "Network Nodes": 500,
      "Governance Decisions": 120,
      "Cultural Integrity Score": "9.2/10",
      "Intergenerational Participation": "45%"
    },
    industry: "Network Governance",
    region: "Global",
    program_type: "Stewardship Framework",
    year: 2024,
    tags: ["governance", "stewardship", "indigenous-wisdom", "network-management", "sustainability"],
    related_tools: [],
    related_videos: [],
    is_featured: true
  },
  {
    id: "joy-corps",
    title: "Joy Corps: Transforming Organisations Through Relational Economics",
    summary: "A comprehensive framework that shifts organizations from transactional to relational economics, centering imagination, mentoring, and custodianship as core operational principles.",
    challenge: "Modern organisations face challenges with information overload, staff motivation, risk appetite, and authentic purpose alignment. Traditional management approaches cannot adequately address the shift to remote work and the need for genuine connection.",
    solution: "Joy Corps provides proven frameworks for transformation through relational principles, focusing on stakeholder relationships, cultural transformation, and sustainable value creation across multiple dimensions.",
    impact: "Organizations completing Joy Corps accreditation demonstrate measurable improvements in employee retention, innovation capacity, and long-term sustainability while accessing new market opportunities in the emerging $125 trillion nature-centered economy.",
    metrics: {
      "Organizations Transformed": 85,
      "SROI Ratio": "4.2:1",
      "Employee Engagement": "45% improvement",
      "Innovation Output": "38% increase"
    },
    industry: "Organizational Development",
    region: "Global",
    program_type: "Transformation Framework",
    year: 2024,
    tags: ["organizational-transformation", "relational-economics", "mentoring", "custodianship", "innovation"],
    related_tools: [],
    related_videos: [],
    is_featured: true
  },
  {
    id: "imagi-labs",
    title: "IMAGI-Labs: Transforming Education Through Imagination and Custodianship",
    summary: "Physical and digital spaces that transform traditional educational environments into imagination-centered learning ecosystems that prioritize creativity, relationships, and systems thinking.",
    challenge: "Traditional education systems suppress imagination and creativity while preparing students for outdated industrial models rather than the collaborative, creative work needed for systemic transformation.",
    solution: "Redesigned learning environments that integrate Indigenous knowledge systems, imagination development, and custodial thinking into all subjects while maintaining academic rigor.",
    impact: "Students develop creative confidence, systems thinking abilities, and collaborative skills while achieving superior academic outcomes and increased engagement with learning.",
    metrics: {
      "Labs Established": 25,
      "Students Reached": 3500,
      "Creative Confidence Increase": "67%",
      "Academic Performance": "23% improvement"
    },
    industry: "Education Innovation",
    region: "Global",
    program_type: "Learning Environment",
    year: 2024,
    tags: ["education-transformation", "imagination", "custodianship", "indigenous-knowledge", "creativity"],
    related_tools: [],
    related_videos: [],
    is_featured: true
  },
  {
    id: "indigenous-labs",
    title: "Indigenous Knowledge Systems Labs: Bringing Traditional Wisdom to the Design Queue",
    summary: "Innovation laboratories that integrate Indigenous knowledge systems with contemporary design processes to create solutions that honor both traditional wisdom and modern needs.",
    challenge: "Indigenous knowledge is often excluded from innovation processes despite containing time-tested solutions to contemporary challenges. Modern design thinking lacks the relational and long-term perspectives essential for sustainable innovation.",
    solution: "Collaborative spaces where Indigenous knowledge holders work with contemporary designers and innovators to develop solutions that integrate traditional wisdom with modern technology and approaches.",
    impact: "Breakthrough innovations that demonstrate how Indigenous knowledge can inform contemporary solutions while ensuring appropriate protocols and benefit-sharing with knowledge holders.",
    metrics: {
      "Knowledge Holders": 60,
      "Innovation Projects": 40,
      "Solutions Developed": 28,
      "Cultural Protocol Compliance": "100%"
    },
    industry: "Innovation Design",
    region: "Global",
    program_type: "Knowledge Integration",
    year: 2024,
    tags: ["indigenous-knowledge", "innovation", "design-thinking", "traditional-wisdom", "collaboration"],
    related_tools: [],
    related_videos: [],
    is_featured: true
  },
  {
    id: "mentor-credit",
    title: "Mentor Credit: Transforming Knowledge Exchange Through Relational Economics",
    summary: "A knowledge sharing economy that transforms expertise exchange from competitive hoarding to collaborative sharing through relationship-based credit systems.",
    challenge: "Knowledge hoarding in competitive systems prevents collective learning and innovation. Traditional professional development focuses on individual advancement rather than community wisdom building.",
    solution: "Mentor Credit system where knowledge sharing earns relational credits that can be exchanged for learning opportunities, creating incentives for collaborative wisdom development.",
    impact: "Accelerated learning and innovation through networked knowledge sharing, with knowledge holders experiencing increased impact while learners access diverse expertise.",
    metrics: {
      "Knowledge Holders": 300,
      "Mentoring Relationships": 750,
      "Knowledge Exchanges": 2100,
      "Learning Velocity": "3.2x increase"
    },
    industry: "Knowledge Economy",
    region: "Global",
    program_type: "Exchange System",
    year: 2024,
    tags: ["knowledge-sharing", "mentoring", "relational-economics", "professional-development", "collaboration"],
    related_tools: [],
    related_videos: [],
    is_featured: true
  },
  {
    id: "systems-residency",
    title: "Systems Change Residency: Incubating Earth-Shot Solutions for Planetary Transformation",
    summary: "Intensive residency program for breakthrough innovators developing earth-shot solutions that address planetary challenges through systems transformation approaches.",
    challenge: "Breakthrough ideas for planetary transformation often remain trapped in isolated development without access to Indigenous wisdom, collaborative resources, and systemic thinking frameworks needed for implementation.",
    solution: "Immersive residency combining Indigenous knowledge integration, project development intensification, communication tool creation, and network activation for scaling transformational solutions.",
    impact: "Accelerated development of breakthrough solutions with systemic impact potential, supported by collaborative networks and Indigenous wisdom integration.",
    metrics: {
      "Residents": 40,
      "Earth-Shot Projects": 32,
      "Solutions in Implementation": 18,
      "Systemic Impact Potential": "Planetary Scale"
    },
    industry: "Systems Innovation",
    region: "Global",
    program_type: "Innovation Residency",
    year: 2024,
    tags: ["systems-change", "breakthrough-innovation", "earth-shot-solutions", "residency", "transformation"],
    related_tools: [],
    related_videos: [],
    is_featured: true
  }
];

export async function POST() {
  try {
    const db = await getDatabase();
    const repo = new BusinessCasesRepository(db);
    
    // Initialize schema
    await repo.initializeSchema();
    
    // Add AIME business case pathways
    const results = [];
    for (const caseData of aimeBusinessCases) {
      const businessCase = await repo.upsertBusinessCase(caseData);
      results.push(businessCase);
    }
    
    // Get stats
    const stats = await repo.getStats();
    
    return NextResponse.json({
      success: true,
      message: `Added ${results.length} AIME business case pathways`,
      stats
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed business cases' },
      { status: 500 }
    );
  }
}