# Setup & Installation Guide

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **npm** v6 or higher (comes with Node.js)
- **Git** (optional, for cloning)
- **MongoDB Atlas account** ([Create Free Account](https://www.mongodb.com/cloud/atlas))

## 🔧 Step-by-Step Setup

### Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (select the free tier)
4. Wait for cluster to be created (usually 5-10 minutes)
5. Click "Connect" and select "Connect your application"
6. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster-name.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
   ```
7. Replace `username`, `password`, and database name

### Step 2: Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd social-media-app/backend
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - express
   - socket.io
   - mongoose
   - bcryptjs
   - jsonwebtoken
   - dotenv
   - cors
   - multer
   - express-validator

3. **Create `.env` file:**
   ```bash
   # Windows
   copy .env.example .env

   # macOS/Linux
   cp .env.example .env
   ```

4. **Edit `.env` file with your values:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster-name.mongodb.net/social-media
   JWT_SECRET=generate-a-random-string-like-sk8734kjr3hj3hr3h3r3
   JWT_EXPIRE=7d
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Verify server.js imports:**
   All required packages should be imported. If you get errors, run:
   ```bash
   npm install express socket.io mongoose bcryptjs jsonwebtoken dotenv cors
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   Server running on port 5000
   MongoDB Connected: cluster-name.mongodb.net
   ```

### Step 3: Frontend Setup

1. **Option A: Using http-server (Recommended)**
   ```bash
   # Install globally
   npm install -g http-server

   # In the frontend folder
   cd social-media-app/frontend
   http-server -p 3000
   ```

   Access at `http://localhost:3000`

2. **Option B: Using Python**
   ```bash
   cd social-media-app/frontend
   
   # Python 3
   python -m http.server 3000
   
   # Python 2
   python -m SimpleHTTPServer 3000
   ```

3. **Option C: Using VS Code Live Server**
   - Right-click `index.html`
   - Select "Open with Live Server"

### Step 4: Verify Installation

1. Open browser and go to `http://localhost:3000`
2. You should see the SocialHub login page
3. Create a new account by clicking "Sign Up"
4. Fill in details and click "Sign Up"
5. You should be logged in and see the feed

## ✅ Testing the Application

### Test User Registration
1. Click "Sign Up"
2. Fill in all fields:
   - Full Name: Your Name
   - Email: test@example.com
   - Password: test1234
   - Confirm Password: test1234
3. Click "Sign Up"
4. You should be redirected to the feed

### Test Creating a Post
1. In the "What's on your mind?" section, type a test post
2. Click "Post"
3. You should see your post appear in the feed

### Test Like/Comment
1. Click the heart icon on a post
2. Click comment icon to add a comment
3. Type your comment and press Enter

### Test Real-time Chat
1. Create a second user (use incognito/private window)
2. On user 1, go to Messages
3. Start chatting with user 2
4. Messages should appear in real-time

### Test Notifications
1. Have user 1 like a post by user 2
2. User 2 should see a notification
3. Click the notification bell icon to view

### Test Dark Mode
1. Click the moon icon in the navbar
2. The entire app should switch to dark mode
3. This preference is saved in localStorage

## 🔧 Configuration Tips

### Change API Port
In `backend/server.js` and `backend/.env`:
```env
PORT=3001
```

Update in `frontend/js/api.js`:
```javascript
const API_URL = 'http://localhost:3001/api';
```

### Use Different MongoDB Database
In `backend/.env`:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/your-db-name
```

### Enable HTTPS (for production)
Use a reverse proxy like nginx or deploy to Render/Railway

## 🚨 Common Issues & Solutions

### Error: "MongoDB Connection Error"
**Solution:**
- Check your MongoDB URI is correct in `.env`
- Ensure MongoDB Atlas IP whitelist includes your IP
- Add `0.0.0.0/0` for local development (not secure for production!)

### Error: "Cannot GET /api/..."
**Solution:**
- Check backend server is running on port 5000
- Verify `CORS_ORIGIN` in `.env` matches your frontend URL
- Restart the backend server

### Error: "Socket.io failed to connect"
**Solution:**
- Ensure backend server is running
- Check CORS settings in `backend/config/socketIO.js`
- Clear browser cache and restart

### Port Already in Use
**Solution:**
```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000

# Kill the process and restart
```

### Images Not Loading
**Solution:**
- For development, images are stored as base64
- In production, implement cloud storage (AWS S3, Cloudinary, or Firebase)

## 📦 Production Deployment

### Deploy to Render.com

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Create Render Account** at [render.com](https://render.com)

3. **Deploy Backend:**
   - New > Web Service
   - Connect GitHub repo
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variables:
     ```
     MONGODB_URI=your_production_uri
     JWT_SECRET=your_secret_key
     NODE_ENV=production
     CORS_ORIGIN=your_frontend_url
     ```

4. **Deploy Frontend to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo
   - Build settings auto-detected
   - In `frontend/js/api.js`, update:
     ```javascript
     const API_URL = 'https://your-render-backend.onrender.com/api';
     ```
   - Deploy

## 🔐 Security Checklist

Before deploying to production:
- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Enable MongoDB IP whitelist (don't use 0.0.0.0/0)
- [ ] Use HTTPS for all communications
- [ ] Set up rate limiting
- [ ] Enable CORS only for your frontend domain
- [ ] Never commit .env to git
- [ ] Use environment variables for sensitive data
- [ ] Enable two-factor authentication on MongoDB Atlas
- [ ] Set up database backups

## 📞 Troubleshooting Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check if port is in use
netstat -ano | findstr :5000

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check MongoDB connection
npm test (if test scripts are set up)
```

## ✨ Next Steps

1. Customize the frontend with your branding
2. Add more features (stories, groups, video, etc.)
3. Implement cloud storage for images
4. Set up email notifications
5. Add analytics and monitoring
6. Implement search indexing
7. Add admin dashboard

---

**You're all set! Enjoy building with SocialHub! 🚀**
