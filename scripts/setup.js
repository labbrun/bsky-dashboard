#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🦋 Bluesky Analytics Dashboard Setup\n');
console.log('This wizard will help you configure your local analytics dashboard.\n');

const config = {};

function ask(question, defaultValue = '') {
  const prompt = defaultValue ? `${question} (${defaultValue}): ` : `${question}: `;
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function setup() {
  try {
    console.log('📊 BASIC CONFIGURATION');
    console.log('─'.repeat(40));
    
    config.REACT_APP_BLUESKY_HANDLE = await ask(
      'Enter your Bluesky handle (without @)',
      'your-handle.bsky.social'
    );
    
    config.REACT_APP_AUTH_PASSWORD = await ask(
      'Set a dashboard password',
      'secure-password-123'
    );
    
    config.REACT_APP_NAME = await ask(
      'Dashboard name',
      'My Bluesky Analytics'
    );

    console.log('\n🔧 OPTIONAL FEATURES');
    console.log('─'.repeat(40));
    
    const wantDatabase = await ask('Enable database storage? (y/n)', 'n');
    
    if (wantDatabase.toLowerCase() === 'y') {
      console.log('\n📊 Supabase Configuration (for data persistence):');
      config.REACT_APP_SUPABASE_URL = await ask('Supabase URL');
      config.REACT_APP_SUPABASE_ANON_KEY = await ask('Supabase Anon Key');
    }
    
    const wantGoogle = await ask('\nEnable Google services? (y/n)', 'n');
    
    if (wantGoogle.toLowerCase() === 'y') {
      console.log('\n🔍 Google Services Configuration:');
      config.REACT_APP_GOOGLE_CSE_API_KEY = await ask('Google Custom Search API Key');
      config.REACT_APP_GOOGLE_CSE_ID = await ask('Google Custom Search Engine ID');
    }
    
    const wantLinkedIn = await ask('\nEnable LinkedIn integration? (y/n)', 'n');
    
    if (wantLinkedIn.toLowerCase() === 'y') {
      console.log('\n💼 LinkedIn Configuration:');
      config.REACT_APP_LINKEDIN_CLIENT_ID = await ask('LinkedIn Client ID');
      config.REACT_APP_LINKEDIN_CLIENT_SECRET = await ask('LinkedIn Client Secret');
    }
    
    const wantPostiz = await ask('\nEnable Postiz integration? (y/n)', 'n');
    
    if (wantPostiz.toLowerCase() === 'y') {
      console.log('\n📅 Postiz Configuration:');
      config.REACT_APP_POSTIZ_URL = await ask('Postiz URL');
      config.REACT_APP_POSTIZ_API_KEY = await ask('Postiz API Key');
    }

    console.log('\n⚙️ ADVANCED SETTINGS');
    console.log('─'.repeat(40));
    
    config.REACT_APP_MODE = 'local';
    config.REACT_APP_DEBUG = await ask('Enable debug logging? (true/false)', 'false');
    config.REACT_APP_REFRESH_INTERVAL = await ask('Auto-refresh interval (ms, 0 to disable)', '300000');

    // Generate .env file
    const envPath = path.join(process.cwd(), '.env');
    const envContent = Object.entries(config)
      .filter(([key, value]) => value) // Only include non-empty values
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Configuration complete!');
    console.log(`📝 Environment file created: ${envPath}`);
    
    console.log('\n🚀 Next steps:');
    console.log('1. Review and edit .env file if needed');
    console.log('2. Run: npm start (for development)');
    console.log('3. Or run: docker-compose up (for Docker deployment)');
    
    console.log('\n🔒 Security note:');
    console.log('- Never commit the .env file to version control');
    console.log('- Use strong, unique passwords');
    console.log('- Keep your API keys secure\n');
    
    rl.close();
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    rl.close();
    process.exit(1);
  }
}

setup();