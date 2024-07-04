const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your React app's URL
    methods: ["GET", "POST"]
  }
});

const users = {};

app.use(cors({
  origin: "http://localhost:3000" // Replace with your React app's URL
}));

io.on('connection', (socket) => {
  // New user joined
  socket.on('new-user-joined', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
    console.log(name);
  });

  // Message sent
  socket.on('send', (message) => {
    socket.broadcast.emit('recieve', { message, name: users[socket.id] });
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
