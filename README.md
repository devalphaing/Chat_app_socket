# Chat Application

This is a real-time chat application built using React for the client-side and Node.js with Socket.IO for the server-side.

## Features

- **Real-Time Messaging**: Send and receive messages instantly.
- **User Join/Leave Notifications**: Get notified when users join or leave the chat.
- **Custom Username**: Users can set their own username before joining the chat.
- **Responsive Design**: User-friendly interface that adapts to different screen sizes.

## Technologies Used

- **Frontend**:
  - React
  - Material-UI (for styling components)
  - Socket.IO Client (for real-time communication)

- **Backend**:
  - Node.js
  - Express
  - Socket.IO (for real-time communication)

## Getting Started

### Prerequisites

- Node.js installed on your machine
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/chat-app.git
   cd chat-app
   ```

2. Install dependencies for both client and server:

   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

### Running the Application

1. Start the server:

   ```bash
   # From the server directory
   npm start
   ```

   This will start the Node.js server on `http://localhost:8000`.

2. Start the client:

   ```bash
   # From the client directory
   npm start
   ```

   This will start the React development server and open the application in your default web browser (`http://localhost:3000`).

### Usage

- When the application loads, you will be prompted to enter your username.
- Enter your desired username and click "Submit".
- You will then join the chat room.
- Start sending messages in the input box at the bottom and press "Send".
- Messages will appear in the main chat area in real-time.
- You will receive notifications when other users join or leave the chat.

