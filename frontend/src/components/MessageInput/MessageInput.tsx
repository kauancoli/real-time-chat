import { PaperPlaneTilt } from "@phosphor-icons/react";
import { IconButton } from "@/components/ui";

type MessageInputProps = {
  msg: string;
  setMsg: (value: string) => void;
  handleMessageSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  roomId: string;
};

export function MessageInput({
  msg,
  setMsg,
  handleMessageSubmit,
  roomId,
}: MessageInputProps) {
  return (
    <form className="message-composer" onSubmit={handleMessageSubmit}>
      <input
        value={msg}
        disabled={!roomId}
        onChange={(event) => setMsg(event.target.value)}
        placeholder="Escreva uma mensagem..."
        aria-label="Mensagem"
      />
      <IconButton
        className="send-button"
        disabled={!roomId || !msg.trim()}
        aria-label="Enviar mensagem"
      >
        <PaperPlaneTilt size={20} weight="fill" />
      </IconButton>
    </form>
  );
}
