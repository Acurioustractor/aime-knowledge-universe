import { NextRequest, NextResponse } from 'next/server';
import { fetchYouTubeVideos } from '@/lib/integrations/youtube';
import { fetchMailchimpCampaigns } from '@/lib/integrations/mailchimp';

export async function GET() {
  try {
    console.log('🔍 Testing all integrations separately...');
    
    // Test YouTube
    let youtubeResult;
    try {
      const youtubeVideos = await fetchYouTubeVideos({ limit: 2, query: 'AIME education' });
      youtubeResult = { success: true, count: youtubeVideos.length };
      console.log(`✅ YouTube: ${youtubeVideos.length} videos`);
    } catch (error) {
      youtubeResult = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      console.log(`❌ YouTube failed:`, error);
    }
    
    // Test Mailchimp
    let mailchimpResult;
    try {
      const mailchimpCampaigns = await fetchMailchimpCampaigns({ limit: 2 });
      mailchimpResult = { success: true, count: mailchimpCampaigns.length };
      console.log(`✅ Mailchimp: ${mailchimpCampaigns.length} campaigns`);
    } catch (error) {
      mailchimpResult = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      console.log(`❌ Mailchimp failed:`, error);
    }
    
    return NextResponse.json({
      youtube: youtubeResult,
      mailchimp: mailchimpResult
    });
    
  } catch (error) {
    console.error('❌ Integration test failed:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}