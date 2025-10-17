type Props = {
  currentPage: number;          // página atual (1-based)
  pageSize: number;             // itens por página
  total: number;                // total de itens
  onPageChange: (page: number) => void;
  siblingCount?: number;        // quantas páginas vizinhas mostrar (default: 1)
};

export default function Pagination({
  currentPage,
  pageSize,
  total,
  onPageChange,
  siblingCount = 1,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  function clamp(p: number) {
    return Math.min(Math.max(1, p), totalPages);
  }

  const start = Math.max(1, currentPage - siblingCount);
  const end = Math.min(totalPages, currentPage + siblingCount);
  const pages: (number | "...")[] = [];

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between gap-2 py-3">
      <div className="text-sm text-gray-600">
        {pageSize * (currentPage - 1) + 1}–
        {Math.min(currentPage * pageSize, total)} de {total}
      </div>

      <div className="flex items-center gap-1">
        <button
          className="px-3 py-1 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
          onClick={() => onPageChange(clamp(currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          ←
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-gray-500">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 rounded border ${
                p === currentPage
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white hover:bg-gray-50"
              }`}
              aria-current={p === currentPage ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          className="px-3 py-1 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
          onClick={() => onPageChange(clamp(currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Próxima página"
        >
          →
        </button>
      </div>
    </div>
  );
}
