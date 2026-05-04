// UI Management
let isLoginMode = true;
let currentPage = 'home';
let postsPage = 1;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  initializeUI();
  setupEventListeners();
  const backendAvailable = await verifyBackend();
  if (backendAvailable) {
    checkAuth();
  }
});

async function verifyBackend() {
  try {
    await api.ping();
    clearBackendStatus();
    return true;
  } catch (error) {
    showBackendError('Unable to connect to backend. Please start the backend server and refresh.');
    return false;
  }
}

function initializeUI() {
  // Dark mode
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) {
    document.documentElement.classList.add('dark');
  }

  // Set up event listeners
  document.getElementById('darkModeToggle')?.addEventListener('click', toggleDarkMode);
  document.getElementById('userMenuBtn')?.addEventListener('click', toggleUserMenu);
  document.getElementById('notificationBell')?.addEventListener('click', toggleNotificationDropdown);
  document.getElementById('toggleAuthBtn')?.addEventListener('click', toggleAuthMode);
  document.getElementById('navAuthBtn')?.addEventListener('click', showAuthModal);
  document.getElementById('retryBackendBtn')?.addEventListener('click', async () => {
    if (await verifyBackend()) {
      checkAuth();
    }
  });
}

function setupEventListeners() {
  // Auth form
  document.getElementById('authForm').addEventListener('submit', handleAuthSubmit);

  // Post creation
  document.getElementById('createPostBtn').addEventListener('click', handleCreatePost);
  document.getElementById('imageUploadBtn').addEventListener('click', () => {
    document.getElementById('postImageInput').click();
  });

  // Hero actions
  document.getElementById('openFeedBtn').addEventListener('click', () => {
    requireAuth(loadFeed);
  });
  document.getElementById('startPostingBtn').addEventListener('click', () => {
    requireAuth(() => {
      document.getElementById('createPostSection').classList.remove('hidden');
      document.getElementById('postContent').focus();
    });
  });

  // Navigation
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);

  // Search
  let searchTimeout;
  document.getElementById('searchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    if (query.length > 2) {
      searchTimeout = setTimeout(() => performSearch(query), 300);
    }
  });

  // Load more posts
  document.getElementById('loadMoreBtn').addEventListener('click', () => {
    postsPage++;
    loadFeed();
  });
}

function requireAuth(action) {
  if (!authToken) {
    showAuthModal();
    return;
  }
  action();
}

function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('darkMode', isDark);
}

function toggleUserMenu() {
  const dropdown = document.getElementById('userDropdown');
  dropdown.classList.toggle('hidden');
}

function toggleNotificationDropdown() {
  const dropdown = document.getElementById('notificationDropdown');
  dropdown.classList.toggle('hidden');
  if (!dropdown.classList.contains('hidden')) {
    loadNotifications();
  }
}

function setAuthMode(loginMode) {
  isLoginMode = loginMode;
  const form = document.getElementById('authForm');
  const title = document.getElementById('authModalTitle');
  const submitBtn = document.getElementById('authSubmitBtn');
  const nameInput = document.getElementById('nameInput');
  const confirmPasswordInput = document.getElementById('confirmPasswordInput');
  const toggleText = document.getElementById('toggleAuthText');

  if (isLoginMode) {
    title.textContent = 'Login to SocialHub';
    submitBtn.textContent = 'Login';
    nameInput.classList.add('hidden');
    confirmPasswordInput.classList.add('hidden');
    toggleText.innerHTML = 'Don\'t have an account? <button id="toggleAuthBtn" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Sign Up</button>';
  } else {
    title.textContent = 'Create Your Account';
    submitBtn.textContent = 'Sign Up';
    nameInput.classList.remove('hidden');
    confirmPasswordInput.classList.remove('hidden');
    toggleText.innerHTML = 'Already have an account? <button id="toggleAuthBtn" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Login</button>';
  }

  form.reset();
  const toggleBtn = document.getElementById('toggleAuthBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (event) => {
      event.preventDefault();
      setAuthMode(!isLoginMode);
    });
  }
}

function toggleAuthMode() {
  setAuthMode(!isLoginMode);
}

function navigateTo(page) {
  currentPage = page;
  const modal = document.getElementById('modalOverlay');
  modal.classList.add('hidden');
  
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.remove('bg-blue-100', 'dark:bg-blue-900');
  });
  document.querySelector(`[data-page="${page}"]`)?.classList.add('bg-blue-100', 'dark:bg-blue-900');

  const feed = document.getElementById('postsFeed');
  feed.innerHTML = '';
  postsPage = 1;

  switch (page) {
    case 'home':
      loadFeed();
      break;
    case 'profile':
      showUserProfile();
      break;
    case 'messages':
      showMessages();
      break;
    case 'notifications':
      showNotifications();
      break;
    case 'saved':
      loadSavedPosts();
      break;
  }
}

async function checkAuth() {
  if (!authToken) {
    document.getElementById('createPostSection').classList.add('hidden');
    return;
  }

  try {
    await loadCurrentUser();
    await loadFeed();
    initializeSocket();
  } catch (error) {
    authToken = null;
    localStorage.removeItem('token');
    document.getElementById('createPostSection').classList.add('hidden');
  }
}

function showAuthModal() {
  if (typeof clearAuthError === 'function') {
    clearAuthError();
  }
  document.getElementById('authModal').classList.remove('hidden');
  document.getElementById('createPostSection').classList.add('hidden');
}

function showBackendError(message) {
  const banner = document.getElementById('backendStatusBanner');
  const messageContainer = document.getElementById('backendStatusMessage');
  if (!banner || !messageContainer) return;
  messageContainer.textContent = message;
  banner.classList.remove('hidden');
}

function clearBackendStatus() {
  const banner = document.getElementById('backendStatusBanner');
  if (!banner) return;
  banner.classList.add('hidden');
}

function hideAuthModal() {
  document.getElementById('authModal').classList.add('hidden');
  if (authToken) {
    document.getElementById('createPostSection').classList.remove('hidden');
  }
}

function showModal(content) {
  const modal = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = content;
  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

// Click outside modal to close
document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
  if (e.target.id === 'modalOverlay') {
    closeModal();
  }
});

// Click outside user menu to close
document.addEventListener('click', (e) => {
  if (!e.target.closest('#userMenuBtn') && !e.target.closest('#userDropdown')) {
    document.getElementById('userDropdown').classList.add('hidden');
  }
});

// Click outside notification dropdown to close
document.addEventListener('click', (e) => {
  if (!e.target.closest('#notificationBell') && !e.target.closest('#notificationDropdown')) {
    document.getElementById('notificationDropdown').classList.add('hidden');
  }
});
