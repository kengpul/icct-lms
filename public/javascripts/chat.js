const socket = io();
const form = document.querySelector('.chat-form');
const chatContainer = document.querySelector('.chat-container');
const chatInput = document.querySelector('.chat-input');
const room = window.location.href.slice(window.location.href.lastIndexOf('/')).slice(1);

window.addEventListener('load', () => {
    chatContainer.scrollTop = chatContainer.scrollHeight;
    socket.emit('joinChat', room);
})

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!chatInput.value) return;
    socket.emit('chat', chat(chatInput.name, chatInput.value, room));
    chatInput.value = ''
})

const chat = (name, input, room) => {
    return {
        name,
        input,
        room,
        time: new Date()
    }
}

socket.on('displayChat', chat => {
    displayChat(chat);
})

const displayChat = (chat) => {
    const p = document.createElement('p');
    const margin = user == chat.name ? 'ms-auto' : '';
    p.innerHTML = `
    <div class="bg-white my-3 ${margin} p-3 chat-body text-end shadow">
        <div class="chat-text-header d-flex justify-content-between border-bottom">
            <p>${chat.name}</p>
            <p class="text-muted ms-3">${chat.time}</p>
        </div>
        <p>${chat.input}</p>
    </div>
    `
    chatContainer.append(p);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}