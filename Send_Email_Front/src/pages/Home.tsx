import { useEffect, useMemo, useState } from "react";
import EmailsTable from "../components/EmailsTable";
import Pagination from "../components/Pagination";
import EmailCreateModal from "../components/EmailCreateModal";
import { getAllSettingsEmails } from "../services/settingsEmail";
import type { SettingsEmail } from "../types/settingsEmail";
import { useAuth } from "../context/AuthContext";
import { usePolling } from "../hooks/usePolling";

export default function Home() {
  const { isAuthenticated } = useAuth();

  const [emails, setEmails] = useState<SettingsEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // modal
  const [modalOpen, setModalOpen] = useState(false);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getAllSettingsEmails();
      setEmails(data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao buscar dados da API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Polling a cada 15s (somente logado e com modal fechado)
  usePolling(fetchData, {
    intervalMs: 15000,
    enabled: isAuthenticated && !modalOpen,
  });

  // re-calibra página se total mudar
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(emails.length / pageSize));
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [emails.length, pageSize, currentPage]);

  const total = emails.length;
  const pageStart = (currentPage - 1) * pageSize;
  const pageItems = useMemo(
    () => emails.slice(pageStart, pageStart + pageSize),
    [emails, pageStart, pageSize]
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Lista de E-mails Agendados
        </h1>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="pageSize" className="text-gray-600">
              Itens por página:
            </label>
            <select
              id="pageSize"
              className="border rounded px-2 py-1 bg-white"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchData}
            className="rounded-md border bg-white px-3 py-2 text-sm hover:bg-gray-50"
            title="Atualizar agora"
          >
            Atualizar
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Novo agendamento
          </button>
        </div>
      </div>

      <EmailsTable emails={pageItems} loading={loading} error={error} />

      {!loading && !error && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          total={total}
          onPageChange={setCurrentPage}
        />
      )}

      <EmailCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
