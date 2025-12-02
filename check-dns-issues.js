#!/usr/bin/env node

/**
 * DNS Issue Diagnostic Script
 * 
 * This script checks for common causes of DNS_HOSTNAME_RESOLVED_PRIVATE errors
 * Run this before deploying to Vercel to catch issues early.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for DNS-related issues...\n');

const issues = [];
const warnings = [];

// Check 1: Environment variables in .env files
console.log('1️⃣ Checking .env files...');
const envFiles = ['.env', '.env.local', '.env.production', '.env.development'];
envFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        // Check for localhost, private IPs, etc.
        if (trimmed.match(/localhost|127\.0\.0\.1|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\./i)) {
          issues.push({
            file,
            line: index + 1,
            content: trimmed,
            issue: 'Contains localhost or private IP address'
          });
        }
      }
    });
  }
});

// Check 2: Hardcoded URLs in code files
console.log('2️⃣ Checking code files for hardcoded URLs...');
const codeFiles = ['server.js', 'public/index.html'];
codeFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Check for hardcoded localhost URLs (but allow in comments/docs)
      if (line.includes('localhost:') && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
        warnings.push({
          file,
          line: index + 1,
          content: line.trim(),
          issue: 'Hardcoded localhost URL found (may be in comments/docs)'
        });
      }
      
      // Check for private IP patterns in code
      if (line.match(/['"]http:\/\/127\.0\.0\.1|['"]http:\/\/192\.168\.|['"]http:\/\/10\./)) {
        issues.push({
          file,
          line: index + 1,
          content: line.trim(),
          issue: 'Hardcoded private IP address in code'
        });
      }
    });
  }
});

// Check 3: Vercel configuration
console.log('3️⃣ Checking Vercel configuration...');
const vercelJsonPath = path.join(__dirname, 'vercel.json');
if (!fs.existsSync(vercelJsonPath)) {
  warnings.push({
    file: 'vercel.json',
    line: 0,
    content: 'Missing',
    issue: 'vercel.json not found - may cause deployment issues'
  });
} else {
  console.log('   ✅ vercel.json exists');
}

// Check 4: Package.json scripts
console.log('4️⃣ Checking package.json...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (!packageJson.scripts['vercel-build']) {
    warnings.push({
      file: 'package.json',
      line: 0,
      content: 'Missing vercel-build script',
      issue: 'Consider adding vercel-build script for Vercel deployments'
    });
  } else {
    console.log('   ✅ vercel-build script exists');
  }
}

// Report results
console.log('\n' + '='.repeat(60));
console.log('📊 DIAGNOSTIC RESULTS\n');

if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ No issues found! Your code looks good for Vercel deployment.\n');
  console.log('💡 Remember to check Vercel dashboard environment variables:');
  console.log('   Settings → Environment Variables');
  console.log('   Look for any containing: localhost, 127.0.0.1, or private IPs\n');
  process.exit(0);
}

if (issues.length > 0) {
  console.log('❌ CRITICAL ISSUES FOUND:\n');
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.file}:${issue.line}`);
    console.log(`   Issue: ${issue.issue}`);
    console.log(`   Content: ${issue.content}`);
    console.log('');
  });
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  warnings.forEach((warning, index) => {
    console.log(`${index + 1}. ${warning.file}:${warning.line}`);
    console.log(`   ${warning.issue}`);
    if (warning.content !== 'Missing') {
      console.log(`   Content: ${warning.content}`);
    }
    console.log('');
  });
}

console.log('='.repeat(60));
console.log('\n💡 NEXT STEPS:');
console.log('1. Fix all critical issues above');
console.log('2. Review warnings (may be false positives)');
console.log('3. Check Vercel dashboard environment variables');
console.log('4. Test deployment: vercel deploy\n');

process.exit(issues.length > 0 ? 1 : 0);

