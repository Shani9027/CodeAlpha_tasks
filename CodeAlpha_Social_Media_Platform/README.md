# SocialHub - Social Media Application

A full-stack social media platform combining features of Instagram, Twitter, and WhatsApp with real-time capabilities.

## 🚀 Project Structure

```
social-media-app/
├── backend/                    # Node.js + Express server
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── socketIO.js        # Socket.io setup
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   ├── messageController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   └── SavedPost.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   ├── comments.js
│   │   ├── messages.js
│   │   └── notifications.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── populateFields.js
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env.example
└── frontend/                   # HTML5 + CSS3 + JavaScript
    ├── index.html
    ├── css/
    │   └── styles.css
    ├── js/
    │   ├── api.js             # API client
    │   ├── socket.js          # Socket.io client
    │   ├── ui.js              # UI management
    │   ├── auth.js            # Authentication
    │   ├── posts.js           # Posts management
    │   ├── chat.js            # Chat system
    │   └── notifications.js   # Notifications
    └── images/

```

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Authentication**: JWT, bcryptjs
- **Deployment**: Vercel (Frontend), Render/Railway (Backend)

## ✨ Features

### Core Features
- ✅ User Registration & Login with JWT
- ✅ User Profiles with Follow/Unfollow
- ✅ Create, Edit, Delete Posts
- ✅ Like/Unlike Posts
- ✅ Comments System
- ✅ Bookmark/Save Posts
- ✅ Search Users & Posts

### Advanced Features
- ✅ Real-time Chat System (Socket.io)
- ✅ Online/Offline Status
- ✅ Typing Indicators
- ✅ Real-time Notifications
- ✅ Dark Mode Toggle
- ✅ Responsive Design
- ✅ Password Hashing (bcrypt)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB account (MongoDB Atlas)
- Modern web browser

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   copy .env.example .env
   ```

4. **Update `.env` with your values:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-media
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Open frontend directory:**
   ```bash
   cd frontend
   ```

2. **Open `index.html` in a browser** or use a local server:
   ```bash
   # Using Python
   python -m http.server 3000

   # Using Node.js (install http-server)
   npm install -g http-server
   http-server -p 3000
   ```

Access the app at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/search/:query` - Search users
- `PUT /api/users/:id` - Update profile
- `POST /api/users/:id/follow` - Follow user
- `POST /api/users/:id/unfollow` - Unfollow user
- `GET /api/users/:id/followers` - Get followers
- `GET /api/users/:id/following` - Get following

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts` - Get all posts
- `GET /api/posts/feed/following` - Get following feed
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post
- `POST /api/posts/:id/unlike` - Unlike post
- `POST /api/posts/:id/save` - Save post
- `GET /api/posts/saved/posts` - Get saved posts
- `GET /api/posts/search/:query` - Search posts

### Comments
- `POST /api/comments/:postId` - Add comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/like` - Like comment
- `POST /api/comments/:id/unlike` - Unlike comment
- `GET /api/comments/:postId` - Get comments

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages` - Get conversations
- `GET /api/messages/:userId` - Get conversation with user
- `PUT /api/messages/:id/read` - Mark as read

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/unread/count` - Get unread count

## 🔐 Security

- Password hashing with bcryptjs
- JWT authentication tokens
- Protected API routes
- CORS enabled
- Input validation
- XSS protection with Tailwind CSS sanitization
- CSRF protection ready

## 📱 Database Schema

### Users
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  bio: String,
  profileImage: String,
  followers: [ObjectId],
  following: [ObjectId],
  createdAt: Date
}
```

### Posts
```javascript
{
  user: ObjectId,
  content: String,
  image: String,
  likes: [ObjectId],
  comments: [ObjectId],
  createdAt: Date
}
```

### Messages
```javascript
{
  sender: ObjectId,
  receiver: ObjectId,
  text: String,
  read: Boolean,
  createdAt: Date
}
```

### Notifications
```javascript
{
  user: ObjectId,
  type: String (like|comment|follow|message),
  referenceId: ObjectId,
  actor: ObjectId,
  read: Boolean,
  createdAt: Date
}
```

## 🌐 Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `CORS_ORIGIN=your-frontend-url`
6. Deploy

### Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Import GitHub repository
3. Frontend settings are usually auto-detected
4. Update API URL in `frontend/js/api.js`:
   ```javascript
   const API_URL = 'https://your-backend-url/api';
   ```
5. Deploy

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add connection string to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/social-media
   ```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] Create post with text and image
- [ ] Like/Unlike post
- [ ] Add comment to post
- [ ] Delete own post
- [ ] Follow/Unfollow user
- [ ] Send message in real-time
- [ ] Receive notifications
- [ ] Search users and posts
- [ ] Save posts for later
- [ ] Toggle dark mode
- [ ] View user profiles
- [ ] Update profile information

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check MongoDB URI in `.env`
- Ensure IP address is whitelisted in MongoDB Atlas
- Verify credentials are correct

### Socket.io Connection Error
- Check CORS_ORIGIN in backend `.env`
- Ensure frontend and backend URLs match
- Clear browser cache and restart

### CORS Error
- Update `CORS_ORIGIN` in `.env` to match frontend URL
- Ensure credentials are true in Socket.io settings

### Image Upload Issues
- Images are stored as base64 in current implementation
- For production, use cloud storage (AWS S3, Cloudinary)

## 🚀 Performance Tips

- Use MongoDB indexes for frequently queried fields
- Implement pagination for feeds
- Use CDN for images
- Enable compression middleware
- Add caching strategies
- Optimize Socket.io event handlers

## 📚 Additional Features to Add

- [ ] Post hashtags and trending topics
- [ ] Direct message groups
- [ ] Stories (disappearing posts)
- [ ] Video upload support
- [ ] Two-factor authentication
- [ ] User verification badges
- [ ] Blocking users
- [ ] Report inappropriate content
- [ ] Analytics dashboard
- [ ] Email notifications

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support and questions, please create an issue in the repository.

---

**Made with ❤️ for the web development community**
