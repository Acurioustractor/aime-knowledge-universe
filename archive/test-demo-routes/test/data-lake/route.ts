/**
 * Unified Data Lake Test Endpoint
 * 
 * Tests all data lake integrations: GitHub, Airtable, and Mailchimp
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchRepositoryContent } from '@/lib/integrations/github';
import { fetchAirtableResources } from '@/lib/integrations/airtable';
import { fetchMailchimpCampaigns } from '@/lib/integrations/mailchimp';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing unified data lake integration...');
    
    const startTime = Date.now();
    const results = {
      github: { status: 'pending', data: [], error: null, timing: 0 },
      airtable: { status: 'pending', data: [], error: null, timing: 0 },
      mailchimp: { status: 'pending', data: [], error: null, timing: 0 }
    };
    
    // Test GitHub integration
    try {
      const githubStart = Date.now();
      console.log('Testing GitHub integration...');
      
      const githubData = await fetchRepositoryContent({ limit: 10 });
      results.github = {
        status: 'success',
        data: githubData,
        error: null,
        timing: Date.now() - githubStart
      };
      
      console.log(`GitHub integration successful: ${githubData.length} items`);
    } catch (error) {
      console.error('GitHub integration failed:', error);
      results.github = {
        status: 'error',
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        timing: 0
      };
    }
    
    // Test Airtable integration
    try {
      const airtableStart = Date.now();
      console.log('Testing Airtable integration...');
      
      const airtableData = await fetchAirtableResources({ limit: 10 });
      results.airtable = {
        status: 'success',
        data: airtableData,
        error: null,
        timing: Date.now() - airtableStart
      };
      
      console.log(`Airtable integration successful: ${airtableData.length} items`);
    } catch (error) {
      console.error('Airtable integration failed:', error);
      results.airtable = {
        status: 'error',
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        timing: 0
      };
    }
    
    // Test Mailchimp integration
    try {
      const mailchimpStart = Date.now();
      console.log('Testing Mailchimp integration...');
      
      const mailchimpData = await fetchMailchimpCampaigns({ limit: 10 });
      results.mailchimp = {
        status: 'success',
        data: mailchimpData,
        error: null,
        timing: Date.now() - mailchimpStart
      };
      
      console.log(`Mailchimp integration successful: ${mailchimpData.length} items`);
    } catch (error) {
      console.error('Mailchimp integration failed:', error);
      results.mailchimp = {
        status: 'error',
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        timing: 0
      };
    }
    
    const totalTime = Date.now() - startTime;
    const totalItems = results.github.data.length + results.airtable.data.length + results.mailchimp.data.length;
    const successCount = [results.github, results.airtable, results.mailchimp].filter(r => r.status === 'success').length;
    
    return NextResponse.json({
      success: successCount > 0,
      message: `Data lake test completed: ${successCount}/3 integrations successful`,
      timestamp: new Date().toISOString(),
      summary: {
        totalItems,
        totalTime: `${totalTime}ms`,
        successRate: `${successCount}/3`,
        github: {
          status: results.github.status,
          itemCount: results.github.data.length,
          timing: `${results.github.timing}ms`
        },
        airtable: {
          status: results.airtable.status,
          itemCount: results.airtable.data.length,
          timing: `${results.airtable.timing}ms`
        },
        mailchimp: {
          status: results.mailchimp.status,
          itemCount: results.mailchimp.data.length,
          timing: `${results.mailchimp.timing}ms`
        }
      },
      results
    });
    
  } catch (error) {
    console.error('Data lake test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}