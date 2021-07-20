function random(length: number): string {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export interface User {
  id: string,
  name: string,
}

export interface Room {
  room: string,
  user1: User,
  user2?: User,
}

export enum MatchMakingRoomStatus {
  matching,
  matched,
}

const rooms: Room[] = [];

export const joinRoom = (user: User): [MatchMakingRoomStatus, string] => {
  if (rooms.length === 0 || rooms[rooms.length - 1].user2 !== undefined) {
    let roomKey: string = random(7);
    while (rooms.some((item: Room) => item.room === roomKey)) {
      roomKey = random(7);
    }
    const newRoom: Room = {
      room: roomKey,
      user1: user,
    }
    rooms.push(newRoom);
    return [MatchMakingRoomStatus.matching, roomKey];
  } else {
    rooms[rooms.length - 1].user2 = user;
    return [MatchMakingRoomStatus.matched, rooms[rooms.length - 1].room];
  }
}

export const exitRoom = (room: string) => {
  const roomIndex = rooms.findIndex((item: Room) => item.room === room);
  rooms.splice(roomIndex, 1);
}

// const addUser = ({ id, name, room }: User): User => {
//   room = room.trim().toLowerCase();

//   const exist = users.find((user) => user.room === room && user.name === name);

//   if (exist) {
//     throw new Error('User already exists');
//   }

//   const user = { id, name, room };
//   users.push(user);
//   return user;
// }

// const removeUser = (id: number) => {
//   const index = users.findIndex((user) => user.id === id);
//   if (index !== -1) {
//     return users.splice(index, 1)[0];
//   }
// }

// const getUser = (id: number) => users.find((user: User) => user.id === id);
