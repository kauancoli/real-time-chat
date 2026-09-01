export type AuthFormData = {
  email?: string;
  name: string;
  password: string;
};

export type AuthView = "Login" | "Register" | "Forgot_Password";
