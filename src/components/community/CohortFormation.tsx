/**
 * Cohort Formation Component
 * 
 * Interface for creating new implementation cohorts with intelligent member selection
 */

'use client';

import { useState } from 'react';
import { 
  UsersIcon,
  SparklesIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface CohortFormationProps {
  sessionId: string;
  onCohortCreated?: (cohort: any) => void;
  onClose?: () => void;
}

export default function CohortFormation({ sessionId, onCohortCreated, onClose }: CohortFormationProps) {
  const [formData, setFormData] = useState({
    philosophyDomain: 'imagination-based-learning',
    implementationGoal: '',
    preferredSize: 6,
    maxSize: 8,
    geographicScope: 'global',
    experienceLevel: 'mixed',
    startDate: '',
    durationWeeks: 12,
    formationType: 'intelligent' // 'intelligent' or 'manual'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formationResult, setFormationResult] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 3;

  const philosophyDomains = [
    {
      value: 'imagination-based-learning',
      label: 'Imagination-Based Learning',
      description: 'Education that prioritizes imagination as the foundation for all learning'
    },
    {
      value: 'hoodie-economics',
      label: 'Hoodie Economics',
      description: 'Economic philosophy prioritizing relational value over transactional value'
    },
    {
      value: 'mentoring-systems',
      label: 'Mentoring Systems',
      description: 'Structured approaches to mentoring that create networks of support'
    }
  ];

  const handleFormCohort = async () => {
    if (!formData.implementationGoal.trim()) {
      setError('Implementation goal is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/community/cohorts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: formData.formationType === 'intelligent' ? 'form' : 'create',
          sessionId,
          ...formData,
          startDate: formData.startDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setFormationResult(result.data);
        onCohortCreated?.(result.data.cohort);
      } else {
        setError(result.error || 'Failed to form cohort');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Cohort formation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  if (success && formationResult) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border border-gray-200">
        <div className="text-center mb-8">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cohort Formed Successfully!</h2>
          <p className="text-gray-600">
            Your implementation cohort has been created with {formationResult.members?.length || 0} members.
          </p>
        </div>

        {/* Formation Results */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cohort Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <p className="text-gray-900">{formationResult.cohort.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Philosophy Domain:</span>
                <p className="text-gray-900 capitalize">{formationResult.cohort.philosophy_domain.replace('-', ' ')}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Members:</span>
                <p className="text-gray-900">{formationResult.cohort.current_member_count} / {formationResult.cohort.max_members}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Duration:</span>
                <p className="text-gray-900">{formationResult.cohort.expected_duration_weeks} weeks</p>
              </div>
            </div>
          </div>

          {formationResult.formationReasoning && (
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Formation Analysis</h3>
              <p className="text-gray-700">{formationResult.formationReasoning}</p>
            </div>
          )}

          {formationResult.diversityAnalysis && (
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Diversity Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Experience Levels</h4>
                  {Object.entries(formationResult.diversityAnalysis.experienceLevels).map(([level, count]) => (
                    <div key={level} className="flex justify-between text-sm">
                      <span className="capitalize">{level}:</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Geographic Distribution</h4>
                  {Object.entries(formationResult.diversityAnalysis.geographicDistribution).map(([location, count]) => (
                    <div key={location} className="flex justify-between text-sm">
                      <span>{location}:</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Role Distribution</h4>
                  {Object.entries(formationResult.diversityAnalysis.roleDistribution).map(([role, count]) => (
                    <div key={role} className="flex justify-between text-sm">
                      <span className="capitalize">{role}:</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Diversity Score:</span>
                  <span className="text-lg font-bold text-purple-600">
                    {Math.round(formationResult.diversityAnalysis.diversityScore * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {formationResult.members && (
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formationResult.members.map((member: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-medium text-sm">
                          {member.userSession.user_role?.charAt(0).toUpperCase() || 'M'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {member.userSession.user_role || 'Member'}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {member.userSession.experience_level}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      Alignment: {Math.round(member.alignmentScore * 100)}% • 
                      Diversity: {Math.round(member.diversityContribution * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Continue to Cohort Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Form Implementation Cohort</h1>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
        
        <p className="text-gray-600 mb-6">
          Create a collaborative learning group to work together on implementing AIME methodologies.
        </p>

        {/* Progress indicator */}
        <div className="flex items-center space-x-4 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i + 1 <= currentStep 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={`w-16 h-1 mx-2 ${
                  i + 1 < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Philosophy Domain & Goal */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <SparklesIcon className="h-5 w-5" />
            Philosophy Domain & Implementation Goal
          </h2>

          {/* Philosophy Domain Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Philosophy Domain
            </label>
            <div className="space-y-3">
              {philosophyDomains.map(domain => (
                <label key={domain.value} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="philosophyDomain"
                    value={domain.value}
                    checked={formData.philosophyDomain === domain.value}
                    onChange={(e) => updateFormData({ philosophyDomain: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{domain.label}</div>
                    <div className="text-sm text-gray-600">{domain.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Implementation Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Implementation Goal
            </label>
            <textarea
              value={formData.implementationGoal}
              onChange={(e) => updateFormData({ implementationGoal: e.target.value })}
              placeholder="Describe what you want to achieve together (e.g., 'Implement imagination-based learning in our school district')"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-1">
              Be specific about what you want to accomplish as a group
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Cohort Configuration */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Cohort Configuration
          </h2>

          {/* Formation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Formation Method
            </label>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="formationType"
                  value="intelligent"
                  checked={formData.formationType === 'intelligent'}
                  onChange={(e) => updateFormData({ formationType: e.target.value })}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">Intelligent Formation</div>
                  <div className="text-sm text-gray-600">
                    AI will select diverse, compatible members based on goals and experience
                  </div>
                </div>
              </label>
              <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="formationType"
                  value="manual"
                  checked={formData.formationType === 'manual'}
                  onChange={(e) => updateFormData({ formationType: e.target.value })}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">Manual Creation</div>
                  <div className="text-sm text-gray-600">
                    Create an empty cohort and invite specific people to join
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Cohort Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Size
              </label>
              <select
                value={formData.preferredSize}
                onChange={(e) => updateFormData({ preferredSize: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {[4, 5, 6, 7, 8].map(size => (
                  <option key={size} value={size}>{size} members</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Size
              </label>
              <select
                value={formData.maxSize}
                onChange={(e) => updateFormData({ maxSize: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {[6, 7, 8, 9, 10].map(size => (
                  <option key={size} value={size}>{size} members</option>
                ))}
              </select>
            </div>
          </div>

          {/* Geographic Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <GlobeAltIcon className="h-4 w-4 inline mr-2" />
              Geographic Scope
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'local', label: 'Local', description: 'Same city/region' },
                { value: 'regional', label: 'Regional', description: 'Same country/region' },
                { value: 'global', label: 'Global', description: 'Worldwide' }
              ].map(option => (
                <label key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="geographicScope"
                    value={option.value}
                    checked={formData.geographicScope === option.value}
                    onChange={(e) => updateFormData({ geographicScope: e.target.value as any })}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <AcademicCapIcon className="h-4 w-4 inline mr-2" />
              Experience Level Mix
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { value: 'mixed', label: 'Mixed Levels', description: 'Diverse experience for peer learning' },
                { value: 'beginner', label: 'Beginners', description: 'New to this philosophy domain' },
                { value: 'intermediate', label: 'Intermediate', description: 'Some experience implementing' },
                { value: 'advanced', label: 'Advanced', description: 'Experienced practitioners' }
              ].map(option => (
                <label key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="experienceLevel"
                    value={option.value}
                    checked={formData.experienceLevel === option.value}
                    onChange={(e) => updateFormData({ experienceLevel: e.target.value })}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Timeline */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Timeline & Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => updateFormData({ startDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to start next week
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (weeks)
              </label>
              <select
                value={formData.durationWeeks}
                onChange={(e) => updateFormData({ durationWeeks: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {[8, 10, 12, 16, 20, 24].map(weeks => (
                  <option key={weeks} value={weeks}>{weeks} weeks</option>
                ))}
              </select>
            </div>
          </div>

          {/* Information about cohort lifecycle */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Cohort Lifecycle</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Formation:</strong> Members get to know each other and align on goals</p>
                  <p><strong>Orientation:</strong> Establish working agreements and detailed plans</p>
                  <p><strong>Active Implementation:</strong> Work together toward your implementation goal</p>
                  <p><strong>Completion:</strong> Celebrate achievements and document learnings</p>
                  <p><strong>Alumni:</strong> Ongoing connection and support network</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-4">Cohort Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Philosophy Domain:</span>
                <span className="font-medium capitalize">
                  {formData.philosophyDomain.replace('-', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Formation Method:</span>
                <span className="font-medium capitalize">{formData.formationType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target Size:</span>
                <span className="font-medium">{formData.preferredSize} - {formData.maxSize} members</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Geographic Scope:</span>
                <span className="font-medium capitalize">{formData.geographicScope}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Experience Level:</span>
                <span className="font-medium capitalize">{formData.experienceLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{formData.durationWeeks} weeks</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex space-x-3">
          {currentStep < totalSteps ? (
            <button
              onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleFormCohort}
              disabled={loading || !formData.implementationGoal.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {formData.formationType === 'intelligent' ? 'Forming Cohort...' : 'Creating Cohort...'}
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4" />
                  {formData.formationType === 'intelligent' ? 'Form Intelligent Cohort' : 'Create Manual Cohort'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}