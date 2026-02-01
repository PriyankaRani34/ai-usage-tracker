# GitHub Repository Setup

## ✅ Local Git Setup Complete!

Your project has been initialized with git and all files have been committed.

## Next Steps: Push to GitHub

### Option 1: Using GitHub CLI (Easiest)

If you have GitHub CLI installed, run:

```bash
cd /Users/jygrwl/ai-usage-tracker
gh repo create ai-usage-tracker --public --source=. --remote=origin --push
```

This will:
- Create the repository on GitHub
- Add it as a remote
- Push all your code

### Option 2: Manual Setup (Step by Step)

#### Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `ai-usage-tracker`
3. Description: `Track AI usage across devices with cognitive health monitoring and brain impact analysis`
4. Choose **Public** or **Private**
5. **IMPORTANT**: Do NOT check "Add a README file" (we already have one)
6. Click **"Create repository"**

#### Step 2: Connect and Push

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
cd /Users/jygrwl/ai-usage-tracker

# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/ai-usage-tracker.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

#### Step 3: Verify

1. Go to your repository on GitHub
2. You should see all your files
3. The README.md should display with all the project information

## Repository Information

**Repository Name**: `ai-usage-tracker`

**Description**: Track AI usage across devices with cognitive health monitoring and brain impact analysis

**Topics/Tags** (add these in GitHub):
- `ai-tracking`
- `cognitive-health`
- `react`
- `nodejs`
- `express`
- `sqlite`
- `browser-extension`
- `health-monitoring`

**License**: MIT (you can add a LICENSE file later)

## What's Included

✅ Complete project structure
✅ All source code
✅ Documentation (README, guides)
✅ Configuration files
✅ .gitignore (excludes node_modules, database, build files)

## What's Excluded (via .gitignore)

- `node_modules/` (dependencies)
- `data/` (database files)
- `dashboard/build/` (build output)
- `.env` (environment variables)
- Log files

## After Pushing

1. **Add a LICENSE file** (optional but recommended):
   - Go to repository → Add file → Create new file
   - Name it `LICENSE`
   - Choose MIT license template

2. **Add repository topics** (for discoverability):
   - Go to repository → ⚙️ Settings → Topics
   - Add the topics listed above

3. **Enable GitHub Pages** (optional):
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, folder: /dashboard/build

4. **Add a .github/workflows** (optional):
   - For CI/CD automation
   - Can add tests, builds, etc.

## Troubleshooting

### If push fails with authentication:
```bash
# Use personal access token instead
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/ai-usage-tracker.git
```

### If you need to update later:
```bash
git add .
git commit -m "Your commit message"
git push
```

## Repository URL Format

After setup, your repository will be at:
- `https://github.com/YOUR_USERNAME/ai-usage-tracker`
