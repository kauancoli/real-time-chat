export type User = {
  id: string;
  email: string;
  userName: string;
  password: string;
};

export type Room = {
  id: string;
  name: string;
  userId: string;
  password?: string;
  messages?: Message[];
};

export type Message = {
  id: string;
  userName: string;
  content: string;
  timestamp: string;
  roomId: string;
};
