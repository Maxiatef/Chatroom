(function () {
    const app = document.querySelector('.app');
    const socket = io();

    let uname;

    const joinButton = app.querySelector("#join");
    joinButton.addEventListener('click', function () {
        let username = app.querySelector("#username").value;
        if (username.length === 0) {
            return;
        }
        socket.emit('newuser', username);
        uname = username;
        app.querySelector('.join-screen').classList.remove('active');
        app.querySelector('.chat-screen').classList.add('active');
    });

    const sendButton = app.querySelector("#send-message");
    sendButton.addEventListener('click', function () {
        const messageInput = app.querySelector("#message-input");
        let message = messageInput.value;
        if (message.length === 0) {
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message
        });

        socket.emit('chat', {
            username: uname,
            text: message
        });
        messageInput.value = '';
    });


    function renderMessage(type, data) {
        let messagesContainer = app.querySelector('.messages');
        let el = document.createElement('div');

        if (type === "my") {
            el.setAttribute('class', 'message my-message');
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${data.text}</div>
                </div>
            `;
        } else if (type === "other") {
            el.setAttribute('class', 'message other-message');
            el.innerHTML = `
                <div>
                    <div class="name">${data.username}</div>
                    <div class="text">${data.text}</div>
                </div>
            `;
        } else if (type === "update") {
            el.setAttribute('class', 'update');
            el.innerText = data;
        }

        messagesContainer.appendChild(el);
        messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
    }


    app.querySelector(" .chat-screen #exit-chat").addEventListener('click', function () {
        socket.emit('exituser', uname);
        window.location.href = window.location.href;
    });

    socket.on('update', function (data) {
        renderMessage("update", data);
    });
    socket.on('chat', function (data) {
        renderMessage("other", data);
    });
})();
