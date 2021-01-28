const socketIo = require('socket.io')

const initialize = (server, db) => {
  const io = socketIo(server);
  
  io.on('connection', (socket) => {
    // console.log('Visitor connected');

    // join room
    socket.on('join', (content) => {
        console.log('someone joined');
        console.log(content);
        const collection = db.collection("messages");
        collection.insertOne(content);
        let room = content.groupName + content.channelName;
        socket.join(room);
        // socket.broadcast.in(room).emit(content);
        io.sockets.in(room).emit('message', content);
    });

    socket.on('leave', (content) => {
        console.log('Someone left');
        console.log(content);
        const collection = db.collection("messages");
        collection.insertOne(content);
        let room = content.groupName + content.channelName;
        socket.leave(room);
        // socket.broadcast.in(room).emit(content);
        io.sockets.in(room).emit('message', content);
    });

    socket.on('new-message', (content) => {
        console.log('NEW MESSAGE:');
        console.log(content);
        const collection = db.collection("messages");
        collection.insertOne(content);
        let room = content.groupName + content.channelName;
        // io.emit('message', content);
        io.sockets.in(room).emit('message', content);
    });

  });
  
}

module.exports = initialize;