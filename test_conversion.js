const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testConversion() {
    console.log('🧪 Testing MP4 to MP3 conversion API...\n');

    try {
        // Check if server is running
        console.log('1. Checking server health...');
        const healthResponse = await axios.get('http://localhost:3000/api/health');
        console.log('✅ Server is running:', healthResponse.data.message);

        // Check for test file
        console.log('\n2. Looking for test MP4 file...');
        const testFiles = fs.readdirSync('.').filter(file => file.endsWith('.mp4'));
        if (testFiles.length === 0) {
            console.log('❌ No MP4 files found for testing');
            console.log('   Please place an MP4 file in the current directory');
            return;
        }

        const testFile = testFiles[0];
        console.log('✅ Found test file:', testFile);

        // Test conversion
        console.log('\n3. Testing conversion...');
        const formData = new FormData();
        formData.append('video', fs.createReadStream(testFile));

        const convertResponse = await axios.post('http://localhost:3000/api/convert', formData, {
            headers: formData.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        console.log('✅ Conversion response received');
        console.log('Response data:', JSON.stringify(convertResponse.data, null, 2));

        if (convertResponse.data.success) {
            console.log('\n🎉 Conversion successful!');
            console.log('Download URL:', convertResponse.data.downloadUrl);
            console.log('Filename:', convertResponse.data.filename);

            // Test download
            console.log('\n4. Testing download...');
            const downloadUrl = `http://localhost:3000${convertResponse.data.downloadUrl}`;
            const downloadResponse = await axios.get(downloadUrl, {
                responseType: 'stream',
                maxContentLength: Infinity
            });

            if (downloadResponse.status === 200) {
                console.log('✅ Download endpoint working');
            }
        } else {
            console.log('❌ Conversion failed:', convertResponse.data.message);
        }

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        if (error.response) {
            console.error('Server response:', error.response.data);
        }
    }
}

testConversion();
