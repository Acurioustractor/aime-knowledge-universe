"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  LightBulbIcon, 
  UserGroupIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface BusinessCase {
  id: string
  title: string
  subtitle: string
  description: string
  priority: 'flagship' | 'core' | 'emerging'
  target_audience: string
  impact_score: number
  tags: string[]
  key_outcomes: string[]
  challenge: string
  approach: string
  implementation: string[]
  metrics: string[]
  testimonials: Array<{
    quote: string
    author: string
    role: string
  }>
  resources: Array<{
    title: string
    type: string
    url: string
  }>
}

export default function BusinessCaseDetailPage() {
  const params = useParams()
  const [businessCase, setBusinessCase] = useState<BusinessCase | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'approach' | 'implementation' | 'results' | 'resources'>('overview')

  useEffect(() => {
    loadBusinessCase()
  }, [params.id])

  const loadBusinessCase = async () => {
    // Mock data for the core 8 business cases
    const mockData = getBusinessCaseData(params.id as string)
    setBusinessCase(mockData)
    setLoading(false)
  }

  const getBusinessCaseData = (id: string): BusinessCase => {
    const cases = {
      'joy-corps': {
        id: 'joy-corps',
        title: 'Joy Corps',
        subtitle: 'Organizational Transformation Through Indigenous Wisdom',
        description: 'Joy Corps represents AIME\'s flagship approach to embedding Indigenous custodianship into organizational culture and operations. This comprehensive transformation methodology prioritizes relationships, community benefit, and seven-generation thinking to create sustainable organizational change.',
        priority: 'flagship' as const,
        target_audience: 'Global Organizations & Corporate Leaders',
        impact_score: 95,
        tags: ['transformation', 'organizational-change', 'indigenous-wisdom', 'joy-corps', 'culture', 'leadership'],
        key_outcomes: [
          'Organizations report 40% improvement in employee engagement through relationship-first approaches',
          'Implementation of seven-generation thinking in strategic planning processes across 50+ companies',
          'Cultural transformation metrics show sustained positive change over 18+ months',
          'Leadership development programs integrate Indigenous mentoring methodologies',
          'Measurable improvements in organizational resilience and adaptability'
        ],
        challenge: 'Traditional organizational structures often prioritize short-term profits over long-term sustainability and human relationships. This creates disconnected workplaces where employees feel undervalued and organizational purpose lacks deeper meaning.',
        approach: 'Joy Corps transforms organizations by embedding Indigenous custodianship principles into core operations. The methodology focuses on relationship-building, community-centered decision-making, and seven-generation thinking to create workplaces that honor both people and purpose.',
        implementation: [
          'Leadership immersion in Indigenous custodianship principles and relationship-first approaches',
          'Cultural assessment and transformation planning with community input and feedback',
          'Implementation of mentoring networks and relationship-building systems across all levels',
          'Integration of seven-generation thinking into strategic planning and decision-making processes',
          'Development of community-centered policies and practices that prioritize collective wellbeing',
          'Ongoing measurement and adaptation based on cultural transformation metrics and employee feedback'
        ],
        metrics: [
          '40% increase in employee engagement scores',
          '60% improvement in leadership effectiveness ratings',
          '25% reduction in staff turnover',
          '50% increase in innovation metrics',
          '35% improvement in organizational resilience measures'
        ],
        testimonials: [
          {
            quote: "Joy Corps didn't just change our policies - it transformed how we see ourselves as an organization. We now make decisions thinking about the impact on seven generations.",
            author: "Sarah Chen",
            role: "CEO, Global Tech Solutions"
          },
          {
            quote: "The relationship-first approach has created the most connected and purposeful workplace I've ever experienced. Our teams are more creative and collaborative than ever.",
            author: "Marcus Williams",
            role: "Head of People & Culture, Innovation Labs"
          }
        ],
        resources: [
          { title: 'Joy Corps Implementation Guide', type: 'PDF', url: '/resources/joy-corps-guide.pdf' },
          { title: 'Seven-Generation Planning Toolkit', type: 'Toolkit', url: '/resources/seven-generation-toolkit' },
          { title: 'Organizational Transformation Webinar Series', type: 'Video', url: '/resources/transformation-webinars' }
        ]
      },
      'custodians': {
        id: 'custodians',
        title: 'Custodians',
        subtitle: 'Systems Leadership and Stewardship Models',
        description: 'The Custodians pathway develops systems leaders who understand their role as stewards of transformation. This program integrates Indigenous concepts of custodianship with modern leadership development to create leaders who prioritize collective wellbeing.',
        priority: 'flagship' as const,
        target_audience: 'System Leaders & Change Agents',
        impact_score: 90,
        tags: ['systems-leadership', 'stewardship', 'custodianship', 'indigenous-wisdom', 'mentoring', 'transformation'],
        key_outcomes: [
          'Leaders demonstrate measurable shift toward stewardship mindset',
          'Systems thinking capabilities increase by 60% in program participants',
          'Network effects create ripple impact across connected organizations',
          'Development of sustainable leadership practices based on Indigenous principles'
        ],
        challenge: 'Traditional leadership models often focus on individual achievement and short-term results, creating leaders who struggle with systems-level challenges and long-term stewardship responsibilities.',
        approach: 'Custodians develops leaders through Indigenous stewardship principles, emphasizing responsibility to community, long-term thinking, and systems understanding.',
        implementation: [
          'Leadership assessment and stewardship readiness evaluation',
          'Immersive learning in Indigenous custodianship principles',
          'Systems thinking skill development and practical application',
          'Mentoring relationships with experienced stewardship leaders',
          'Community-based leadership projects and real-world application'
        ],
        metrics: [
          '60% increase in systems thinking capabilities',
          '45% improvement in long-term strategic planning',
          '30% increase in community-centered decision making',
          '50% improvement in stakeholder engagement'
        ],
        testimonials: [
          {
            quote: "The Custodians program completely changed how I approach leadership. I now see myself as a steward of transformation rather than just a manager of results.",
            author: "Dr. Maria Santos",
            role: "Director of Systems Change, Healthcare Network"
          }
        ],
        resources: [
          { title: 'Custodians Leadership Framework', type: 'PDF', url: '/resources/custodians-framework.pdf' },
          { title: 'Stewardship Assessment Tool', type: 'Assessment', url: '/resources/stewardship-assessment' }
        ]
      },
      'presidents': {
        id: 'presidents',
        title: 'Presidents',
        subtitle: 'Executive Mentoring and Leadership Transformation',
        description: 'The Presidents pathway transforms executive leadership through Indigenous mentoring methodologies. This program addresses how senior leaders can embody and model transformational change at the highest organizational levels.',
        priority: 'core' as const,
        target_audience: 'Senior Executives & C-Suite Leaders',
        impact_score: 85,
        tags: ['executive-leadership', 'mentoring', 'transformation', 'indigenous-wisdom', 'presidents', 'senior-management'],
        key_outcomes: [
          'Executive decision-making incorporates long-term thinking principles',
          'Mentoring relationships become central to leadership development',
          'Organizational culture shifts reflect Indigenous custodianship integration',
          'Senior leaders model transformational change across organizations'
        ],
        challenge: 'Senior executives often operate in isolation with limited peer learning opportunities, leading to decision-making that lacks broader perspective and long-term thinking.',
        approach: 'Presidents creates peer mentoring networks among senior executives, integrating Indigenous custodianship into executive decision-making and organizational transformation.',
        implementation: [
          'Executive peer network formation and relationship building',
          'Indigenous custodianship integration into strategic decision-making',
          'Mentoring skill development for senior leadership roles',
          'Organizational transformation planning and implementation',
          'Cross-sector learning and knowledge sharing initiatives'
        ],
        metrics: [
          '70% improvement in strategic decision-making quality',
          '40% increase in long-term organizational planning',
          '35% improvement in cross-functional collaboration',
          '50% increase in mentoring relationships within organizations'
        ],
        testimonials: [
          {
            quote: "The Presidents network has given me perspectives I never would have gained alone. Our decisions now consider impacts I previously overlooked.",
            author: "James Rodriguez",
            role: "CEO, Regional Manufacturing Group"
          }
        ],
        resources: [
          { title: 'Executive Mentoring Guide', type: 'PDF', url: '/resources/executive-mentoring-guide.pdf' },
          { title: 'Strategic Decision-Making Toolkit', type: 'Toolkit', url: '/resources/strategic-decision-toolkit' }
        ]
      },
      'citizens': {
        id: 'citizens',
        title: 'Citizens',
        subtitle: 'Community Engagement and Collective Action',
        description: 'The Citizens pathway enables community-level transformation through collective action and shared responsibility. This program demonstrates grassroots approaches to systems change that build sustainable community networks.',
        priority: 'core' as const,
        target_audience: 'Community Leaders & Grassroots Organizations',
        impact_score: 80,
        tags: ['community-engagement', 'collective-action', 'citizens', 'grassroots', 'transformation', 'networks'],
        key_outcomes: [
          'Community networks demonstrate increased collaboration and mutual support',
          'Grassroots initiatives show sustainable impact over multiple years',
          'Collective action models replicated across diverse geographic regions',
          'Community-led decision making processes strengthen local autonomy'
        ],
        challenge: 'Communities often lack the tools and frameworks needed to create sustainable collective action, leading to fragmented efforts and limited long-term impact.',
        approach: 'Citizens empowers communities through Indigenous collective action principles, building networks that sustain long-term transformation through shared responsibility and mutual support.',
        implementation: [
          'Community asset mapping and relationship building exercises',
          'Collective action skill development and capacity building',
          'Indigenous governance and decision-making process integration',
          'Network formation and inter-community learning exchanges',
          'Sustainable impact measurement and community accountability systems'
        ],
        metrics: [
          '55% increase in community collaboration initiatives',
          '40% improvement in collective decision-making processes',
          '65% increase in cross-community knowledge sharing',
          '30% improvement in community resilience measures'
        ],
        testimonials: [
          {
            quote: "The Citizens approach helped our community move from individual efforts to powerful collective action. We've achieved more together than we ever thought possible.",
            author: "Elena Thompson",
            role: "Community Organizer, Urban Renewal Initiative"
          }
        ],
        resources: [
          { title: 'Community Action Planning Guide', type: 'PDF', url: '/resources/community-action-guide.pdf' },
          { title: 'Collective Decision-Making Toolkit', type: 'Toolkit', url: '/resources/collective-decision-toolkit' }
        ]
      },
      'imagi-labs': {
        id: 'imagi-labs',
        title: 'IMAGI-Labs',
        subtitle: 'Innovation Hubs and Creative Transformation',
        description: 'IMAGI-Labs creates innovation hubs that blend Indigenous custodianship with cutting-edge creative methodologies. This program demonstrates how imagination becomes a practical tool for transformation in organizational and community contexts.',
        priority: 'core' as const,
        target_audience: 'Innovation Centers & Creative Organizations',
        impact_score: 75,
        tags: ['innovation', 'creativity', 'imagi-labs', 'imagination', 'transformation', 'hubs'],
        key_outcomes: [
          'Innovation metrics show 50% increase in breakthrough solutions',
          'Creative methodologies integrate Indigenous custodianship principles',
          'Hub models successfully replicated in multiple contexts',
          'Imagination-based learning demonstrates measurable impact on problem-solving'
        ],
        challenge: 'Innovation often becomes disconnected from deeper purpose and cultural wisdom, leading to solutions that lack sustainability and broader positive impact.',
        approach: 'IMAGI-Labs combines Indigenous imagination practices with modern innovation methodologies to create solutions that are both creative and culturally grounded.',
        implementation: [
          'Innovation hub design and space creation for creative collaboration',
          'Indigenous imagination practice integration into innovation processes',
          'Creative methodology development and team skill building',
          'Community-centered innovation challenges and solution development',
          'Hub network formation and cross-pollination of creative ideas'
        ],
        metrics: [
          '50% increase in breakthrough innovation solutions',
          '60% improvement in creative problem-solving capabilities',
          '40% increase in community-centered innovation projects',
          '45% improvement in innovation sustainability measures'
        ],
        testimonials: [
          {
            quote: "IMAGI-Labs transformed how our team approaches innovation. We now create solutions that are both creative and deeply connected to community needs.",
            author: "Dr. Alex Chen",
            role: "Innovation Director, Technology Collaborative"
          }
        ],
        resources: [
          { title: 'Innovation Hub Setup Guide', type: 'PDF', url: '/resources/innovation-hub-guide.pdf' },
          { title: 'Imagination-Based Innovation Toolkit', type: 'Toolkit', url: '/resources/imagination-innovation-toolkit' }
        ]
      },
      'indigenous-labs': {
        id: 'indigenous-labs',
        title: 'Indigenous Labs',
        subtitle: 'Cultural Knowledge and Modern Applications',
        description: 'Indigenous Labs focuses on preserving and applying traditional knowledge in contemporary contexts. This program bridges ancient wisdom with modern challenges, creating frameworks for cultural knowledge transfer and application.',
        priority: 'core' as const,
        target_audience: 'Cultural Organizations & Knowledge Keepers',
        impact_score: 88,
        tags: ['indigenous-knowledge', 'cultural-preservation', 'traditional-wisdom', 'modern-applications', 'labs'],
        key_outcomes: [
          'Traditional knowledge systems successfully integrated into modern frameworks',
          'Cultural preservation efforts show measurable community impact',
          'Knowledge transfer between generations demonstrates sustained success',
          'Modern applications of traditional wisdom create innovative solutions'
        ],
        challenge: 'Traditional Indigenous knowledge often remains disconnected from modern applications, limiting its potential impact and creating barriers to intergenerational knowledge transfer.',
        approach: 'Indigenous Labs creates structured environments where traditional knowledge keepers work with modern practitioners to develop applications that honor cultural protocols while addressing contemporary challenges.',
        implementation: [
          'Cultural knowledge documentation and preservation systems',
          'Intergenerational learning program development and facilitation',
          'Modern application development guided by traditional protocols',
          'Community validation and cultural appropriateness review processes',
          'Knowledge sharing network creation and sustainable knowledge transfer'
        ],
        metrics: [
          '75% increase in intergenerational knowledge transfer activities',
          '60% improvement in cultural preservation initiative outcomes',
          '50% increase in modern applications of traditional knowledge',
          '40% improvement in community cultural engagement measures'
        ],
        testimonials: [
          {
            quote: "Indigenous Labs helped us bridge the gap between our traditional knowledge and modern needs. We're now sharing wisdom in ways that honor our culture while serving our community.",
            author: "Elder Mary Kingbird",
            role: "Traditional Knowledge Keeper, First Nations Education Council"
          }
        ],
        resources: [
          { title: 'Cultural Knowledge Documentation Guide', type: 'PDF', url: '/resources/cultural-knowledge-guide.pdf' },
          { title: 'Traditional-Modern Integration Toolkit', type: 'Toolkit', url: '/resources/traditional-modern-toolkit' }
        ]
      },
      'mentor-credit': {
        id: 'mentor-credit',
        title: 'Mentor Credit',
        subtitle: 'Relationship Economics and Value Creation',
        description: 'Mentor Credit explores creating economic value from mentoring relationships. This emerging program demonstrates how relational economics can transform traditional value creation models by recognizing and rewarding mentoring contributions.',
        priority: 'emerging' as const,
        target_audience: 'Economic Innovators & Social Entrepreneurs',
        impact_score: 70,
        tags: ['mentor-credit', 'relational-economics', 'value-creation', 'mentoring', 'economics', 'relationships'],
        key_outcomes: [
          'Pilot programs demonstrate measurable economic value from mentoring relationships',
          'Alternative value creation models show promise for scaling',
          'Relationship-based economics principles gain institutional recognition',
          'Mentoring becomes recognized as valuable economic contribution'
        ],
        challenge: 'Traditional economic models fail to recognize the value created through mentoring relationships, leading to underinvestment in relationship-building and knowledge transfer.',
        approach: 'Mentor Credit develops systems that quantify and reward the economic value created through mentoring relationships, creating new models for relational economics.',
        implementation: [
          'Mentoring value measurement system development and testing',
          'Economic model creation for relationship-based value exchange',
          'Pilot program implementation with partner organizations',
          'Impact measurement and economic outcome tracking',
          'Scaling framework development for broader adoption'
        ],
        metrics: [
          '30% increase in measurable mentoring relationship outcomes',
          '25% improvement in knowledge transfer effectiveness',
          '40% increase in mentoring program participation',
          '35% improvement in economic recognition of mentoring value'
        ],
        testimonials: [
          {
            quote: "Mentor Credit helped us see mentoring as an economic asset rather than just a nice-to-have program. It's changing how we value relationships in our organization.",
            author: "Sarah Johnson",
            role: "Director of People Development, Social Enterprise Network"
          }
        ],
        resources: [
          { title: 'Mentor Credit Implementation Guide', type: 'PDF', url: '/resources/mentor-credit-guide.pdf' },
          { title: 'Relationship Economics Toolkit', type: 'Toolkit', url: '/resources/relationship-economics-toolkit' }
        ]
      },
      'systems-residency': {
        id: 'systems-residency',
        title: 'Systems Residency',
        subtitle: 'Immersive Transformation Experiences',
        description: 'Systems Residency provides immersive experiences in systems transformation. This emerging program combines intensive learning with practical application in real-world contexts to develop deep systems thinking capabilities.',
        priority: 'emerging' as const,
        target_audience: 'Change Agents & Systems Practitioners',
        impact_score: 82,
        tags: ['systems-residency', 'immersive-learning', 'transformation', 'experiential', 'systems-thinking'],
        key_outcomes: [
          'Participants demonstrate deep systems thinking capabilities post-residency',
          'Immersive learning models show superior retention and application rates',
          'Residency graduates become effective transformation leaders in their contexts',
          'Systems intervention skills develop through real-world application'
        ],
        challenge: 'Traditional systems thinking education often lacks the immersive, experiential components needed to develop deep systems intervention capabilities.',
        approach: 'Systems Residency creates intensive, immersive learning environments where participants engage with real systems challenges while developing theoretical understanding and practical skills.',
        implementation: [
          'Residency program design with immersive learning components',
          'Real-world systems challenge identification and participant matching',
          'Intensive learning curriculum combining theory and practice',
          'Mentoring and support system development throughout residency',
          'Graduation and ongoing alumni network for continued learning'
        ],
        metrics: [
          '80% improvement in systems thinking assessment scores',
          '65% increase in systems intervention effectiveness',
          '70% improvement in complex problem-solving capabilities',
          '55% increase in transformation leadership roles post-residency'
        ],
        testimonials: [
          {
            quote: "The Systems Residency was transformational. I came in understanding systems theory and left with the skills to actually create systems change.",
            author: "Dr. Michael Park",
            role: "Systems Change Consultant, Global Development Organization"
          }
        ],
        resources: [
          { title: 'Systems Residency Design Guide', type: 'PDF', url: '/resources/systems-residency-guide.pdf' },
          { title: 'Immersive Learning Toolkit', type: 'Toolkit', url: '/resources/immersive-learning-toolkit' }
        ]
      }
    }
    
    return cases[id as keyof typeof cases] || cases['joy-corps']
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      flagship: 'bg-purple-100 text-purple-800 border-purple-200',
      core: 'bg-blue-100 text-blue-800 border-blue-200',
      emerging: 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[priority as keyof typeof colors] || colors.core
  }

  const getPriorityIcon = (priority: string) => {
    const icons = {
      flagship: '🌟',
      core: '⚡',
      emerging: '🌱'
    }
    return icons[priority as keyof typeof icons] || icons.core
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business case...</p>
        </div>
      </div>
    )
  }

  if (!businessCase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Business Case Not Found</h2>
          <p className="text-gray-600 mb-4">The requested business case could not be found.</p>
          <Link href="/business-cases" className="text-blue-600 hover:text-blue-800">
            ← Back to Business Cases
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/business-cases" className="hover:text-gray-700">
              Business Cases
            </Link>
            <span>•</span>
            <span className="text-gray-900">{businessCase.title}</span>
          </div>

          {/* Title Section */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(businessCase.priority)}`}>
                  {getPriorityIcon(businessCase.priority)} {businessCase.priority.toUpperCase()}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ChartBarIcon className="w-4 h-4" />
                  <span>Impact Score: {businessCase.impact_score}/100</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {businessCase.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {businessCase.subtitle}
              </p>
              <p className="text-gray-700 leading-relaxed max-w-4xl">
                {businessCase.description}
              </p>
            </div>

            <div className="ml-8 text-right">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {businessCase.impact_score}
                </div>
                <div className="text-sm text-blue-800">Impact Score</div>
              </div>
              
              <Link
                href="/business-cases"
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Back to Cases</span>
              </Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-8 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'overview', label: 'Overview', icon: DocumentTextIcon },
                { key: 'approach', label: 'Approach', icon: LightBulbIcon },
                { key: 'implementation', label: 'Implementation', icon: RocketLaunchIcon },
                { key: 'results', label: 'Results', icon: ChartBarIcon },
                { key: 'resources', label: 'Resources', icon: UserGroupIcon }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>   
   {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Challenge */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-red-600 font-bold">!</span>
                  </div>
                  The Challenge
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {businessCase.challenge}
                </p>
              </div>

              {/* Target Audience */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <UserGroupIcon className="w-6 h-6 text-blue-600 mr-3" />
                  Target Audience
                </h2>
                <p className="text-gray-700 text-lg">
                  {businessCase.target_audience}
                </p>
              </div>

              {/* Key Themes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Key Themes
                </h2>
                <div className="flex flex-wrap gap-2">
                  {businessCase.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                    >
                      {tag.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Priority Level</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(businessCase.priority)}`}>
                      {businessCase.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Impact Score</span>
                    <span className="font-semibold text-gray-900">{businessCase.impact_score}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Key Outcomes</span>
                    <span className="font-semibold text-gray-900">{businessCase.key_outcomes.length}</span>
                  </div>
                </div>
              </div>

              {/* Key Outcomes Preview */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Outcomes</h3>
                <div className="space-y-3">
                  {businessCase.key_outcomes.slice(0, 3).map((outcome, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{outcome}</p>
                    </div>
                  ))}
                  {businessCase.key_outcomes.length > 3 && (
                    <p className="text-sm text-gray-500 italic">
                      +{businessCase.key_outcomes.length - 3} more outcomes
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'approach' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <LightBulbIcon className="w-8 h-8 text-yellow-600 mr-3" />
                Our Approach
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {businessCase.approach}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'implementation' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <RocketLaunchIcon className="w-8 h-8 text-blue-600 mr-3" />
                Implementation Process
              </h2>
              <div className="space-y-6">
                {businessCase.implementation.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <ChartBarIcon className="w-6 h-6 text-green-600 mr-3" />
                Key Metrics
              </h2>
              <div className="space-y-4">
                {businessCase.metrics.map((metric, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">{metric}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <StarIcon className="w-6 h-6 text-yellow-600 mr-3" />
                Testimonials
              </h2>
              <div className="space-y-6">
                {businessCase.testimonials.map((testimonial, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <blockquote className="text-gray-700 italic mb-2">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Outcomes List */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Complete Outcomes List
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businessCase.key_outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <UserGroupIcon className="w-8 h-8 text-purple-600 mr-3" />
                Resources & Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {businessCase.resources.map((resource, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {resource.type}
                      </span>
                    </div>
                    <a
                      href={resource.url}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Access Resource →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}