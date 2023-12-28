const http = require('http');

const server = http.createServer();

const io = require('socket.io')(server, {
    cors: { origin: '*' }
});

let messages = []

io.on('connection', (socket) => {
    console.log('Se ha conectado un cliente');

    socket.emit('loadMessages', messages);

    socket.on("message", (data) => {
        messages.push(data);
        io.emit('message', data);
    })
});

server.listen(8080);