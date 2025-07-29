// YouTube API Types
export interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: YouTubeThumbnail;
      medium: YouTubeThumbnail;
      high: YouTubeThumbnail;
      standard?: YouTubeThumbnail;
      maxres?: YouTubeThumbnail;
    };
    publishedAt: string;
    channelTitle: string;
    channelId: string;
  };
}

export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubePlaylistResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeVideo[];
}

// Mailchimp API Types
export interface MailchimpCampaign {
  id: string;
  web_id: number;
  title: string;
  subject_line: string;
  preview_text?: string;
  from_name: string;
  send_time: string;
  archive_url: string;
}

export interface MailchimpResponse {
  campaigns: MailchimpCampaign[];
  total_count: number;
}

// Wiki Content Types
export interface WikiPage {
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  date?: string;
  author?: string;
  tags?: string[];
  category?: string;
}

export interface Recommendation {
  id: string;
  number: string;
  title: string;
  description: string;
  content: string;
  videoIds?: string[];
  relatedRecommendations?: string[];
}

export interface Voice {
  id: string;
  name: string;
  role: string;
  country: string;
  region: string;
  bio: string;
  photoUrl?: string;
  quotes?: Quote[];
  videoAppearances?: string[];
}

export interface Quote {
  id: string;
  text: string;
  source: string;
  voiceId: string;
  themes?: string[];
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  videoIds?: string[];
  quoteIds?: string[];
}