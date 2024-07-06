const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Create an Express application
const app = express();

// Create an HTTP server and attach the Express app to it
const server = http.createServer(app);

// Create a Socket.IO server and configure CORS settings
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your React app's URL
    methods: ["GET", "POST"]
  }
});

// Object to keep track of connected users
const users = {};

// Use CORS middleware to allow requests from the React app
app.use(cors({
  origin: "http://localhost:3000" // Replace with your React app's URL
}));

// Set up Socket.IO event listeners
io.on('connection', (socket) => {

  // Event listener for when a new user joins
  socket.on('new-user-joined', (name) => {
    users[socket.id] = name; // Store the user's name associated with their socket ID
    socket.broadcast.emit('user-joined', name); // Broadcast to other clients that a new user has joined
    console.log(users); // Log the current users
  });

  // Event listener for when a message is sent
  socket.on('send', (message) => {
    if (users[socket.id]) {
      console.log(`Message came = ${message} from ${users[socket.id]}`);
      socket.broadcast.emit('receive', { message, name: users[socket.id] }); // Broadcast the message to other clients
    }
  });

  // Event listener for when a user disconnects
  socket.on('disconnect', () => {
    console.log(`user left ${users[socket.id]}`);
    if (users[socket.id]) {
      socket.broadcast.emit('user-left', users[socket.id]); // Broadcast to other clients that a user has left
      delete users[socket.id]; // Remove the user from the users object
    }
  });
});

// Define the port the server will listen on
const PORT = process.env.PORT || 8000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});