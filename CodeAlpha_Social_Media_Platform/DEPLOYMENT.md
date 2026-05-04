# Deployment Guide

Complete guide to deploy SocialHub to production.

## 🚀 Deployment Options

### 1. Deploy Backend to Render.com

Render is a simple, free alternative to Heroku.

#### Steps:

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub account

2. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Create New Web Service**
   - Dashboard > New > Web Service
   - Connect your GitHub repository
   - Select the social-media-app repository

4. **Configure Service**
   - Name: `socialhub-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Instance Type: Free

5. **Add Environment Variables**
   - Click "Environment"
   - Add the following:
     ```
     PORT=5000
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-media
     JWT_SECRET=generate-a-strong-random-string-here
     JWT_EXPIRE=7d
     NODE_ENV=production
     CORS_ORIGIN=https://your-frontend-url.com
     ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (usually 5-10 minutes)
   - Copy the backend URL (e.g., `https://socialhub-backend.onrender.com`)

### 2. Deploy Frontend to Vercel

Vercel is the easiest way to deploy Next.js/static sites.

#### Steps:

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub account

2. **Import Project**
   - Click "New Project"
   - Select your GitHub repository
   - Select `social-media-app` as root

3. **Build Settings**
   - Framework: `Other` (or leave blank for static)
   - Build Command: Leave empty
   - Output Directory: `frontend`

4. **Environment Variables**
   - Add to `.env.local`:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com/api
     ```

5. **Before Deployment**
   - Update `frontend/js/api.js`:
     ```javascript
     const API_URL = 'https://socialhub-backend.onrender.com/api';
     ```

6. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Access your app at the provided URL

### 3. Alternative: Deploy to Railway.app

Railway is another great option with generous free tier.

#### Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add Variables**
   - Go to Variables
   - Add all environment variables from `.env`

4. **Deploy**
   - Railway automatically deploys
   - Get URL from deployment details

## 📦 MongoDB Atlas Setup for Production

1. **Create Free Cluster**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Sign up
   - Create a new project
   - Create a cluster (M0 free tier)

2. **Create Database User**
   - Security > Database Access
   - Add New Database User
   - Set username and password (save these!)
   - Assign role: `Atlas admin`

3. **Whitelist IP Addresses**
   - Security > Network Access
   - Add IP Address
   - For development: `0.0.0.0/0` (not secure!)
   - For production: Add specific IPs only

4. **Get Connection String**
   - Clusters > Connect > Connect your application
   - Copy connection string
   - Replace `<username>` and `<password>`
   - Database name: `social-media`

5. **Example URI**
   ```
   mongodb+srv://admin:SecurePassword123@cluster-name.mongodb.net/social-media?retryWrites=true&w=majority
   ```

## 🔐 Security Checklist for Production

### Environment Variables
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Change default passwords
- [ ] Use unique database credentials
- [ ] Set NODE_ENV=production

### Database Security
- [ ] Enable IP whitelist (not 0.0.0.0/0)
- [ ] Use strong database passwords
- [ ] Enable MongoDB encryption
- [ ] Regular backups enabled
- [ ] Two-factor authentication on MongoDB Atlas

### Application Security
- [ ] CORS limited to your domain only
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Rate limiting implemented
- [ ] Input validation active
- [ ] No secrets in code
- [ ] No debug logs in production

### Frontend Security
- [ ] API key not exposed in frontend code
- [ ] No sensitive data in localStorage
- [ ] HTTPS-only communication
- [ ] Content Security Policy headers set

## 📊 Monitoring & Maintenance

### Enable Monitoring on Render
1. Go to Service > Logs
2. Monitor real-time logs
3. Set up alerts for errors

### Enable Monitoring on Vercel
1. Go to Project > Monitoring
2. Track performance metrics
3. Get alerts for deployment issues

### MongoDB Monitoring
1. Go to Atlas > Monitoring
2. Monitor cluster health
3. Check replication lag
4. Monitor database size

## 🔄 CI/CD Pipeline

### GitHub Actions for Deployment

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

Get deploy hook from Render:
1. Service > Settings > Deploy Hook
2. Add to GitHub Secrets

## 📈 Scaling Recommendations

### When You Need to Scale
- User base exceeds 1,000
- Database size exceeds 512MB
- API response time > 500ms
- Connection limit reached

### Scaling Steps
1. **Upgrade MongoDB**
   - Move from M0 to M2/M5 tier
   - Enable sharding for large datasets

2. **Upgrade Backend**
   - Render: Switch to paid tier
   - Add more instances if needed
   - Implement load balancing

3. **Add Caching**
   - Implement Redis
   - Cache frequently accessed data
   - Reduce database queries

4. **Optimize Database**
   - Add indexes to frequently queried fields
   - Archive old data
   - Implement pagination

5. **CDN for Static Files**
   - Use Cloudflare or AWS CloudFront
   - Store images on AWS S3
   - Reduce load on backend

## 🚨 Troubleshooting Deployment

### Backend Won't Deploy
1. Check logs: `Logs` tab in Render
2. Verify all dependencies in package.json
3. Ensure build command is correct
4. Check environment variables

### Frontend Not Connecting to Backend
1. Update API_URL in `frontend/js/api.js`
2. Check CORS_ORIGIN in backend `.env`
3. Verify backend is running
4. Check browser console for errors

### Database Connection Fails
1. Verify MongoDB URI is correct
2. Check IP whitelist includes server IP
3. Ensure database user exists
4. Try connection in MongoDB Compass

### Socket.io Not Working
1. Check CORS settings
2. Verify WebSocket is enabled
3. Check firewall/proxy settings
4. Use browser DevTools > Network

## 📝 Deployment Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database backups enabled
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Error logging enabled
- [ ] Performance metrics set up
- [ ] Domain configured
- [ ] Email alerts configured
- [ ] Backup plan documented

## 💰 Cost Estimate

### Free Tier (Monthly)
- Render Web Service: Free (3 months)
- Vercel: Free
- MongoDB Atlas: Free (512MB)
- **Total: $0**

### Paid Tier (Monthly)
- Render: $7+ per service
- Vercel: $20+ (Pro)
- MongoDB: $57+ (M2 cluster)
- AWS S3 (for images): ~$1-10
- **Estimated: $85-100/month**

## 🎯 Performance Optimization

### Backend Optimization
```javascript
// Add compression
app.use(compression());

// Add caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});

// Implement rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

### Frontend Optimization
- Lazy load images
- Minimize CSS/JS
- Use service workers
- Implement image compression
- Cache API responses

### Database Optimization
- Add indexes to frequently queried fields
- Use projection to select only needed fields
- Implement pagination
- Archive old data

## 📞 Support & Help

- **Render Support**: support@render.com
- **Vercel Support**: support@vercel.com
- **MongoDB Support**: support.mongodb.com
- **GitHub Issues**: GitHub repository issues

---

**Successfully deployed! 🎉**
