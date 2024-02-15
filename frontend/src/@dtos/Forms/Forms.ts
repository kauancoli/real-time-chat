export type FormData = {
  email?: string;
  name: string;
  password: string;
};

export type Tabs = {
  setTabs: React.Dispatch<React.SetStateAction<string>>;
};
