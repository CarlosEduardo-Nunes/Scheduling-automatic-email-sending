import { http } from "../lib/http";
import type {
  SettingsEmail,
  CreateSettingsEmailRequest,
} from "../types/settingsEmail";

/** GET /SettingsEmail/GetAllSettingsEmails */
export async function getAllSettingsEmails(): Promise<SettingsEmail[]> {
  const { data } = await http.get<SettingsEmail[]>(
    "/SettingsEmail/GetAllSettingsEmails"
  );
  return data;
}

/**
 * POST /SettingsEmail/CreateAgenEmail
 * O endpoint recebe tudo por QUERY (sem body), então passamos via `params`.
 * Campos comuns: RecipientEmail, Description, ScheduledAt.
 * Status deixei como 0 (Pendente) por padrão.
 */
export async function createSettingsEmail(
  payload: CreateSettingsEmailRequest & {
    status?: number;
    sentAt?: string | null;
    createdAt?: string | null;
  }
): Promise<SettingsEmail> {
  const {
    recipientEmail,
    description = null,
    scheduledAt = null,
    userId,
    status = 0, // pendente
    sentAt = null,
    createdAt = null,
  } = payload;

  const { data } = await http.post<SettingsEmail>(
    "/SettingsEmail/CreateAgenEmail",
    null, // sem body
    {
      params: {
        RecipientEmail: recipientEmail,
        Description: description,
        UserId: userId,
        Status: status,
        ScheduledAt: scheduledAt,
        SentAt: sentAt,
        CreatedAt: createdAt,
      },
    }
  );

  return data;
}
