const express = require("express")
const app = express()
const http = require('http');
const { Server } = require('socket.io')
const cors = require("cors")

app.use(cors())

const server = http.createServer();

const io = new Server(server, {
    cors: { origin: '*' },
    methods: ["GET", "POST"]
});

let messages = []

io.on('connection', (socket) => {
    console.log('Se ha conectado un cliente');

    socket.emit('loadMessages', messages);

    socket.on("message", (data) => {
        try {
            messages.push(data);
            io.emit('message', data);
        } catch (error) {
            console.error('Error en el servidor:', error);
        }
    });
});

server.listen(8080);