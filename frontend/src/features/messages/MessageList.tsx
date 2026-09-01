import { Button } from "@/components";
import { Message } from "@/types/domain";
import { useEffect, useRef, useState } from "react";
import { groupMessages } from "./groupMessages";
import { MessageItem } from "./MessageItem";

type MessageListProps = {
  currentUserName: string;
  messages: Message[];
  roomId: string;
  roomName: string;
};

export function MessageList({
  currentUserName,
  messages,
  roomId,
  roomName,
}: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const shouldStickToBottom = useRef(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const groups = groupMessages(messages);
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior });
    shouldStickToBottom.current = true;
    setHasNewMessages(false);
  };

  const handleScroll = () => {
    const list = listRef.current;
    if (!list) return;
    shouldStickToBottom.current =
      list.scrollHeight - list.scrollTop - list.clientHeight < 96;
    if (shouldStickToBottom.current) setHasNewMessages(false);
  };

  useEffect(() => {
    requestAnimationFrame(() => scrollToBottom("auto"));
  }, [roomId]);

  useEffect(() => {
    if (shouldStickToBottom.current)
      requestAnimationFrame(() => scrollToBottom("auto"));
    else if (messages.length) setHasNewMessages(true);
  }, [messages.length]);

  return (
    <div className="message-region">
      <div
        className="message-list"
        ref={listRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-label={`Mensagens da sala ${roomName}`}
      >
        <div className="message-list-content">
          {groups.map((group) => (
            <MessageItem
              group={group}
              isCurrentUser={group.author === currentUserName}
              key={group.messages[0].id}
            />
          ))}
          {!messages.length && (
            <div className="conversation-empty">
              <strong>Esta é a primeira mensagem de #{roomName}</strong>
              <span>Comece a conversa abaixo.</span>
            </div>
          )}
        </div>
      </div>
      {hasNewMessages && (
        <Button
          className="new-messages-button"
          onClick={() => scrollToBottom()}
        >
          Novas mensagens
        </Button>
      )}
    </div>
  );
}
