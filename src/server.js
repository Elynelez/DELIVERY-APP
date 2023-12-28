const http = require('http');

const server = http.createServer();

const io = require('socket.io')(server, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('Se ha conectado un cliente');

    socket.on("message", (data) => {
        socket.broadcast.emit("message", data)
    })
});

server.listen(8080, '0.0.0.0', () => {
    console.log(`Servidor socket.io escuchando en el puerto 8080`);
});