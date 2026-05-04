// Posts Management
async function loadFeed() {
  const feed = document.getElementById('postsFeed');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  try {
    if (postsPage === 1) {
      loadingIndicator.classList.remove('hidden');
      feed.innerHTML = '';
    }

    const response = await api.getPosts(postsPage, 10);
    
    loadingIndicator.classList.add('hidden');

    response.posts.forEach((post) => {
      feed.appendChild(createPostElement(post));
    });

    // Show load more button if there are more posts
    if (response.pagination.currentPage < response.pagination.pages) {
      loadMoreBtn.classList.remove('hidden');
    } else {
      loadMoreBtn.classList.add('hidden');
    }
  } catch (error) {
    console.error('Error loading feed:', error);
    loadingIndicator.classList.add('hidden');
  }
}

async function handleCreatePost() {
  const content = document.getElementById('postContent').value.trim();
  const imageFile = document.getElementById('postImageInput').files[0];

  if (!content) {
    alert('Please write something to post');
    return;
  }

  try {
    // Convert image to base64 if present
    let image = '';
    if (imageFile) {
      image = await fileToBase64(imageFile);
    }

    const response = await api.createPost(content, image);
    
    // Clear form
    document.getElementById('postContent').value = '';
    document.getElementById('postImageInput').value = '';

    // Reload feed
    postsPage = 1;
    loadFeed();
  } catch (error) {
    alert(`Error creating post: ${error.message}`);
  }
}

function createPostElement(post) {
  const div = document.createElement('div');
  div.className = 'bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm';
  div.innerHTML = `
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center space-x-3">
        <img src="${post.user.profileImage}" alt="${post.user.name}" class="w-12 h-12 rounded-full">
        <div>
          <h4 class="font-semibold">${post.user.name}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">${formatTime(post.createdAt)}</p>
        </div>
      </div>
      ${post.user._id === currentUserId ? `
        <div class="relative group">
          <button class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">⋮</button>
          <div class="hidden group-hover:block absolute right-0 bg-white dark:bg-gray-700 rounded shadow-lg py-2 z-10">
            <button onclick="editPost('${post._id}')" class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Edit</button>
            <button onclick="deletePost('${post._id}')" class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600">Delete</button>
          </div>
        </div>
      ` : ''}
    </div>
    
    <p class="mb-3 text-gray-900 dark:text-white">${post.content}</p>
    
    ${post.image ? `<img src="${post.image}" alt="Post" class="w-full rounded-lg mb-3 max-h-96 object-cover">` : ''}
    
    <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 py-2 border-y border-gray-200 dark:border-gray-700">
      <span>${post.likes.length} likes</span>
      <span>${post.comments.length} comments</span>
    </div>
    
    <div class="flex items-center justify-around py-2">
      <button onclick="toggleLike('${post._id}')" class="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex-1 justify-center">
        <span class="${post.likes.some(like => like._id === currentUserId) ? 'text-red-500' : ''} text-lg">
          ${post.likes.some(like => like._id === currentUserId) ? '❤️' : '🤍'}
        </span>
        <span>Like</span>
      </button>
      <button onclick="toggleComments('${post._id}')" class="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex-1 justify-center">
        <span>💬</span>
        <span>Comment</span>
      </button>
      <button onclick="toggleSave('${post._id}')" class="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex-1 justify-center">
        <span>🔖</span>
        <span>Save</span>
      </button>
    </div>
    
    <div id="comments-${post._id}" class="hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div id="comments-list-${post._id}" class="space-y-3 mb-3">
        <!-- Comments will be loaded here -->
      </div>
      <div class="flex items-start space-x-3">
        <img src="${currentUserId ? 'https://via.placeholder.com/32' : ''}" alt="You" class="w-8 h-8 rounded-full">
        <input 
          type="text" 
          placeholder="Write a comment..." 
          class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm focus:outline-none"
          onkeypress="if(event.key === 'Enter') addComment('${post._id}', this.value); this.value = '';"
        >
      </div>
    </div>
  `;

  return div;
}

async function toggleLike(postId) {
  try {
    const post = await api.getPostById(postId);
    const hasLiked = post.post.likes.some(like => like._id === currentUserId);
    
    if (hasLiked) {
      await api.unlikePost(postId);
    } else {
      await api.likePost(postId);
    }
    
    // Reload feed
    postsPage = 1;
    loadFeed();
  } catch (error) {
    console.error('Error toggling like:', error);
  }
}

async function toggleComments(postId) {
  const commentsDiv = document.getElementById(`comments-${postId}`);
  commentsDiv.classList.toggle('hidden');
  
  if (!commentsDiv.classList.contains('hidden')) {
    await loadComments(postId);
  }
}

async function loadComments(postId) {
  try {
    const response = await api.getPostComments(postId);
    const commentsList = document.getElementById(`comments-list-${postId}`);
    
    commentsList.innerHTML = response.comments.map(comment => `
      <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-2">
            <img src="${comment.user.profileImage}" alt="${comment.user.name}" class="w-8 h-8 rounded-full">
            <div>
              <p class="font-semibold text-sm">${comment.user.name}</p>
              <p class="text-sm text-gray-700 dark:text-gray-300">${comment.text}</p>
            </div>
          </div>
          ${comment.user._id === currentUserId ? `
            <button onclick="deleteComment('${comment._id}')" class="text-red-600 text-sm">Delete</button>
          ` : ''}
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading comments:', error);
  }
}

async function addComment(postId, text) {
  if (!text.trim()) return;
  
  try {
    await api.addComment(postId, text);
    await loadComments(postId);
  } catch (error) {
    console.error('Error adding comment:', error);
  }
}

async function deleteComment(commentId) {
  if (!confirm('Delete this comment?')) return;
  
  try {
    await api.deleteComment(commentId);
    postsPage = 1;
    loadFeed();
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
}

async function deletePost(postId) {
  if (!confirm('Delete this post?')) return;
  
  try {
    await api.deletePost(postId);
    postsPage = 1;
    loadFeed();
  } catch (error) {
    alert(`Error deleting post: ${error.message}`);
  }
}

async function editPost(postId) {
  try {
    const response = await api.getPostById(postId);
    const post = response.post;

    const html = `
      <div class="p-6">
        <h3 class="text-2xl font-bold mb-4">Edit Post</h3>
        <form id="editPostForm" class="space-y-4">
          <textarea id="editPostContent" class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows="4">${post.content}</textarea>
          <input type="text" id="editPostImage" class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Image URL" value="${post.image || ''}">
          <div class="flex space-x-2">
            <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold">Save Changes</button>
            <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-700 font-semibold">Cancel</button>
          </div>
        </form>
      </div>
    `;

    showModal(html);

    document.getElementById('editPostForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const updatedContent = document.getElementById('editPostContent').value.trim();
        const updatedImage = document.getElementById('editPostImage').value.trim();
        await api.updatePost(postId, updatedContent, updatedImage);
        closeModal();
        postsPage = 1;
        loadFeed();
      } catch (error) {
        alert(`Error updating post: ${error.message}`);
      }
    });
  } catch (error) {
    alert(`Error loading post: ${error.message}`);
  }
}

async function toggleSave(postId) {
  try {
    await api.savePost(postId);
    alert('Post saved!');
  } catch (error) {
    // If already saved, unsave it
    try {
      await api.unsavePost(postId);
      alert('Post removed from saved');
    } catch (e) {
      console.error('Error:', e);
    }
  }
}

async function loadSavedPosts() {
  const feed = document.getElementById('postsFeed');
  feed.innerHTML = '<h2 class="text-2xl font-bold mb-4">Saved Posts</h2>';
  
  try {
    const response = await api.getSavedPosts(1, 10);
    response.posts.forEach((post) => {
      feed.appendChild(createPostElement(post));
    });
  } catch (error) {
    feed.innerHTML += '<p class="text-gray-500">No saved posts yet</p>';
  }
}

async function performSearch(query) {
  const feed = document.getElementById('postsFeed');
  feed.innerHTML = '<div class="text-center py-8">🔍 Searching...</div>';
  
  try {
    const userResponse = await api.searchUsers(query);
    const postResponse = await api.searchPosts(query);
    
    let html = '<h2 class="text-2xl font-bold mb-4">Search Results</h2>';
    
    if (userResponse.users.length > 0) {
      html += '<h3 class="text-xl font-bold mb-3">Users</h3>';
      html += '<div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">';
      userResponse.users.forEach(user => {
        html += `
          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <img src="${user.profileImage}" alt="${user.name}" class="w-16 h-16 rounded-full mx-auto mb-2">
            <p class="font-semibold">${user.name}</p>
            <p class="text-sm text-gray-500">${user.email}</p>
            <button onclick="viewUserProfile('${user.id}')" class="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">View</button>
          </div>
        `;
      });
      html += '</div>';
    }
    
    if (postResponse.posts.length > 0) {
      html += '<h3 class="text-xl font-bold mb-3">Posts</h3>';
      feed.innerHTML = html;
      postResponse.posts.forEach((post) => {
        feed.appendChild(createPostElement(post));
      });
    } else {
      if (userResponse.users.length === 0) {
        feed.innerHTML = html + '<p class="text-gray-500">No results found</p>';
      } else {
        feed.innerHTML = html;
      }
    }
  } catch (error) {
    feed.innerHTML = '<p class="text-red-600">Error searching</p>';
  }
}

async function loadSuggestedUsers() {
  const suggestions = document.getElementById('suggestedUsers');
  suggestions.innerHTML = '<div class="text-gray-500">Loading suggestions...</div>';
  try {
    const response = await api.searchUsers('a');
    const users = response.users.filter((user) => user.id !== currentUserId).slice(0, 5);
    if (!users.length) {
      suggestions.innerHTML = '<p class="text-gray-500">No suggestions available</p>';
      return;
    }

    suggestions.innerHTML = '';
    users.forEach((user) => {
      const card = document.createElement('div');
      card.className = 'bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center justify-between gap-3';
      card.innerHTML = `
        <div class="flex items-center gap-3">
          <img src="${user.profileImage}" alt="${user.name}" class="w-12 h-12 rounded-full">
          <div>
            <p class="font-semibold">${user.name}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">${user.email}</p>
          </div>
        </div>
        <button onclick="viewUserProfile('${user.id}')" class="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700">View</button>
      `;
      suggestions.appendChild(card);
    });
  } catch (error) {
    suggestions.innerHTML = '<p class="text-red-600">Unable to load suggestions</p>';
  }
}

// Helper function to convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Helper function to format time
function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
}

// User Profile Functions
async function showUserProfile(userId = null) {
  const feed = document.getElementById('postsFeed');
  
  try {
    if (!userId) userId = currentUserId;
    
    const userResponse = await api.getUser(userId);
    const postsResponse = await api.getPostsByUser(userId, 1, 10);
    const user = userResponse.user;
    
    feed.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
        <div class="h-32 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        <div class="px-6 pb-6">
          <div class="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-4">
            <img src="${user.profileImage}" alt="${user.name}" class="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800">
            <div class="mt-4 md:mt-0 flex items-center space-x-2">
              ${userId === currentUserId ? `
                <button onclick="editProfile()" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold">Edit Profile</button>
              ` : `
                <button onclick="toggleFollowUser('${userId}')" class="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold">Follow</button>
              `}
            </div>
          </div>
          <h1 class="text-3xl font-bold">${user.name}</h1>
          <p class="text-gray-600 dark:text-gray-400 mb-4">${user.email}</p>
          <p class="text-gray-700 dark:text-gray-300 mb-4">${user.bio}</p>
          <div class="flex space-x-6">
            <div class="text-center">
              <p class="font-bold text-lg">${postsResponse.posts.length}</p>
              <p class="text-gray-600 dark:text-gray-400">Posts</p>
            </div>
            <div class="text-center cursor-pointer" onclick="viewFollowers('${userId}')">
              <p class="font-bold text-lg">${user.followers.length}</p>
              <p class="text-gray-600 dark:text-gray-400">Followers</p>
            </div>
            <div class="text-center cursor-pointer" onclick="viewFollowing('${userId}')">
              <p class="font-bold text-lg">${user.following.length}</p>
              <p class="text-gray-600 dark:text-gray-400">Following</p>
            </div>
          </div>
        </div>
      </div>
      
      <h2 class="text-2xl font-bold mb-4">Posts</h2>
      <div id="userPostsContainer"></div>
    `;
    
    const postsContainer = document.getElementById('userPostsContainer');
    if (postsResponse.posts.length === 0) {
      postsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">No posts yet</p>';
    } else {
      postsResponse.posts.forEach(post => {
        postsContainer.appendChild(createPostElement(post));
      });
    }
  } catch (error) {
    feed.innerHTML = '<p class="text-red-600">Error loading profile</p>';
  }
}

function viewUserProfile(userId) {
  navigateTo('profile');
  showUserProfile(userId);
}

async function toggleFollowUser(userId) {
  try {
    const user = await api.getUser(userId);
    const isFollowing = user.user.followers.some(f => f._id === currentUserId);
    
    if (isFollowing) {
      await api.unfollowUser(userId);
    } else {
      await api.followUser(userId);
    }
    
    showUserProfile(userId);
  } catch (error) {
    console.error('Error toggling follow:', error);
  }
}

async function viewFollowers(userId) {
  try {
    const response = await api.getFollowers(userId);
    showUsersList(response.followers, 'Followers');
  } catch (error) {
    console.error('Error loading followers:', error);
  }
}

async function viewFollowing(userId) {
  try {
    const response = await api.getFollowing(userId);
    showUsersList(response.following, 'Following');
  } catch (error) {
    console.error('Error loading following:', error);
  }
}

function showUsersList(users, title) {
  let html = `
    <div class="p-6">
      <h3 class="text-2xl font-bold mb-4">${title}</h3>
      <div class="space-y-3">
  `;
  
  users.forEach(user => {
    html += `
      <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="flex items-center space-x-3">
          <img src="${user.profileImage}" alt="${user.name}" class="w-10 h-10 rounded-full">
          <div>
            <p class="font-semibold">${user.name}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">${user.email}</p>
          </div>
        </div>
        <button onclick="viewUserProfile('${user._id}')" class="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm">View</button>
      </div>
    `;
  });
  
  html += `
      </div>
    </div>
  `;
  
  showModal(html);
}

function editProfile() {
  let html = `
    <div class="p-6">
      <h3 class="text-2xl font-bold mb-4">Edit Profile</h3>
      <form id="editProfileForm" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-2">Name</label>
          <input type="text" id="editName" class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your name">
        </div>
        <div>
          <label class="block text-sm font-semibold mb-2">Bio</label>
          <textarea id="editBio" class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows="4" placeholder="Your bio"></textarea>
        </div>
        <div>
          <label class="block text-sm font-semibold mb-2">Profile Image URL</label>
          <input type="text" id="editProfileImage" class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Image URL">
        </div>
        <div class="flex space-x-2">
          <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold">Save</button>
          <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-700 font-semibold">Cancel</button>
        </div>
      </form>
    </div>
  `;
  
  showModal(html);
  
  // Load current user data
  api.getCurrentUser().then(response => {
    document.getElementById('editName').value = response.user.name;
    document.getElementById('editBio').value = response.user.bio;
    document.getElementById('editProfileImage').value = response.user.profileImage;
  });
  
  document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api.updateProfile(currentUserId, {
        name: document.getElementById('editName').value,
        bio: document.getElementById('editBio').value,
        profileImage: document.getElementById('editProfileImage').value,
      });
      closeModal();
      showUserProfile();
      loadCurrentUser();
    } catch (error) {
      alert(`Error updating profile: ${error.message}`);
    }
  });
}
