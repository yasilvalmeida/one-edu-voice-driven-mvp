#!/usr/bin/env node

/**
 * 🔐 Environment Variables Verification Script
 *
 * This script helps verify that your environment variables are properly configured
 * and follows security best practices.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ONE EDU - Environment Variables Verification\n');

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envLocalPath)) {
  console.error('❌ .env.local file not found!');
  console.log('📋 To fix this:');
  console.log('   1. Copy .env.example to .env.local');
  console.log('   2. Add your actual credentials');
  console.log('   3. Run this script again\n');
  process.exit(1);
}

// Read environment variables
require('dotenv').config({ path: envLocalPath });

// Security checks
const securityChecks = [
  {
    name: 'Supabase URL configured',
    check: () => !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    fix: 'Add NEXT_PUBLIC_SUPABASE_URL to your .env.local',
  },
  {
    name: 'Supabase URL not placeholder',
    check: () =>
      !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project-id'),
    fix: 'Replace placeholder with your actual Supabase project URL',
  },
  {
    name: 'Supabase anon key configured',
    check: () => !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    fix: 'Add NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local',
  },
  {
    name: 'Supabase anon key not placeholder',
    check: () =>
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('your-anon-key'),
    fix: 'Replace placeholder with your actual Supabase anon key',
  },
  {
    name: 'OpenAI API key configured',
    check: () => !!process.env.OPENAI_API_KEY,
    fix: 'Add OPENAI_API_KEY to your .env.local',
  },
  {
    name: 'OpenAI API key not placeholder',
    check: () => !process.env.OPENAI_API_KEY?.includes('your-openai-api-key'),
    fix: 'Replace placeholder with your actual OpenAI API key',
  },
  {
    name: 'Service role key is server-side only',
    check: () => !process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
    fix: 'Remove NEXT_PUBLIC_ prefix from service role key - it should be server-side only!',
  },
];

let allPassed = true;

console.log('Running security checks...\n');

securityChecks.forEach((check) => {
  const passed = check.check();
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${check.name}`);

  if (!passed) {
    console.log(`   💡 ${check.fix}\n`);
    allPassed = false;
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('🎉 All security checks passed!');
  console.log('📋 Your environment is properly configured.');
  console.log('🚀 You can now start the development server with: npm run dev');
} else {
  console.log('⚠️  Some security checks failed.');
  console.log('🔧 Please fix the issues above and run this script again.');
}

console.log('\n🔗 Need help? Check out:');
console.log('   • SECURITY.md for security guidelines');
console.log('   • .env.example for configuration template');
console.log('   • README.md for setup instructions');
