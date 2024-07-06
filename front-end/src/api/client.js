import io from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:8000";

export const socket = io(SOCKET_SERVER_URL);

export const userJoined = (name)=> {
    socket.emit('new-user-joined', name);
}

export const sendMessage = (message) => {
    socket.emit('send', message);   
}

export const disconnect = () => {
    socket.emit('disconnect');
}