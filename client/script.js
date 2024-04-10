// script.js

document.addEventListener("DOMContentLoaded", function() {
    const socket = io();
    const editor = document.getElementById('editor');
    require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        const editor = monaco.editor.create(document.getElementById('editor'), {
            language: 'plaintext', // Set the default language to plain text
            theme: 'vs-dark', // Set the dark theme
            automaticLayout: true, // Automatically resize the editor when the window size changes
        });
        // Define a function to apply text highlighting
        function applyTextHighlighting() {
            // Define keywords to highlight
    const keywords = ['function', 'if', 'else', 'for', 'while', 'var', 'const', 'let'];

    // Create a regular expression to match keywords
    const regex = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'g');

    // Apply highlighting using the regular expression
    return text.replace(regex, '<span style="color: blue;">$1</span>');
            const model = editor.getModel();
            const text = model.getValue();
            const highlightedText = highlightText(text); // You need to implement highlightText function
            editor.setValue(highlightedText);
        }
        // Event listener to send updated text and cursor position to server
        editor.onDidChangeModelContent(() => {
            const updatedText = editor.getValue();
            const cursorPosition = editor.getPosition();
            socket.emit('editorUpdate', { text: updatedText, cursor: cursorPosition });
            applyTextHighlighting();
        });
    
        // Event listener to receive updated text and cursor position from server
        socket.on('editorUpdated', ({ text, cursor }) => {
            editor.setValue(text);
            editor.setPosition(cursor);
            applyTextHighlighting();
        });
        // Function to update user presence indicators
    function updateUserPresence(users) {
        const usersList = document.getElementById('users');
        usersList.innerHTML = '<h2>Connected Users</h2>';
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user');
            userElement.textContent = user.name;
            if (user.connected) {
                userElement.classList.add('connected');
            } else {
                userElement.classList.add('disconnected');
            }
            usersList.appendChild(userElement);
        });
    }

    // Event listener to receive list of connected users and update presence indicators
    socket.on('userList', (users) => {
        updateUserPresence(users);
    });

    // Event listener to receive updated user presence and update presence indicators
    socket.on('userPresenceUpdate', (users) => {
        updateUserPresence(users);
    });
    
    
    // Event listener to send updated text to server
    editor.addEventListener('input', () => {
        const updatedText = editor.value;
        socket.emit('textUpdate', updatedText);
    });

    // Event listener to receive updated text from server
    socket.on('textUpdated', (text) => {
        editor.value = text;
    });

    // Event listener to handle receiving list of connected users
    socket.on('userList', (users) => {
        displayUserList(users);
    });

    function displayUserList(users) {
        const usersList = document.getElementById('users');
        usersList.innerHTML = '<h2>Connected Users</h2>';
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user');
            userElement.textContent = user;
            usersList.appendChild(userElement);
        });
    }
    });

});
