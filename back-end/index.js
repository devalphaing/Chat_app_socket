const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

//data of users for logging in:
const userDatabase = [];

// JWT secret key
const JWT_SECRET = 'SECRET_KEY';

// Use CORS middleware to allow requests from the React app
app.use(cors({
  origin: "http://localhost:3000" // Replace with your React app's URL
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Register a new user
app.post('/register', async (req, res) => {
  console.log('Request for the route register came');
  const { username, password } = req.body;
  
  // Check if the user already exists
  const existingUser = userDatabase.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).send({ status: false, message: 'User already exists' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword };
    userDatabase.push(user);
    res.status(201).send({ status: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).send({ status: false, message: 'Error registering user', error });
  }
});

// Login user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Find the user by username
  const user = userDatabase.find(user => user.username === username);
  if (!user) {
    return res.status(401).send({ status: false, message: 'Invalid username or password' });
  }

  try {
    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).send({ status: true, username, token });
    } else {
      res.status(401).send({ status: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).send({ status: false, message: 'Error logging in', error });
  }
});

//verify user
app.post('/verifyToken', (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).send({ status: true, username: decoded.username });
  } catch (error) {
    res.status(401).send({ status: false, message: 'Invalid token' });
  }
});

//get all registered users-only for testing
app.get('/users', (req, res) => {
  res.send(userDatabase);
})

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