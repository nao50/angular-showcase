export interface CreateChatroom {
  name: string;
  discription: string;
}
export interface ChatRoom {
  roomID: string;
  discription: string;
  time: Date;
  existclients: { [userID: string]: boolean };
}
