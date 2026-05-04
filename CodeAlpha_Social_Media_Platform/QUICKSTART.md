# Quick Start Guide - Get Up and Running in 5 Minutes!

## 🎯 Prerequisites
- Node.js 14+ installed
- MongoDB Atlas account (free)
- Modern web browser

## ⚡ 5-Minute Setup

### Step 1: MongoDB Setup (2 minutes)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create free cluster (M0)
4. Copy connection string
5. Replace username/password in string

### Step 2: Backend Setup (2 minutes)
```bash
cd social-media-app/backend
npm install
copy .env.example .env
# Edit .env and add MongoDB URI
npm run dev
```

### Step 3: Frontend Setup (1 minute)
```bash
# In another terminal
cd social-media-app/frontend
npx http-server -p 3000
```

### Step 4: Access App
- Open browser: `http://localhost:3000`
- Click "Sign Up"
- Create account and start using!

## 🧪 Test It Out

```
Test Email: test@example.com
Test Password: test1234
```

### Quick Actions to Try
1. ✅ Create a post
2. ✅ Like someone's post
3. ✅ Add a comment
4. ✅ Follow a user
5. ✅ Send a message
6. ✅ Check notifications
7. ✅ Toggle dark mode

## 📁 Project Structure

```
social-media-app/
├── backend/           # Node.js API server
│   └── server.js     # Start here
├── frontend/         # Web application
│   └── index.html   # Start here
└── README.md        # Full documentation
```

## 🔗 Important Files

| File | Purpose |
|------|---------|
| `.env` | Configuration (create from .env.example) |
| `server.js` | Backend entry point |
| `index.html` | Frontend entry point |
| `API_DOCS.md` | Complete API reference |
| `DEPLOYMENT.md` | Deploy to production |

## 🚀 Environment Variables

Create `.env` in backend folder:
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/social-media
JWT_SECRET=your_random_secret_key_here
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

## 📞 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to MongoDB | Check MongoDB URI and whitelist IP |
| Port 5000 in use | Change PORT in .env or kill process |
| Frontend not loading | Use `npx http-server` or Python server |
| Socket.io errors | Restart both frontend and backend |
| Images not loading | Use placeholder URLs or base64 |

## 📚 Next Steps

1. **Read Full Documentation**: See [README.md](README.md)
2. **Learn API Endpoints**: See [API_DOCS.md](API_DOCS.md)
3. **Deploy to Production**: See [DEPLOYMENT.md](DEPLOYMENT.md)
4. **Add Sample Data**: See [SAMPLE_DATA.md](SAMPLE_DATA.md)

## ✨ Features You Can Try

- 📝 Create posts with text and images
- ❤️ Like and comment on posts
- 👥 Follow/unfollow users
- 💬 Real-time instant messaging
- 🔔 Real-time notifications
- 🔖 Save posts for later
- 🔍 Search users and posts
- 🌙 Dark mode toggle

## 🎓 What You'll Learn

- Full-stack web development
- Real-time communication (Socket.io)
- Database design (MongoDB)
- JWT authentication
- REST API design
- Frontend state management
- Deployment strategies

## 💡 Pro Tips

1. **Open Two Browsers**: Test messaging between two users
2. **Use DevTools**: Check Network tab for API calls
3. **Check Console**: View error messages and logs
4. **Read Comments**: Code has helpful comments
5. **Start Small**: Try one feature at a time

## 🚀 Ready to Deploy?

When you're happy with the development version:

1. **Backend to Render**: See [DEPLOYMENT.md](DEPLOYMENT.md)
2. **Frontend to Vercel**: See [DEPLOYMENT.md](DEPLOYMENT.md)
3. **Database to Atlas**: Already done!

## 📧 Example Test Flow

1. Open two incognito windows
2. Window 1: Sign up as "Alice" (alice@test.com)
3. Window 2: Sign up as "Bob" (bob@test.com)
4. Alice creates a post
5. Bob likes and comments
6. Alice gets notification
7. They message each other in real-time

## 🎉 You're Ready!

**Start building your social network now!**

```bash
# Terminal 1 - Backend
cd social-media-app/backend
npm run dev

# Terminal 2 - Frontend  
cd social-media-app/frontend
npx http-server -p 3000
```

Then open `http://localhost:3000` and enjoy! 🚀

---

For detailed documentation, see:
- 📖 [Complete README](README.md)
- 🔗 [API Documentation](API_DOCS.md)
- 🌐 [Deployment Guide](DEPLOYMENT.md)
- 📊 [Sample Data](SAMPLE_DATA.md)
