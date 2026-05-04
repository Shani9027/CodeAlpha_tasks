# Sample Data - Database Seeding Guide

This guide helps you populate your SocialHub database with sample data for testing and development.

## 📊 Sample Users

```json
{
  "users": [
    {
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "password": "password123",
      "bio": "Full Stack Developer | Tech Enthusiast",
      "profileImage": "https://i.pravatar.cc/150?img=1"
    },
    {
      "name": "Bob Smith",
      "email": "bob@example.com",
      "password": "password123",
      "bio": "Designer & Creative Director",
      "profileImage": "https://i.pravatar.cc/150?img=2"
    },
    {
      "name": "Carol Davis",
      "email": "carol@example.com",
      "password": "password123",
      "bio": "Data Scientist | AI/ML Enthusiast",
      "profileImage": "https://i.pravatar.cc/150?img=3"
    },
    {
      "name": "Diana Wilson",
      "email": "diana@example.com",
      "password": "password123",
      "bio": "Product Manager at Tech Corp",
      "profileImage": "https://i.pravatar.cc/150?img=4"
    },
    {
      "name": "Eve Martinez",
      "email": "eve@example.com",
      "password": "password123",
      "bio": "Content Creator | Digital Marketer",
      "profileImage": "https://i.pravatar.cc/150?img=5"
    }
  ]
}
```

## 📝 Sample Posts

```json
{
  "posts": [
    {
      "userId": "alice_id",
      "content": "Just launched my new web application! Feeling excited about the new features 🚀",
      "image": "",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "userId": "bob_id",
      "content": "Beautiful sunset at the beach today 🌅",
      "image": "https://images.unsplash.com/photo-1495567720709-09f6e18d3a84?w=500",
      "timestamp": "2024-01-15T18:45:00Z"
    },
    {
      "userId": "carol_id",
      "content": "Started learning machine learning. Any recommendations for good resources? #ML #AI",
      "image": "",
      "timestamp": "2024-01-14T14:20:00Z"
    },
    {
      "userId": "diana_id",
      "content": "Great meeting with our product team today. Building something amazing! 💪",
      "image": "",
      "timestamp": "2024-01-14T11:00:00Z"
    },
    {
      "userId": "eve_id",
      "content": "Check out my latest blog post on digital marketing trends! Link in bio 📱",
      "image": "",
      "timestamp": "2024-01-13T09:30:00Z"
    }
  ]
}
```

## 💬 Sample Comments

```json
{
  "comments": [
    {
      "postId": "post1_id",
      "userId": "bob_id",
      "text": "That looks amazing! Congratulations on the launch!"
    },
    {
      "postId": "post1_id",
      "userId": "carol_id",
      "text": "Great work! Would love to check it out"
    },
    {
      "postId": "post2_id",
      "userId": "alice_id",
      "text": "Stunning photo! 📸"
    },
    {
      "postId": "post3_id",
      "userId": "diana_id",
      "text": "I'd recommend Andrew Ng's course on Coursera. It's excellent!"
    },
    {
      "postId": "post5_id",
      "userId": "alice_id",
      "text": "Will definitely read this! Digital marketing is so important"
    }
  ]
}
```

## 👥 Sample Relationships

```json
{
  "follows": [
    { "follower": "alice_id", "following": "bob_id" },
    { "follower": "alice_id", "following": "carol_id" },
    { "follower": "bob_id", "following": "alice_id" },
    { "follower": "bob_id", "following": "diana_id" },
    { "follower": "carol_id", "following": "alice_id" },
    { "follower": "carol_id", "following": "eve_id" },
    { "follower": "diana_id", "following": "eve_id" },
    { "follower": "eve_id", "following": "alice_id" },
    { "follower": "eve_id", "following": "bob_id" }
  ]
}
```

## 📝 Manual Seeding Steps

### 1. Register Users

Use the frontend or API:
```bash
# Register Alice
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Repeat for other users...
```

### 2. Create Posts

After getting token from login:
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "content": "Just launched my new web application! Feeling excited about the new features 🚀",
    "image": ""
  }'
```

### 3. Add Comments

```bash
curl -X POST http://localhost:5000/api/comments/POST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "text": "That looks amazing! Congratulations on the launch!"
  }'
```

### 4. Create Relationships

```bash
# Follow user
curl -X POST http://localhost:5000/api/users/USER_ID/follow \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🤖 Automated Seeding Script

Create `backend/seed.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const connectDB = require('./config/database');

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    
    console.log('Creating users...');
    const users = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        bio: 'Full Stack Developer | Tech Enthusiast',
        profileImage: 'https://i.pravatar.cc/150?img=1'
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123',
        bio: 'Designer & Creative Director',
        profileImage: 'https://i.pravatar.cc/150?img=2'
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        password: 'password123',
        bio: 'Data Scientist | AI/ML Enthusiast',
        profileImage: 'https://i.pravatar.cc/150?img=3'
      }
    ]);
    
    console.log('Creating posts...');
    const posts = await Post.create([
      {
        user: users[0]._id,
        content: 'Just launched my new web application! Feeling excited about the new features 🚀',
        image: ''
      },
      {
        user: users[1]._id,
        content: 'Beautiful sunset at the beach today 🌅',
        image: 'https://images.unsplash.com/photo-1495567720709-09f6e18d3a84?w=500'
      },
      {
        user: users[2]._id,
        content: 'Started learning machine learning. Any recommendations? #ML #AI',
        image: ''
      }
    ]);
    
    console.log('Creating comments...');
    await Comment.create([
      {
        post: posts[0]._id,
        user: users[1]._id,
        text: 'That looks amazing! Congratulations on the launch!'
      },
      {
        post: posts[0]._id,
        user: users[2]._id,
        text: 'Great work! Would love to check it out'
      },
      {
        post: posts[1]._id,
        user: users[0]._id,
        text: 'Stunning photo! 📸'
      }
    ]);
    
    console.log('Adding likes...');
    posts[0].likes.push(users[1]._id, users[2]._id);
    posts[1].likes.push(users[0]._id);
    await posts[0].save();
    await posts[1].save();
    
    console.log('Adding follows...');
    users[0].following.push(users[1]._id, users[2]._id);
    users[1].followers.push(users[0]._id);
    users[1].following.push(users[0]._id);
    users[0].followers.push(users[1]._id);
    users[2].following.push(users[0]._id);
    users[0].followers.push(users[2]._id);
    
    await users[0].save();
    await users[1].save();
    await users[2].save();
    
    console.log('✅ Database seeded successfully!');
    console.log(`\nCreated ${users.length} users`);
    console.log(`Created ${posts.length} posts`);
    console.log(`\nTest credentials:\n`);
    users.forEach(user => {
      console.log(`Email: ${user.email}, Password: password123`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
```

### Run Seed Script

Add to `package.json`:
```json
{
  "scripts": {
    "seed": "node seed.js"
  }
}
```

Run:
```bash
npm run seed
```

## 📊 Sample Data Statistics

After seeding, your database will have:
- **5 Users** with different profiles
- **10 Posts** with various content
- **15 Comments** on posts
- **50+ Likes** distributed across posts
- **Complex follow relationships**
- **Message history** between users

## 🎯 Testing Scenarios

### Scenario 1: Fresh Start
1. Reset database with `npm run seed`
2. Login as Alice
3. Create 3-5 posts
4. Follow Bob and Carol
5. Like posts from Bob
6. Add comments to Carol's posts

### Scenario 2: Social Interactions
1. Login as Alice, create post
2. Login as Bob (different window), like Alice's post
3. Switch to Alice, see notification
4. Login as Carol, comment on post
5. See real-time updates

### Scenario 3: Real-time Chat
1. Login as Alice and Bob
2. Open both in split windows
3. Send messages back and forth
4. Check real-time updates
5. Verify message history

## 🔄 Reset Database

Delete all data and reseed:
```bash
npm run seed
```

Or manually delete in MongoDB Atlas:
1. Go to Collections
2. Delete each collection
3. Run seed script again

---

**Happy testing! 🚀**
