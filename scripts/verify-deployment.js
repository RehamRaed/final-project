#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Deployment Verification Script
 * Checks all critical configurations before deployment
 */

const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  try {
    if (fs.existsSync(filePath)) {
      log(`✓ ${description}`, 'green');
      return true;
    } else {
      log(`✗ ${description} - FILE NOT FOUND`, 'red');
      return false;
    }
  } catch (e) {
    log(`✗ ${description} - ERROR: ${e.message}`, 'red');
    return false;
  }
}

function checkEnvVariable(key) {
  const value = process.env[key];
  if (value) {
    log(`✓ ${key} is set`, 'green');
    return true;
  } else {
    log(`✗ ${key} is NOT set`, 'red');
    return false;
  }
}

async function runVerification() {
  log('\n🔍 Starting Deployment Verification...\n', 'blue');

  let passed = 0;
  let failed = 0;

  // Check critical files
  log('📁 Checking critical files:', 'blue');
  const files = [
    ['next.config.ts', 'Next.js configuration'],
    ['tsconfig.json', 'TypeScript configuration'],
    ['package.json', 'Package configuration'],
    ['middleware.ts', 'Authentication middleware'],
    ['.env.local', 'Environment variables'],
  ];

  files.forEach(([file, desc]) => {
    if (checkFile(file, desc)) {
      passed++;
    } else {
      failed++;
    }
  });

  // Check environment variables
  log('\n🔑 Checking environment variables:', 'blue');
  const envVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_APP_URL',
  ];

  envVars.forEach(envVar => {
    if (checkEnvVariable(envVar)) {
      passed++;
    } else {
      failed++;
    }
  });

  // Check package.json scripts
  log('\n📦 Checking package.json scripts:', 'blue');
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const requiredScripts = ['dev', 'build', 'start', 'lint'];
    requiredScripts.forEach(script => {
      if (pkg.scripts && pkg.scripts[script]) {
        log(`✓ Script "${script}" found`, 'green');
        passed++;
      } else {
        log(`✗ Script "${script}" NOT found`, 'red');
        failed++;
      }
    });
  } catch (e) {
    log(`✗ Failed to read package.json: ${e.message}`, 'red');
    failed++;
  }

  // Check source structure
  log('\n📂 Checking source structure:', 'blue');
  const srcDirs = [
    ['src/app', 'App directory'],
    ['src/components', 'Components directory'],
    ['src/actions', 'Server actions directory'],
    ['src/services', 'Services directory'],
    ['src/lib', 'Utilities/Library directory'],
    ['public', 'Public assets directory'],
  ];

  srcDirs.forEach(([dir, desc]) => {
    if (checkFile(dir, desc)) {
      passed++;
    } else {
      failed++;
    }
  });

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  log(`\n📊 Verification Summary:`, 'blue');
  log(`✓ Passed: ${passed}`, 'green');
  log(`✗ Failed: ${failed}`, failed > 0 ? 'red' : 'green');

  if (failed === 0) {
    log('\n🎉 All checks passed! Ready for deployment.', 'green');
    process.exit(0);
  } else {
    log(`\n⚠️  ${failed} check(s) failed. Please fix before deploying.`, 'yellow');
    process.exit(1);
  }
}

runVerification().catch(err => {
  log(`\n❌ Verification failed: ${err.message}`, 'red');
  process.exit(1);
});
