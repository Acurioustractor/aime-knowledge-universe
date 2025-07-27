'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface MentorLesson {
  id: string;
  lessonNumber: number;
  title: string;
  topic: string;
  summary: string;
  longDescription: string;
  vimeoUrl: string;
  vimeoEmbed: string;
  audioUrl: string | null;
  thumbnailUrl: string | null;
  activity: string;
  duration: string;
  learningObjectives: string[];
  keywords: string[];
  culturalContext: string[];
  relatedTopics: string[];
  hasAudio: boolean;
  hasVideo: boolean;
  isInteractive: boolean;
}

export default function MentorLessonPage() {
  const params = useParams();
  const lessonId = params.id as string;
  
  const [lesson, setLesson] = useState<MentorLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [reflection, setReflection] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const steps = [
    { id: 'intro', title: 'Introduction', icon: '👋', description: 'Learn about this lesson' },
    { id: 'audio', title: 'Listen', icon: '🎧', description: 'Absorb the wisdom through audio' },
    { id: 'video', title: 'Watch', icon: '📹', description: 'Visual learning experience' },
    { id: 'activity', title: 'Practice', icon: '✋', description: 'Apply what you\'ve learned' },
    { id: 'reflect', title: 'Reflect', icon: '🤔', description: 'Integrate and connect' }
  ];

  useEffect(() => {
    if (lessonId) {
      loadLesson();
      loadProgress();
    }
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      const response = await fetch('/api/mentor-app/lessons');
      const data = await response.json();
      
      if (data.success) {
        const foundLesson = data.data.lessons.find((l: MentorLesson) => l.id === lessonId);
        if (foundLesson) {
          setLesson(foundLesson);
        }
      }
    } catch (error) {
      console.error('Failed to load lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = () => {
    const progress = localStorage.getItem(`lesson-progress-${lessonId}`);
    if (progress) {
      const data = JSON.parse(progress);
      setCurrentStep(data.currentStep || 0);
      setCompletedSteps(new Set(data.completedSteps || []));
      setIsCompleted(data.isCompleted || false);
      setReflection(data.reflection || '');
    }
  };

  const saveProgress = () => {
    const progress = {
      currentStep,
      completedSteps: [...completedSteps],
      isCompleted,
      reflection
    };
    localStorage.setItem(`lesson-progress-${lessonId}`, JSON.stringify(progress));
  };

  const completeStep = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepIndex);
    setCompletedSteps(newCompleted);
    
    if (stepIndex === steps.length - 1) {
      setIsCompleted(true);
      // Mark lesson as completed in main app
      const mainProgress = localStorage.getItem('mentor-app-progress');
      const completed = mainProgress ? JSON.parse(mainProgress) : [];
      if (!completed.includes(lessonId)) {
        completed.push(lessonId);
        localStorage.setItem('mentor-app-progress', JSON.stringify(completed));
      }
    }
    
    setTimeout(saveProgress, 100);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimeout(saveProgress, 100);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Lesson not found</h1>
          <Link href="/apps/mentor-app" className="text-yellow-400 hover:text-yellow-300">
            ← Back to Mentor App
          </Link>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const progressPercentage = ((completedSteps.size) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-black/20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/apps/mentor-app" 
              className="text-white/80 hover:text-white text-sm flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back to Mentor App</span>
            </Link>
            <div className="text-white/80 text-sm">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Lesson Header */}
        <div className="text-center text-white mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xl">
              {steps[0].icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{lesson.title}</h1>
              <p className="text-white/80">{lesson.topic}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-white/70 text-sm mt-2">{Math.round(progressPercentage)}% Complete</p>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                  index === currentStep
                    ? 'bg-white/20 text-white border border-white/30'
                    : completedSteps.has(index)
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <span className="text-2xl mb-1">{step.icon}</span>
                <span className="text-xs font-medium">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-white/80">{currentStepData.description}</p>
          </div>

          {/* Step Content */}
          {currentStep === 0 && (
            <div className="text-white">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed mb-6">{lesson.summary}</p>
                
                {lesson.longDescription && (
                  <p className="mb-6">{lesson.longDescription}</p>
                )}

                <div className="bg-white/5 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold mb-3">What you'll learn:</h3>
                  <ul className="space-y-2">
                    {lesson.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-yellow-400 mt-1">•</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {lesson.culturalContext.map((context, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                      {context}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { completeStep(0); nextStep(); }}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold py-3 rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all"
              >
                Ready to Begin → Listen to the Audio
              </button>
            </div>
          )}

          {currentStep === 1 && lesson.hasAudio && (
            <div className="text-white text-center">
              <div className="mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl">
                  🎧
                </div>
                <p className="text-lg mb-6">
                  Listen deeply to Jack Manning Bancroft share insights about <strong>{lesson.title}</strong>
                </p>
              </div>

              {lesson.audioUrl && (
                <div className="bg-white/5 rounded-lg p-6 mb-6">
                  <audio 
                    ref={audioRef}
                    src={lesson.audioUrl}
                    onPlay={() => setAudioPlaying(true)}
                    onPause={() => setAudioPlaying(false)}
                    onEnded={() => { setAudioPlaying(false); completeStep(1); }}
                    className="w-full mb-4"
                    controls
                  />
                  
                  <button
                    onClick={toggleAudio}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    {audioPlaying ? '⏸️ Pause' : '▶️ Play Audio'}
                  </button>
                </div>
              )}

              <button
                onClick={() => { completeStep(1); nextStep(); }}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-green-300 hover:to-blue-400 transition-all"
              >
                Continue to Video →
              </button>
            </div>
          )}

          {currentStep === 2 && lesson.hasVideo && (
            <div className="text-white">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                  📹
                </div>
                <p className="text-lg">
                  Watch the visual lesson to deepen your understanding
                </p>
              </div>

              {lesson.vimeoEmbed && (
                <div className="mb-6">
                  <div 
                    className="aspect-video rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: lesson.vimeoEmbed }}
                  />
                </div>
              )}

              <button
                onClick={() => { completeStep(2); nextStep(); }}
                className="w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold py-3 rounded-lg hover:from-blue-300 hover:to-purple-400 transition-all"
              >
                Ready for the Activity →
              </button>
            </div>
          )}

          {currentStep === 3 && lesson.isInteractive && (
            <div className="text-white">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                  ✋
                </div>
                <h3 className="text-xl font-semibold mb-2">Time for Action</h3>
                <p className="text-white/80">
                  Now apply what you've learned through hands-on practice
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-6 mb-6">
                <h4 className="font-semibold mb-3">Your Activity:</h4>
                <p className="text-lg leading-relaxed whitespace-pre-line">{lesson.activity}</p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <p className="text-yellow-300 text-sm">
                  💡 <strong>Tip:</strong> Take your time with this activity. The real learning happens through practice and reflection.
                </p>
              </div>

              <button
                onClick={() => { completeStep(3); nextStep(); }}
                className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-purple-300 hover:to-pink-400 transition-all"
              >
                I've Completed the Activity →
              </button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-white">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                  🤔
                </div>
                <h3 className="text-xl font-semibold mb-2">Reflect & Connect</h3>
                <p className="text-white/80">
                  How will you apply {lesson.title} in your mentoring journey?
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Your Reflection:</label>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder={`How has learning about ${lesson.title} changed your perspective? What specific actions will you take?`}
                  className="w-full h-32 bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Link
                  href="/apps/imagination-tv"
                  className="bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-4 text-center transition-all"
                >
                  <div className="text-2xl mb-2">📺</div>
                  <div className="text-sm font-medium">Related Videos</div>
                  <div className="text-xs text-white/60">IMAGI-NATION TV</div>
                </Link>
                <Link
                  href="/knowledge"
                  className="bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-4 text-center transition-all"
                >
                  <div className="text-2xl mb-2">📚</div>
                  <div className="text-sm font-medium">Explore More</div>
                  <div className="text-xs text-white/60">Knowledge Hub</div>
                </Link>
                <Link
                  href="/network"
                  className="bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-4 text-center transition-all"
                >
                  <div className="text-2xl mb-2">🌐</div>
                  <div className="text-sm font-medium">Share Insights</div>
                  <div className="text-xs text-white/60">Community</div>
                </Link>
              </div>

              <button
                onClick={() => { completeStep(4); setIsCompleted(true); saveProgress(); }}
                className="w-full bg-gradient-to-r from-indigo-400 to-purple-500 text-white font-semibold py-3 rounded-lg hover:from-indigo-300 hover:to-purple-400 transition-all"
              >
                Complete Lesson ✨
              </button>
            </div>
          )}
        </div>

        {/* Completion Celebration */}
        {isCompleted && (
          <div className="mt-8 bg-gradient-to-r from-green-400/20 to-blue-400/20 border border-green-400/30 rounded-2xl p-8 text-center text-white">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Lesson Complete!</h2>
            <p className="text-white/80 mb-6">
              You've successfully learned about <strong>{lesson.title}</strong> and completed all activities. 
              Keep building your mentoring skills!
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/apps/mentor-app"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Next Lesson →
              </Link>
              <button
                onClick={() => setCurrentStep(0)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Review Lesson
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}