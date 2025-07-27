'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MentorLesson {
  id: string;
  lessonNumber: number;
  title: string;
  topic: string;
  summary: string;
  vimeoUrl: string;
  audioUrl: string | null;
  thumbnailUrl: string | null;
  activity: string;
  duration: string;
  hasAudio: boolean;
  hasVideo: boolean;
  isInteractive: boolean;
  learningObjectives: string[];
  keywords: string[];
  culturalContext: string[];
}

export default function MentorAppPage() {
  const [lessons, setLessons] = useState<MentorLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<MentorLesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadLessons();
    loadProgress();
  }, []);

  const loadLessons = async () => {
    try {
      const response = await fetch('/api/mentor-app/lessons');
      const data = await response.json();
      
      if (data.success) {
        setLessons(data.data.lessons);
        console.log(`🎓 Loaded ${data.data.lessons.length} mentor lessons`);
      }
    } catch (error) {
      console.error('Failed to load mentor lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = () => {
    const saved = localStorage.getItem('mentor-app-progress');
    if (saved) {
      setCompletedLessons(new Set(JSON.parse(saved)));
    }
  };

  const markLessonComplete = (lessonId: string) => {
    const newCompleted = new Set(completedLessons);
    newCompleted.add(lessonId);
    setCompletedLessons(newCompleted);
    localStorage.setItem('mentor-app-progress', JSON.stringify([...newCompleted]));
  };

  const getProgressPercentage = () => {
    if (lessons.length === 0) return 0;
    return Math.round((completedLessons.size / lessons.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading your mentoring journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/apps" 
              className="text-white/80 hover:text-white text-sm flex items-center space-x-2 transition-colors"
            >
              <span>←</span>
              <span>Back to Apps</span>
            </Link>
            <div className="text-white/80 text-sm">
              {completedLessons.size} of {lessons.length} lessons completed
            </div>
          </div>

          <div className="text-center text-white mb-12">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl">
                🎓
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  AIME Mentor App
                </h1>
                <p className="text-xl text-white/90">
                  Transform lives through the power of mentoring
                </p>
              </div>
            </div>

            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8">
              Journey through AIME's core mentoring principles with interactive lessons that combine 
              Indigenous wisdom, practical activities, and real-world application.
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white/70">Your Progress</span>
                <span className="text-white font-semibold">{getProgressPercentage()}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessons.has(lesson.id);
            const isNext = !isCompleted && index === completedLessons.size;
            
            return (
              <div
                key={lesson.id}
                className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:scale-105 ${
                  isCompleted 
                    ? 'border-green-400 bg-green-400/10' 
                    : isNext 
                    ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20' 
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                {/* Lesson Status Badge */}
                <div className="absolute -top-3 -right-3">
                  {isCompleted ? (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      ✓
                    </div>
                  ) : isNext ? (
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                      →
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white/60 text-sm">
                      {lesson.lessonNumber}
                    </div>
                  )}
                </div>

                {/* Lesson Thumbnail */}
                {lesson.thumbnailUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={lesson.thumbnailUrl}
                      alt={lesson.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}

                {/* Lesson Content */}
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                  <p className="text-white/80 text-sm mb-4 line-clamp-3">
                    {lesson.summary}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {lesson.hasVideo && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                        📹 Video
                      </span>
                    )}
                    {lesson.hasAudio && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                        🎧 Audio
                      </span>
                    )}
                    {lesson.isInteractive && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                        ✋ Activity
                      </span>
                    )}
                  </div>

                  {/* Duration & Keywords */}
                  <div className="text-xs text-white/60 mb-4">
                    <div className="flex items-center justify-between">
                      <span>⏱️ {lesson.duration}</span>
                      <span className="truncate ml-2">
                        {lesson.keywords.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/apps/mentor-app/lesson/${lesson.id}`}
                    className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : isNext
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {isCompleted ? '✓ Review Lesson' : isNext ? 'Start Lesson' : 'View Lesson'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Lives?
            </h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Each lesson builds on AIME's 18+ years of mentoring experience, 
              combining Indigenous wisdom with practical tools for creating positive change.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/apps/imagination-tv"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                📺 Watch IMAGI-NATION TV
              </Link>
              <Link
                href="/knowledge"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📚 Explore Knowledge Hub
              </Link>
              <Link
                href="/network"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                🌐 Join the Network
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}