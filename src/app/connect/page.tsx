'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CommunityMember {
  id: string;
  name: string;
  role: string;
  location: string;
  expertise: string[];
  pathways: string[];
  contributions: number;
  lastActive: string;
}

interface MentoringOpportunity {
  id: string;
  title: string;
  type: 'seek-mentor' | 'offer-mentoring' | 'peer-learning';
  description: string;
  skills: string[];
  timeCommitment: string;
  format: string;
  postedBy: string;
  postedDate: string;
}

const communityMembers: CommunityMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Joy Corps Leader',
    location: 'Melbourne, Australia',
    expertise: ['Systems Thinking', 'Organizational Change', 'Indigenous Protocol'],
    pathways: ['Joy Corps Transformation', 'Systems Change Leadership'],
    contributions: 23,
    lastActive: '2 days ago'
  },
  {
    id: '2',
    name: 'Marcus Williams',
    role: 'Mentoring Coordinator',
    location: 'Vancouver, Canada',
    expertise: ['Youth Mentoring', 'Community Building', 'Cultural Bridge-building'],
    pathways: ['Mentoring Methodology', 'Indigenous Systems Thinking'],
    contributions: 15,
    lastActive: '1 week ago'
  },
  {
    id: '3',
    name: 'Dr. Priya Sharma',
    role: 'Learning Design Specialist',
    location: 'New Delhi, India',
    expertise: ['Curriculum Design', 'Imagination Pedagogy', 'Impact Measurement'],
    pathways: ['Imagination-Centered Learning', 'Mentoring Methodology'],
    contributions: 31,
    lastActive: '3 days ago'
  }
];

const mentoringOpportunities: MentoringOpportunity[] = [
  {
    id: '1',
    title: 'Seeking guidance on Joy Corps implementation',
    type: 'seek-mentor',
    description: 'I\'m leading organizational transformation at a mid-sized nonprofit and would love guidance from someone who has successfully implemented Joy Corps principles.',
    skills: ['Organizational change', 'Stakeholder engagement', 'Change management'],
    timeCommitment: '2-3 hours/month',
    format: 'Virtual meetings',
    postedBy: 'Alex Thompson',
    postedDate: '3 days ago'
  },
  {
    id: '2',
    title: 'Offering mentorship in Indigenous knowledge protocols',
    type: 'offer-mentoring',
    description: 'Elder knowledge keeper offering guidance on appropriate protocols for sharing Indigenous wisdom in educational contexts.',
    skills: ['Cultural protocol', 'Indigenous knowledge systems', 'Educational ethics'],
    timeCommitment: '1-2 hours/month',
    format: 'In-person or video calls',
    postedBy: 'Mary Blackfeather',
    postedDate: '1 week ago'
  },
  {
    id: '3',
    title: 'Peer learning group: Hoodie Economics study circle',
    type: 'peer-learning',
    description: 'Starting a monthly study group to explore relational economics principles and share implementation experiences.',
    skills: ['Economics', 'Systems thinking', 'Community validation'],
    timeCommitment: '3 hours/month',
    format: 'Hybrid - online with quarterly in-person',
    postedBy: 'Jordan Martinez',
    postedDate: '5 days ago'
  }
];

export default function ConnectPage() {
  const [activeTab, setActiveTab] = useState<'community' | 'mentoring' | 'collaborate'>('community');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const getOpportunityTypeLabel = (type: string) => {
    const labels = {
      'seek-mentor': 'Seeking Mentor',
      'offer-mentoring': 'Offering Mentorship',
      'peer-learning': 'Peer Learning'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getOpportunityTypeColor = (type: string) => {
    const colors = {
      'seek-mentor': 'bg-blue-50 text-blue-900 border-blue-200',
      'offer-mentoring': 'bg-green-50 text-green-900 border-green-200',
      'peer-learning': 'bg-purple-50 text-purple-900 border-purple-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 text-gray-900 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Community Connections
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Connect with fellow learners, find mentors and mentees, and collaborate 
            on implementing Indigenous wisdom and systems thinking in your context.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-12">
          <div className="flex space-x-8">
            {[
              { key: 'community', label: 'Community Members' },
              { key: 'mentoring', label: 'Mentoring Opportunities' },
              { key: 'collaborate', label: 'Collaboration Projects' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Community Members Tab */}
        {activeTab === 'community' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-light text-gray-900 mb-4">Community Members</h2>
              <p className="text-gray-600">
                Connect with practitioners, learners, and knowledge keepers from around the world 
                who are implementing AIME's methodology in their communities and organizations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityMembers.map((member) => (
                <div 
                  key={member.id} 
                  className="border border-gray-200 hover:border-gray-300 transition-colors p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                      <p className="text-xs text-gray-500 mt-1">{member.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{member.contributions}</div>
                      <div className="text-xs text-gray-500">contributions</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Expertise:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.slice(0, 2).map((skill) => (
                        <span key={skill} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                      {member.expertise.length > 2 && (
                        <span className="text-xs text-gray-500">+{member.expertise.length - 2}</span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Learning pathways:</p>
                    <div className="space-y-1">
                      {member.pathways.map((pathway) => (
                        <div key={pathway} className="text-xs text-gray-600">
                          • {pathway}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Active {member.lastActive}</span>
                    <button className="text-sm text-gray-900 hover:text-gray-700 font-medium">
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-6">
                Ready to join our growing community of changemakers?
              </p>
              <button className="px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                Create Community Profile
              </button>
            </div>
          </div>
        )}

        {/* Mentoring Opportunities Tab */}
        {activeTab === 'mentoring' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-light text-gray-900 mb-4">Mentoring Opportunities</h2>
              <p className="text-gray-600">
                Find mentoring relationships that honor the Indigenous principle of reciprocal learning, 
                where both mentors and mentees share knowledge and grow together.
              </p>
            </div>

            <div className="space-y-6">
              {mentoringOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="border border-gray-200 p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-medium text-gray-900">{opportunity.title}</h3>
                      <span className={`text-xs uppercase tracking-wide px-2 py-1 rounded border ${getOpportunityTypeColor(opportunity.type)}`}>
                        {getOpportunityTypeLabel(opportunity.type)}
                      </span>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>by {opportunity.postedBy}</div>
                      <div>{opportunity.postedDate}</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {opportunity.description}
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Skills involved:</p>
                      <div className="flex flex-wrap gap-1">
                        {opportunity.skills.map((skill) => (
                          <span key={skill} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Time commitment:</p>
                      <p className="text-sm text-gray-600">{opportunity.timeCommitment}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Format:</p>
                      <p className="text-sm text-gray-600">{opportunity.format}</p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button className="text-gray-900 hover:text-gray-700 font-medium">
                      {opportunity.type === 'seek-mentor' ? 'Offer mentorship' :
                       opportunity.type === 'offer-mentoring' ? 'Request mentorship' : 'Join group'} →
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      Learn more
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gray-50 p-8 text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Share your mentoring needs</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Whether you're seeking guidance, offering your expertise, or wanting to create 
                a peer learning group, share your mentoring interests with our community.
              </p>
              <button className="px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                Post Mentoring Opportunity
              </button>
            </div>
          </div>
        )}

        {/* Collaboration Projects Tab */}
        {activeTab === 'collaborate' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-light text-gray-900 mb-4">Collaboration Projects</h2>
              <p className="text-gray-600">
                Join collaborative projects that apply Indigenous wisdom and systems thinking 
                to real-world challenges, from organizational transformation to community development.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Indigenous Knowledge Preservation Initiative',
                  description: 'Collaborative effort to document and appropriately share Indigenous knowledge systems with proper protocols and elder oversight.',
                  participants: 12,
                  skills: ['Cultural protocol', 'Documentation', 'Digital archiving'],
                  status: 'Active',
                  timeline: '6 months'
                },
                {
                  title: 'Joy Corps Implementation Network',
                  description: 'Peer support network for organizations implementing Joy Corps principles, sharing challenges, successes, and best practices.',
                  participants: 8,
                  skills: ['Organizational change', 'Systems thinking', 'Change management'],
                  status: 'Recruiting',
                  timeline: 'Ongoing'
                },
                {
                  title: 'Hoodie Economics Research Collective',
                  description: 'Research group studying relational economics applications across different cultural and economic contexts.',
                  participants: 15,
                  skills: ['Economics research', 'Data analysis', 'Community validation'],
                  status: 'Planning',
                  timeline: '12 months'
                },
                {
                  title: 'Youth Leadership Development Program',
                  description: 'Designing and implementing youth leadership programs that center Indigenous wisdom and systems thinking.',
                  participants: 6,
                  skills: ['Youth development', 'Program design', 'Community engagement'],
                  status: 'Active',
                  timeline: '18 months'
                }
              ].map((project, index) => (
                <div key={index} className="border border-gray-200 p-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-medium text-gray-900">{project.title}</h3>
                    <span className={`text-xs uppercase tracking-wide px-2 py-1 rounded ${
                      project.status === 'Active' ? 'bg-green-50 text-green-900' :
                      project.status === 'Recruiting' ? 'bg-blue-50 text-blue-900' :
                      'bg-yellow-50 text-yellow-900'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Participants:</p>
                      <p className="text-sm text-gray-600">{project.participants} members</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Timeline:</p>
                      <p className="text-sm text-gray-600">{project.timeline}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills needed:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map((skill) => (
                        <span key={skill} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button className="text-gray-900 hover:text-gray-700 font-medium">
                      Join project →
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      Learn more
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gray-900 text-white p-12 rounded-lg text-center">
              <h3 className="text-2xl font-light mb-6">Propose a collaborative project</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Have an idea for applying Indigenous wisdom to systemic challenges? 
                Propose a collaborative project and connect with others who share your vision.
              </p>
              <button className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 transition-colors">
                Propose Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}