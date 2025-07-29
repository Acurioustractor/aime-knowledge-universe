/**
 * Mock data for content integration testing
 * 
 * This file provides mock content items for testing the content integration system
 * before real API integrations are implemented.
 */

import { ContentItem } from './content-integration/models/content-item';

/**
 * Get mock content items
 * 
 * @returns Array of mock content items
 */
export function getMockContent(): ContentItem[] {
  return [
    // Story content items
    {
      id: 'story1',
      title: 'Personal Story: My Journey in Education',
      description: 'A personal story about my journey in education and how it transformed my perspective on learning.',
      contentType: 'video',
      source: 'youtube',
      url: 'https://youtube.com/watch?v=123',
      date: '2023-01-01',
      tags: ['story', 'personal', 'journey', 'education'],
      themes: [{ id: 'theme1', name: 'Education', relevance: 90 }],
      topics: [{ id: 'topic1', name: 'Personal Growth', keywords: ['growth'] }],
      authors: ['Author 1'],
      thumbnail: '/assets/images/School - Day 4-16.jpg'
    },
    {
      id: 'story2',
      title: 'Impact Story: Education in Rural Communities',
      description: 'A story about the impact of education initiatives in rural communities and how they are changing lives.',
      contentType: 'video',
      source: 'youtube',
      url: 'https://youtube.com/watch?v=456',
      date: '2023-01-20',
      tags: ['story', 'impact', 'education', 'rural'],
      themes: [{ id: 'theme1', name: 'Education', relevance: 85 }],
      topics: [{ id: 'topic5', name: 'Rural Education', keywords: ['rural'] }],
      authors: ['Author 6'],
      thumbnail: '/assets/images/School - Day 4-20.jpg'
    },
    {
      id: 'story3',
      title: 'Case Study: Innovative Learning Approaches',
      description: 'A case study examining innovative approaches to learning and their outcomes in different contexts.',
      contentType: 'document',
      source: 'airtable',
      url: 'https://example.com/case-study',
      date: '2023-01-15',
      tags: ['story', 'case study', 'education', 'innovation'],
      themes: [{ id: 'theme1', name: 'Education', relevance: 80 }, { id: 'theme2', name: 'Innovation', relevance: 85 }],
      topics: [{ id: 'topic6', name: 'Learning Innovation', keywords: ['innovation'] }],
      authors: ['Author 7'],
      thumbnail: '/assets/images/School - Day 4-44.jpg'
    },
    
    // Research content items
    {
      id: 'research1',
      title: 'Research Findings: Education Impact',
      description: 'Research findings about education impact and how it affects communities over time.',
      contentType: 'document',
      source: 'airtable',
      url: 'https://example.com/research',
      date: '2023-01-02',
      tags: ['research', 'education', 'impact'],
      themes: [{ id: 'theme1', name: 'Education', relevance: 85 }],
      topics: [{ id: 'topic2', name: 'Impact Assessment', keywords: ['impact'] }],
      authors: ['Author 2'],
      thumbnail: '/assets/images/Uluru Day 1-47.jpg'
    },
    {
      id: 'research2',
      title: 'Data Analysis: Learning Outcomes',
      description: 'A comprehensive analysis of learning outcomes across different educational contexts and methodologies.',
      contentType: 'document',
      source: 'github',
      url: 'https://example.com/analysis',
      date: '2023-01-05',
      tags: ['research', 'analysis', 'education', 'outcomes'],
      themes: [{ id: 'theme1', name: 'Education', relevance: 90 }],
      topics: [{ id: 'topic7', name: 'Learning Outcomes', keywords: ['outcomes'] }],
      authors: ['Author 8'],
      thumbnail: '/assets/images/Uluru Day 1-73.jpg'
    },
    
    // Tool content items
    {
      id: 'tool1',
      title: 'Implementation Toolkit: Education',
      description: 'A toolkit for education implementation with practical resources and guides.',
      contentType: 'toolkit',
      source: 'airtable',
      url: 'https://example.com/toolkit',
      date: '2023-01-10',
      tags: ['tool', 'toolkit', 'education', 'implementation'],
      themes: [{ id: 'theme1', name: 'Education', relevance: 80 }],
      topics: [{ id: 'topic4', name: 'Implementation', keywords: ['implement'] }],
      authors: ['Author 5']
    },
    {
      id: 'tool2',
      title: 'Worksheet: Learning Assessment',
      description: 'A worksheet for assessing learning outcomes and progress in educational settings.',
      contentType: 'document',
      source: 'github',
      url: 'https://example.com/worksheet',
      date: '2023-01-12',
      tags: ['tool', 'worksheet', 'education', 'assessment'],
      themes: [{ id: 'theme1', name: 'Education', relevance: 75 }],
      topics: [{ id: 'topic8', name: 'Assessment', keywords: ['assessment'] }],
      authors: ['Author 9']
    },
    {
      id: 'tool3',
      title: 'Guide: Facilitating Learning Communities',
      description: 'A comprehensive guide for facilitating effective learning communities and collaborative environments.',
      contentType: 'document',
      source: 'github',
      url: 'https://example.com/guide',
      date: '2023-01-18',
      tags: ['tool', 'guide', 'education', 'facilitation'],
      themes: [{ id: 'theme1', name: 'Education', relevance: 85 }, { id: 'theme3', name: 'Community', relevance: 80 }],
      topics: [{ id: 'topic9', name: 'Facilitation', keywords: ['facilitate'] }],
      authors: ['Author 10']
    },
    
    // Event content items
    {
      id: 'event1',
      title: 'Workshop: Education Innovation',
      description: 'A workshop about education innovation and new approaches to learning.',
      contentType: 'event',
      source: 'airtable',
      url: 'https://example.com/event',
      date: '2023-07-15',
      tags: ['event', 'workshop', 'education', 'innovation'],
      themes: [{ id: 'theme1', name: 'Education', relevance: 75 }, { id: 'theme2', name: 'Innovation', relevance: 80 }],
      topics: [{ id: 'topic3', name: 'Education Innovation', keywords: ['innovation'] }],
      authors: ['Author 3'],
      metadata: {
        eventDetails: {
          eventType: 'workshop',
          startDate: '2023-07-15',
          endDate: '2023-07-15',
          location: 'Virtual'
        }
      }
    },
    {
      id: 'event2',
      title: 'Conference: Future of Learning',
      description: 'A conference exploring the future of learning and educational methodologies.',
      contentType: 'event',
      source: 'airtable',
      url: 'https://example.com/conference',
      date: '2023-08-10',
      tags: ['event', 'conference', 'education', 'future'],
      themes: [{ id: 'theme1', name: 'Education', relevance: 90 }, { id: 'theme2', name: 'Innovation', relevance: 85 }],
      topics: [{ id: 'topic10', name: 'Future of Learning', keywords: ['future'] }],
      authors: ['Author 11'],
      metadata: {
        eventDetails: {
          eventType: 'conference',
          startDate: '2023-08-10',
          endDate: '2023-08-12',
          location: 'Sydney, Australia'
        }
      }
    },
    {
      id: 'event3',
      title: 'Training: Facilitation Skills',
      description: 'A training program for developing effective facilitation skills in educational contexts.',
      contentType: 'event',
      source: 'airtable',
      url: 'https://example.com/training',
      date: '2025-09-05',
      tags: ['event', 'training', 'education', 'facilitation'],
      themes: [{ id: 'theme1', name: 'Education', relevance: 80 }],
      topics: [{ id: 'topic9', name: 'Facilitation', keywords: ['facilitate'] }],
      authors: ['Author 12'],
      metadata: {
        eventDetails: {
          eventType: 'training',
          startDate: '2025-09-05',
          endDate: '2025-09-07',
          location: 'Melbourne, Australia'
        }
      }
    },
    
    // Update content items
    {
      id: 'newsletter1',
      title: 'AIME Newsletter: January 2024 - New Year, New Possibilities',
      description: 'Welcome to 2024! This month we explore new educational initiatives, share inspiring stories from our global community, and announce exciting upcoming events.',
      contentType: 'newsletter',
      source: 'mailchimp',
      url: 'https://example.com/newsletter-jan-2024',
      date: '2024-01-15',
      tags: ['newsletter', 'monthly', 'education', 'community'],
      themes: [
        { id: 'theme1', name: 'Education', relevance: 85 },
        { id: 'theme3', name: 'Community', relevance: 70 }
      ],
      authors: ['AIME Team'],
      metadata: {
        newsletterType: 'monthly',
        emailsSent: 15420,
        openRate: 0.34,
        clickRate: 0.08,
        updateDetails: {
          updateType: 'newsletter',
          newsletterType: 'monthly'
        }
      }
    },
    {
      id: 'newsletter2',
      title: 'AIME Weekly Update: Research Breakthrough in Indigenous Education',
      description: 'Exciting developments in our research on Indigenous education methods, plus updates from our programs across Australia and internationally.',
      contentType: 'newsletter',
      source: 'mailchimp',
      url: 'https://example.com/newsletter-weekly-research',
      date: '2024-01-08',
      tags: ['newsletter', 'weekly', 'research', 'indigenous', 'education'],
      themes: [
        { id: 'theme1', name: 'Education', relevance: 90 },
        { id: 'theme4', name: 'Indigenous Knowledge', relevance: 95 }
      ],
      authors: ['AIME Research Team'],
      metadata: {
        newsletterType: 'weekly',
        emailsSent: 8750,
        openRate: 0.42,
        clickRate: 0.12,
        updateDetails: {
          updateType: 'newsletter',
          newsletterType: 'weekly'
        }
      }
    },
    {
      id: 'newsletter3',
      title: 'Special Announcement: IMAGI-NATION Global Launch',
      description: 'Join us for the global launch of IMAGI-NATION - a revolutionary platform connecting young minds worldwide to co-design the future.',
      contentType: 'newsletter',
      source: 'mailchimp',
      url: 'https://example.com/newsletter-imagi-nation-launch',
      date: '2024-01-26',
      tags: ['newsletter', 'special', 'announcement', 'imagi-nation', 'launch'],
      themes: [
        { id: 'theme2', name: 'Innovation', relevance: 95 },
        { id: 'theme3', name: 'Community', relevance: 80 },
        { id: 'theme5', name: 'Global Impact', relevance: 90 }
      ],
      authors: ['Jack Manning Bancroft', 'AIME Team'],
      metadata: {
        newsletterType: 'special',
        emailsSent: 25000,
        openRate: 0.58,
        clickRate: 0.18,
        updateDetails: {
          updateType: 'newsletter',
          newsletterType: 'special'
        }
      }
    },
    {
      id: 'newsletter4',
      title: 'AIME Quarterly Report: Impact Across 52 Countries',
      description: 'Our quarterly deep-dive into the global impact of AIME programs, featuring stories from 52 countries and comprehensive data analysis.',
      contentType: 'newsletter',
      source: 'mailchimp',
      url: 'https://example.com/newsletter-quarterly-q4-2023',
      date: '2023-12-15',
      tags: ['newsletter', 'quarterly', 'report', 'global', 'impact'],
      themes: [
        { id: 'theme1', name: 'Education', relevance: 85 },
        { id: 'theme5', name: 'Global Impact', relevance: 95 },
        { id: 'theme6', name: 'Data & Research', relevance: 80 }
      ],
      authors: ['AIME Impact Team'],
      metadata: {
        newsletterType: 'quarterly',
        emailsSent: 18500,
        openRate: 0.45,
        clickRate: 0.15,
        updateDetails: {
          updateType: 'newsletter',
          newsletterType: 'quarterly'
        }
      }
    },
    {
      id: 'newsletter5',
      title: 'Event Spotlight: Upcoming Workshops and Webinars',
      description: 'Discover upcoming AIME workshops, webinars, and training sessions designed to empower educators and community leaders worldwide.',
      contentType: 'newsletter',
      source: 'mailchimp',
      url: 'https://example.com/newsletter-events-feb-2024',
      date: '2024-02-01',
      tags: ['newsletter', 'events', 'workshops', 'webinars', 'training'],
      themes: [
        { id: 'theme1', name: 'Education', relevance: 80 },
        { id: 'theme7', name: 'Professional Development', relevance: 90 }
      ],
      authors: ['AIME Events Team'],
      metadata: {
        newsletterType: 'event',
        emailsSent: 12300,
        openRate: 0.38,
        clickRate: 0.22,
        updateDetails: {
          updateType: 'newsletter',
          newsletterType: 'event'
        }
      }
    },
    {
      id: 'update2',
      title: 'Announcement: New Research Partnership',
      description: 'Announcing a new research partnership to explore innovative educational approaches.',
      contentType: 'document',
      source: 'airtable',
      url: 'https://example.com/announcement',
      date: '2023-01-20',
      tags: ['update', 'announcement', 'research', 'partnership'],
      themes: [{ id: 'theme1', name: 'Education', relevance: 75 }, { id: 'theme2', name: 'Innovation', relevance: 80 }],
      authors: ['Author 13'],
      metadata: {
        updateDetails: {
          updateType: 'announcement'
        }
      }
    },
    {
      id: 'update3',
      title: 'News: Education Innovation Award',
      description: 'News about the recent Education Innovation Award recipients and their groundbreaking work.',
      contentType: 'document',
      source: 'airtable',
      url: 'https://example.com/news',
      date: '2023-01-25',
      tags: ['update', 'news', 'education', 'award'],
      themes: [{ id: 'theme1', name: 'Education', relevance: 80 }, { id: 'theme2', name: 'Innovation', relevance: 85 }],
      authors: ['Author 14'],
      metadata: {
        updateDetails: {
          updateType: 'news'
        }
      }
    },
    {
      id: 'update4',
      title: 'Release: New Learning Resources',
      description: 'Announcing the release of new learning resources for educators and facilitators.',
      contentType: 'document',
      source: 'github',
      url: 'https://example.com/release',
      date: '2023-01-30',
      tags: ['update', 'release', 'education', 'resources'],
      themes: [{ id: 'theme1', name: 'Education', relevance: 85 }],
      authors: ['Author 15'],
      metadata: {
        updateDetails: {
          updateType: 'release'
        }
      }
    }
  ];
}