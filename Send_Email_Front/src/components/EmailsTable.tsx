import type { SettingsEmail } from "../types/settingsEmail";

type Props = {
  emails: SettingsEmail[];
  loading?: boolean;
  error?: string | null;
};

function formatDate(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso; // fallback
  return d.toLocaleString();
}

export default function EmailsTable({ emails, loading, error }: Props) {
  if (loading) {
    return <p className="text-gray-600">Carregando...</p>;
  }

  if (error) {
    return (
      <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-left text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Destinatário</th>
            <th className="px-4 py-3">Descrição</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Agendado</th>
            <th className="px-4 py-3">Criado em</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((e) => (
            <tr key={e.id} className="border-t hover:bg-gray-50 transition-colors">
              <td className="px-4 py-2">{e.id}</td>
              <td className="px-4 py-2">{e.recipientEmail}</td>
              <td className="px-4 py-2">{e.description}</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium
                    ${e.status === 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                >
                  {e.status === 0 ? "Pendente" : "Enviado"}
                </span>
              </td>
              <td className="px-4 py-2">{formatDate(e.scheduledAt)}</td>
              <td className="px-4 py-2">{formatDate(e.createdAt)}</td>
            </tr>
          ))}
          {emails.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                Nenhum e-mail encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
