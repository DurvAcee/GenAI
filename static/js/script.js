const enterKeyPress = (event) => {
    if (event.keyCode === 13) {
        sendMessage();
        return false;
    }
    return true;
}

window.onload = function() {
    fetchInitialMessage();
    $('[data-toggle="tooltip"]').tooltip();
    document.getElementById('userInput').addEventListener('input', updateSendButtonState);
}

const speak = () => {
    const utterance = new SpeechSynthesisUtterance("Welcome to this tutorial!");
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[0];
    speechSynthesis.speak(utterance);
  }

const updateSendButtonState = () => {
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    if (userInput.value.trim() === '') {
        sendButton.disabled = true;
    } else {
        sendButton.disabled = false;
    }
}

const fetchInitialMessage = () => {
    // API Call to -> /localbot/welcome
    fetch('/localbot/welcome/')
        .then(response => response.json())
        .then(data => {
            removeTypingIndicator();
            sessionStorage.setItem("chatSessionId", data.chat_session_id);
            typeMessage('bot', data.message);
        })
        .catch(error => {
            console.error('Error fetching initial message:', error);
            typeMessage('bot', 'Sorry, there was an error fetching the response.');
        });
}

const sendMessage = () => {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (message === '') {
        return;
    }

    appendMessage('user', message);
    userInput.value = '';
    updateSendButtonState();
    showTypingIndicator();
    //  API Call to -> /localbot/prompt
    setTimeout(() => {
        fetch('/localbot/prompt/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_session_id: sessionStorage.getItem("chatSessionId"),
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            removeTypingIndicator();
            const decodedMessage = decodeURIComponent(data.message);
            typeMessage('bot', decodedMessage);
        })
        .catch(error => {
            console.error('Error fetching API:', error);
            removeTypingIndicator();
            typeMessage('bot', 'Sorry, there was an error processing your request.');
        });
    }, 2000);
}

const appendMessage = (sender, message) => {
    const chatBody = document.getElementById('chat-body');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.innerText = message;

    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}

const showTypingIndicator = () => {
    const chatBody = document.getElementById('chat-body');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot typing-indicator';
    typingIndicator.innerText = 'Alta Co-Pilot is thinking...';

    chatBody.appendChild(typingIndicator);
    chatBody.scrollTop = chatBody.scrollHeight;
}

const removeTypingIndicator = () => {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

const typeMessage = (sender, message) => {
    const chatBody = document.getElementById('chat-body');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;

    const textElement = document.createElement('span');
    textElement.className = 'bot-text';
    messageElement.appendChild(textElement);
    chatBody.appendChild(messageElement);

    let index = 0;
    function type() {
        if (index < message.length) {
            messageElement.innerHTML += message.charAt(index) === ' ' ? '&nbsp;' : message.charAt(index);
            index++;
            setTimeout(type, 50); 
        }
    }
    type();
    chatBody.scrollTop = chatBody.scrollHeight;
}        