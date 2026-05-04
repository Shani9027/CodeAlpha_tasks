// Notifications Management
async function loadNotifications() {
  try {
    const response = await api.getNotifications(1, 10);
    const dropdown = document.getElementById('notificationDropdown');
    
    if (response.notifications.length === 0) {
      dropdown.innerHTML = '<div class="p-4 text-center text-gray-500">No notifications</div>';
      return;
    }
    
    let html = '<div class="p-2">';
    html += '<div class="flex justify-between items-center mb-3 px-2">';
    html += '<h4 class="font-bold">Notifications</h4>';
    html += '<button onclick="api.markAllNotificationsAsRead().then(() => loadNotifications())" class="text-sm text-blue-600 hover:underline">Mark all as read</button>';
    html += '</div>';
    
    response.notifications.forEach((notif) => {
      const icon = {
        'like': '❤️',
        'comment': '💬',
        'follow': '👥',
        'message': '📧'
      }[notif.type] || '🔔';
      
      html += `
        <div class="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onclick="api.markNotificationAsRead('${notif._id}')">
          <div class="flex items-start space-x-3">
            <span class="text-lg">${icon}</span>
            <div class="flex-1">
              <p class="text-sm"><strong>${notif.actor.name}</strong> ${getNotificationText(notif.type)}</p>
              <p class="text-xs text-gray-500">${formatTime(notif.createdAt)}</p>
            </div>
            ${!notif.read ? '<div class="w-2 h-2 bg-blue-600 rounded-full"></div>' : ''}
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    dropdown.innerHTML = html;
  } catch (error) {
    console.error('Error loading notifications:', error);
  }
}

async function showNotifications() {
  const feed = document.getElementById('postsFeed');
  feed.innerHTML = '<h2 class="text-2xl font-bold mb-4">Notifications</h2>';
  
  try {
    const response = await api.getNotifications(1, 20);
    
    if (response.notifications.length === 0) {
      feed.innerHTML += '<p class="text-gray-500">No notifications yet</p>';
      return;
    }
    
    response.notifications.forEach((notif) => {
      const icon = {
        'like': '❤️',
        'comment': '💬',
        'follow': '👥',
        'message': '📧'
      }[notif.type] || '🔔';
      
      const div = document.createElement('div');
      div.className = 'bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-start justify-between';
      div.innerHTML = `
        <div class="flex items-start space-x-3 flex-1">
          <img src="${notif.actor.profileImage}" alt="${notif.actor.name}" class="w-10 h-10 rounded-full">
          <div>
            <p class="font-semibold">${notif.actor.name}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">${getNotificationText(notif.type)}</p>
            <p class="text-xs text-gray-500 mt-1">${formatTime(notif.createdAt)}</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          ${!notif.read ? '<div class="w-3 h-3 bg-blue-600 rounded-full"></div>' : ''}
          <button onclick="deleteNotification('${notif._id}')" class="text-gray-400 hover:text-red-600">✕</button>
        </div>
      `;
      feed.appendChild(div);
    });
  } catch (error) {
    feed.innerHTML += '<p class="text-red-600">Error loading notifications</p>';
  }
}

function getNotificationText(type) {
  const texts = {
    'like': 'liked your post',
    'comment': 'commented on your post',
    'follow': 'started following you',
    'message': 'sent you a message'
  };
  return texts[type] || 'notified you';
}

async function deleteNotification(notificationId) {
  try {
    await api.deleteNotification(notificationId);
    if (currentPage === 'notifications') {
      showNotifications();
    } else {
      loadNotifications();
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
}

// Update notification badge
async function updateNotificationBadge() {
  try {
    const response = await api.getUnreadNotificationCount();
    const badge = document.getElementById('notificationBadge');
    if (response.unreadCount > 0) {
      badge.textContent = response.unreadCount;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  } catch (error) {
    console.error('Error updating badge:', error);
  }
}

// Periodically check for new notifications
setInterval(() => {
  if (currentUserId) {
    updateNotificationBadge();
  }
}, 30000); // Check every 30 seconds
