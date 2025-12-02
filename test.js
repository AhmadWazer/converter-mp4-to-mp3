#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🧪 MP4 to MP3 Converter - System Test');
console.log('=====================================\n');

// Test 1: Check Node.js dependencies
console.log('1. Checking Node.js dependencies...');
const requiredDeps = ['express', 'multer', 'fluent-ffmpeg', 'ffmpeg-static', 'cors', 'uuid'];

let depsOk = true;
requiredDeps.forEach(dep => {
    try {
        require.resolve(dep);
        console.log(`   ✅ ${dep}`);
    } catch (e) {
        console.log(`   ❌ ${dep} - NOT FOUND`);
        depsOk = false;
    }
});

if (!depsOk) {
    console.log('\n❌ Missing dependencies. Run: npm install\n');
    process.exit(1);
} else {
    console.log('   ✅ All dependencies installed\n');
}

// Test 2: Check FFmpeg availability
console.log('2. Checking FFmpeg availability...');
try {
    const ffmpegStatic = require('ffmpeg-static');
    const fs = require('fs');

    if (fs.existsSync(ffmpegStatic)) {
        console.log('   ✅ ffmpeg-static binary available');
        console.log('   ✅ FFmpeg ready (automatic installation)\n');
    } else {
        console.log('   ⚠️  ffmpeg-static binary not found');
        console.log('   This may be normal - FFmpeg will download on first use\n');
    }
} catch (error) {
    console.log('   ❌ ffmpeg-static package not found');
    console.log('   Run: npm install ffmpeg-static\n');
}

// Test 3: Check directories
console.log('3. Checking directories...');
const dirs = ['public', 'uploads', 'converted'];
let dirsOk = true;

dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`   ✅ ${dir}/`);
    } else {
        console.log(`   ❌ ${dir}/ - MISSING`);
        dirsOk = false;
    }
});

if (!dirsOk) {
    console.log('   Creating missing directories...');
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`   ✅ Created ${dir}/`);
        }
    });
}
console.log('');

// Test 4: Check server file
console.log('4. Checking server configuration...');
if (fs.existsSync('server.js')) {
    console.log('   ✅ server.js found');

    // Try to load the server (syntax check)
    try {
        require('./server.js');
        console.log('   ✅ server.js syntax OK');
    } catch (e) {
        console.log('   ❌ server.js syntax error:', e.message);
    }
} else {
    console.log('   ❌ server.js not found');
}
console.log('');

// Test 5: Check web interface
console.log('5. Checking web interface...');
if (fs.existsSync('public/index.html')) {
    console.log('   ✅ index.html found');

    const htmlContent = fs.readFileSync('public/index.html', 'utf8');
    if (htmlContent.includes('MP4 to MP3') && htmlContent.includes('/api/convert')) {
        console.log('   ✅ Web interface appears complete');
    } else {
        console.log('   ⚠️  Web interface may be incomplete');
    }
} else {
    console.log('   ❌ index.html not found');
}
console.log('');

// Summary
console.log('🎯 Test Summary:');
console.log('===============');

const serverExists = fs.existsSync('server.js');
const webExists = fs.existsSync('public/index.html');
const ffmpegWasmAvailable = (() => {
    try {
        require('@ffmpeg/ffmpeg');
        return true;
    } catch {
        return false;
    }
})();

if (serverExists && webExists && ffmpegWasmAvailable) {
    console.log('✅ System ready! Run: npm start');
    console.log('📱 Then visit: http://localhost:3000');
} else {
    console.log('❌ System not ready. Please fix the issues above.');

    if (!ffmpegWasmAvailable) {
        console.log('\n🔧 FFmpeg Fix:');
        console.log('   Run: npm install @ffmpeg/ffmpeg @ffmpeg/core');
    }

    if (!serverExists || !webExists) {
        console.log('\n🔧 Files missing - check project structure');
    }
}

console.log('\n💡 Quick commands:');
console.log('   npm start          - Start the server');
console.log('   npm run test       - Run this test again');
console.log('   http://localhost:3000 - Open web interface');
