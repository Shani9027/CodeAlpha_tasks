# API Documentation

Complete API reference for SocialHub Social Media Application.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All responses follow this format:
```json
{
  "success": true/false,
  "message": "optional message",
  "data": {}
}
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "",
    "profileImage": "https://via.placeholder.com/150"
  }
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Software Developer",
    "profileImage": "https://example.com/image.jpg",
    "followers": 150,
    "following": 75
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Software Developer",
    "profileImage": "https://example.com/image.jpg",
    "followers": [
      {
        "_id": "follower_id",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "profileImage": "https://example.com/jane.jpg"
      }
    ],
    "following": [...]
  }
}
```

---

## 👥 User Endpoints

### Get User by ID
```http
GET /users/:id
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Software Developer",
    "profileImage": "https://example.com/image.jpg",
    "followers": [...],
    "following": [...]
  }
}
```

### Search Users
```http
GET /users/search/:query
```

**Parameters:**
- `query`: Search term (min 2 characters)

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": "https://example.com/image.jpg"
    }
  ]
}
```

### Update Profile
```http
PUT /users/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "bio": "Updated bio",
  "profileImage": "https://example.com/new-image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Updated",
    "email": "john@example.com",
    "bio": "Updated bio",
    "profileImage": "https://example.com/new-image.jpg"
  }
}
```

### Follow User
```http
POST /users/:id/follow
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User followed successfully"
}
```

### Unfollow User
```http
POST /users/:id/unfollow
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User unfollowed successfully"
}
```

### Get Followers
```http
GET /users/:id/followers
```

**Response:**
```json
{
  "success": true,
  "followers": [
    {
      "_id": "follower_id",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "profileImage": "https://example.com/jane.jpg"
    }
  ]
}
```

### Get Following
```http
GET /users/:id/following
```

**Response:**
```json
{
  "success": true,
  "following": [...]
}
```

---

## 📝 Post Endpoints

### Create Post
```http
POST /posts
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "This is my first post!",
  "image": "base64_encoded_image_or_url"
}
```

**Response:**
```json
{
  "success": true,
  "post": {
    "_id": "post_id",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "profileImage": "https://example.com/image.jpg"
    },
    "content": "This is my first post!",
    "image": "...",
    "likes": [],
    "comments": [],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get All Posts
```http
GET /posts?page=1&limit=10
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Posts per page (default: 10)

**Response:**
```json
{
  "success": true,
  "posts": [...],
  "pagination": {
    "total": 150,
    "pages": 15,
    "currentPage": 1
  }
}
```

### Get Following Feed
```http
GET /posts/feed/following?page=1&limit=10
Authorization: Bearer <token>
```

**Response:** Same as Get All Posts

### Get Post by ID
```http
GET /posts/:id
```

**Response:**
```json
{
  "success": true,
  "post": {...}
}
```

### Update Post
```http
PUT /posts/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "Updated content",
  "image": "new_image_url"
}
```

### Delete Post
```http
DELETE /posts/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

### Like Post
```http
POST /posts/:id/like
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Post liked successfully",
  "post": {...}
}
```

### Unlike Post
```http
POST /posts/:id/unlike
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Post unliked successfully",
  "post": {...}
}
```

### Save Post
```http
POST /posts/:id/save
Authorization: Bearer <token>
```

### Get Saved Posts
```http
GET /posts/saved/posts?page=1&limit=10
Authorization: Bearer <token>
```

### Unsave Post
```http
DELETE /posts/:id/unsave
Authorization: Bearer <token>
```

### Search Posts
```http
GET /posts/search/:query?page=1&limit=10
```

### Get Posts by User
```http
GET /posts/user/:userId?page=1&limit=10
```

---

## 💬 Comment Endpoints

### Add Comment
```http
POST /comments/:postId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "text": "Great post!",
  "parentCommentId": "optional_parent_comment_id"
}
```

### Delete Comment
```http
DELETE /comments/:id
Authorization: Bearer <token>
```

### Like Comment
```http
POST /comments/:id/like
Authorization: Bearer <token>
```

### Unlike Comment
```http
POST /comments/:id/unlike
Authorization: Bearer <token>
```

### Get Comments
```http
GET /comments/:postId
```

---

## 💌 Message Endpoints

### Send Message
```http
POST /messages
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "receiverId": "receiver_user_id",
  "text": "Hello!"
}
```

### Get Conversations
```http
GET /messages
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "conversations": [
    {
      "user": {
        "_id": "user_id",
        "name": "Jane Doe",
        "profileImage": "..."
      },
      "lastMessage": "See you soon!",
      "lastMessageTime": "2024-01-15T10:30:00Z",
      "unreadCount": 3
    }
  ]
}
```

### Get Conversation with User
```http
GET /messages/:userId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "_id": "message_id",
      "sender": {...},
      "receiver": {...},
      "text": "Hello!",
      "read": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Mark Message as Read
```http
PUT /messages/:id/read
Authorization: Bearer <token>
```

---

## 🔔 Notification Endpoints

### Get Notifications
```http
GET /notifications?page=1&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "_id": "notification_id",
      "user": "user_id",
      "type": "like",
      "referenceId": "post_id",
      "actor": {
        "_id": "actor_id",
        "name": "Jane Doe",
        "profileImage": "..."
      },
      "read": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {...}
}
```

### Mark Notification as Read
```http
PUT /notifications/:id/read
Authorization: Bearer <token>
```

### Mark All as Read
```http
PUT /notifications/read-all
Authorization: Bearer <token>
```

### Delete Notification
```http
DELETE /notifications/:id
Authorization: Bearer <token>
```

### Get Unread Count
```http
GET /notifications/unread/count
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "unreadCount": 5
}
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to delete this post"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Post not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## 🔌 Socket.io Events

### Client -> Server

#### user_online
Emit when user comes online
```javascript
socket.emit('user_online', userId);
```

#### send_message
Send a message in real-time
```javascript
socket.emit('send_message', {
  senderId: 'user_id',
  receiverId: 'receiver_id',
  message: 'Hello!',
  timestamp: new Date()
});
```

#### typing
Indicate user is typing
```javascript
socket.emit('typing', {
  senderId: 'user_id',
  receiverId: 'receiver_id'
});
```

#### stop_typing
Indicate user stopped typing
```javascript
socket.emit('stop_typing', {
  senderId: 'user_id',
  receiverId: 'receiver_id'
});
```

#### send_notification
Send a notification
```javascript
socket.emit('send_notification', {
  userId: 'user_id',
  notification: {...}
});
```

### Server -> Client

#### user_status_change
User status changed
```javascript
socket.on('user_status_change', (data) => {
  // data: { userId, status, onlineUsers }
});
```

#### receive_message
Receive a message
```javascript
socket.on('receive_message', (data) => {
  // data: { senderId, receiverId, message, timestamp }
});
```

#### user_typing
User is typing
```javascript
socket.on('user_typing', (data) => {
  // data: { senderId }
});
```

#### user_stop_typing
User stopped typing
```javascript
socket.on('user_stop_typing', (data) => {
  // data: { senderId }
});
```

#### receive_notification
Receive a notification
```javascript
socket.on('receive_notification', (notification) => {
  // notification object
});
```

---

## 🧪 Example Usage

### JavaScript/Fetch Example

```javascript
// Register
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    confirmPassword: 'password123'
  })
})
.then(res => res.json())
.then(data => {
  const token = data.token;
  localStorage.setItem('token', token);
});

// Create Post
fetch('http://localhost:5000/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    content: 'My first post!',
    image: ''
  })
})
.then(res => res.json())
.then(data => console.log(data.post));
```

---

**For more information, refer to the README.md file**
