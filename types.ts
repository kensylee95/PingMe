
export interface ChatType{
  _id?:string
  participants: partChild[];
  messages: MessageType[];
  lastMessage?:string;
}
export interface partChild{
  _id:string;
  username:string;
}
export interface status{
  [_id: string]: boolean
}
export interface MessageType{
  sender:string;
  chat:string;
  content: string;
  timestamp:Date;
  status: "sent"|"delivered"|"read"
}

export interface IUser{
  _id?: string;
  username:string;
  password?: string;
  online?:boolean
  chats?:[]
}
