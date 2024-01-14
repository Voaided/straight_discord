const { PeerServer } = require('peer');
const peerserver = PeerServer({
    port: 9001,
    key: 'Straight_discord',
    path: '/myapp',
});


console.log ("server started");
peerserver.on('connection',async (client) => {
    console.log('New client connected with id:', client.id);
});


peerserver.on('disconnect', async (client) => {
    console.log('Client disconnected with id:', client.id);
});


const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server);

const port = 9002;

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join_namespace', (customId) => {
    socket.join(customId);
    console.log(`User with custom ID ${customId} joined`);
  });

  socket.on('send_message', (data, targetCustomId) => {
    io.to(targetCustomId).emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
