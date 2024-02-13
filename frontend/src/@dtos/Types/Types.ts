export type User = {
  id: string;
  userName: string;
  password: string;
};

export type Room = {
  id: string;
  name: string;
  messages?: Message[];
  users?: User[];
};

export type Message = {
  id: string;
  userName: string;
  content: string;
  timestamp: string;
  roomId: string;
};
