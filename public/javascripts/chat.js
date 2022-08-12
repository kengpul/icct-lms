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
    socket.emit('chat', chatInput.value, room, chatInput.name);
    chatInput.value = ''
})

socket.on('displayChat', (chat, id) => {
    displayChat(chat, id);
})

const displayChat = (chat, id) => {
    const p = document.createElement('p');
    p.innerText = chat;
    if (id === user) {
        p.classList.add('bg-primary', 'text-white', 'w-50', 'ms-auto', 'rounded', 'p-2');
    } else {
        p.classList.add('w-50', 'rounded', 'p-2');
    }
    chatContainer.append(p);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}