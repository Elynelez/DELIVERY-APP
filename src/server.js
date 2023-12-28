const http = require('http');

const server = http.createServer();

const io = require('socket.io')(server, {
    cors: { origin: 'https://delivery-app-one-phi.vercel.app/test/display' }
});

io.on('connection', (socket) => {
    console.log('Se ha conectado un cliente');

    socket.on("message", (data) => {
        socket.broadcast.emit("message", data)
    })
});

server.listen(8080);