// Chat System
async function showMessages() {
  const feed = document.getElementById('postsFeed');
  feed.innerHTML = '<h2 class="text-2xl font-bold mb-4">Messages</h2>';
  
  try {
    const response = await api.getConversations();
    
    let html = '<div class="space-y-2">';
    response.conversations.forEach((conv) => {
      html += `
        <div onclick="openConversation('${conv.user.id}', '${conv.user.name}')" class="p-4 bg-white dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-3">
            <img src="${conv.user.profileImage}" alt="${conv.user.name}" class="w-12 h-12 rounded-full">
            <div class="flex-1">
              <p class="font-semibold">${conv.user.name}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 truncate">${conv.lastMessage}</p>
            </div>
            ${conv.unreadCount > 0 ? `<span class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">${conv.unreadCount}</span>` : ''}
          </div>
        </div>
      `;
    });
    html += '</div>';
    
    feed.innerHTML += html;
  } catch (error) {
    feed.innerHTML += '<p class="text-red-600">Error loading conversations</p>';
  }
}

async function openConversation(userId, userName) {
  const modal = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  
  let html = `
    <div class="h-full flex flex-col">
      <div class="bg-blue-600 text-white p-4 flex items-center justify-between">
        <h3 class="font-bold text-lg">${userName}</h3>
        <button onclick="closeModal()" class="text-white hover:bg-blue-700 p-2 rounded">✕</button>
      </div>
      <div id="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3">
        <!-- Messages will load here -->
      </div>
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-2">
        <input 
          type="text" 
          id="messageInput" 
          placeholder="Type a message..." 
          class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none"
          onkeypress="if(event.key === 'Enter') sendMessage('${userId}'); event.target.value = '';"
        >
        <button onclick="sendMessage('${userId}')" class="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">Send</button>
      </div>
    </div>
  `;
  
  modalContent.innerHTML = html;
  modal.classList.remove('hidden');
  
  // Load conversation
  try {
    const response = await api.getConversation(userId);
    const container = document.getElementById('messagesContainer');
    
    container.innerHTML = response.messages.map((msg) => `
      <div class="${msg.sender._id === currentUserId ? 'text-right' : ''}">
        <div class="inline-block max-w-xs ${msg.sender._id === currentUserId ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'} p-3 rounded-lg">
          <p>${msg.text}</p>
          <p class="text-xs ${msg.sender._id === currentUserId ? 'text-blue-200' : 'text-gray-500'} mt-1">${formatTime(msg.createdAt)}</p>
        </div>
      </div>
    `).join('');
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
  } catch (error) {
    console.error('Error loading conversation:', error);
  }
}

async function sendMessage(receiverId) {
  const messageInput = document.getElementById('messageInput');
  const text = messageInput.value.trim();
  
  if (!text) return;
  
  try {
    const response = await api.sendMessage(receiverId, text);
    messageInput.value = '';
    
    // Add message to UI
    const container = document.getElementById('messagesContainer');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'text-right';
    msgDiv.innerHTML = `
      <div class="inline-block max-w-xs bg-blue-600 text-white p-3 rounded-lg">
        <p>${text}</p>
        <p class="text-xs text-blue-200 mt-1">now</p>
      </div>
    `;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
    
    // Emit via socket
    if (socket) {
      emitMessage(currentUserId, receiverId, text);
    }
  } catch (error) {
    alert(`Error sending message: ${error.message}`);
  }
}
