import io from 'socket.io-client';

// URL of the Socket.IO server
const SOCKET_SERVER_URL = "http://localhost:8000";

// Create a socket instance and connect to the server
export const socket = io(SOCKET_SERVER_URL);

/**
 * Emits an event to the server indicating that a new user has joined.
 * @param {string} name - The name of the user joining.
 */
export const userJoined = (name) => {
    socket.emit('new-user-joined', name);
}

/**
 * Emits an event to the server to send a message.
 * @param {string} message - The message to be sent.
 */
export const sendMessage = (message) => {
    socket.emit('send', message);   
}

/**
 * Emits a disconnect event to the server.
 * This can be used to handle cleanup on the server side.
 */
export const disconnect = () => {
    socket.emit('disconnect');
}