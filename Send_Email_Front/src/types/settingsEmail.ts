export type SettingsEmail = {
  id: number;
  recipientEmail: string;
  description: string | null;
  userId: number;
  status: number;          // 0=pending, 1=sent? (ajuste se tiver enum)
  scheduledAt: string | null; // ISO string
  sentAt: string | null;      // ISO string
  createdAt: string;          // ISO string
};
export type CreateSettingsEmailRequest = {
  recipientEmail: string;
  description?: string | null;
  scheduledAt?: string | null; // ISO (ex.: "2025-10-17T13:08:54Z"). Se usar <input type="datetime-local">, convertemos.
  userId?: number; // se o backend exigir; se ele inferir pelo token, pode deixar de fora
};