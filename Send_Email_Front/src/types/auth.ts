// Requisição esperada pelo seu backend.
// Ajuste os campos conforme sua API (userName vs email).
export type LoginRequest = {
  userName: string;   // alguns backends usam userName

  password: string;
};

// Resposta que sua API retorna ao logar.
export type LoginResponse = {
  token: string;   
    userId: number;
  user?: {
    id?: number | string;
    name?: string;
    email?: string;
    role?: string;
  };
};
