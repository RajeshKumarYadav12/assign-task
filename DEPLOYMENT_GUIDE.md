# Vercel Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository pushed
- MongoDB Atlas account (for production database)

---

## 📦 Backend Deployment (API)

### Step 1: Prepare Backend

The backend is already configured with `vercel.json`. Make sure you have:
- ✅ `server/vercel.json` (already created)
- ✅ Build script in `package.json` (already added)

### Step 2: Deploy Backend to Vercel

1. **Via Vercel CLI (Recommended):**

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Navigate to server directory
cd server

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

2. **Via Vercel Dashboard:**

- Go to https://vercel.com/dashboard
- Click "New Project"
- Import your GitHub repository
- Set Root Directory to `server`
- Configure Environment Variables (see below)
- Click "Deploy"

### Step 3: Configure Backend Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-production-key-min-32-characters
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-production-key-min-32-characters
JWT_REFRESH_EXPIRE=30d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CLIENT_URL=https://your-frontend-app.vercel.app
LOG_LEVEL=info
```

**Important Notes:**
- Use MongoDB Atlas for production database (free tier available)
- Generate strong JWT secrets (32+ characters)
- Update CLIENT_URL after deploying frontend

### Step 4: Test Backend API

After deployment, your API will be available at:
```
https://your-backend-app.vercel.app/health
```

Test endpoints:
```
https://your-backend-app.vercel.app/api/v1/auth/register
https://your-backend-app.vercel.app/api/v1/auth/login
https://your-backend-app.vercel.app/api/v1/tasks
```

---

## 🎨 Frontend Deployment (React App)

### Step 1: Update API URL

Update `client/.env` or `client/.env.production`:

```env
VITE_API_URL=https://your-backend-app.vercel.app/api/v1
```

Or update directly in `client/src/api/axiosInstance.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-app.vercel.app/api/v1';
```

### Step 2: Deploy Frontend to Vercel

1. **Via Vercel CLI:**

```powershell
# Navigate to client directory
cd client

# Deploy
vercel --prod
```

2. **Via Vercel Dashboard:**

- Go to https://vercel.com/dashboard
- Click "New Project"
- Import your GitHub repository (or create new project)
- Set Root Directory to `client`
- Set Build Command: `npm run build`
- Set Output Directory: `dist`
- Add Environment Variable:
  - `VITE_API_URL` = `https://your-backend-app.vercel.app/api/v1`
- Click "Deploy"

### Step 3: Update Backend CORS

After frontend is deployed, update backend environment variable:
```
CLIENT_URL=https://your-frontend-app.vercel.app
```

---

## 🔧 Complete Deployment Process

### Method 1: Two Separate Projects (Recommended)

**Backend:**
```powershell
cd server
vercel --prod
# Note the deployed URL: https://task-api.vercel.app
```

**Frontend:**
```powershell
cd client
# Update .env with backend URL
vercel --prod
# Note the deployed URL: https://task-app.vercel.app
```

**Update CORS:**
- Go to Vercel Dashboard → Backend Project → Settings → Environment Variables
- Update `CLIENT_URL` to frontend URL
- Redeploy backend

### Method 2: Monorepo (Advanced)

Create root `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "client/dist"
      }
    }
  ]
}
```

---

## 🗄️ MongoDB Atlas Setup

1. **Create Free Cluster:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free M0 cluster (512MB)
   - Create database user
   - Whitelist IP: `0.0.0.0/0` (allow all) for Vercel

2. **Get Connection String:**
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
   ```

3. **Add to Vercel Environment Variables**

---

## ✅ Post-Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] MongoDB Atlas configured
- [ ] Environment variables set in Vercel
- [ ] CORS configured correctly
- [ ] Test registration endpoint
- [ ] Test login endpoint
- [ ] Test task creation
- [ ] Test all CRUD operations
- [ ] Check error handling
- [ ] Verify token refresh works
- [ ] Test protected routes

---

## 🧪 Test Deployed Application

### Test Backend:
```powershell
# Health check
curl https://your-backend-app.vercel.app/health

# Register
curl -X POST https://your-backend-app.vercel.app/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://your-backend-app.vercel.app/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Frontend:
1. Open `https://your-frontend-app.vercel.app`
2. Register a new account
3. Login
4. Create tasks
5. Test all features

---

## 🔄 Continuous Deployment

### Automatic Deployments:

Once connected to GitHub, Vercel automatically deploys:
- **Production:** Push to `main` branch
- **Preview:** Push to any other branch or PR

### Manual Redeployment:

```powershell
# Redeploy backend
cd server
vercel --prod

# Redeploy frontend
cd client
vercel --prod
```

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error

**Solution:** Make sure `CLIENT_URL` in backend matches frontend URL exactly:
```
CLIENT_URL=https://your-frontend-app.vercel.app
```
No trailing slash!

### Issue: MongoDB Connection Error

**Solution:** 
1. Check MongoDB Atlas whitelist: Add `0.0.0.0/0`
2. Verify connection string format
3. Ensure username/password don't contain special characters (or URL encode them)

### Issue: Environment Variables Not Working

**Solution:**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add all required variables
3. Redeploy project

### Issue: 404 on Frontend Routes

**Solution:** The `vercel.json` in client directory handles this with rewrites

### Issue: Backend Timeout

**Solution:** Vercel free tier has 10s timeout. Optimize database queries or upgrade plan.

---

## 📊 Vercel Project Settings

### Backend Settings:
- **Framework Preset:** Other
- **Root Directory:** server
- **Build Command:** `npm run build` (or leave empty)
- **Output Directory:** (leave empty)
- **Install Command:** `npm install`

### Frontend Settings:
- **Framework Preset:** Vite
- **Root Directory:** client
- **Build Command:** `npm run build`
- **Output Directory:** dist
- **Install Command:** `npm install`

---

## 🌐 Custom Domain (Optional)

1. Go to Vercel Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update environment variables with new domain

---

## 📝 Environment Variables Summary

### Backend (Required):
```
NODE_ENV=production
MONGO_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<strong-secret-32-chars>
JWT_REFRESH_SECRET=<strong-secret-32-chars>
CLIENT_URL=<your-frontend-vercel-url>
```

### Frontend (Required):
```
VITE_API_URL=<your-backend-vercel-url>/api/v1
```

---

## 🎉 Success!

Your application is now deployed and accessible worldwide!

**Share your links:**
- Backend API: `https://your-backend-app.vercel.app`
- Frontend App: `https://your-frontend-app.vercel.app`

Update these URLs in your:
- README.md
- SUBMISSION_TEMPLATE.md
- GitHub repository description

---

## 📞 Need Help?

- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Check Vercel deployment logs for errors
- Use Vercel Runtime Logs for debugging

---

**Congratulations on deploying your full-stack application! 🚀**
