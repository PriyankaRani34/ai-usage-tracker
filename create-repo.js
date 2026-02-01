#!/usr/bin/env node

/**
 * Script to create GitHub repository via API
 * Requires GitHub Personal Access Token
 */

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function createRepo(token) {
  const repoData = JSON.stringify({
    name: 'ai-usage-tracker',
    description: 'Track AI usage across devices with cognitive health monitoring and brain impact analysis',
    private: false,
    auto_init: false
  });

  const options = {
    hostname: 'api.github.com',
    path: '/user/repos',
    method: 'POST',
    headers: {
      'User-Agent': 'Node.js',
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': repoData.length
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 201) {
        const repo = JSON.parse(data);
        console.log('\n✅ Repository created successfully!');
        console.log(`🌐 URL: ${repo.html_url}`);
        console.log('\n📤 Now pushing code...\n');
        
        // Push code
        const { exec } = require('child_process');
        exec('git push -u origin main', (error, stdout, stderr) => {
          if (error) {
            console.log('⚠️  Push failed. You may need to authenticate.');
            console.log('   Try: git push -u origin main');
            console.log('   Use your GitHub token as password');
          } else {
            console.log('✅ Code pushed successfully!');
            console.log(`\n🎉 Repository ready at: ${repo.html_url}`);
          }
        });
      } else {
        console.error('\n❌ Failed to create repository');
        console.error(`Status: ${res.statusCode}`);
        console.error(`Response: ${data}`);
        if (res.statusCode === 401) {
          console.error('\n💡 Authentication failed. Please check your token.');
        } else if (res.statusCode === 422) {
          console.error('\n💡 Repository might already exist or name is invalid.');
        }
      }
    });
  });

  req.on('error', (error) => {
    console.error('\n❌ Error:', error.message);
  });

  req.write(repoData);
  req.end();
}

console.log('🔐 GitHub Repository Creator\n');
console.log('To create the repository, you need a GitHub Personal Access Token.');
console.log('Get one at: https://github.com/settings/tokens\n');
console.log('Required scopes: repo\n');

rl.question('Enter your GitHub Personal Access Token (or press Enter to skip): ', (token) => {
  rl.close();
  
  if (!token || token.trim() === '') {
    console.log('\n⏭️  Skipping API creation.');
    console.log('\n📋 Manual steps:');
    console.log('1. Go to: https://github.com/new');
    console.log('2. Name: ai-usage-tracker');
    console.log('3. Description: Track AI usage across devices with cognitive health monitoring');
    console.log('4. Don\'t initialize with README');
    console.log('5. Click "Create repository"');
    console.log('6. Then run: git push -u origin main');
    process.exit(0);
  }

  createRepo(token.trim());
});
