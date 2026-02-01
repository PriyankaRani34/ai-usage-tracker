#!/bin/bash

# Script to push AI Usage Tracker to GitHub
# Make sure you've created the repository at: https://github.com/PriyankaRani34/ai-usage-tracker

echo "🚀 Pushing AI Usage Tracker to GitHub..."
echo ""

# Check if remote exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ Remote 'origin' already configured"
    git remote -v
else
    echo "📝 Adding remote repository..."
    git remote add origin https://github.com/PriyankaRani34/ai-usage-tracker.git
fi

echo ""
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Repository: https://github.com/PriyankaRani34/ai-usage-tracker"
else
    echo ""
    echo "❌ Push failed. Make sure:"
    echo "   1. Repository exists at: https://github.com/PriyankaRani34/ai-usage-tracker"
    echo "   2. You're authenticated with GitHub"
    echo "   3. You have write access to the repository"
fi
