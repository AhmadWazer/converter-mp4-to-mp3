# 🔗 GitHub + Vercel Integration Guide

## 📋 Overview

Your project is connected to GitHub and deployed on Vercel. This guide explains how it works and how to manage it.

---

## ✅ Current Setup

**Repository:** GitHub  
**Hosting:** Vercel  
**Deployment:** Automatic on push to GitHub

---

## 🔄 How It Works

### **Deployment Flow:**

```
1. Push to GitHub
   ↓
2. Vercel detects changes
   ↓
3. Vercel builds your project
   ↓
4. Vercel deploys to production
   ↓
5. Your app is live!
```

### **Automatic Deployments:**

- ✅ **Push to `main` branch** → Production deployment
- ✅ **Push to other branches** → Preview deployment
- ✅ **Pull Requests** → Preview deployment for testing

---

## 🚀 Deployment Workflow

### **Step 1: Make Changes Locally**

```bash
# Make your code changes
# Test locally
npm start
```

### **Step 2: Commit and Push to GitHub**

```bash
# Add changes
git add .

# Commit
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

### **Step 3: Vercel Auto-Deploys**

- Vercel automatically detects the push
- Builds your project
- Deploys to production
- You get a notification when done

---

## 🔧 Vercel Project Settings

### **Check Your Vercel Project:**

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Git**

**You should see:**
- ✅ Connected to GitHub
- ✅ Repository name
- ✅ Production branch (usually `main`)
- ✅ Root directory (if needed)

### **Build Settings:**

**Current Configuration:**
- Build Command: (uses `vercel.json` builds)
- Output Directory: (not needed for Express)
- Install Command: `npm install`
- Development Command: (not used in production)

**Note:** Since you're using `builds` in `vercel.json`, Dashboard Build Settings won't apply (this is fine!).

---

## 📝 Important Files for Vercel

### **1. `vercel.json`** (Required)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [...]
}
```

**Purpose:** Tells Vercel how to build and route your app.

### **2. `package.json`** (Required)

```json
{
  "scripts": {
    "start": "node server.js",
    "vercel-build": "echo 'Build complete'"
  },
  "dependencies": {...}
}
```

**Purpose:** Defines dependencies and scripts.

### **3. `.vercelignore`** (Optional)

```
node_modules
uploads
converted
*.log
.env
.env.local
```

**Purpose:** Excludes files from deployment.

### **4. `.gitignore`** (Recommended)

```
node_modules/
uploads/
converted/
.env
.env.local
*.log
```

**Purpose:** Prevents committing unnecessary files to GitHub.

---

## 🔐 Environment Variables

### **Setting Environment Variables:**

#### **Option 1: Vercel Dashboard (Recommended)**

1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variables:
   - `VERCEL_FUNCTION_MAX_DURATION=300`
   - Any other variables you need

3. **Important:** Set for:
   - ✅ Production
   - ✅ Preview (optional)
   - ✅ Development (optional)

#### **Option 2: Vercel CLI**

```bash
vercel env add VERCEL_FUNCTION_MAX_DURATION
# Enter: 300
# Select: Production, Preview, Development
```

### **Never Commit:**

- ❌ `.env` files
- ❌ API keys
- ❌ Secrets
- ❌ Private credentials

**Use Vercel Environment Variables instead!**

---

## 🌿 Branch Strategy

### **Production Branch:**

- **Branch:** `main` (or `master`)
- **Deployment:** Production URL
- **Example:** `https://your-app.vercel.app`

### **Preview Deployments:**

- **Any other branch** → Preview URL
- **Pull Requests** → Preview URL
- **Example:** `https://your-app-git-branch.vercel.app`

### **Workflow:**

```bash
# Work on feature branch
git checkout -b feature/new-feature

# Make changes
# Push to GitHub
git push origin feature/new-feature

# Vercel creates preview deployment
# Test at: https://your-app-git-feature-new-feature.vercel.app

# Merge to main
git checkout main
git merge feature/new-feature
git push origin main

# Vercel deploys to production
```

---

## 📊 Monitoring Deployments

### **Check Deployment Status:**

1. **Vercel Dashboard:**
   - Go to: Your Project → Deployments
   - See all deployments
   - Check build logs
   - View deployment URLs

2. **GitHub Integration:**
   - Check commit status
   - See deployment comments on PRs
   - View deployment links

### **Deployment Logs:**

1. Go to: Vercel Dashboard → Your Project → Deployments
2. Click on a deployment
3. View:
   - Build logs
   - Function logs
   - Runtime logs

### **Common Log Locations:**

- **Build logs:** Shows npm install, build process
- **Function logs:** Shows runtime errors, console.log output
- **Edge logs:** Shows edge function execution

---

## 🐛 Troubleshooting

### **Issue 1: Deployment Fails**

**Check:**
1. Build logs in Vercel Dashboard
2. `package.json` scripts
3. Dependencies in `package.json`
4. `vercel.json` configuration

**Common Causes:**
- Missing dependencies
- Build errors
- Configuration errors
- Function size limits

### **Issue 2: Changes Not Deploying**

**Check:**
1. Did you push to GitHub?
2. Is Vercel connected to correct branch?
3. Check Vercel Dashboard → Deployments

**Solution:**
```bash
# Force redeploy
vercel --prod
```

### **Issue 3: Environment Variables Not Working**

**Check:**
1. Variables set in Vercel Dashboard?
2. Set for correct environment (Production/Preview)?
3. Redeploy after adding variables

**Solution:**
- Add variables in Dashboard
- Redeploy (or wait for next push)

### **Issue 4: Function Timeout**

**Check:**
1. Function maxDuration setting
2. Vercel Dashboard → Settings → Functions
3. Set to 300 seconds (5 minutes)

**Solution:**
- Increase maxDuration in Dashboard
- Or upgrade Vercel plan

---

## 🔄 Manual Deployment

### **Using Vercel CLI:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### **Using GitHub Actions (Advanced):**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📋 Best Practices

### **1. Git Workflow:**

```bash
# Always test locally first
npm start

# Commit with clear messages
git commit -m "Fix: Download button visibility issue"

# Push to feature branch first
git push origin feature-branch

# Test preview deployment
# Then merge to main
```

### **2. Environment Variables:**

- ✅ Use Vercel Dashboard for secrets
- ✅ Never commit `.env` files
- ✅ Document required variables in README
- ✅ Use different values for dev/prod

### **3. Dependencies:**

- ✅ Commit `package.json` and `package-lock.json`
- ❌ Don't commit `node_modules/`
- ✅ Use exact versions for production
- ✅ Test dependencies before deploying

### **4. File Structure:**

```
your-project/
├── server.js          # Main server file
├── vercel.json        # Vercel configuration
├── package.json       # Dependencies
├── .vercelignore      # Files to exclude
├── .gitignore         # Git ignore
├── public/            # Static files
│   └── index.html
├── uploads/           # Temporary (gitignored)
└── converted/         # Temporary (gitignored)
```

---

## 🔍 Verifying Setup

### **Checklist:**

- [ ] Project connected to GitHub in Vercel Dashboard
- [ ] `vercel.json` exists and is correct
- [ ] `package.json` has correct dependencies
- [ ] Environment variables set in Vercel Dashboard
- [ ] `.gitignore` excludes sensitive files
- [ ] `.vercelignore` excludes unnecessary files
- [ ] Function settings configured (maxDuration, memory)

### **Test Deployment:**

1. **Make a small change:**
   ```bash
   echo "<!-- Test -->" >> public/index.html
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```

3. **Check Vercel Dashboard:**
   - Should see new deployment
   - Should complete successfully
   - Should be live in ~1-2 minutes

---

## 🚀 Quick Commands

### **Git Workflow:**

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Your message"

# Push to GitHub
git push origin main

# Check branches
git branch

# Create new branch
git checkout -b feature-name
```

### **Vercel CLI:**

```bash
# Deploy
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

---

## 📚 Resources

### **Vercel Documentation:**
- https://vercel.com/docs
- https://vercel.com/docs/git

### **GitHub Integration:**
- https://vercel.com/docs/git/vercel-for-github

### **Your Project:**
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repository: (your repo URL)

---

## 📝 Summary

**Your Setup:**
- ✅ GitHub repository
- ✅ Vercel hosting
- ✅ Automatic deployments

**Workflow:**
1. Make changes locally
2. Commit and push to GitHub
3. Vercel auto-deploys
4. App is live!

**Key Points:**
- ✅ Use Vercel Dashboard for environment variables
- ✅ Never commit secrets
- ✅ Test locally before pushing
- ✅ Check deployment logs if issues occur

**Your GitHub + Vercel integration is set up correctly!** 🎯

