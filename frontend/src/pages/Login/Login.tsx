import { api } from "@/config";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Socket } from "socket.io-client";

type LoginProps = {
  socket: Socket;
};

export const Login = ({ socket }: LoginProps) => {
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `users?userName=${username}&password=${password}`
      );

      const userData = response.data[0];
      if (userData) {
        socket.emit("login", userData);
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            id: userData.id,
            userName: userData.userName,
          })
        );
        navigate("/");
      } else {
        setError("Usuário ou senha inválidos");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao buscar usuário", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">
        Bem-vindo ao ChatApp!
      </h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded border-2 p-2 text-base"
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border-2 p-2 text-base"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleLogin}
        disabled={!username || !password}
        className="btn text-white font-bold py-2 px-4 rounded"
      >
        Entrar
      </button>
    </div>
  );
};
