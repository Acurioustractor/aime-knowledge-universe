"use client"

import { useState } from 'react'

interface Milestone {
  year: number
  title: string
  description: string
  impact: string
  category: 'founding' | 'growth' | 'transformation' | 'scale'
}

interface LessonLearned {
  title: string
  description: string
  insight: string
  application: string
}

const milestones: Milestone[] = [
  {
    year: 2005,
    title: "The Beginning - University of Sydney",
    description: "AIME started with a simple idea: unlocking the potential of Indigenous students through university mentoring.",
    impact: "First cohort of Indigenous students supported",
    category: 'founding'
  },
  {
    year: 2008,
    title: "Scaling Across Universities",
    description: "Expansion to multiple universities as the mentoring model proved successful.",
    impact: "500+ students engaged across 5 universities",
    category: 'growth'
  },
  {
    year: 2012,
    title: "Community-Centered Approach",
    description: "Shift from university-only to community-embedded programs, recognizing the importance of cultural connection.",
    impact: "Programs embedded in 20+ communities",
    category: 'transformation'
  },
  {
    year: 2015,
    title: "Joy Corps Formation",
    description: "Development of the Joy Corps model - systematic approach to relationship-building and mentorship.",
    impact: "Joy Corps methodology established",
    category: 'transformation'
  },
  {
    year: 2018,
    title: "International Expansion",
    description: "Taking the AIME model global, adapting to different cultural contexts while maintaining core principles.",
    impact: "Programs launched in 3 countries",
    category: 'scale'
  },
  {
    year: 2020,
    title: "Digital Transformation",
    description: "Rapid adaptation to digital delivery during global challenges, maintaining connection and impact.",
    impact: "Seamless transition to digital engagement",
    category: 'transformation'
  },
  {
    year: 2022,
    title: "IMAGI-NATION Vision",
    description: "Launch of the IMAGI-NATION concept - a global movement for systemic change and alternative economics.",
    impact: "$100M capital shift initiative launched",
    category: 'scale'
  },
  {
    year: 2024,
    title: "Hoodie Economics",
    description: "Formal articulation of alternative economic models based on relational value and community-centered exchange.",
    impact: "New economic framework established",
    category: 'transformation'
  }
]

const lessonsLearned: LessonLearned[] = [
  {
    title: "Relationship Before Program",
    description: "The most important learning has been that genuine relationships must come before any program structure.",
    insight: "Programs fail when they prioritize process over people. Success comes from authentic human connection.",
    application: "Every AIME initiative now starts with relationship-building and cultural understanding."
  },
  {
    title: "Community Ownership",
    description: "Communities must own and drive their own transformation - external support is just that, support.",
    insight: "Top-down approaches, no matter how well-intentioned, cannot create lasting change.",
    application: "AIME programs are now designed to transfer ownership and decision-making to communities."
  },
  {
    title: "Cultural Adaptation",
    description: "Methods must adapt to cultural context while maintaining core principles of respect and relationship.",
    insight: "What works in one cultural context may not work in another, but human dignity is universal.",
    application: "Local cultural advisors are integral to every program design and implementation."
  },
  {
    title: "Scale Through Stories",
    description: "Impact scales through story and inspiration, not just through replication of programs.",
    insight: "The most powerful programs inspire others to create their own solutions rather than copy existing ones.",
    application: "AIME focuses on sharing principles and stories rather than prescriptive program models."
  },
  {
    title: "Economics of Care",
    description: "Traditional economic models don't capture the value of care, relationship, and community wellbeing.",
    insight: "We need new ways to measure and exchange value that honor relational and cultural wealth.",
    application: "Development of hoodie economics and alternative value systems within AIME programs."
  }
]

export default function EvolutionStory() {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [activeTab, setActiveTab] = useState<'timeline' | 'lessons' | 'trajectory'>('timeline')

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'founding': return 'bg-blue-100 text-blue-800'
      case 'growth': return 'bg-green-100 text-green-800'
      case 'transformation': return 'bg-purple-100 text-purple-800'
      case 'scale': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Evolution & Growth Story</h1>
        <p className="text-lg text-gray-700 max-w-3xl">
          The journey of AIME from a university mentoring program to a global movement for systemic change, 
          shaped by relationships, learning, and continuous adaptation.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1">
          {[
            { id: 'timeline', label: 'Interactive Timeline', icon: '📅' },
            { id: 'lessons', label: 'Lessons Learned', icon: '💡' },
            { id: 'trajectory', label: 'Growth Trajectory', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Key Milestones</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start mb-8">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold z-10">
                    {milestone.year.toString().slice(-2)}
                  </div>
                  
                  {/* Content */}
                  <div 
                    className="ml-6 bg-white rounded-lg border-2 border-gray-200 p-4 cursor-pointer hover:border-blue-300 transition-colors"
                    onClick={() => setSelectedMilestone(milestone)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{milestone.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(milestone.category)}`}>
                        {milestone.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{milestone.description}</p>
                    <p className="text-sm text-blue-600 font-medium">Impact: {milestone.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestone Detail */}
          <div className="lg:col-span-1">
            {selectedMilestone ? (
              <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                <h3 className="text-xl font-semibold mb-3">{selectedMilestone.title}</h3>
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedMilestone.category)}`}>
                    {selectedMilestone.category} • {selectedMilestone.year}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{selectedMilestone.description}</p>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-blue-600 mb-2">Key Impact</h4>
                  <p className="text-gray-600">{selectedMilestone.impact}</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">Explore the Timeline</h3>
                <p className="text-gray-600">Click on any milestone to learn more about that phase of AIME's evolution.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lessons Learned Tab */}
      {activeTab === 'lessons' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Organizational Insights</h2>
          <div className="space-y-6">
            {lessonsLearned.map((lesson, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                  <h3 className="text-xl font-semibold">{lesson.title}</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">What We Learned</h4>
                      <p className="text-gray-700">{lesson.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Insight</h4>
                      <p className="text-gray-700">{lesson.insight}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">How We Apply It</h4>
                      <p className="text-gray-700">{lesson.application}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Growth Trajectory Tab */}
      {activeTab === 'trajectory' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Growth Trajectory & Key Achievements</h2>
          
          {/* Achievement Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">20K+</div>
              <div className="text-blue-100">Young People Engaged</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-green-100">Communities Served</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">5</div>
              <div className="text-purple-100">Countries Active</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">$100M</div>
              <div className="text-orange-100">Capital Shift Goal</div>
            </div>
          </div>

          {/* Growth Phases */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                🌱 <span className="ml-2">Phase 1: Foundation (2005-2010)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Focus</h4>
                  <p className="text-gray-700">Establishing core mentoring model and proving concept in university settings.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Achievements</h4>
                  <ul className="text-gray-700 list-disc pl-5">
                    <li>First successful mentoring cohorts</li>
                    <li>University partnerships established</li>
                    <li>Initial impact measurement systems</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                🌿 <span className="ml-2">Phase 2: Growth (2010-2015)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Focus</h4>
                  <p className="text-gray-700">Scaling successful model across multiple locations and developing systematic approaches.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Achievements</h4>
                  <ul className="text-gray-700 list-disc pl-5">
                    <li>Multi-state program expansion</li>
                    <li>Community partnership development</li>
                    <li>Joy Corps methodology creation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                🌳 <span className="ml-2">Phase 3: Transformation (2015-2020)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Focus</h4>
                  <p className="text-gray-700">Evolving from program delivery to systemic change and alternative approaches.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Achievements</h4>
                  <ul className="text-gray-700 list-disc pl-5">
                    <li>International expansion</li>
                    <li>Digital platform development</li>
                    <li>Alternative economic model exploration</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                🌍 <span className="ml-2">Phase 4: Global Movement (2020-Present)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Focus</h4>
                  <p className="text-gray-700">Building global movement for systemic change through IMAGI-NATION and hoodie economics.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Achievements</h4>
                  <ul className="text-gray-700 list-disc pl-5">
                    <li>IMAGI-NATION vision launch</li>
                    <li>Hoodie economics framework</li>
                    <li>$100M capital shift initiative</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}