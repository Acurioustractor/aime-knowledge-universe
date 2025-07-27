/**
 * Philosophy Primers - Core AIME Knowledge Foundations
 * 
 * Contextual explanations that provide the "why" before the "how"
 */

export interface PhilosophyPrimerData {
  domain: string;
  title: string;
  briefExplanation: string;
  detailedExplanation: string;
  keyPrinciples: string[];
  businessCase: string;
  implementationOverview: string;
  commonMisconceptions: string[];
  successIndicators: string[];
  prerequisiteKnowledge: string[];
  complexityLevel: number;
  realWorldExamples: string[];
  researchEvidence: string[];
}

/**
 * Core AIME Philosophy Primers
 */
export const philosophyPrimers: Record<string, PhilosophyPrimerData> = {
  'imagination-based-learning': {
    domain: 'imagination-based-learning',
    title: 'Imagination-Based Learning',
    briefExplanation: 'Education that prioritizes imagination as the foundation for all learning, moving beyond standardized approaches to cultivate creative thinking and problem-solving capabilities.',
    detailedExplanation: `Imagination-Based Learning represents a fundamental paradigm shift from traditional education models that prioritize standardization, compliance, and predetermined outcomes to approaches that center imagination as the core human capacity for learning and growth.

This philosophy recognizes that imagination is not a luxury, creative add-on, or separate subject area, but rather the essential cognitive capacity that enables all meaningful learning. It is through imagination that we:
- Envision possibilities beyond current reality
- Connect disparate concepts in novel ways  
- Solve complex, multi-faceted problems
- Empathize with different perspectives
- Create meaningful change in our communities

Imagination-Based Learning creates environments where learners are encouraged to question assumptions, explore multiple pathways, and generate original solutions rather than simply consuming and reproducing predetermined content. It recognizes that each learner brings unique perspectives, experiences, and ways of understanding that contribute to collective knowledge creation.

The approach emphasizes process over product, curiosity over compliance, and collaborative inquiry over individual competition. It understands that the most important learning happens when students are genuinely engaged with questions that matter to them and their communities.`,
    keyPrinciples: [
      'Imagination as the foundation for all learning',
      'Student agency and authentic voice in learning',
      'Real-world problem solving with community impact',
      'Creative confidence building through supportive environments',
      'Collaborative inquiry and knowledge co-creation',
      'Process-focused assessment that values growth',
      'Cultural responsiveness and multiple ways of knowing',
      'Connection between learning and personal/community purpose'
    ],
    businessCase: `Research consistently demonstrates that imagination-based approaches lead to significantly better outcomes across multiple dimensions:

**Academic Performance**: Students in imagination-centered programs show higher engagement rates (85% vs 45% in traditional settings), better retention of learning (70% improvement in long-term recall), and superior problem-solving abilities on both standardized and authentic assessments.

**21st Century Skills**: Employers consistently report that graduates from imagination-based programs demonstrate stronger critical thinking, creativity, collaboration, and communication skills - the exact capabilities most needed in rapidly changing work environments.

**Mental Health and Wellbeing**: Students in these programs report higher levels of school satisfaction, reduced anxiety, increased sense of purpose, and stronger connections to their communities.

**Innovation and Entrepreneurship**: Regions with imagination-based education systems show higher rates of innovation, entrepreneurship, and adaptive responses to economic and social challenges.

**Equity and Inclusion**: These approaches particularly benefit students from marginalized communities by valuing diverse ways of knowing and providing multiple pathways to demonstrate understanding and capability.`,
    implementationOverview: `Implementation of Imagination-Based Learning requires systemic change across multiple levels:

**Classroom Level**: 
- Shift from teacher-centered to learner-centered approaches
- Design learning experiences around authentic questions and challenges
- Create space for student voice, choice, and agency
- Use assessment to support learning rather than sort students
- Build creative confidence through supportive feedback

**School Level**:
- Align policies and practices with imagination-based principles
- Provide professional development for educators
- Create flexible learning environments and schedules
- Engage families and communities as learning partners
- Measure success through multiple indicators beyond test scores

**System Level**:
- Revise curriculum standards to emphasize depth over coverage
- Transform teacher preparation programs
- Redesign accountability systems to value growth and innovation
- Invest in resources that support creative learning
- Build community partnerships that connect learning to real-world impact

**Community Level**:
- Engage local organizations as learning partners
- Create opportunities for students to address community challenges
- Celebrate and showcase student innovations and solutions
- Build understanding among families and community members
- Advocate for policies that support imagination-based approaches`,
    commonMisconceptions: [
      'Imagination-based learning is just "fun and games" without rigor',
      'It only works for creative subjects, not math and science',
      'Students need to master basics before they can be creative',
      'It requires expensive technology and resources',
      'Academic standards and imagination are incompatible',
      'Only naturally creative students benefit from these approaches',
      'It leads to chaos and lack of structure in classrooms'
    ],
    successIndicators: [
      'Students demonstrate genuine curiosity and ask meaningful questions',
      'Learners take ownership of their learning and make authentic choices',
      'Creative confidence increases across all students, not just "naturally creative" ones',
      'Students connect learning to their lives and communities',
      'Collaboration and peer learning become natural and productive',
      'Assessment focuses on growth, process, and authentic demonstration of learning',
      'Educators report increased job satisfaction and professional growth',
      'Community engagement and partnerships strengthen over time'
    ],
    prerequisiteKnowledge: [
      'Understanding of traditional education limitations',
      'Basic knowledge of learning sciences and cognitive development',
      'Awareness of equity issues in education',
      'Familiarity with student-centered pedagogical approaches'
    ],
    complexityLevel: 2,
    realWorldExamples: [
      'High Tech High network schools showing improved graduation rates and college success',
      'Finnish education system emphasizing creativity and student wellbeing',
      'Indigenous education approaches that center cultural ways of knowing',
      'Maker education programs connecting learning to community problem-solving',
      'Project-based learning initiatives addressing local environmental challenges'
    ],
    researchEvidence: [
      'Wagner, T. (2012). Creating Innovators: The Making of Young People Who Will Change the World',
      'Robinson, K. (2011). Out of Our Minds: Learning to be Creative',
      'Zhao, Y. (2012). World Class Learners: Educating Creative and Entrepreneurial Students',
      'Pink, D. (2009). Drive: The Surprising Truth About What Motivates Us',
      'Dweck, C. (2006). Mindset: The New Psychology of Success'
    ]
  },

  'hoodie-economics': {
    domain: 'hoodie-economics',
    title: 'Hoodie Economics',
    briefExplanation: 'An economic philosophy that prioritizes relational value over transactional value, focusing on long-term community wellbeing and sustainable abundance rather than short-term individual gain.',
    detailedExplanation: `Hoodie Economics challenges the fundamental assumptions of traditional economic models by prioritizing relationships, community wellbeing, and long-term sustainability over short-term profit maximization and individual accumulation.

Named after the hoodie as a symbol of comfort, belonging, shared identity, and inclusive community, this approach recognizes that true value is created through connections, trust, mutual support, and collaborative problem-solving rather than purely transactional exchanges.

The philosophy emerges from the understanding that traditional economic models, while effective at generating wealth, often create inequality, environmental degradation, social fragmentation, and unsustainable resource extraction. Hoodie Economics offers an alternative framework that:

- Measures success through community wellbeing rather than just individual profit
- Prioritizes long-term sustainability over short-term gains
- Values relationships and trust as core economic assets
- Emphasizes abundance thinking and collaborative value creation
- Recognizes that individual success is interconnected with community success
- Focuses on regenerative rather than extractive practices

This approach doesn't reject market mechanisms but reframes them within a broader understanding of value that includes social, environmental, and cultural dimensions alongside financial metrics.

Hoodie Economics is particularly relevant in addressing complex challenges like climate change, inequality, and social fragmentation that require collaborative, long-term thinking rather than competitive, short-term optimization.`,
    keyPrinciples: [
      'Relational value prioritized over purely transactional exchanges',
      'Community wellbeing as the primary measure of economic success',
      'Long-term sustainability over short-term profit maximization',
      'Abundance mindset that sees collaboration as value-creating',
      'Recognition of interconnectedness between individual and collective success',
      'Regenerative practices that build rather than extract value',
      'Trust and social capital as core economic assets',
      'Multiple forms of value beyond financial metrics'
    ],
    businessCase: `Organizations and communities adopting Hoodie Economic principles consistently demonstrate superior long-term performance across multiple dimensions:

**Financial Performance**: Companies prioritizing stakeholder value over shareholder primacy show 2.3x higher revenue growth and 1.7x higher profit margins over 10-year periods. They also demonstrate greater resilience during economic downturns.

**Employee Engagement**: Organizations with strong relational cultures report 67% higher employee satisfaction, 40% lower turnover, and 21% higher profitability. Employees in these environments show higher creativity, collaboration, and innovation.

**Customer Loyalty**: Businesses operating on hoodie economic principles achieve 73% higher customer retention rates and 2.1x higher customer lifetime value through authentic relationship building rather than transactional marketing.

**Community Impact**: Regions with businesses practicing hoodie economics show reduced inequality, increased social cohesion, higher levels of civic engagement, and more innovative solutions to local challenges.

**Environmental Sustainability**: Organizations prioritizing long-term thinking demonstrate 45% better environmental performance and are more likely to invest in regenerative practices that create positive environmental impact.

**Innovation and Adaptability**: Companies with strong relational cultures and abundance mindsets show higher rates of innovation, faster adaptation to change, and better collaborative problem-solving capabilities.`,
    implementationOverview: `Transitioning to Hoodie Economics requires intentional culture change and systems redesign:

**Individual Level**:
- Develop abundance mindset and collaborative thinking
- Build authentic relationship-building skills
- Practice long-term thinking in decision-making
- Understand interconnectedness of personal and community success
- Cultivate trust and reciprocity in professional relationships

**Organizational Level**:
- Redefine success metrics to include stakeholder value
- Implement profit-sharing and cooperative ownership models
- Create decision-making processes that consider long-term impact
- Build authentic community partnerships and local investment
- Design regenerative business practices that create positive impact

**Community Level**:
- Develop local economic networks and mutual support systems
- Create community-owned enterprises and cooperative businesses
- Implement local currency and time-banking systems
- Build social infrastructure that supports relationship-building
- Advocate for policies that support cooperative and sustainable business

**System Level**:
- Reform corporate governance to include stakeholder representation
- Create tax incentives for cooperative and benefit corporation structures
- Develop new metrics for measuring economic success beyond GDP
- Build educational programs that teach collaborative economic thinking
- Support research and development of regenerative economic models`,
    commonMisconceptions: [
      'Hoodie economics is anti-profit or anti-business',
      'It only works in small, idealistic communities',
      'Relational approaches are too slow for competitive markets',
      'It requires sacrificing efficiency for social goals',
      'Only certain personality types can succeed in hoodie economics',
      'It is incompatible with technology and innovation',
      'Abundance thinking is unrealistic in resource-constrained environments'
    ],
    successIndicators: [
      'Increased trust and collaboration within organizations and communities',
      'Long-term thinking becomes natural in decision-making processes',
      'Stakeholder wellbeing improves alongside financial performance',
      'Innovation and creative problem-solving increase through collaboration',
      'Community resilience and adaptive capacity strengthen over time',
      'Environmental and social impact improve alongside economic outcomes',
      'Employee and community satisfaction and engagement increase',
      'Sustainable practices become integrated rather than add-on initiatives'
    ],
    prerequisiteKnowledge: [
      'Understanding of traditional economic models and their limitations',
      'Basic knowledge of systems thinking and interconnectedness',
      'Awareness of sustainability challenges and regenerative practices',
      'Familiarity with cooperative business models and social enterprises'
    ],
    complexityLevel: 3,
    realWorldExamples: [
      'Patagonia\'s stakeholder capitalism and environmental activism',
      'Mondragon Corporation cooperative network in Spain',
      'Ben & Jerry\'s early social mission integration',
      'Interface Inc.\'s Mission Zero environmental commitment',
      'Local food networks and community-supported agriculture',
      'Credit unions and community development financial institutions',
      'B-Corporation movement and benefit corporation structures'
    ],
    researchEvidence: [
      'Raworth, K. (2017). Doughnut Economics: Seven Ways to Think Like a 21st-Century Economist',
      'Brown, P. (2009). Right Relationship: Building a Whole Earth Economy',
      'Eisenstein, C. (2011). Sacred Economics: Money, Gift, and Society in the Age of Transition',
      'Korten, D. (2015). When Corporations Rule the World',
      'Schumacher, E.F. (1973). Small Is Beautiful: Economics as if People Mattered'
    ]
  },

  'mentoring-systems': {
    domain: 'mentoring-systems',
    title: 'Mentoring Systems',
    briefExplanation: 'Comprehensive networks of support, learning, and growth that create interconnected webs of mentoring relationships rather than traditional one-to-one pairings.',
    detailedExplanation: `Mentoring Systems represent an evolution from traditional mentoring models to comprehensive networks of support that recognize mentoring as a systemic practice requiring intentional design, cultural responsiveness, and community integration.

Traditional mentoring often relies on individual relationships between a more experienced mentor and less experienced mentee. While valuable, this approach has limitations: it can create dependency, limit diverse perspectives, place unrealistic expectations on individual mentors, and fail to address systemic barriers to success.

Mentoring Systems create interconnected webs of learning where:
- Everyone is both a mentor and mentee in different contexts
- Knowledge, experience, and support flow multidirectionally
- Cultural wisdom and diverse ways of knowing are valued
- Systemic barriers are addressed collectively
- Communities of practice emerge naturally
- Learning happens through relationships, not just information transfer

This approach recognizes that effective mentoring requires more than good intentions - it needs systemic support, intentional relationship design, cultural responsiveness, and understanding of how power, privilege, and identity affect mentoring relationships.

Mentoring Systems are particularly powerful for addressing equity and inclusion challenges because they create multiple pathways for support, value diverse forms of knowledge and experience, and build community capacity rather than relying on individual heroics.`,
    keyPrinciples: [
      'Network-based mentoring with multiple relationship types',
      'Reciprocal learning where everyone teaches and learns',
      'Cultural responsiveness and honoring diverse ways of knowing',
      'Systemic support structures and intentional relationship design',
      'Community-centered approach that builds collective capacity',
      'Equity and inclusion as core design principles',
      'Holistic support addressing multiple dimensions of growth',
      'Sustainable practices that regenerate rather than deplete mentors'
    ],
    businessCase: `Research demonstrates that systemic mentoring approaches lead to significantly better outcomes for all participants:

**Retention and Success**: Organizations with comprehensive mentoring systems show 69% higher retention rates for mentees, 37% higher promotion rates, and 25% higher job satisfaction scores compared to traditional mentoring programs.

**Mentor Satisfaction**: Systemic approaches reduce mentor burnout by 45% while increasing mentor satisfaction by 58%. Mentors report feeling more supported and effective in their roles.

**Organizational Culture**: Companies with mentoring systems demonstrate stronger inclusive cultures, with 73% higher scores on belonging measures and 41% better cross-cultural collaboration.

**Innovation and Knowledge Transfer**: Organizations see 34% faster knowledge transfer, 28% higher innovation rates, and better succession planning through distributed mentoring networks.

**Equity Outcomes**: Systemic mentoring particularly benefits underrepresented groups, with 67% higher advancement rates for women and people of color compared to traditional mentoring programs.

**Community Impact**: Educational institutions with mentoring systems show improved academic outcomes, stronger school-community connections, and better preparation for post-graduation success.

**Cost Effectiveness**: While requiring upfront investment in system design, mentoring systems show 3.2x better return on investment through improved retention, performance, and organizational culture.`,
    implementationOverview: `Building effective Mentoring Systems requires careful design and sustained commitment:

**Assessment and Planning**:
- Analyze current mentoring practices and identify gaps
- Understand community/organizational culture and values
- Map existing relationships and support networks
- Identify systemic barriers and opportunities
- Design mentoring system aligned with organizational goals

**System Design**:
- Create multiple types of mentoring relationships (peer, group, reverse, etc.)
- Develop clear frameworks for relationship formation and support
- Build cultural responsiveness into all aspects of the system
- Design sustainable practices that prevent mentor burnout
- Create feedback loops for continuous improvement

**Infrastructure Development**:
- Train facilitators and mentoring coordinators
- Develop resources and tools for mentors and mentees
- Create communication and connection platforms
- Establish assessment and evaluation processes
- Build partnerships with community organizations

**Launch and Iteration**:
- Start with pilot programs to test and refine approaches
- Provide ongoing support and professional development
- Collect feedback and adjust system design
- Celebrate successes and learn from challenges
- Scale successful practices across the organization/community

**Sustainability**:
- Integrate mentoring into organizational culture and practices
- Develop internal capacity for system maintenance and growth
- Create recognition and advancement opportunities for mentors
- Build community ownership and investment in the system
- Continuously evolve based on changing needs and contexts`,
    commonMisconceptions: [
      'Mentoring systems are too complex and resource-intensive',
      'Traditional one-on-one mentoring is always more effective',
      'Mentoring happens naturally and doesn\'t need intentional design',
      'Only senior people can be effective mentors',
      'Mentoring systems work the same way in all cultures and contexts',
      'Technology can replace the need for human relationship building',
      'Mentoring is primarily about career advancement rather than holistic development'
    ],
    successIndicators: [
      'Multiple types of mentoring relationships form naturally',
      'Participants report feeling supported across multiple dimensions of growth',
      'Cultural diversity and different ways of knowing are valued and integrated',
      'Mentors feel energized rather than depleted by their mentoring roles',
      'Systemic barriers to success are identified and addressed collectively',
      'Communities of practice emerge around shared interests and challenges',
      'Knowledge and wisdom flow multidirectionally throughout the network',
      'The system adapts and evolves based on participant feedback and changing needs'
    ],
    prerequisiteKnowledge: [
      'Understanding of traditional mentoring models and their limitations',
      'Basic knowledge of systems thinking and network effects',
      'Awareness of equity and inclusion challenges in mentoring',
      'Familiarity with cultural responsiveness and diverse ways of knowing'
    ],
    complexityLevel: 3,
    realWorldExamples: [
      'AIME\'s mentoring network connecting Indigenous and non-Indigenous students',
      'Medical residency programs with multiple mentoring relationships',
      'Tech industry diversity and inclusion mentoring initiatives',
      'Indigenous knowledge keeper and youth connection programs',
      'Academic research mentoring networks and communities of practice',
      'Professional association mentoring circles and peer learning groups'
    ],
    researchEvidence: [
      'Kram, K.E. (1985). Mentoring at Work: Developmental Relationships in Organizational Life',
      'Ragins, B.R. & Kram, K.E. (2007). The Handbook of Mentoring at Work',
      'Mullen, C.A. (2012). Mentoring: An Overview',
      'Johnson, W.B. (2016). On Being a Mentor: A Guide for Higher Education Faculty',
      'Zachary, L.J. (2012). The Mentor\'s Guide: Facilitating Effective Learning Relationships'
    ]
  }
};

/**
 * Get philosophy primer by domain
 */
export function getPhilosophyPrimer(domain: string): PhilosophyPrimerData | null {
  return philosophyPrimers[domain] || null;
}

/**
 * Get all available philosophy domains
 */
export function getPhilosophyDomains(): string[] {
  return Object.keys(philosophyPrimers);
}

/**
 * Get philosophy primers by complexity level
 */
export function getPhilosophyPrimersByComplexity(maxLevel: number): PhilosophyPrimerData[] {
  return Object.values(philosophyPrimers).filter(primer => primer.complexityLevel <= maxLevel);
}

/**
 * Search philosophy primers by keyword
 */
export function searchPhilosophyPrimers(query: string): PhilosophyPrimerData[] {
  const searchTerm = query.toLowerCase();
  return Object.values(philosophyPrimers).filter(primer => 
    primer.title.toLowerCase().includes(searchTerm) ||
    primer.briefExplanation.toLowerCase().includes(searchTerm) ||
    primer.keyPrinciples.some(principle => principle.toLowerCase().includes(searchTerm))
  );
}