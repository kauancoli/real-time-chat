import { Message } from "@/types/domain";

export type MessageGroup = {
  author: string;
  messages: Message[];
};

export function groupMessages(messages: Message[]): MessageGroup[] {
  return messages.reduce<MessageGroup[]>((groups, message) => {
    const previousGroup = groups.at(-1);
    if (previousGroup?.author === message.userName) {
      previousGroup.messages.push(message);
    } else {
      groups.push({ author: message.userName, messages: [message] });
    }
    return groups;
  }, []);
}
