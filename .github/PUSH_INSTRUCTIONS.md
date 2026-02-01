# GitHub Repository Setup Instructions

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right
3. Select "New repository"
4. Repository name: `ai-usage-tracker` (or your preferred name)
5. Description: "Track AI usage across devices with cognitive health monitoring"
6. Choose Public or Private
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

## Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Use these:

```bash
cd /Users/jygrwl/ai-usage-tracker

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ai-usage-tracker.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/ai-usage-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
cd /Users/jygrwl/ai-usage-tracker
gh repo create ai-usage-tracker --public --source=. --remote=origin --push
```

## Step 3: Verify

1. Go to your GitHub repository
2. Verify all files are uploaded
3. Check that README.md displays correctly

## Repository Settings (Optional)

1. Go to Settings → Pages (if you want GitHub Pages)
2. Go to Settings → Actions (to enable GitHub Actions if needed)
3. Add topics: `ai-tracking`, `cognitive-health`, `react`, `nodejs`, `sqlite`

## Next Steps

- Add a license file (MIT recommended)
- Set up GitHub Actions for CI/CD (optional)
- Add issue templates (optional)
- Configure branch protection (optional)
