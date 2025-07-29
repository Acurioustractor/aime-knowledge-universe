#!/usr/bin/env node

/**
 * AIME Data Lake Auto-Initialization Script
 * 
 * Runs on server startup to:
 * - Initialize database
 * - Start background sync
 * - Populate with initial data
 * - Set up scheduled jobs
 */

const http = require('http');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const MAX_RETRIES = 10;
const RETRY_DELAY = 2000; // 2 seconds

async function waitForServer() {
  console.log('🔍 Waiting for Next.js server to start...');
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetch(`${SERVER_URL}/api/health`);
      if (response.ok) {
        console.log('✅ Server is ready!');
        return true;
      }
    } catch (error) {
      // Server not ready yet
    }
    
    console.log(`⏳ Attempt ${i + 1}/${MAX_RETRIES} - Server not ready, waiting...`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
  }
  
  console.log('⚠️ Server didn\'t start within expected time, proceeding anyway...');
  return false;
}

async function initializeDataLake() {
  try {
    console.log('🚀 Initializing AIME Data Lake...');
    
    const response = await fetch(`${SERVER_URL}/api/data-lake/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Data Lake initialized successfully!');
      console.log('📊 Stats:', result.data);
      
      if (result.data.initial_sync_performed) {
        console.log('🔄 Initial sync completed - all data sources synchronized');
      } else {
        console.log('✅ Data Lake already contains data - background sync active');
      }
      
      return true;
    } else {
      console.error('❌ Data Lake initialization failed:', result.error);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Failed to initialize Data Lake:', error.message);
    return false;
  }
}

async function main() {
  console.log('🌊 AIME Data Lake Initialization');
  console.log('================================');
  
  // Wait for server to be ready
  await waitForServer();
  
  // Add a small delay to ensure all modules are loaded
  console.log('⏳ Waiting for modules to load...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Initialize data lake
  const success = await initializeDataLake();
  
  if (success) {
    console.log('🎉 AIME Data Lake is now operational!');
    console.log('🔄 Background sync jobs are running');
    console.log('⚡ Fast database API is ready');
    process.exit(0);
  } else {
    console.error('💥 Data Lake initialization failed');
    process.exit(1);
  }
}

// Global fetch polyfill for Node.js
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

main(); 