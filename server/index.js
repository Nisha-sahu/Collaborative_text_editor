// server/index.js

// server.js

const express = require('express');
const path=require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname,'public')));

app.use(express.static(path.join(__dirname,'../client')));


app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'../client/index.html'));
});


let text = ''; // Initialize empty text
let connectedUsers=[];

io.on('connection', (socket) => {
  console.log('Client connected');

  // Add the new user to the list of connected users
  connectedUsers.push(socket.id);

  // Send the updated list of connected users to all clients
  io.emit('userList', connectedUsers);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Remove the disconnected user from the list of connected users
    connectedUsers = connectedUsers.filter(user => user !== socket.id);
    // Send the updated list of connected users to all clients
    io.emit('userList', connectedUsers);
  });

  // Send current text and cursor position to the new client
  socket.emit('initialEditorState', { text, cursor: null });

  socket.on('editorUpdate', ({ text, cursor }) => {
    const currentText = text;
    // Here you would implement your conflict resolution strategy
    // For simplicity, let's assume we just accept the latest changes
    io.emit('editorUpdated', { text: currentText, cursor });  });
  
  // Send current text to the new client
  socket.emit('initialText', text);

  socket.on('textUpdate', (updatedText) => {
    text = updatedText;
    // Broadcast the updated text to all clients
    io.emit('textUpdated', text);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
