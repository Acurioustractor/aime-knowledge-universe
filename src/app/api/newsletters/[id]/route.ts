/**
 * Individual Newsletter API Route
 * 
 * Provides endpoint for fetching a specific newsletter by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchMailchimpCampaignById } from '@/lib/content-integration/api/mailchimp-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Remove 'mailchimp-' prefix if present
    const campaignId = id.startsWith('mailchimp-') ? id.substring(10) : id;
    
    const newsletter = await fetchMailchimpCampaignById(campaignId);
    
    if (!newsletter) {
      return NextResponse.json(
        {
          success: false,
          error: 'Newsletter not found'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: newsletter
    });
  } catch (error) {
    console.error(`Error fetching newsletter ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch newsletter',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}