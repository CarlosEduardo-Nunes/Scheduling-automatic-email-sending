import { http } from "../lib/http";
import type { LoginRequest, LoginResponse } from "../types/auth";

/** POST /auth/login (userName e password em QUERY) */
export async function login(req: LoginRequest): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>(
    "/auth/login",
    null, // sem body
    {
      params: {
        userName: req.userName,
        password: req.password,
      },
    }
  );

  // não salvar nada aqui — quem salva é o AuthContext (setAuth)
  return data;
}
