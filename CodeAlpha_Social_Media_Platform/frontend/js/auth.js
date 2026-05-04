// Authentication
async function handleAuthSubmit(e) {
  e.preventDefault();

  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  const name = document.getElementById('nameInput').value;
  const confirmPassword = document.getElementById('confirmPasswordInput').value;

  clearAuthError();

  if (!email || !password) {
    showAuthError('Please fill in all required fields');
    return;
  }

  try {
    let response;
    if (isLoginMode) {
      response = await api.login(email, password);
    } else {
      if (!name || !confirmPassword) {
        showAuthError('Please fill in all required fields');
        return;
      }
      if (password !== confirmPassword) {
        showAuthError('Passwords do not match');
        return;
      }
      response = await api.register(name, email, password, confirmPassword);
    }

    // Save token
    authToken = response.token;
    localStorage.setItem('token', authToken);

    // Hide modal and load app
    hideAuthModal();
    await loadCurrentUser();
    await loadFeed();
    initializeSocket();

    // Clear form
    document.getElementById('authForm').reset();
  } catch (error) {
    const message = error.message === 'Failed to fetch'
      ? 'Unable to connect to the backend. Please make sure the backend server is running and reachable.'
      : error.message;
    showAuthError(`Error: ${message}`);
  }
}

function showAuthError(message) {
  const errorContainer = document.getElementById('authError');
  if (!errorContainer) return;
  errorContainer.textContent = message;
  errorContainer.classList.remove('hidden');
}

function clearAuthError() {
  const errorContainer = document.getElementById('authError');
  if (!errorContainer) return;
  errorContainer.textContent = '';
  errorContainer.classList.add('hidden');
}

async function loadCurrentUser() {
  try {
    const response = await api.getCurrentUser();
    currentUserId = response.user.id;

    // Update UI with user info
    document.getElementById('navUserImage').src = response.user.profileImage;
    document.getElementById('createPostUserImage').src = response.user.profileImage;

    // Set up profile links
    document.getElementById('navProfile').href = `#profile-${response.user.id}`;

    if (typeof updateNotificationBadge === 'function') {
      updateNotificationBadge();
    }
    if (typeof loadSuggestedUsers === 'function') {
      loadSuggestedUsers();
    }
  } catch (error) {
    console.error('Error loading current user:', error);
  }
}

function handleLogout() {
  authToken = null;
  localStorage.removeItem('token');
  currentUserId = null;

  if (socket) {
    socket.disconnect();
  }

  location.reload();
}
