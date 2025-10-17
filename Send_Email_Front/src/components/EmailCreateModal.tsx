import { useEffect, useState } from "react";
import { createSettingsEmail } from "../services/settingsEmail";
import { useAuth } from "../context/AuthContext";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // recarrega a lista na Home
};

function toIsoFromDatetimeLocal(value: string | null) {
  if (!value) return null;
  // datetime-local costuma vir "YYYY-MM-DDTHH:mm" → adiciona segundos
  return value.length === 16 ? `${value}:00` : value;
}

export default function EmailCreateModal({ open, onClose, onSuccess }: Props) {
  const { userId } = useAuth();

  const [recipientEmail, setRecipientEmail] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setRecipientEmail("");
      setDescription("");
      setScheduledAt("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!recipientEmail) {
      setError("Informe o e-mail do destinatário.");
      return;
    }
    if (userId == null) {
      setError("Usuário não identificado. Faça login novamente.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await createSettingsEmail({
        recipientEmail,
        description: description || null,
        scheduledAt: toIsoFromDatetimeLocal(scheduledAt),
        userId, // <- agora enviando para o endpoint
        status: 0, // pendente
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Não foi possível criar o agendamento.";
      setError(msg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-lg font-semibold">Novo agendamento</h2>
          <button onClick={onClose} className="rounded p-1 text-gray-500 hover:bg-gray-100" aria-label="Fechar">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm text-gray-700" htmlFor="recipientEmail">
              Destinatário
            </label>
            <input
              id="recipientEmail"
              type="email"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ex.: usuario@dominio.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-700" htmlFor="description">
              Descrição (opcional)
            </label>
            <input
              id="description"
              type="text"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Assunto / observação"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-700" htmlFor="scheduledAt">
              Agendar para (opcional)
            </label>
            <input
              id="scheduledAt"
              type="datetime-local"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              disabled={submitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              Deixe vazio para enviar imediatamente (se o backend permitir).
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border bg-white px-4 py-2 hover:bg-gray-50"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`rounded-md px-4 py-2 text-white ${
                submitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={submitting}
            >
              {submitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
