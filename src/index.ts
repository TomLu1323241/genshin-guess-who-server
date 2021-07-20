import express from 'express';
import { Server, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { joinRoom, exitRoom, User, Room, MatchMakingRoomStatus } from './users';

enum socketType {
  join = 'join',
  message = 'message',
  status = 'status',
  sendMessage = 'sendMessage',
  disconnect = 'disconnect',
  connection = 'connection',
}

const PORT = process.env.PORT || 5000;
const router = require('./router');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", } });

io.on(socketType.connection, (socket: Socket) => {
  console.log('We have a new connection!!!');
  let user: User;
  let room: string;

  socket.on(socketType.join, (name: string) => {
    user = { id: socket.id, name: name };
    const [status, roomKey]: [MatchMakingRoomStatus, string] = joinRoom(user);
    room = roomKey;
    if (status === MatchMakingRoomStatus.matched) {
      socket.emit(socketType.message, { user: 'admin', text: `${user.name}, welcome to the room ${room}` });
      socket.broadcast.to(room).emit(socketType.message, { user: 'admin', text: `${user.name}, has joined` });
      socket.join(room);
      console.log(`room: ${room}, name: ${name}, status: matched`);
    } else {
      socket.emit(socketType.status, { room }); // need to change front end
      socket.join(room);
      console.log(`room: ${room}, name: ${name}, status: matching`);
    }
  });

  socket.on('sendMessage', (message: string) => {
    console.log(`user: ${user.name}, message: ${message}`);
    io.to(room).emit('message', { user: user.name, text: message });
  });

  socket.on('disconnect', () => {
    console.log(`user: ${user.name}, left the room`);
    exitRoom(room);
    socket.broadcast.to(room).emit('message', { user: 'admin', text: `${user.name}, has left` });
    socket.broadcast.to(room).emit('leave');
  });
});

app.use(router);
app.use(cors());

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));