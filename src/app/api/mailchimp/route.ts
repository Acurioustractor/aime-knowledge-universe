import { NextResponse } from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';

// This API route will fetch newsletters from Mailchimp
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  try {
    // Extract server prefix from API key (format: key-us12)
    const apiKey = process.env.MAILCHIMP_API_KEY;
    let serverPrefix = 'us1'; // default
    if (apiKey && apiKey.includes('-')) {
      serverPrefix = apiKey.split('-').pop() || 'us1';
    }
    
    // Configure Mailchimp API client
    mailchimp.setConfig({
      apiKey: apiKey,
      server: serverPrefix, // extracted from API key
    });
    
    // Check if Mailchimp API key is configured
    if (!apiKey || apiKey === 'your_mailchimp_api_key_here') {
      throw new Error('Mailchimp API key is not configured');
    }
    
    // Fetch campaigns from Mailchimp
    const response = await mailchimp.campaigns.list({
      count: limit,
      offset: offset,
      status: 'sent',
      sort_field: 'send_time',
      sort_dir: 'desc',
    });
    
    // Transform the response to match our expected format
    const campaigns = response.campaigns.map((campaign: any) => ({
      id: campaign.id,
      title: campaign.settings.title,
      subject: campaign.settings.subject_line,
      previewText: campaign.settings.preview_text,
      createTime: campaign.create_time,
      sendTime: campaign.send_time,
      archiveUrl: campaign.archive_url,
      // You could add additional metadata from your repository here
      tags: campaign.tags ? campaign.tags.map((tag: any) => tag.name) : [],
    }));
    
    return NextResponse.json({
      campaigns,
      totalCampaigns: response.total_items,
      limit,
      offset
    });
  } catch (error: any) {
    console.error('Mailchimp API error:', error.response?.data || error.message);
    
    // If the Mailchimp API is not configured, return mock data for development
    if (error.message === 'Mailchimp API key is not configured') {
      // Mock data for newsletters
      const mockCampaigns = [
        {
          id: 'campaign1',
          title: 'IMAGI-NATION Research Synthesis: October 2024 Update',
          subject: 'New findings from our global co-design process + 3 featured episodes',
          previewText: 'Discover the latest insights from our research synthesis',
          createTime: '2024-10-15T14:00:00Z',
          sendTime: '2024-10-15T16:00:00Z',
          archiveUrl: 'https://mailchi.mp/imagi-nation/october-2024-update',
          tags: ['research', 'synthesis', 'monthly-update']
        },
        {
          id: 'campaign2',
          title: 'Schools as Imagination Labs: Special Edition',
          subject: 'Transforming education through imagination + implementation toolkit',
          previewText: 'Special edition on reimagining education',
          createTime: '2024-09-22T14:00:00Z',
          sendTime: '2024-09-22T16:00:00Z',
          archiveUrl: 'https://mailchi.mp/imagi-nation/schools-imagination-labs',
          tags: ['education', 'imagination', 'toolkit']
        },
        {
          id: 'campaign3',
          title: 'Indigenous Knowledge Systems: Wisdom for the Future',
          subject: 'Learning from ancestral knowledge + new co-design sessions',
          previewText: 'Exploring indigenous wisdom for contemporary challenges',
          createTime: '2024-09-08T14:00:00Z',
          sendTime: '2024-09-08T16:00:00Z',
          archiveUrl: 'https://mailchi.mp/imagi-nation/indigenous-knowledge',
          tags: ['indigenous', 'knowledge', 'co-design']
        }
      ];
      
      return NextResponse.json({
        campaigns: mockCampaigns,
        totalCampaigns: mockCampaigns.length,
        limit,
        offset,
        _notice: 'Using mock data - Mailchimp API key not configured'
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch Mailchimp data' },
      { status: 500 }
    );
  }
}