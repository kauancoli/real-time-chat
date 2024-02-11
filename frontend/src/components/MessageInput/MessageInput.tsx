import { PaperPlaneTilt } from "phosphor-react";

type MessageInput = {
  msg: string;
  setMsg: (value: string) => void;
  handleMessageSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  roomId: string;
};

export function MessageInput({
  msg,
  setMsg,
  handleMessageSubmit,
  roomId,
}: MessageInput) {
  return (
    <form
      className="flex items-center bg-dark py-2 px-4 rounded-2xl shadow-lg"
      onSubmit={handleMessageSubmit}
    >
      <input
        type="text"
        value={msg}
        disabled={!roomId}
        placeholder="Digite uma mensagem..."
        onChange={(e) => setMsg(e.target.value)}
        className="rounded py-2 px-4 flex-1 mr-2 bg-transparent text-white focus:outline-none text-sm"
      />
      <button className="p-2 rounded" disabled={!roomId}>
        <PaperPlaneTilt color="#615EF0" size={24} />
      </button>
    </form>
  );
}
