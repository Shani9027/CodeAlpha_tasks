// API Configuration
const API_URL = 'http://127.0.0.1:5000/api';
let authToken = localStorage.getItem('token');

class APIClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API Error');
      }

      return data;
    } catch (error) {
      console.error(`API Error: ${error.message}`);
      throw error;
    }
  }

  // Auth endpoints
  register(name, email, password, confirmPassword) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
  }

  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  getCurrentUser() {
    return this.request('/auth/me');
  }

  ping() {
    return this.request('/health');
  }

  // User endpoints
  getUser(userId) {
    return this.request(`/users/${userId}`);
  }

  searchUsers(query) {
    return this.request(`/users/search/${query}`);
  }

  updateProfile(userId, data) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  followUser(userId) {
    return this.request(`/users/${userId}/follow`, {
      method: 'POST',
    });
  }

  unfollowUser(userId) {
    return this.request(`/users/${userId}/unfollow`, {
      method: 'POST',
    });
  }

  getFollowers(userId) {
    return this.request(`/users/${userId}/followers`);
  }

  getFollowing(userId) {
    return this.request(`/users/${userId}/following`);
  }

  // Post endpoints
  createPost(content, image = '') {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify({ content, image }),
    });
  }

  getPosts(page = 1, limit = 10) {
    return this.request(`/posts?page=${page}&limit=${limit}`);
  }

  getPostById(postId) {
    return this.request(`/posts/${postId}`);
  }

  getFeedFollowing(page = 1, limit = 10) {
    return this.request(`/posts/feed/following?page=${page}&limit=${limit}`);
  }

  getPostsByUser(userId, page = 1, limit = 10) {
    return this.request(`/posts/user/${userId}?page=${page}&limit=${limit}`);
  }

  deletePost(postId) {
    return this.request(`/posts/${postId}`, { method: 'DELETE' });
  }

  updatePost(postId, content, image) {
    return this.request(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({ content, image }),
    });
  }

  likePost(postId) {
    return this.request(`/posts/${postId}/like`, { method: 'POST' });
  }

  unlikePost(postId) {
    return this.request(`/posts/${postId}/unlike`, { method: 'POST' });
  }

  savePost(postId) {
    return this.request(`/posts/${postId}/save`, { method: 'POST' });
  }

  unsavePost(postId) {
    return this.request(`/posts/${postId}/unsave`, { method: 'DELETE' });
  }

  getSavedPosts(page = 1, limit = 10) {
    return this.request(`/posts/saved/posts?page=${page}&limit=${limit}`);
  }

  searchPosts(query, page = 1, limit = 10) {
    return this.request(`/posts/search/${query}?page=${page}&limit=${limit}`);
  }

  // Comment endpoints
  addComment(postId, text, parentCommentId = null) {
    return this.request(`/comments/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ text, parentCommentId }),
    });
  }

  deleteComment(commentId) {
    return this.request(`/comments/${commentId}`, { method: 'DELETE' });
  }

  likeComment(commentId) {
    return this.request(`/comments/${commentId}/like`, { method: 'POST' });
  }

  unlikeComment(commentId) {
    return this.request(`/comments/${commentId}/unlike`, { method: 'POST' });
  }

  getPostComments(postId) {
    return this.request(`/comments/${postId}`);
  }

  // Message endpoints
  sendMessage(receiverId, text) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId, text }),
    });
  }

  getConversation(userId) {
    return this.request(`/messages/${userId}`);
  }

  getConversations() {
    return this.request('/messages');
  }

  markMessageAsRead(messageId) {
    return this.request(`/messages/${messageId}/read`, { method: 'PUT' });
  }

  // Notification endpoints
  getNotifications(page = 1, limit = 10) {
    return this.request(`/notifications?page=${page}&limit=${limit}`);
  }

  markNotificationAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, { method: 'PUT' });
  }

  markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', { method: 'PUT' });
  }

  deleteNotification(notificationId) {
    return this.request(`/notifications/${notificationId}`, { method: 'DELETE' });
  }

  getUnreadNotificationCount() {
    return this.request('/notifications/unread/count');
  }
}

const api = new APIClient(API_URL);
