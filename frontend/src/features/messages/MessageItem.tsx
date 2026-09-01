import { Avatar } from "@/components";
import { MessageGroup } from "./groupMessages";

type MessageItemProps = { group: MessageGroup; isCurrentUser: boolean };

export function MessageItem({ group, isCurrentUser }: MessageItemProps) {
  const firstMessage = group.messages[0];

  return (
    <article
      className={`message-group ${isCurrentUser ? "message-group--own" : ""}`}
    >
      <Avatar name={group.author} className="message-avatar" />
      <div className="message-group-content">
        <header className="message-group-header">
          <strong>{isCurrentUser ? "Você" : group.author}</strong>
          <time>{firstMessage.timestamp}</time>
        </header>
        <div className="message-group-body">
          {group.messages.map((message) => (
            <p className="message-text" key={message.id}>
              {message.content}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
