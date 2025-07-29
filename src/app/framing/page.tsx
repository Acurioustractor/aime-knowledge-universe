"use client"

import { useState, useEffect } from 'react'
import { DocumentTextIcon, LightBulbIcon, TagIcon, FolderIcon, CloudArrowUpIcon, DocumentPlusIcon } from '@heroicons/react/24/outline'

interface FramingData {
  summary: {
    totalDocuments: number
    totalConcepts: number
    categories: number
    avgWordsPerDoc: number
  }
  topConcepts: Array<{
    name: string
    frequency: number
    categories: string[]
  }>
  categories: Array<{
    name: string
    documentCount: number
    uniqueConcepts: number
    avgWordCount: number
  }>
  recentDocuments: Array<{
    id: string
    title: string
    category: string
    conceptCount: number
  }>
}

// Knowledge Synthesis Interfaces
interface SynthesisSection {
  id: string
  title: string
  icon: string
  description: string
  estimatedReadTime: number
  keyTopics: string[]
  documentCount: number
  completed?: boolean
}

interface NavigationHubProps {
  sections: SynthesisSection[]
  currentSection?: string
  completedSections: string[]
  onSectionSelect: (sectionId: string) => void
}

interface KnowledgeSynthesisState {
  currentSection: string | null
  completedSections: string[]
  searchQuery: string
  bookmarkedSections: string[]
}

// Section Components
interface SectionProps {
  onComplete: () => void
  onBookmark: () => void
  isBookmarked: boolean
}

function IndigenousFoundations({ onComplete, onBookmark, isBookmarked }: SectionProps) {
  return (
    <section id="indigenous-foundations" className="mb-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="text-4xl mr-4">🌱</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Indigenous Foundations</h2>
              <p className="text-gray-600">The bedrock wisdom that guides everything AIME does</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onBookmark}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isBookmarked ? '★' : '☆'}
            </button>
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Mark Complete
            </button>
          </div>
        </div>
        {/* Introduction */}
        <div className="mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            AIME's work is grounded in Indigenous custodianship that has guided communities for thousands of years. 
            These foundational principles shape every aspect of our approach, from individual mentoring relationships 
            to systemic transformation strategies.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-blue-800 italic">
              "Indigenous knowledge systems offer profound insights into sustainable relationships, 
              community-centered decision making, and long-term thinking that can transform how we approach 
              education, economics, and social change." - AIME Philosophy
            </p>
          </div>
        </div>

        {/* Four Key Subsections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Seven-Generation Thinking */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🌿</span>
              <h3 className="text-xl font-semibold text-green-900">Seven-Generation Thinking</h3>
            </div>
            <p className="text-green-800 mb-4">
              Every decision considers the impact on seven generations into the future. This Indigenous principle 
              transforms how organizations plan, invest, and measure success - moving beyond quarterly profits 
              to generational impact.
            </p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-green-300">
                <h4 className="font-medium text-green-900 mb-2">Practical Applications:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Long-term mentoring relationships that span years, not months</li>
                  <li>• Investment strategies focused on sustainable community benefit</li>
                  <li>• Educational programs designed for intergenerational knowledge transfer</li>
                  <li>• Policy advocacy that considers environmental and social legacy</li>
                </ul>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p className="text-xs text-green-700 font-medium">Key Documents:</p>
                <p className="text-xs text-green-600">Hoodie Economics, IMAGI-NATION Investment Deck, Federal Government Proposal</p>
              </div>
            </div>
          </div>

          {/* Relational Economics */}
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🤝</span>
              <h3 className="text-xl font-semibold text-purple-900">Relational Economics</h3>
            </div>
            <p className="text-purple-800 mb-4">
              Value creation through relationships rather than extraction. This approach prioritizes community 
              benefit, reciprocity, and collective wellbeing over individual profit maximization.
            </p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-purple-300">
                <h4 className="font-medium text-purple-900 mb-2">Core Principles:</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Reciprocity: mutual benefit in all exchanges</li>
                  <li>• Community ownership of resources and outcomes</li>
                  <li>• Wealth redistribution through relationship networks</li>
                  <li>• Success measured by collective flourishing</li>
                </ul>
              </div>
              <div className="bg-purple-100 p-3 rounded">
                <p className="text-xs text-purple-700 font-medium">Key Documents:</p>
                <p className="text-xs text-purple-600">Hoodie Economics, Letter to Billionaires, 100M Capital Shift</p>
              </div>
            </div>
          </div>

          {/* Community-Centered Approach */}
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🏘️</span>
              <h3 className="text-xl font-semibold text-orange-900">Community-Centered Approach</h3>
            </div>
            <p className="text-orange-800 mb-4">
              Indigenous custodianship places community at the center of all decision-making. This means consulting 
              with and prioritizing the needs of the collective, especially those most marginalized.
            </p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-orange-300">
                <h4 className="font-medium text-orange-900 mb-2">Implementation Methods:</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Community consultation before program design</li>
                  <li>• Shared leadership and decision-making structures</li>
                  <li>• Resources directed to community-identified priorities</li>
                  <li>• Success defined by community wellbeing indicators</li>
                </ul>
              </div>
              <div className="bg-orange-100 p-3 rounded">
                <p className="text-xs text-orange-700 font-medium">Key Documents:</p>
                <p className="text-xs text-orange-600">We-full, Townhall Transcript, No Shame at AIME</p>
              </div>
            </div>
          </div>

          {/* Cultural Protocols & Respect */}
          <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🪶</span>
              <h3 className="text-xl font-semibold text-indigo-900">Cultural Protocols & Respect</h3>
            </div>
            <p className="text-indigo-800 mb-4">
              All work is grounded in respect for Indigenous knowledge systems, cultural protocols, and 
              the understanding that this wisdom has been developed over thousands of years.
            </p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-indigo-300">
                <h4 className="font-medium text-indigo-900 mb-2">Respectful Practices:</h4>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• Acknowledgment of Traditional Owners and Country</li>
                  <li>• Indigenous leadership in program governance</li>
                  <li>• Cultural safety training for all staff and mentors</li>
                  <li>• Protection and preservation of cultural knowledge</li>
                </ul>
              </div>
              <div className="bg-indigo-100 p-3 rounded">
                <p className="text-xs text-indigo-700 font-medium">Key Documents:</p>
                <p className="text-xs text-indigo-600">About AIME Website, Earth Commons Interview, AIME Full Report</p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Section */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How These Foundations Integrate</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔄</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Cyclical Thinking</h4>
              <p className="text-sm text-gray-600">
                All principles work together in cycles of relationship, reflection, and renewal
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚖️</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Balance & Harmony</h4>
              <p className="text-sm text-gray-600">
                Individual growth balanced with community wellbeing and environmental sustainability
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🌟</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Holistic Impact</h4>
              <p className="text-sm text-gray-600">
                Transformation that addresses spiritual, emotional, mental, and physical dimensions
              </p>
            </div>
          </div>
        </div>

        {/* Key Quotes Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wisdom from AIME's Journey</h3>
          <div className="space-y-4">
            <blockquote className="border-l-4 border-green-400 pl-4 py-2 bg-green-50 rounded-r">
              <p className="text-green-800 italic mb-2">
                "We are not trying to fix Indigenous kids. We are trying to unlock the system that has been 
                designed to fail them, and in doing so, unlock the potential for all kids."
              </p>
              <cite className="text-green-600 text-sm">- Jack Manning Bancroft, AIME Founder</cite>
            </blockquote>
            <blockquote className="border-l-4 border-purple-400 pl-4 py-2 bg-purple-50 rounded-r">
              <p className="text-purple-800 italic mb-2">
                "Indigenous custodianship teaches us that we are all connected - to each other, to the land, 
                and to future generations. This connection is the foundation of all sustainable change."
              </p>
              <cite className="text-purple-600 text-sm">- AIME Philosophy Document</cite>
            </blockquote>
            <blockquote className="border-l-4 border-orange-400 pl-4 py-2 bg-orange-50 rounded-r">
              <p className="text-orange-800 italic mb-2">
                "When we center community in our decision-making, we create solutions that work for everyone, 
                not just the privileged few."
              </p>
              <cite className="text-orange-600 text-sm">- AIME Community Engagement Report</cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}

function AIMEMethodology({ onComplete, onBookmark, isBookmarked }: SectionProps) {
  return (
    <section id="aime-methodology" className="mb-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="text-4xl mr-4">🎯</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AIME Methodology</h2>
              <p className="text-gray-600">The systematic approach to transformation through mentoring</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onBookmark}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isBookmarked ? '★' : '☆'}
            </button>
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Mark Complete
            </button>
          </div>
        </div>
        {/* Introduction */}
        <div className="mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            AIME's methodology is built on 20 years of experience creating transformational change through 
            Indigenous custodianship-informed mentoring. This systematic approach unlocks imagination, builds 
            relationships, and creates sustainable pathways to opportunity.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-blue-800 italic">
              "Our methodology isn't about fixing people - it's about unlocking systems and creating 
              conditions where everyone can flourish through the power of relationships and imagination." 
              - AIME Core Philosophy
            </p>
          </div>
        </div>

        {/* Interactive Methodology Framework */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">The AIME Methodology Framework</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Mentoring as Foundation */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🤝</span>
                <h4 className="text-lg font-semibold text-blue-900">Mentoring as Foundation</h4>
              </div>
              <p className="text-blue-800 mb-4">
                AIME's core methodology centers on mentoring relationships that unlock imagination and potential. 
                This isn't traditional mentoring - it's relationship-first, culturally grounded, and focused on 
                systemic change rather than individual advancement alone.
              </p>
              
              {/* Interactive Elements */}
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border border-blue-300">
                  <h5 className="font-medium text-blue-900 mb-2">🔄 Relationship-First Approach</h5>
                  <p className="text-sm text-blue-800 mb-2">Building genuine connections before focusing on outcomes</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-blue-700">Trust → Connection → Growth → Impact</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-blue-300">
                  <h5 className="font-medium text-blue-900 mb-2">✨ Imagination-Centered</h5>
                  <p className="text-sm text-blue-800 mb-2">Unlocking creative potential as the path to transformation</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-xs text-blue-700">Dream → Design → Deliver → Develop</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-blue-300">
                  <h5 className="font-medium text-blue-900 mb-2">🌐 Systems-Aware</h5>
                  <p className="text-sm text-blue-800 mb-2">Understanding individual change within broader systems context</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-blue-700">Individual → Community → Systems → Society</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Joy Corps System */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🎉</span>
                <h4 className="text-lg font-semibold text-purple-900">Joy Corps System</h4>
              </div>
              <p className="text-purple-800 mb-4">
                The organizational transformation methodology that embeds Indigenous custodianship into institutions. 
                Joy Corps creates cultural change that prioritizes relationships, community benefit, and long-term thinking.
              </p>
              
              {/* Implementation Pathway */}
              <div className="bg-white p-4 rounded-lg border border-purple-300 mb-4">
                <h5 className="font-medium text-purple-900 mb-3">Implementation Pathway:</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-800">1</div>
                    <span className="text-sm text-purple-800">Leadership immersion in Indigenous custodianship</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-800">2</div>
                    <span className="text-sm text-purple-800">Cultural assessment and gap analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-800">3</div>
                    <span className="text-sm text-purple-800">Mentoring networks establishment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-800">4</div>
                    <span className="text-sm text-purple-800">Seven-generation planning integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-800">5</div>
                    <span className="text-sm text-purple-800">Community-centered policy development</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-100 p-3 rounded">
                <p className="text-xs text-purple-700 font-medium">Success Metrics:</p>
                <p className="text-xs text-purple-600">Relationship quality, community wellbeing, long-term sustainability</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transformation Framework */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Transformation Framework</h3>
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Phase 1: Connect */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h4 className="font-semibold text-green-900 mb-2">1. Connect</h4>
                <p className="text-sm text-green-800 mb-3">
                  Build authentic relationships based on trust, respect, and shared humanity
                </p>
                <div className="bg-white p-3 rounded border border-green-300">
                  <p className="text-xs text-green-700 font-medium">Key Activities:</p>
                  <ul className="text-xs text-green-600 mt-1 space-y-1">
                    <li>• Cultural introductions</li>
                    <li>• Story sharing</li>
                    <li>• Trust building</li>
                  </ul>
                </div>
              </div>

              {/* Phase 2: Inspire */}
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h4 className="font-semibold text-yellow-900 mb-2">2. Inspire</h4>
                <p className="text-sm text-yellow-800 mb-3">
                  Unlock imagination and help people see new possibilities for their future
                </p>
                <div className="bg-white p-3 rounded border border-yellow-300">
                  <p className="text-xs text-yellow-700 font-medium">Key Activities:</p>
                  <ul className="text-xs text-yellow-600 mt-1 space-y-1">
                    <li>• Vision creation</li>
                    <li>• Possibility mapping</li>
                    <li>• Dream activation</li>
                  </ul>
                </div>
              </div>

              {/* Phase 3: Equip */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛠️</span>
                </div>
                <h4 className="font-semibold text-blue-900 mb-2">3. Equip</h4>
                <p className="text-sm text-blue-800 mb-3">
                  Provide practical tools, skills, and knowledge needed for transformation
                </p>
                <div className="bg-white p-3 rounded border border-blue-300">
                  <p className="text-xs text-blue-700 font-medium">Key Activities:</p>
                  <ul className="text-xs text-blue-600 mt-1 space-y-1">
                    <li>• Skill development</li>
                    <li>• Resource provision</li>
                    <li>• Network building</li>
                  </ul>
                </div>
              </div>

              {/* Phase 4: Sustain */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔄</span>
                </div>
                <h4 className="font-semibold text-purple-900 mb-2">4. Sustain</h4>
                <p className="text-sm text-purple-800 mb-3">
                  Create ongoing support systems and pathways for continued growth
                </p>
                <div className="bg-white p-3 rounded border border-purple-300">
                  <p className="text-xs text-purple-700 font-medium">Key Activities:</p>
                  <ul className="text-xs text-purple-600 mt-1 space-y-1">
                    <li>• Peer networks</li>
                    <li>• Ongoing mentoring</li>
                    <li>• System integration</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Relationship Building Methodology */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Relationship Building Methodology</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">💝</span>
                <h4 className="font-medium text-orange-900">Reciprocal Relationships</h4>
              </div>
              <p className="text-sm text-orange-800 mb-3">
                Both mentors and mentees learn from each other, creating mutual benefit and shared growth.
              </p>
              <div className="bg-white p-3 rounded border border-orange-300">
                <p className="text-xs text-orange-700 font-medium">Principles:</p>
                <ul className="text-xs text-orange-600 mt-1 space-y-1">
                  <li>• Mutual respect and learning</li>
                  <li>• Shared power and decision-making</li>
                  <li>• Cultural exchange and understanding</li>
                </ul>
              </div>
            </div>

            <div className="bg-teal-50 rounded-lg p-6 border border-teal-200">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🌍</span>
                <h4 className="font-medium text-teal-900">Cultural Safety</h4>
              </div>
              <p className="text-sm text-teal-800 mb-3">
                Creating environments where Indigenous culture is respected, valued, and integrated into all interactions.
              </p>
              <div className="bg-white p-3 rounded border border-teal-300">
                <p className="text-xs text-teal-700 font-medium">Elements:</p>
                <ul className="text-xs text-teal-600 mt-1 space-y-1">
                  <li>• Cultural protocols recognition</li>
                  <li>• Indigenous leadership priority</li>
                  <li>• Safe space creation</li>
                </ul>
              </div>
            </div>

            <div className="bg-rose-50 rounded-lg p-6 border border-rose-200">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🎯</span>
                <h4 className="font-medium text-rose-900">Outcome Focus</h4>
              </div>
              <p className="text-sm text-rose-800 mb-3">
                Relationships are purposeful, working toward specific goals while maintaining authentic connection.
              </p>
              <div className="bg-white p-3 rounded border border-rose-300">
                <p className="text-xs text-rose-700 font-medium">Outcomes:</p>
                <ul className="text-xs text-rose-600 mt-1 space-y-1">
                  <li>• Educational achievement</li>
                  <li>• Career pathway development</li>
                  <li>• Community leadership growth</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Practical Applications */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Practical Applications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">🏫 In Education</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>University mentoring programs connecting Indigenous students with role models</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Imagination-based curriculum development in schools</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Teacher training in culturally responsive pedagogy</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">🏢 In Organizations</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Leadership development through Indigenous custodianship principles</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Workplace culture transformation using Joy Corps methodology</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Employee mentoring networks based on reciprocal relationships</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights from 20 Years</h3>
          <div className="space-y-4">
            <blockquote className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50 rounded-r">
              <p className="text-blue-800 italic mb-2">
                "The magic happens in the relationship. When you create genuine connection first, 
                everything else becomes possible - learning, growth, transformation, and systemic change."
              </p>
              <cite className="text-blue-600 text-sm">- AIME Mentoring Handbook</cite>
            </blockquote>
            <blockquote className="border-l-4 border-purple-400 pl-4 py-2 bg-purple-50 rounded-r">
              <p className="text-purple-800 italic mb-2">
                "Joy Corps isn't about making people happy - it's about creating the conditions 
                where joy naturally emerges through meaningful work, authentic relationships, and purposeful impact."
              </p>
              <cite className="text-purple-600 text-sm">- Joy Corps Implementation Guide</cite>
            </blockquote>
            <blockquote className="border-l-4 border-green-400 pl-4 py-2 bg-green-50 rounded-r">
              <p className="text-green-800 italic mb-2">
                "Transformation isn't a linear process. It's cyclical, relational, and requires both 
                individual growth and systems change to be sustainable."
              </p>
              <cite className="text-green-600 text-sm">- AIME Methodology Research</cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}

function EvolutionStory({ onComplete, onBookmark, isBookmarked }: SectionProps) {
  return (
    <section id="evolution-story" className="mb-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="text-4xl mr-4">📈</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Evolution of AIME</h2>
              <p className="text-gray-600">20 years of growth, learning, and transformation</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onBookmark}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isBookmarked ? '★' : '☆'}
            </button>
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Mark Complete
            </button>
          </div>
        </div>
        {/* Introduction */}
        <div className="mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            From a small mentoring program in Sydney to a global movement reaching thousands, 
            AIME's 20-year journey demonstrates the power of Indigenous custodianship applied to contemporary challenges. 
            This evolution story reveals key lessons about scaling impact while staying true to core values.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
            <p className="text-amber-800 italic">
              "We didn't set out to build an organization - we set out to build relationships. 
              The organization grew naturally from the strength of those connections and the 
              impact they created." - Jack Manning Bancroft, AIME Founder
            </p>
          </div>
        </div>

        {/* Interactive Timeline */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">AIME's Journey: 2005-2025</h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-green-400"></div>
            
            {/* Timeline Items */}
            <div className="space-y-8">
              
              {/* 2005: Foundation */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl">🌱</span>
                </div>
                <div className="ml-6 bg-blue-50 rounded-lg p-6 border border-blue-200 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-blue-900">2005: The Beginning</h4>
                    <span className="text-sm text-blue-600 font-medium">Foundation</span>
                  </div>
                  <p className="text-blue-800 mb-3">
                    Jack Manning Bancroft starts AIME with a simple idea: connect Indigenous high school 
                    students with university student mentors to bridge the gap to higher education.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border border-blue-300">
                      <p className="text-xs text-blue-700 font-medium">Key Milestone:</p>
                      <p className="text-xs text-blue-600">First mentoring program launched at University of Sydney</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-blue-300">
                      <p className="text-xs text-blue-700 font-medium">Impact:</p>
                      <p className="text-xs text-blue-600">25 Indigenous students, 25 mentors</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2008: First Expansion */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl">🚀</span>
                </div>
                <div className="ml-6 bg-green-50 rounded-lg p-6 border border-green-200 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-green-900">2008: First Expansion</h4>
                    <span className="text-sm text-green-600 font-medium">Growth</span>
                  </div>
                  <p className="text-green-800 mb-3">
                    AIME expands to multiple universities across Australia, developing the core methodology 
                    that would become the foundation for all future programs.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border border-green-300">
                      <p className="text-xs text-green-700 font-medium">Key Milestone:</p>
                      <p className="text-xs text-green-600">Programs in 5 universities across 3 states</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-green-300">
                      <p className="text-xs text-green-700 font-medium">Learning:</p>
                      <p className="text-xs text-green-600">Relationship-first approach proves most effective</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2012: Methodology Formalization */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="ml-6 bg-purple-50 rounded-lg p-6 border border-purple-200 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-purple-900">2012: Methodology Formalization</h4>
                    <span className="text-sm text-purple-600 font-medium">Systematization</span>
                  </div>
                  <p className="text-purple-800 mb-3">
                    AIME formalizes its Indigenous custodianship-informed methodology, creating frameworks 
                    that can be replicated and scaled while maintaining cultural integrity.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border border-purple-300">
                      <p className="text-xs text-purple-700 font-medium">Key Milestone:</p>
                      <p className="text-xs text-purple-600">First AIME Methodology Handbook published</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-purple-300">
                      <p className="text-xs text-purple-700 font-medium">Innovation:</p>
                      <p className="text-xs text-purple-600">Imagination-based curriculum development</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2015: International Recognition */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl">🌍</span>
                </div>
                <div className="ml-6 bg-yellow-50 rounded-lg p-6 border border-yellow-200 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-yellow-900">2015: International Recognition</h4>
                    <span className="text-sm text-yellow-600 font-medium">Global Impact</span>
                  </div>
                  <p className="text-yellow-800 mb-3">
                    AIME gains international recognition for its innovative approach, beginning partnerships 
                    with organizations worldwide and sharing Indigenous custodianship globally.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border border-yellow-300">
                      <p className="text-xs text-yellow-700 font-medium">Key Milestone:</p>
                      <p className="text-xs text-yellow-600">First international partnerships established</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-yellow-300">
                      <p className="text-xs text-yellow-700 font-medium">Recognition:</p>
                      <p className="text-xs text-yellow-600">Multiple awards for educational innovation</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2018: Hoodie Economics */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl">💡</span>
                </div>
                <div className="ml-6 bg-indigo-50 rounded-lg p-6 border border-indigo-200 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-indigo-900">2018: Hoodie Economics</h4>
                    <span className="text-sm text-indigo-600 font-medium">Economic Innovation</span>
                  </div>
                  <p className="text-indigo-800 mb-3">
                    AIME introduces Hoodie Economics - a revolutionary economic model based on Indigenous 
                    principles of reciprocity, relationship, and community benefit.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border border-indigo-300">
                      <p className="text-xs text-indigo-700 font-medium">Key Milestone:</p>
                      <p className="text-xs text-indigo-600">Hoodie Economics framework launched</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-indigo-300">
                      <p className="text-xs text-indigo-700 font-medium">Impact:</p>
                      <p className="text-xs text-indigo-600">New model for sustainable social enterprise</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2020: Digital Transformation */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl">💻</span>
                </div>
                <div className="ml-6 bg-teal-50 rounded-lg p-6 border border-teal-200 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-teal-900">2020: Digital Transformation</h4>
                    <span className="text-sm text-teal-600 font-medium">Adaptation</span>
                  </div>
                  <p className="text-teal-800 mb-3">
                    COVID-19 accelerates AIME's digital transformation, leading to innovative online 
                    mentoring platforms while maintaining the relationship-first approach.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border border-teal-300">
                      <p className="text-xs text-teal-700 font-medium">Key Milestone:</p>
                      <p className="text-xs text-teal-600">Digital mentoring platform launched</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-teal-300">
                      <p className="text-xs text-teal-700 font-medium">Learning:</p>
                      <p className="text-xs text-teal-600">Relationships transcend physical boundaries</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2023: IMAGI-NATION */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl">✨</span>
                </div>
                <div className="ml-6 bg-rose-50 rounded-lg p-6 border border-rose-200 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-rose-900">2023: IMAGI-NATION Vision</h4>
                    <span className="text-sm text-rose-600 font-medium">Global Movement</span>
                  </div>
                  <p className="text-rose-800 mb-3">
                    AIME launches IMAGI-NATION, a global movement to shift $100M toward Indigenous-led 
                    solutions and create systemic change through imagination and relationships.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border border-rose-300">
                      <p className="text-xs text-rose-700 font-medium">Key Milestone:</p>
                      <p className="text-xs text-rose-600">$100M capital shift initiative launched</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-rose-300">
                      <p className="text-xs text-rose-700 font-medium">Vision:</p>
                      <p className="text-xs text-rose-600">Global systems transformation through Indigenous custodianship</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2025: Knowledge Universe */}
              <div className="relative flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl">🌌</span>
                </div>
                <div className="ml-6 bg-emerald-50 rounded-lg p-6 border border-emerald-200 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-emerald-900">2025: Knowledge Universe</h4>
                    <span className="text-sm text-emerald-600 font-medium">Present</span>
                  </div>
                  <p className="text-emerald-800 mb-3">
                    AIME creates a comprehensive knowledge universe, making 20 years of Indigenous custodianship 
                    and transformational methodology accessible to changemakers worldwide.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border border-emerald-300">
                      <p className="text-xs text-emerald-700 font-medium">Key Milestone:</p>
                      <p className="text-xs text-emerald-600">Comprehensive knowledge platform launched</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-emerald-300">
                      <p className="text-xs text-emerald-700 font-medium">Impact:</p>
                      <p className="text-xs text-emerald-600">Global access to Indigenous custodianship frameworks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Lessons Learned */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Lessons from 20 Years</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🎯</span>
                <h4 className="font-semibold text-blue-900">Stay True to Core Values</h4>
              </div>
              <p className="text-blue-800 text-sm mb-3">
                Despite massive growth and change, AIME's commitment to Indigenous custodianship, 
                relationship-first approaches, and community benefit has remained constant.
              </p>
              <div className="bg-white p-3 rounded border border-blue-300">
                <p className="text-xs text-blue-700 font-medium">Key Insight:</p>
                <p className="text-xs text-blue-600">
                  "Values aren't just words on a wall - they're the foundation that allows 
                  you to scale impact without losing your soul."
                </p>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🌱</span>
                <h4 className="font-semibold text-green-900">Organic Growth Works</h4>
              </div>
              <p className="text-green-800 text-sm mb-3">
                AIME's growth has been organic, driven by relationships and impact rather than 
                aggressive expansion strategies or external pressure.
              </p>
              <div className="bg-white p-3 rounded border border-green-300">
                <p className="text-xs text-green-700 font-medium">Key Insight:</p>
                <p className="text-xs text-green-600">
                  "When you focus on doing good work and building strong relationships, 
                  growth happens naturally and sustainably."
                </p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🔄</span>
                <h4 className="font-semibold text-purple-900">Adaptation is Essential</h4>
              </div>
              <p className="text-purple-800 text-sm mb-3">
                From in-person to digital, local to global, AIME has continuously adapted 
                its methods while maintaining its core methodology and values.
              </p>
              <div className="bg-white p-3 rounded border border-purple-300">
                <p className="text-xs text-purple-700 font-medium">Key Insight:</p>
                <p className="text-xs text-purple-600">
                  "Flexibility in methods combined with consistency in values creates 
                  resilience and enables continuous innovation."
                </p>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🤝</span>
                <h4 className="font-semibold text-orange-900">Relationships Scale</h4>
              </div>
              <p className="text-orange-800 text-sm mb-3">
                The relationship-first approach that worked with 25 students has proven 
                effective at scale, reaching thousands while maintaining personal connection.
              </p>
              <div className="bg-white p-3 rounded border border-orange-300">
                <p className="text-xs text-orange-700 font-medium">Key Insight:</p>
                <p className="text-xs text-orange-600">
                  "Authentic relationships aren't limited by scale - they're the foundation 
                  that makes meaningful scale possible."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Organizational Development Insights */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizational Development Insights</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <span className="text-blue-500 mr-2">📊</span>
                Growth Metrics
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 25 students (2005) → 10,000+ students (2025)</li>
                <li>• 1 university → 50+ institutions globally</li>
                <li>• 1 program → 15+ program types</li>
                <li>• Local impact → Global movement</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <span className="text-green-500 mr-2">🏗️</span>
                Structural Evolution
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Volunteer-led → Professional organization</li>
                <li>• Single program → Diversified portfolio</li>
                <li>• Grant-dependent → Multiple revenue streams</li>
                <li>• Local team → Global network</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <span className="text-purple-500 mr-2">🎯</span>
                Impact Evolution
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Individual mentoring → Systems change</li>
                <li>• Educational outcomes → Life transformation</li>
                <li>• Student support → Community development</li>
                <li>• Local change → Global influence</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SystemsEconomics({ onComplete, onBookmark, isBookmarked }: SectionProps) {
  return (
    <section id="systems-economics" className="mb-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="text-4xl mr-4">🔄</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Systems & Economics</h2>
              <p className="text-gray-600">Hoodie economics and relational value systems</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onBookmark}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isBookmarked ? '★' : '☆'}
            </button>
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Mark Complete
            </button>
          </div>
        </div>
        <div className="text-gray-700">
          <p className="mb-4">Content for Systems & Economics will be implemented in the next tasks...</p>
        </div>
      </div>
    </section>
  )
}

function ImagiNationVision({ onComplete, onBookmark, isBookmarked }: SectionProps) {
  return (
    <section id="imagi-nation-vision" className="mb-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="text-4xl mr-4">✨</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">IMAGI-NATION Vision</h2>
              <p className="text-gray-600">Global movement and $100M transformation vision</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onBookmark}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isBookmarked ? '★' : '☆'}
            </button>
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Mark Complete
            </button>
          </div>
        </div>
        <div className="text-gray-700">
          <p className="mb-4">Content for IMAGI-NATION Vision will be implemented in the next tasks...</p>
        </div>
      </div>
    </section>
  )
}

function ImplementationPathways({ onComplete, onBookmark, isBookmarked }: SectionProps) {
  return (
    <section id="implementation-pathways" className="mb-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="text-4xl mr-4">🛠️</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Implementation Pathways</h2>
              <p className="text-gray-600">Practical guidance for applying AIME principles</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onBookmark}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isBookmarked ? '★' : '☆'}
            </button>
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Mark Complete
            </button>
          </div>
        </div>
        <div className="text-gray-700">
          <p className="mb-4">Content for Implementation Pathways will be implemented in the next tasks...</p>
        </div>
      </div>
    </section>
  )
}

// Navigation Hub Component
function NavigationHub({ sections, currentSection, completedSections, onSectionSelect }: NavigationHubProps) {
  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Navigate the AIME Story & System</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionSelect(section.id)}
            className={`flex items-start space-x-3 p-4 bg-white rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
              currentSection === section.id 
                ? 'border-blue-500 bg-blue-50' 
                : completedSections.includes(section.id)
                ? 'border-green-300 bg-green-50'
                : 'border-blue-200 hover:border-blue-400'
            }`}
          >
            <div className="flex-shrink-0">
              <span className="text-2xl">{section.icon}</span>
              {completedSections.includes(section.id) && (
                <div className="text-green-600 text-xs mt-1">✓</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-blue-900 text-sm mb-1">{section.title}</div>
              <div className="text-xs text-blue-700 mb-2">{section.description}</div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{section.estimatedReadTime} min read</span>
                <span>{section.documentCount} docs</span>
              </div>
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {section.keyTopics.slice(0, 2).map((topic, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {topic}
                    </span>
                  ))}
                  {section.keyTopics.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{section.keyTopics.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Knowledge Synthesis Component
function KnowledgeSynthesis() {
  const [synthesisState, setSynthesisState] = useState<KnowledgeSynthesisState>({
    currentSection: null,
    completedSections: [],
    searchQuery: '',
    bookmarkedSections: []
  })

  const synthesisections: SynthesisSection[] = [
    {
      id: 'indigenous-foundations',
      title: 'Indigenous Foundations',
      icon: '🌱',
      description: 'The bedrock wisdom that guides everything AIME does',
      estimatedReadTime: 8,
      keyTopics: ['Seven-Generation Thinking', 'Relational Economics', 'Community-Centered Approach', 'Cultural Protocols'],
      documentCount: 12
    },
    {
      id: 'aime-methodology',
      title: 'AIME Methodology',
      icon: '🎯',
      description: 'The systematic approach to transformation through mentoring',
      estimatedReadTime: 10,
      keyTopics: ['Mentoring Framework', 'Joy Corps System', 'Transformation Process', 'Relationship Building'],
      documentCount: 15
    },
    {
      id: 'evolution-story',
      title: 'Evolution of AIME',
      icon: '📈',
      description: '20 years of growth, learning, and transformation',
      estimatedReadTime: 12,
      keyTopics: ['Origins & Founding', 'Key Milestones', 'Lessons Learned', 'Organizational Development'],
      documentCount: 18
    },
    {
      id: 'systems-economics',
      title: 'Systems & Economics',
      icon: '🔄',
      description: 'Hoodie economics and relational value systems',
      estimatedReadTime: 9,
      keyTopics: ['Hoodie Economics', 'Relational Value', 'Alternative Models', 'Impact Measurement'],
      documentCount: 14
    },
    {
      id: 'imagi-nation-vision',
      title: 'IMAGI-NATION Vision',
      icon: '✨',
      description: 'Global movement and $100M transformation vision',
      estimatedReadTime: 7,
      keyTopics: ['Global Movement', '$100M Capital Shift', 'Systemic Change', 'Future Pathways'],
      documentCount: 10
    },
    {
      id: 'implementation-pathways',
      title: 'Implementation Pathways',
      icon: '🛠️',
      description: 'Practical guidance for applying AIME principles',
      estimatedReadTime: 11,
      keyTopics: ['Getting Started', 'Context Applications', 'Tools & Frameworks', 'Assessment Methods'],
      documentCount: 16
    }
  ]

  const handleSectionSelect = (sectionId: string) => {
    setSynthesisState(prev => ({
      ...prev,
      currentSection: sectionId
    }))
    
    // Scroll to section
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const markSectionComplete = (sectionId: string) => {
    setSynthesisState(prev => ({
      ...prev,
      completedSections: [...prev.completedSections.filter(id => id !== sectionId), sectionId]
    }))
  }

  const toggleBookmark = (sectionId: string) => {
    setSynthesisState(prev => ({
      ...prev,
      bookmarkedSections: prev.bookmarkedSections.includes(sectionId)
        ? prev.bookmarkedSections.filter(id => id !== sectionId)
        : [...prev.bookmarkedSections, sectionId]
    }))
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          AIME Knowledge Synthesis
        </h2>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          A unified explanation of AIME's entire system - synthesizing 20 years of Indigenous custodianship, 
          mentoring methodology, and systems transformation into core sections with headings and summaries.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
          <div className="text-sm text-gray-600">
            {synthesisState.completedSections.length} of {synthesisections.length} sections completed
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(synthesisState.completedSections.length / synthesisections.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600">
          Estimated total reading time: {synthesisections.reduce((total, section) => total + section.estimatedReadTime, 0)} minutes
        </div>
      </div>

      {/* Navigation Hub */}
      <NavigationHub 
        sections={synthesisections}
        currentSection={synthesisState.currentSection}
        completedSections={synthesisState.completedSections}
        onSectionSelect={handleSectionSelect}
      />

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={synthesisState.searchQuery}
            onChange={(e) => setSynthesisState(prev => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search within the knowledge synthesis..."
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-12">
        <IndigenousFoundations 
          onComplete={() => markSectionComplete('indigenous-foundations')}
          onBookmark={() => toggleBookmark('indigenous-foundations')}
          isBookmarked={synthesisState.bookmarkedSections.includes('indigenous-foundations')}
        />
        
        <AIMEMethodology 
          onComplete={() => markSectionComplete('aime-methodology')}
          onBookmark={() => toggleBookmark('aime-methodology')}
          isBookmarked={synthesisState.bookmarkedSections.includes('aime-methodology')}
        />
        
        <EvolutionStory 
          onComplete={() => markSectionComplete('evolution-story')}
          onBookmark={() => toggleBookmark('evolution-story')}
          isBookmarked={synthesisState.bookmarkedSections.includes('evolution-story')}
        />
        
        <SystemsEconomics 
          onComplete={() => markSectionComplete('systems-economics')}
          onBookmark={() => toggleBookmark('systems-economics')}
          isBookmarked={synthesisState.bookmarkedSections.includes('systems-economics')}
        />
        
        <ImagiNationVision 
          onComplete={() => markSectionComplete('imagi-nation-vision')}
          onBookmark={() => toggleBookmark('imagi-nation-vision')}
          isBookmarked={synthesisState.bookmarkedSections.includes('imagi-nation-vision')}
        />
        
        <ImplementationPathways 
          onComplete={() => markSectionComplete('implementation-pathways')}
          onBookmark={() => toggleBookmark('implementation-pathways')}
          isBookmarked={synthesisState.bookmarkedSections.includes('implementation-pathways')}
        />
      </div>
    </div>
  )
}

export default function FramingDashboard() {
  const [framingData, setFramingData] = useState<FramingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedConcept, setSelectedConcept] = useState<string>('')
  
  // New upload functionality
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'library' | 'synthesis'>('dashboard')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadText, setUploadText] = useState<string>('')
  const [processing, setProcessing] = useState(false)
  const [processingResult, setProcessingResult] = useState<any>(null)
  
  // Document library functionality
  const [allDocuments, setAllDocuments] = useState<any[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all')
  const [libraryLoading, setLibraryLoading] = useState(false)

  useEffect(() => {
    loadFramingData()
    if (activeTab === 'library') {
      loadAllDocuments()
    }
  }, [activeTab])

  const loadFramingData = async () => {
    try {
      const response = await fetch('/api/framing?type=overview&limit=20')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setFramingData(data.data)
        }
      }
    } catch (error) {
      console.error('Failed to load framing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Read file content for text files
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadText(e.target?.result as string || '')
        }
        reader.readAsText(file)
      }
    }
  }

  const processDocument = async () => {
    if (!uploadText.trim() && !uploadedFile) {
      alert('Please provide text content or upload a file')
      return
    }

    setProcessing(true)
    setProcessingResult(null)

    try {
      // For now, we'll do client-side processing since the API only reads pre-processed files
      const content = uploadText.trim() || 'File content processing...'
      const result = await processDocumentClientSide(content, uploadedFile?.name || 'Uploaded Document')
      setProcessingResult(result)
      setActiveTab('dashboard') // Switch to results view
    } catch (error) {
      console.error('Processing failed:', error)
      alert('Document processing failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  // Client-side document processing (simplified version)
  const processDocumentClientSide = async (content: string, title: string) => {
    // Simple concept extraction
    const words = content.toLowerCase().split(/\W+/).filter(word => word.length > 3)
    const wordCount = words.length
    
    // Key AIME concepts to look for
    const aimeConcepts = [
      'indigenous', 'mentoring', 'hoodie', 'economics', 'systems', 'transformation',
      'imagination', 'relationships', 'community', 'wisdom', 'knowledge', 'learning',
      'joy', 'corps', 'imagi-nation', 'seven-generation', 'reciprocity', 'connection'
    ]
    
    const foundConcepts = aimeConcepts.filter(concept => 
      content.toLowerCase().includes(concept)
    )
    
    // Simple categorization
    let category = 'uncategorized'
    if (content.toLowerCase().includes('economic') || content.toLowerCase().includes('hoodie')) {
      category = 'economic'
    } else if (content.toLowerCase().includes('vision') || content.toLowerCase().includes('future')) {
      category = 'vision'
    } else if (content.toLowerCase().includes('strategy') || content.toLowerCase().includes('plan')) {
      category = 'strategic'
    } else if (content.toLowerCase().includes('operation') || content.toLowerCase().includes('implement')) {
      category = 'operational'
    } else if (content.toLowerCase().includes('communication') || content.toLowerCase().includes('story')) {
      category = 'communication'
    }
    
    // Extract key quotes (sentences with key concepts)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
    const keyQuotes = sentences.filter(sentence => 
      aimeConcepts.some(concept => sentence.toLowerCase().includes(concept))
    ).slice(0, 3)
    
    return {
      id: Date.now().toString(),
      title,
      category,
      concepts: foundConcepts,
      keyQuotes,
      wordCount,
      processedAt: new Date().toISOString(),
      summary: `Document contains ${foundConcepts.length} AIME concepts and ${wordCount} words. Categorized as ${category}.`
    }
  }

  const loadAllDocuments = async () => {
    setLibraryLoading(true)
    try {
      const response = await fetch('/api/framing?type=documents&limit=100')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAllDocuments(data.data.documents)
          setFilteredDocuments(data.data.documents)
        }
      }
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setLibraryLoading(false)
    }
  }

  const filterDocuments = () => {
    let filtered = allDocuments

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.concepts.some(concept => concept.toLowerCase().includes(query)) ||
        doc.keyQuotes.some(quote => quote.toLowerCase().includes(query))
      )
    }

    // Filter by category
    if (selectedCategoryFilter !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategoryFilter)
    }

    setFilteredDocuments(filtered)
  }

  useEffect(() => {
    filterDocuments()
  }, [searchQuery, selectedCategoryFilter, allDocuments])

  const getDocumentUrl = (doc: any) => {
    // Try to create a link to the original document
    if (doc.filename) {
      return `/docs/Framing_docs/${encodeURIComponent(doc.filename)}`
    }
    return null
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      vision: 'bg-purple-100 text-purple-800 border-purple-200',
      economic: 'bg-green-100 text-green-800 border-green-200',
      strategic: 'bg-blue-100 text-blue-800 border-blue-200',
      operational: 'bg-orange-100 text-orange-800 border-orange-200',
      communication: 'bg-pink-100 text-pink-800 border-pink-200',
      uncategorized: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[category as keyof typeof colors] || colors.uncategorized
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      vision: '🎯',
      economic: '💰',
      strategic: '🚀',
      operational: '⚙️',
      communication: '📢',
      uncategorized: '📄'
    }
    return icons[category as keyof typeof icons] || icons.uncategorized
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading framing documents...</p>
        </div>
      </div>
    )
  }

  if (!framingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Framing Data Not Available</h2>
          <p className="text-gray-600">Please run the framing document processor first.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AIME Framing System</h1>
              <p className="text-lg text-gray-600 mt-2">
                Analyze documents through AIME's Indigenous custodianship framework
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {framingData?.summary.totalDocuments || 0}
                </div>
                <div className="text-sm text-gray-500">Documents Processed</div>
              </div>
              
              <button
                onClick={() => setActiveTab('upload')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <DocumentPlusIcon className="w-5 h-5" />
                <span>Upload Document</span>
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upload & Analyze
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'library'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Document Library
              </button>
              <button
                onClick={() => setActiveTab('synthesis')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'synthesis'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Knowledge Synthesis
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'synthesis' ? (
          <KnowledgeSynthesis />
        ) : activeTab === 'upload' ? (
          /* Upload Interface */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <CloudArrowUpIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Analyze Your Document
                </h2>
                <p className="text-gray-600">
                  Upload a document or paste text to analyze it through AIME's Indigenous custodianship framework
                </p>
              </div>

              {/* File Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Document (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept=".txt,.md,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Supports .txt, .md, .doc, .docx files
                    </p>
                  </label>
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or Paste Your Text Here
                </label>
                <textarea
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  placeholder="Paste your document content here for analysis..."
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {uploadText.length} characters • {Math.ceil(uploadText.split(' ').length / 200)} min read
                </p>
              </div>

              {/* Process Button */}
              <div className="text-center">
                <button
                  onClick={processDocument}
                  disabled={processing || (!uploadText.trim() && !uploadedFile)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <LightBulbIcon className="w-5 h-5" />
                      <span>Analyze Document</span>
                    </>
                  )}
                </button>
              </div>

              {/* Processing Result */}
              {processingResult && (
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">
                    Analysis Complete! ✅
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Title:</span> {processingResult.title}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Category:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-sm ${getCategoryColor(processingResult.category)}`}>
                        {processingResult.category}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">AIME Concepts Found:</span> {processingResult.concepts.join(', ') || 'None identified'}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Word Count:</span> {processingResult.wordCount}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Summary:</span> {processingResult.summary}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    View in Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'library' ? (
          /* Document Library */
          <div>
            {/* Library Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Document Library</h2>
              <p className="text-gray-600 mb-6">
                Browse all processed documents with summaries, themes, and links to originals
              </p>
              
              {/* Search and Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search documents, concepts, or quotes..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="md:w-48">
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="vision">Vision</option>
                    <option value="economic">Economic</option>
                    <option value="strategic">Strategic</option>
                    <option value="operational">Operational</option>
                    <option value="communication">Communication</option>
                    <option value="uncategorized">Uncategorized</option>
                  </select>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Showing {filteredDocuments.length} of {allDocuments.length} documents
              </div>
            </div>

            {/* Documents Grid */}
            {libraryLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading document library...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    {/* Document Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {doc.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(doc.category)}`}>
                            {getCategoryIcon(doc.category)} {doc.category}
                          </span>
                          <span>{doc.metadata?.wordCount || 0} words</span>
                          <span>{Math.ceil((doc.metadata?.wordCount || 0) / 200)} min read</span>
                          {doc.processedAt && (
                            <span>Processed {new Date(doc.processedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      
                      {getDocumentUrl(doc) && (
                        <a
                          href={getDocumentUrl(doc)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                        >
                          <DocumentTextIcon className="w-4 h-4" />
                          <span>View Original</span>
                        </a>
                      )}
                    </div>

                    {/* Document Summary */}
                    {doc.summary && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                        <p className="text-gray-700 leading-relaxed">
                          {truncateText(doc.summary, 300)}
                        </p>
                      </div>
                    )}

                    {/* AIME Concepts */}
                    {doc.concepts && doc.concepts.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">AIME Concepts ({doc.concepts.length})</h4>
                        <div className="flex flex-wrap gap-2">
                          {doc.concepts.slice(0, 10).map((concept, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {concept}
                            </span>
                          ))}
                          {doc.concepts.length > 10 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                              +{doc.concepts.length - 10} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Key Quotes */}
                    {doc.keyQuotes && doc.keyQuotes.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Key Quotes</h4>
                        <div className="space-y-2">
                          {doc.keyQuotes.slice(0, 2).map((quote, index) => (
                            <blockquote key={index} className="border-l-4 border-blue-200 pl-4 italic text-gray-700">
                              "{truncateText(quote.trim(), 200)}"
                            </blockquote>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Document Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Document ID: {doc.id}
                      </div>
                      <div className="flex items-center space-x-3">
                        {getDocumentUrl(doc) && (
                          <a
                            href={getDocumentUrl(doc)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Read Full Document →
                          </a>
                        )}
                        <button
                          onClick={() => {
                            // Copy concepts to clipboard for easy reference
                            navigator.clipboard.writeText(doc.concepts.join(', '))
                            alert('Concepts copied to clipboard!')
                          }}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          Copy Concepts
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredDocuments.length === 0 && !libraryLoading && (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                    <p className="text-gray-600">
                      {searchQuery || selectedCategoryFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria'
                        : 'No documents have been processed yet'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Dashboard Content */
          <div>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <DocumentTextIcon className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {framingData.summary.totalDocuments}
                    </div>
                    <div className="text-sm text-gray-500">Total Documents</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <LightBulbIcon className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {framingData.summary.totalConcepts}
                    </div>
                    <div className="text-sm text-gray-500">Key Concepts</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <FolderIcon className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {framingData.summary.categories}
                    </div>
                    <div className="text-sm text-gray-500">Categories</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <TagIcon className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {framingData.summary.avgWordsPerDoc.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Avg Words/Doc</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Concepts */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Top Concepts</h2>
                  <p className="text-sm text-gray-600 mt-1">Most frequently mentioned concepts across all documents</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {framingData.topConcepts.slice(0, 10).map((concept, index) => (
                      <div key={concept.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-800">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 capitalize">
                              {concept.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {concept.categories.join(', ')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {concept.frequency}
                          </div>
                          <div className="text-xs text-gray-500">documents</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Document Categories</h2>
                  <p className="text-sm text-gray-600 mt-1">Distribution of documents across different categories</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {framingData.categories.map((category) => (
                      <div key={category.name} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getCategoryIcon(category.name)}</span>
                            <div>
                              <div className="font-medium text-gray-900 capitalize">
                                {category.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {category.documentCount} documents
                              </div>
                            </div>
                          </div>
                          
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category.name)}`}>
                            {category.uniqueConcepts} concepts
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          Average: {category.avgWordCount.toLocaleString()} words per document
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Documents */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Documents</h2>
                <p className="text-sm text-gray-600 mt-1">Recently processed framing documents</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {framingData.recentDocuments.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-gray-900 text-sm leading-tight">
                          {doc.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(doc.category)}`}>
                          {doc.category}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {doc.conceptCount} concepts identified
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}