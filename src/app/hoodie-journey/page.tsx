'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Journey Phase Definitions for IMAGI-NATION Philosophy Integration
interface JourneyPhase {
  id: number;
  name: string;
  description: string;
  hoodieReward: string;
  requirements: string[];
  resources: Array<{
    type: 'video' | 'article' | 'tool' | 'business_case';
    title: string;
    url: string;
    description: string;
  }>;
  actions: string[];
  philosophy: string;
}

const journeyPhases: JourneyPhase[] = [
  {
    id: 1,
    name: "Ceremony In",
    description: "Begin your transformation by understanding AIME's relational philosophy and your role in the global movement.",
    hoodieReward: "Welcome Hoodie - The Beginning",
    requirements: [
      "Watch foundational IMAGI-NATION TV episodes",
      "Read the master philosophy document", 
      "Complete self-reflection questionnaire"
    ],
    resources: [
      {
        type: 'article',
        title: 'AIME Philosophy & Systems Guide',
        url: '/MASTER_AIME_PHILOSOPHY_AND_SYSTEMS.md',
        description: 'Comprehensive guide to understanding AIME\'s vision and systems'
      },
      {
        type: 'video',
        title: 'What is Hoodie Economics?',
        url: '/content/videos',
        description: 'Learn about relational economics and imagination currency'
      }
    ],
    actions: [
      "Share your 'why' for joining the movement",
      "Connect with a local AIME chapter or start one",
      "Begin documenting your transformation journey"
    ],
    philosophy: "Relationships are the foundation of all transformation. Before we can change systems, we must understand how we relate to ourselves, others, and the world."
  },
  // Additional phases can be defined here...
];

interface JourneyStep {
  id: number;
  phase: string;
  title: string;
  icon: string;
  type: string;
  description: string;
  timing?: string;
  hoodieImage?: string;
  requirements?: string[];
  resources?: Array<{type: string; title: string}>;
}

interface JourneyPhase {
  id: string;
  name: string;
  timeline: string;
  description: string;
  color: string;
  type: string;
}

export default function HoodieJourney() {
  const [currentSection, setCurrentSection] = useState('hero');
  const [modalData, setModalData] = useState<JourneyStep | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.journey-section');
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      let current = 'hero';
      let foundCurrent = false;
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = scrollTop + rect.top;
        
        if (scrollTop >= sectionTop - windowHeight / 3 && !foundCurrent) {
          current = section.id;
          foundCurrent = true;
        }
      });
      
      if (current !== currentSection) {
        setCurrentSection(current);
        
        // Update progress
        const allSections = ['hero', 'ceremony-in', 'orientation', 'action', 'wandering', 'reserve-bank', 'ceremony-out'];
        const index = allSections.indexOf(current);
        if (index !== -1) {
          setProgress(((index + 1) / allSections.length) * 100);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 120;
      const top = section.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  };

  const openModal = (step: JourneyStep) => {
    setModalData(step);
  };

  const closeModal = () => {
    setModalData(null);
  };

  const getResourceIcon = (type: string) => {
    const icons: Record<string, string> = {
      book: '📚',
      video: '🎥',
      pdf: '📄',
      guide: '📋',
      practice: '🎯',
      ceremony: '🎭',
      framework: '⚙️'
    };
    return icons[type] || '📎';
  };

  const phases: JourneyPhase[] = [
    {id: 'hero', name: 'Journey Guide', timeline: 'Start Here', description: 'Overview and introduction', color: '#667eea', type: 'hero'},
    {id: 'ceremony-in', name: 'Ceremony In', timeline: 'February', description: 'Foundation and relational orientation', color: '#8B5A2B', type: 'foundation'},
    {id: 'orientation', name: 'UNCx5 Orientation', timeline: 'Mar-Dec', description: '11 monthly digital hoodies', color: '#4F46E5', type: 'digital'},
    {id: 'action', name: 'Action Pathways', timeline: 'Mar-Dec', description: 'Visa-specific journeys', color: '#E11D48', type: 'action'},
    {id: 'wandering', name: 'Knowledge Fields', timeline: 'Mar-Dec', description: 'Core wisdom areas', color: '#F59E0B', type: 'knowledge'},
    {id: 'reserve-bank', name: 'Re-Serve Bank', timeline: 'Mar-Dec', description: '11 stimulus hoodies', color: '#10B981', type: 'stimulus'},
    {id: 'ceremony-out', name: 'Graduation', timeline: 'Dec-Feb', description: 'Key hoodies and completion', color: '#8B5CF6', type: 'graduation'}
  ];

  const foundationSteps: JourneyStep[] = [
    {id: 1, phase: 'ceremony-in', title: "The Map", icon: "🗺️", type: "hoodie", description: "Navigate your relational journey and understand the territory ahead", timing: "February", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68420630f990cfea5741f791_background_removed_image_qFNvwHtbSb2b3H-xduaSqA.png", requirements: ["Begin your journey", "Open mindset"], resources: [{type: "guide", title: "Journey Navigation"}]},
    {id: 2, phase: 'ceremony-in', title: "Relational Orientation", icon: "🤝", type: "hoodie", description: "5 beings: past, present, imaginary, non-human", timing: "February", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68420630f990cfea5741f791_background_removed_image_qFNvwHtbSb2b3H-xduaSqA.png", requirements: ["Complete The Map", "Understand relational principles"], resources: [{type: "book", title: "5 Beings Framework"}]},
    {id: 3, phase: 'ceremony-in', title: "Default Settings", icon: "⚙️", type: "hoodie", description: "Configure your fundamental approaches", timing: "February", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68420630f990cfea5741f791_background_removed_image_qFNvwHtbSb2b3H-xduaSqA.png", requirements: ["Awareness of patterns", "Readiness to examine defaults"], resources: [{type: "guide", title: "Settings Analysis"}]},
    {id: 4, phase: 'ceremony-in', title: "Social Contract", icon: "📋", type: "hoodie", description: "Establish community agreements", timing: "February", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68420630f990cfea5741f791_background_removed_image_qFNvwHtbSb2b3H-xduaSqA.png", requirements: ["Community engagement", "Agreement principles"], resources: [{type: "framework", title: "Social Contract Template"}]},
    {id: 5, phase: 'ceremony-in', title: "Child Protection", icon: "🛡️", type: "hoodie", description: "Creating safe spaces for young people", timing: "February", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68420630f990cfea5741f791_background_removed_image_qFNvwHtbSb2b3H-xduaSqA.png", requirements: ["Safety awareness", "Protection protocols"], resources: [{type: "guide", title: "Child Protection Framework"}]},
    {id: 6, phase: 'ceremony-in', title: "Peace Train", icon: "🚂", type: "hoodie", description: "Building pathways to peaceful resolution", timing: "February", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68420630f990cfea5741f791_background_removed_image_qFNvwHtbSb2b3H-xduaSqA.png", requirements: ["Conflict awareness", "Peace-building mindset"], resources: [{type: "practice", title: "Peace Building Exercises"}]},
    {id: 7, phase: 'ceremony-in', title: "5 Elements", icon: "🌟", type: "hoodie", description: "Understanding fundamental elements", timing: "February", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68420630f990cfea5741f791_background_removed_image_qFNvwHtbSb2b3H-xduaSqA.png", requirements: ["Elemental awareness", "Holistic thinking"], resources: [{type: "guide", title: "5 Elements Framework"}]}
  ];

  const digitalSteps: JourneyStep[] = [
    {id: 13, phase: 'orientation', title: "The Past", icon: "👕", type: "digital", description: "Connect with historical context", timing: "March", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/6842135b581117b4ecb619ec_background_removed_image__655LPFqSfWbmUqox0E29A.png", requirements: ["Complete foundation"], resources: [{type: "book", title: "Book of Letters"}]},
    {id: 14, phase: 'orientation', title: "Kolab", icon: "👕", type: "digital", description: "Collaborative learning", timing: "March", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/6842135b581117b4ecb619ec_background_removed_image__655LPFqSfWbmUqox0E29A.png", requirements: ["Collaboration foundation"], resources: [{type: "book", title: "Kolab Guide"}]},
    {id: 15, phase: 'orientation', title: "Professors", icon: "👕", type: "digital", description: "Academic excellence", timing: "April", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/6842135b581117b4ecb619ec_background_removed_image__655LPFqSfWbmUqox0E29A.png", requirements: ["Academic foundation"], resources: [{type: "book", title: "Professors Guide"}]},
    {id: 16, phase: 'orientation', title: "Water", icon: "👕", type: "digital", description: "Flow and adaptability", timing: "May", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/6842135b581117b4ecb619ec_background_removed_image__655LPFqSfWbmUqox0E29A.png", requirements: ["Flow understanding"], resources: [{type: "book", title: "Water Principles"}]},
    {id: 17, phase: 'orientation', title: "Gallery", icon: "👕", type: "digital", description: "Creative expression", timing: "June", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/6842135b581117b4ecb619ec_background_removed_image__655LPFqSfWbmUqox0E29A.png", requirements: ["Creative foundation"], resources: [{type: "book", title: "Gallery Guide"}]},
    {id: 18, phase: 'orientation', title: "Mentor Mindset", icon: "👕", type: "digital", description: "Guide others", timing: "July", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/6842135b581117b4ecb619ec_background_removed_image__655LPFqSfWbmUqox0E29A.png", requirements: ["Mentoring foundation"], resources: [{type: "book", title: "Mentoring Guide"}]}
  ];

  const actionSteps: JourneyStep[] = [
    {id: 24, phase: 'action', title: "IKSL", icon: "📕", type: "action", description: "Indigenous Knowledge Systems Leadership", timing: "Mar-Dec", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68421579ceead35dd970b380_background_removed_image_EqW-g_HcR3m9iGNkVTr5gQ.png", requirements: ["Complete orientation"], resources: [{type: "guide", title: "Leadership Skills"}]},
    {id: 25, phase: 'action', title: "Presidents", icon: "📕", type: "action", description: "Leadership pathway", timing: "Mar-Dec", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68421579ceead35dd970b380_background_removed_image_EqW-g_HcR3m9iGNkVTr5gQ.png", requirements: ["Leadership experience"], resources: [{type: "guide", title: "Assessment Framework"}]},
    {id: 26, phase: 'action', title: "Joy", icon: "📕", type: "action", description: "Happiness and energy", timing: "Mar-Dec", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68421579ceead35dd970b380_background_removed_image_EqW-g_HcR3m9iGNkVTr5gQ.png", requirements: ["Joy mindset"], resources: [{type: "practice", title: "Joy Practices"}]},
    {id: 27, phase: 'action', title: "Citizens", icon: "📕", type: "action", description: "Community participation", timing: "Mar-Dec", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68421579ceead35dd970b380_background_removed_image_EqW-g_HcR3m9iGNkVTr5gQ.png", requirements: ["Civic engagement"], resources: [{type: "guide", title: "Citizenship Framework"}]},
    {id: 28, phase: 'action', title: "Schools", icon: "📕", type: "action", description: "Educational pathway", timing: "Mar-Dec", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68421579ceead35dd970b380_background_removed_image_EqW-g_HcR3m9iGNkVTr5gQ.png", requirements: ["Educational focus"], resources: [{type: "guide", title: "Educational Framework"}]}
  ];

  const knowledgeSteps: JourneyStep[] = [
    {id: 29, phase: 'wandering', title: "Imagination", icon: "🎨", type: "knowledge", description: "Creative thinking", timing: "Mar-Dec", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68421c450109c6fbdc782e39_background_removed_image_k0Xqsv6DQZmTbfs0Idk3CQ.png", requirements: ["Creative foundation"], resources: [{type: "practice", title: "Imagination Exercises"}]},
    {id: 30, phase: 'wandering', title: "Mentoring", icon: "👥", type: "knowledge", description: "Guiding others", timing: "Mar-Dec", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68421c450109c6fbdc782e39_background_removed_image_k0Xqsv6DQZmTbfs0Idk3CQ.png", requirements: ["Interpersonal skills"], resources: [{type: "guide", title: "Mentoring Principles"}]},
    {id: 31, phase: 'wandering', title: "Custodianship", icon: "🛡️", type: "knowledge", description: "Care and stewardship", timing: "Mar-Dec", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68421c450109c6fbdc782e39_background_removed_image_k0Xqsv6DQZmTbfs0Idk3CQ.png", requirements: ["Stewardship mindset"], resources: [{type: "practice", title: "Custodial Practices"}]},
    {id: 32, phase: 'wandering', title: "Energy", icon: "⚡", type: "knowledge", description: "Personal and collective energy", timing: "Mar-Dec", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68421c450109c6fbdc782e39_background_removed_image_k0Xqsv6DQZmTbfs0Idk3CQ.png", requirements: ["Energy consciousness"], resources: [{type: "practice", title: "Energy Management"}]}
  ];

  const stimulusSteps: JourneyStep[] = [
    {id: 33, phase: 'reserve-bank', title: "Protocols of Peace", icon: "💚", type: "stimulus", description: "Peaceful frameworks", timing: "Mar-Dec", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68421ed0c7f41fcf079ffdfe_background_removed_image_gkAY5QgdQMKFzkpS9EzBRQ.png", requirements: ["Peace-building mindset"], resources: [{type: "guide", title: "Peace Protocols"}]},
    {id: 34, phase: 'reserve-bank', title: "Imagination", icon: "💚", type: "stimulus", description: "Creative imagination", timing: "Mar-Dec", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68421ed0c7f41fcf079ffdfe_background_removed_image_gkAY5QgdQMKFzkpS9EzBRQ.png", requirements: ["Creative foundation"], resources: [{type: "practice", title: "Imagination Exercises"}]},
    {id: 35, phase: 'reserve-bank', title: "Mentoring", icon: "💚", type: "stimulus", description: "Advanced mentoring", timing: "Mar-Dec", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68421ed0c7f41fcf079ffdfe_background_removed_image_gkAY5QgdQMKFzkpS9EzBRQ.png", requirements: ["Mentoring skills"], resources: [{type: "practice", title: "Mentorship Framework"}]},
    {id: 36, phase: 'reserve-bank', title: "Custodianship", icon: "💚", type: "stimulus", description: "Advanced stewardship", timing: "Mar-Dec", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68421ed0c7f41fcf079ffdfe_background_removed_image_gkAY5QgdQMKFzkpS9EzBRQ.png", requirements: ["Custodial mindset"], resources: [{type: "guide", title: "Custodial Practices"}]},
    {id: 37, phase: 'reserve-bank', title: "Kindness", icon: "💚", type: "stimulus", description: "Practice kindness", timing: "Mar-Dec", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68421ed0c7f41fcf079ffdfe_background_removed_image_gkAY5QgdQMKFzkpS9EzBRQ.png", requirements: ["Compassion practice"], resources: [{type: "practice", title: "Kindness Practices"}]}
  ];

  const graduationSteps: JourneyStep[] = [
    {id: 65, phase: 'ceremony-out', title: "Pink Key", icon: "💖", type: "graduation", description: "Graduation key hoodie", timing: "Dec-Feb", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68425e332c744b4b09efcfe4_background_removed_image_uQuunJYXTYWPM5FgAsKrXA.png", requirements: ["Complete all phases"], resources: [{type: "ceremony", title: "Graduation"}]},
    {id: 66, phase: 'ceremony-out', title: "Green Key", icon: "💚", type: "graduation", description: "Graduation key hoodie", timing: "Dec-Feb", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68425ee8bbdcd2221eef2be9_background_removed_image_i-JVVivrQi2INtMlctcmLw.png", requirements: ["Complete all phases"], resources: [{type: "ceremony", title: "Graduation"}]},
    {id: 67, phase: 'ceremony-out', title: "Blue Key", icon: "💙", type: "graduation", description: "Graduation key hoodie", timing: "Dec-Feb", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68425f4b391ae7932f836294_background_removed_image_Cdl3XmXrQLSFOo3qf__U8w.png", requirements: ["Complete all phases"], resources: [{type: "ceremony", title: "Graduation"}]},
    {id: 68, phase: 'ceremony-out', title: "Purple Key", icon: "💜", type: "graduation", description: "Graduation key hoodie", timing: "Dec-Feb", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/68425a90c4a45f76c6709c7a_background_removed_image_-KvcSQUfSeu9zbWUrMtd5A.png", requirements: ["Complete all phases"], resources: [{type: "ceremony", title: "Graduation"}]},
    {id: 69, phase: 'ceremony-out', title: "Physical Hoodie", icon: "🎓", type: "physical", description: "Physical graduation hoodie", timing: "Dec-Feb", hoodieImage: "https://cdn.prod.website-files.com/66e9e0f321959abc41e99860/6840a6571c3e3a6beb21dd5f_background_removed_image_OvT-So24Qq-02E1cjF_1CQ.png", requirements: ["Complete key hoodie"], resources: [{type: "physical", title: "Physical Hoodie"}]}
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900">
      {/* Back to Wiki Link */}
      <div className="fixed top-4 left-4 z-50">
        <Link 
          href="/" 
          className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
        >
          ← Back to Wiki
        </Link>
      </div>

      {/* Progress Navigation */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            {phases.map((phase, index) => (
              <button
                key={phase.id}
                onClick={() => scrollToSection(phase.id)}
                className={`text-xs px-2 py-1 rounded transition-all ${
                  currentSection === phase.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {phase.name}
              </button>
            ))}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Journey Content */}
      <div className="pt-20">
        {/* Hero Section */}
        <section className="journey-section min-h-screen flex items-center justify-center px-4" id="hero">
          <div className="text-center max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              IMAGI-NATION
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Hoodie Journey
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              A transformative learning experience through 7 phases of growth, 
              from foundation to graduation
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Journey Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                <div>🗺️ 7 Foundation Hoodies</div>
                <div>👕 11 Monthly Digital Hoodies</div>
                <div>📕 5 Action Pathways</div>
                <div>🌟 4 Knowledge Fields</div>
                <div>💚 11 Stimulus Hoodies</div>
                <div>🎓 Graduation Ceremony</div>
              </div>
            </div>
            <button 
              onClick={() => scrollToSection('ceremony-in')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Begin Journey
            </button>
          </div>
        </section>

        {/* Ceremony In Section */}
        <section className="journey-section min-h-screen flex items-center px-4 py-16" id="ceremony-in">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4" style={{color: '#8B5A2B'}}>
                Ceremony In
              </h2>
              <div className="text-lg text-gray-300 mb-2">📅 February</div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Begin your journey by connecting with your relational orientation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {foundationSteps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => openModal(step)}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 border border-white/20"
                >
                  {step.hoodieImage ? (
                    <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden">
                      <img src={step.hoodieImage} alt={step.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="text-4xl text-center mb-4">{step.icon}</div>
                  )}
                  <h3 className="text-lg font-semibold text-white mb-2 text-center">{step.title}</h3>
                  <p className="text-sm text-gray-300 text-center mb-3">{step.description}</p>
                  {step.timing && (
                    <div className="text-xs text-center bg-blue-600/50 text-white px-3 py-1 rounded-full">
                      {step.timing}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Orientation Section */}
        <section className="journey-section min-h-screen flex items-center px-4 py-16" id="orientation">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4" style={{color: '#4F46E5'}}>
                UNCx5 Orientation
              </h2>
              <div className="text-lg text-gray-300 mb-2">📅 March - December</div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Build your foundation through 11 monthly digital hoodies
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {digitalSteps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => openModal(step)}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 border border-white/20"
                >
                  {step.hoodieImage ? (
                    <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden">
                      <img src={step.hoodieImage} alt={step.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="text-4xl text-center mb-4">{step.icon}</div>
                  )}
                  <h3 className="text-lg font-semibold text-white mb-2 text-center">{step.title}</h3>
                  <p className="text-sm text-gray-300 text-center mb-3">{step.description}</p>
                  {step.timing && (
                    <div className="text-xs text-center bg-indigo-600/50 text-white px-3 py-1 rounded-full">
                      {step.timing}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">+ 5 more digital hoodies through December</p>
            </div>
          </div>
        </section>

        {/* Action Section */}
        <section className="journey-section min-h-screen flex items-center px-4 py-16" id="action">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4" style={{color: '#E11D48'}}>
                Action Pathways
              </h2>
              <div className="text-lg text-gray-300 mb-2">📅 March - December</div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Choose your journey path based on your visa type
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {actionSteps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => openModal(step)}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 border border-white/20"
                >
                  {step.hoodieImage ? (
                    <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden">
                      <img src={step.hoodieImage} alt={step.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="text-4xl text-center mb-4">{step.icon}</div>
                  )}
                  <h3 className="text-lg font-semibold text-white mb-2 text-center">{step.title}</h3>
                  <p className="text-sm text-gray-300 text-center mb-3">{step.description}</p>
                  {step.timing && (
                    <div className="text-xs text-center bg-red-600/50 text-white px-3 py-1 rounded-full">
                      {step.timing}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Knowledge Section */}
        <section className="journey-section min-h-screen flex items-center px-4 py-16" id="wandering">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4" style={{color: '#F59E0B'}}>
                Knowledge Fields
              </h2>
              <div className="text-lg text-gray-300 mb-2">📅 March - December</div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Core wisdom areas and grounding principles
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {knowledgeSteps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => openModal(step)}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 border border-white/20"
                >
                  {step.hoodieImage ? (
                    <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden">
                      <img src={step.hoodieImage} alt={step.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="text-4xl text-center mb-4">{step.icon}</div>
                  )}
                  <h3 className="text-lg font-semibold text-white mb-2 text-center">{step.title}</h3>
                  <p className="text-sm text-gray-300 text-center mb-3">{step.description}</p>
                  {step.timing && (
                    <div className="text-xs text-center bg-yellow-600/50 text-white px-3 py-1 rounded-full">
                      {step.timing}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Re-Serve Bank Section */}
        <section className="journey-section min-h-screen flex items-center px-4 py-16" id="reserve-bank">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4" style={{color: '#10B981'}}>
                Re-Serve Bank
              </h2>
              <div className="text-lg text-gray-300 mb-2">📅 March - December</div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Deepen your practice through 11 stimulus hoodies
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stimulusSteps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => openModal(step)}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 border border-white/20"
                >
                  {step.hoodieImage ? (
                    <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden">
                      <img src={step.hoodieImage} alt={step.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="text-4xl text-center mb-4">{step.icon}</div>
                  )}
                  <h3 className="text-lg font-semibold text-white mb-2 text-center">{step.title}</h3>
                  <p className="text-sm text-gray-300 text-center mb-3">{step.description}</p>
                  {step.timing && (
                    <div className="text-xs text-center bg-green-600/50 text-white px-3 py-1 rounded-full">
                      {step.timing}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">+ 6 more stimulus hoodies for complete practice</p>
            </div>
          </div>
        </section>

        {/* Graduation Section */}
        <section className="journey-section min-h-screen flex items-center px-4 py-16" id="ceremony-out">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4" style={{color: '#8B5CF6'}}>
                Graduation
              </h2>
              <div className="text-lg text-gray-300 mb-2">📅 December - February</div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Key to next chapter - graduation and physical hoodie
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white mb-6 text-center">Choose Your Key Color</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {graduationSteps.slice(0, 4).map((step) => (
                    <div
                      key={step.id}
                      onClick={() => openModal(step)}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 border border-white/20 text-center"
                    >
                      <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden">
                        <img src={step.hoodieImage} alt={step.title} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <p className="text-gray-300 mb-4">
                    Your key hoodie unlocks access to the Meeting Place, Star Directory, and your physical graduation hoodie
                  </p>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <div
                  onClick={() => openModal(graduationSteps[4])}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-8 cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 border border-white/20 text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden">
                    <img src={graduationSteps[4].hoodieImage} alt="Physical Hoodie" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Physical Hoodie</h4>
                  <p className="text-sm text-gray-300">Shipped in your chosen key color</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{modalData.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{modalData.title}</h3>
                    <p className="text-blue-200 capitalize">{modalData.type} • {modalData.timing}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="text-white hover:text-gray-300 text-2xl">×</button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 mb-6 leading-relaxed">{modalData.description}</p>
              
              {modalData.requirements && modalData.requirements.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Requirements</h4>
                  <ul className="space-y-2">
                    {modalData.requirements.map((req, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {modalData.resources && modalData.resources.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Resources</h4>
                  <ul className="space-y-2">
                    {modalData.resources.map((resource, index) => (
                      <li key={index} className="text-gray-300 flex items-center gap-2">
                        <span>{getResourceIcon(resource.type)}</span>
                        {resource.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}