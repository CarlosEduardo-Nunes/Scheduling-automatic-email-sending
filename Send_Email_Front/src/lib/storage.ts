/** Utilitários de storage para autenticação */
const TOKEN_KEY = "auth_token";
const USER_ID_KEY = "auth_user_id";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function readToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function saveUserId(userId: number) {
  localStorage.setItem(USER_ID_KEY, String(userId));
}
export function readUserId(): number | null {
  const raw = localStorage.getItem(USER_ID_KEY);
  return raw != null ? Number(raw) : null;
}
export function clearUserId() {
  localStorage.removeItem(USER_ID_KEY);
}

/** helpers combinados */
export function saveAuth(token: string, userId: number) {
  saveToken(token);
  saveUserId(userId);
}
export function clearAuth() {
  clearToken();
  clearUserId();
}
