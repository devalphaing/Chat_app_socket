const io = require('socket.io')(8000);

const users = {};

io.on('connection', socket => {

    //new user joined
    socket.on('new-user-joined', name=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })

    //message send
    socket.on('send', message => {
        socket.broadcast.emit('recieve', {message, name: users[socket.id]});
    })
})

