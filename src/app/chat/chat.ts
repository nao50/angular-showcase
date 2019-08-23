export interface CreateChatroom {
  roomName: string;
  discription: string;
}
export interface ChatRoom {
  roomID: string;
  roomName: string;
  discription: string;
  time: Date;
  existclients: { [userID: string]: boolean };
}
