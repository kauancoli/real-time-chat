import { FormData, Tabs } from "@/@dtos";
import { api } from "@/config";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

export const Register = ({ setTabs }: Tabs) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({ mode: "onChange" });

  const [error, setError] = useState<string | null>(null);
  const [sucess, setSucess] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const userResponse = await api.get(`users?userName=${data.name}`);
      if (userResponse.data.length > 0) {
        setError("Nome de usuário já cadastrado");
        return;
      }

      const emailResponse = await api.get(`users?email=${data.email}`);
      if (emailResponse.data.length > 0) {
        setError("E-mail já cadastrado");
        return;
      }

      await api.post(`users`, {
        id: uuid(),
        email: data.email,
        userName: data.name,
        password: data.password,
      });

      reset();
      setSucess("Usuário cadastrado com sucesso");

      setTimeout(() => {
        setTabs("Login");
      }, 1000);
    } catch (error) {
      console.error("Erro ao cadastrar usuário", error);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-slate-200">
        Cadastro de Usuário
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-slate-400"
          >
            E-mail
          </label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu e-mail"
            {...register("email", {
              required: "Email obrigatório",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail inválido",
              },
            })}
            className="rounded border-2 p-2 w-full mt-1"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-slate-400"
          >
            Usuário
          </label>
          <input
            type="text"
            id="name"
            placeholder="Digite seu nome de usuário"
            {...register("name", {
              required: "Usuario obrigatório",
              maxLength: { value: 20, message: "Nome muito longo" },
            })}
            className="rounded border-2 p-2 w-full mt-1"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-slate-400"
          >
            Senha
          </label>
          <input
            type="password"
            id="password"
            placeholder="Digite sua senha"
            {...register("password", {
              required: "Senha obrigatória",
              minLength: {
                value: 6,
                message: "Senha deve ter pelo menos 6 caracteres",
              },
            })}
            className="rounded border-2 p-2 w-full mt-1"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {sucess && <p className="text-green-500">{sucess}</p>}

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setTabs("Login")}
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600"
          >
            Login
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primaryHover disabled:opacity-50 disabled:hover:bg-primary"
          >
            Cadastrar
          </button>
        </div>
        <div className="mt-3">
          <button
            onClick={() => setTabs("Forgot_Password")}
            className="text-slate-400 hover:text-slate-200 opacity-40"
          >
            Esqueceu a senha?
          </button>
        </div>
      </form>
    </>
  );
};
