'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { HoodieRecord, HoodieStats } from '@/lib/integrations/hoodies';

// Use HoodieRecord from the integration
type HoodieData = HoodieRecord;

// Use HoodieStats from the integration
type DashboardStats = HoodieStats;

export default function HoodieDashboard() {
  const [hoodieData, setHoodieData] = useState<HoodieData[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'hoodies' | 'impact' | 'analytics'>('overview');
  const [selectedHoodie, setSelectedHoodie] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetchHoodieData();
  }, []);

  const fetchHoodieData = async () => {
    try {
      setError(null);
      console.log('🏫 Fetching real Hoodie data from API...');
      
      const response = await fetch('/api/hoodies?stats=true');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch hoodie data');
      }
      
      console.log(`✅ Loaded ${result.data.length} hoodies from Airtable`);
      
      setHoodieData(result.data);
      setDashboardStats(result.stats);
      setLastUpdated(result.meta.lastUpdated);
      
    } catch (error) {
      console.error('❌ Failed to fetch hoodie data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load hoodie data');
      
      // Fallback to mock data for development
      console.log('🔄 Falling back to mock data for development...');
      const mockData = generateMockHoodieData();
      setHoodieData(mockData);
      setDashboardStats(calculateMockStats(mockData));
    } finally {
      setLoading(false);
    }
  };

  const generateMockHoodieData = (): HoodieData[] => {
    return [
      {
        id: 'mock-hoodie-1',
        name: 'Sydney University Hub',
        location: 'Sydney, NSW',
        status: 'active' as const,
        region: 'NSW',
        coordinator: 'Sarah Johnson',
        established: '2018-03-15',
        lastActivity: '2024-01-15',
        metrics: {
          totalMentors: 85,
          totalMentees: 850,
          currentMentors: 45,
          currentMentees: 120,
          completionRate: 87,
          universityPathways: 156,
          employmentOutcomes: 203
        },
        programs: ['University Mentoring', 'Cultural Bridge', 'Leadership Development'],
        demographics: {
          ageGroups: { '15-17': 45, '18-20': 35, '21-25': 20 },
          genderSplit: { 'Female': 55, 'Male': 40, 'Non-binary': 5 },
          culturalBackground: { 'Indigenous': 70, 'Non-Indigenous': 30 }
        },
        contact: {
          email: 'sarah@aime.org.au',
          phone: '+61 2 9876 5432'
        },
        metadata: {
          airtableId: 'mock-rec1',
          lastUpdated: new Date().toISOString(),
          originalFields: {}
        }
      },
      {
        id: 'mock-hoodie-2',
        name: 'Melbourne Innovation Center',
        location: 'Melbourne, VIC',
        status: 'active' as const,
        region: 'VIC',
        coordinator: 'Marcus Williams',
        established: '2019-08-22',
        lastActivity: '2024-01-14',
        metrics: {
          totalMentors: 72,
          totalMentees: 720,
          currentMentors: 38,
          currentMentees: 95,
          completionRate: 92,
          universityPathways: 134,
          employmentOutcomes: 189
        },
        programs: ['STEM Mentoring', 'Creative Arts', 'Entrepreneurship'],
        demographics: {
          ageGroups: { '15-17': 40, '18-20': 35, '21-25': 25 },
          genderSplit: { 'Female': 52, 'Male': 43, 'Non-binary': 5 },
          culturalBackground: { 'Indigenous': 68, 'Non-Indigenous': 32 }
        },
        contact: {
          email: 'marcus@aime.org.au',
          phone: '+61 3 9876 5432'
        },
        metadata: {
          airtableId: 'mock-rec2',
          lastUpdated: new Date().toISOString(),
          originalFields: {}
        }
      },
      {
        id: 'mock-hoodie-3',
        name: 'Brisbane Cultural Hub',
        location: 'Brisbane, QLD',
        status: 'active' as const,
        region: 'QLD',
        coordinator: 'Lila Thompson',
        established: '2017-11-05',
        lastActivity: '2024-01-16',
        metrics: {
          totalMentors: 65,
          totalMentees: 640,
          currentMentors: 32,
          currentMentees: 78,
          completionRate: 89,
          universityPathways: 112,
          employmentOutcomes: 145
        },
        programs: ['Cultural Bridge', 'Traditional Knowledge', 'Digital Innovation'],
        demographics: {
          ageGroups: { '15-17': 50, '18-20': 30, '21-25': 20 },
          genderSplit: { 'Female': 58, 'Male': 37, 'Non-binary': 5 },
          culturalBackground: { 'Indigenous': 75, 'Non-Indigenous': 25 }
        },
        contact: {
          email: 'lila@aime.org.au',
          phone: '+61 7 9876 5432'
        },
        metadata: {
          airtableId: 'mock-rec3',
          lastUpdated: new Date().toISOString(),
          originalFields: {}
        }
      },
      {
        id: 'mock-hoodie-4',
        name: 'Perth Community Center',
        location: 'Perth, WA',
        status: 'active' as const,
        region: 'WA',
        coordinator: 'David Chen',
        established: '2020-02-14',
        lastActivity: '2024-01-13',
        metrics: {
          totalMentors: 58,
          totalMentees: 480,
          currentMentors: 28,
          currentMentees: 65,
          completionRate: 85,
          universityPathways: 89,
          employmentOutcomes: 112
        },
        programs: ['Remote Mentoring', 'Career Pathways', 'Leadership'],
        demographics: {
          ageGroups: { '15-17': 55, '18-20': 25, '21-25': 20 },
          genderSplit: { 'Female': 60, 'Male': 35, 'Non-binary': 5 },
          culturalBackground: { 'Indigenous': 80, 'Non-Indigenous': 20 }
        },
        contact: {
          email: 'david@aime.org.au',
          phone: '+61 8 9876 5432'
        },
        metadata: {
          airtableId: 'mock-rec4',
          lastUpdated: new Date().toISOString(),
          originalFields: {}
        }
      },
      {
        id: 'mock-hoodie-5',
        name: 'Adelaide Imagination Lab',
        location: 'Adelaide, SA',
        status: 'pending' as const,
        region: 'SA',
        coordinator: 'Emma Rodriguez',
        established: '2023-09-30',
        lastActivity: '2024-01-10',
        metrics: {
          totalMentors: 25,
          totalMentees: 125,
          currentMentors: 15,
          currentMentees: 25,
          completionRate: 78,
          universityPathways: 23,
          employmentOutcomes: 31
        },
        programs: ['Pilot Program', 'Community Engagement'],
        demographics: {
          ageGroups: { '15-17': 60, '18-20': 30, '21-25': 10 },
          genderSplit: { 'Female': 56, 'Male': 40, 'Non-binary': 4 },
          culturalBackground: { 'Indigenous': 72, 'Non-Indigenous': 28 }
        },
        contact: {
          email: 'emma@aime.org.au',
          phone: '+61 8 8876 5432'
        },
        metadata: {
          airtableId: 'mock-rec5',
          lastUpdated: new Date().toISOString(),
          originalFields: {}
        }
      }
    ];
  };

  const calculateMockStats = (data: HoodieData[]): DashboardStats => {
    return {
      totalHoodies: data.length,
      activeHoodies: data.filter(h => h.status === 'active').length,
      totalMentors: data.reduce((sum, h) => sum + h.metrics.currentMentors, 0),
      totalMentees: data.reduce((sum, h) => sum + h.metrics.currentMentees, 0),
      totalUniversityPathways: data.reduce((sum, h) => sum + (h.metrics.universityPathways || 0), 0),
      totalEmploymentOutcomes: data.reduce((sum, h) => sum + (h.metrics.employmentOutcomes || 0), 0),
      averageCompletionRate: data.length > 0 ? data.reduce((sum, h) => sum + (h.metrics.completionRate || 0), 0) / data.length : 0,
      regionDistribution: data.reduce((acc, h) => {
        acc[h.region] = (acc[h.region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      statusDistribution: data.reduce((acc, h) => {
        acc[h.status] = (acc[h.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-2">Loading Hoodie Dashboard...</div>
          <div className="text-sm text-gray-500">Fetching real-time data from Airtable</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-2">⚠️ Error Loading Dashboard</div>
          <div className="text-sm text-gray-600 mb-4">{error}</div>
          <button 
            onClick={fetchHoodieData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
          <div className="text-xs text-gray-500 mt-2">
            Falling back to demo data for development
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-wiki py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AIME Hoodie Dashboard</h1>
              <p className="text-gray-600">Real-time insights into AIME's mentoring network</p>
              {lastUpdated && (
                <p className="text-xs text-gray-500">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
              )}
            </div>
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              ← Back to Wiki
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="container-wiki">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'hoodies', label: 'Hoodie Hubs', icon: '🏫' },
              { id: 'impact', label: 'Impact Metrics', icon: '📈' },
              { id: 'analytics', label: 'Analytics', icon: '🔍' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  selectedView === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container-wiki py-8">
        {selectedView === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Active Hoodies"
                value={dashboardStats?.activeHoodies || 0}
                total={dashboardStats?.totalHoodies || 0}
                icon="🏫"
                color="blue"
              />
              <MetricCard
                title="Total Mentors"
                value={dashboardStats?.totalMentors || 0}
                icon="👨‍🏫"
                color="green"
              />
              <MetricCard
                title="Current Mentees"
                value={dashboardStats?.totalMentees || 0}
                icon="👩‍🎓"
                color="purple"
              />
              <MetricCard
                title="University Pathways"
                value={dashboardStats?.totalUniversityPathways || 0}
                icon="🎓"
                color="orange"
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Hoodie Activity</h3>
              <div className="space-y-3">
                {hoodieData.slice(0, 5).map((hoodie) => (
                  <div key={hoodie.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(hoodie.status)}`}>
                          {hoodie.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{hoodie.name}</p>
                        <p className="text-sm text-gray-500">{hoodie.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{hoodie.metrics.currentMentors} mentors</p>
                      <p className="text-sm text-gray-500">{hoodie.metrics.currentMentees} mentees</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedView === 'hoodies' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {hoodieData.map((hoodie) => (
                <HoodieCard
                  key={hoodie.id}
                  hoodie={hoodie}
                  isSelected={selectedHoodie === hoodie.id}
                  onSelect={() => setSelectedHoodie(hoodie.id)}
                />
              ))}
            </div>
          </div>
        )}

        {selectedView === 'impact' && (
          <div className="space-y-8">
            {/* Impact Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ImpactCard
                title="Total Mentees Reached"
                value={hoodieData.reduce((sum, h) => sum + h.metrics.totalMentees, 0)}
                change="+12%"
                icon="🎯"
              />
              <ImpactCard
                title="University Pathways"
                value={hoodieData.reduce((sum, h) => sum + (h.metrics.universityPathways || 0), 0)}
                change="+18%"
                icon="🎓"
              />
              <ImpactCard
                title="Employment Outcomes"
                value={hoodieData.reduce((sum, h) => sum + (h.metrics.employmentOutcomes || 0), 0)}
                change="+15%"
                icon="💼"
              />
              <ImpactCard
                title="Average Completion Rate"
                value={`${Math.round(hoodieData.reduce((sum, h) => sum + (h.metrics.completionRate || 0), 0) / hoodieData.length)}%`}
                change="+5%"
                icon="✅"
              />
            </div>

            {/* Detailed Impact Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Impact by Hoodie Hub</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hub</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Mentees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University Pathways</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employment</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {hoodieData.map((hoodie) => (
                      <tr key={hoodie.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{hoodie.name}</div>
                            <div className="text-sm text-gray-500">{hoodie.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hoodie.metrics.totalMentees}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hoodie.metrics.completionRate || 0}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hoodie.metrics.universityPathways || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hoodie.metrics.employmentOutcomes || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'analytics' && (
          <div className="space-y-8">
            {/* Demographics Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(
                    hoodieData.reduce((acc, hoodie) => {
                      Object.entries(hoodie.demographics.ageGroups).forEach(([age, count]) => {
                        acc[age] = (acc[age] || 0) + count;
                      });
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([age, count]) => (
                    <div key={age} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{age} years</span>
                      <span className="text-sm font-medium text-gray-900">{count}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cultural Background</h3>
                <div className="space-y-3">
                  {Object.entries(
                    hoodieData.reduce((acc, hoodie) => {
                      Object.entries(hoodie.demographics.culturalBackground).forEach(([bg, count]) => {
                        acc[bg] = (acc[bg] || 0) + count;
                      });
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([bg, count]) => (
                    <div key={bg} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{bg}</span>
                      <span className="text-sm font-medium text-gray-900">{Math.round(count / hoodieData.length)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Program Distribution */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Programs Across Hubs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from(new Set(hoodieData.flatMap(h => h.programs))).map((program) => (
                  <div key={program} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">{program}</h4>
                    <p className="text-sm text-gray-600">
                      {hoodieData.filter(h => h.programs.includes(program)).length} hubs
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, total, icon, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <span className="text-lg">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">
            {value}
            {total && <span className="text-sm text-gray-500 font-normal">/{total}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

function HoodieCard({ hoodie, isSelected, onSelect }: any) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-shadow ${
        isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{hoodie.name}</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(hoodie.status)}`}>
          {hoodie.status}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{hoodie.location}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Mentors</p>
          <p className="text-lg font-semibold text-gray-900">{hoodie.metrics.currentMentors}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Mentees</p>
          <p className="text-lg font-semibold text-gray-900">{hoodie.metrics.currentMentees}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Programs</p>
        <div className="flex flex-wrap gap-1">
          {hoodie.programs.slice(0, 3).map((program: string, index: number) => (
            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
              {program}
            </span>
          ))}
          {hoodie.programs.length > 3 && (
            <span className="text-xs text-gray-500">+{hoodie.programs.length - 3} more</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Completion Rate</span>
        <span className="font-medium text-gray-900">{hoodie.metrics.completionRate || 0}%</span>
      </div>
    </div>
  );
}

function ImpactCard({ title, value, change, icon }: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <p className="text-sm text-green-600">{change} from last year</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'inactive': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}