import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

function Pagination({ current, total, onPageChange, totalResults = 0, resultsPerPage = 10 }) {
  const go = (p) => onPageChange(Math.min(Math.max(1, p), total));

  // Calculate "Showing X to Y of Z results"
  const startResult = (current - 1) * resultsPerPage + 1;
  const endResult = Math.min(current * resultsPerPage, totalResults);
  const showResultsText = totalResults > 0;

  const pages = [];
  if (total <= 5) {
    for (let page = 1; page <= total; page += 1) {
      pages.push(page);
    }
  } else if (current <= 3) {
    pages.push(1, 2, 3, "...", total);
  } else if (current >= total - 2) {
    pages.push(1, "...", total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }

  const btnBase =
    "w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl sm:rounded-lg text-sm sm:text-xs font-medium border border-[#e5e7eb] transition-colors";

  return (
    <div className="flex flex-col items-center justify-center gap-2 px-2 md:px-4 py-2 md:py-3">
      {showResultsText && (
        <p className="hidden md:block text-[10px] md:text-xs text-[#10b981] text-center">
          Showing {startResult} to {endResult} of {totalResults} results
        </p>
      )}
      
      <div className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto">
        <button
          onClick={() => go(1)}
          disabled={current === 1}
          className={`${btnBase} bg-[#f8fafc] text-[#111827] hover:bg-[#f1f5f9] disabled:opacity-40`}
          title="First page"
        >
          <ChevronsLeft size={14} />
        </button>

        <button
          onClick={() => go(current - 1)}
          disabled={current === 1}
          className={`${btnBase} ${
            current === 1
              ? "bg-[#f8fafc] text-[#d1d5db] disabled:opacity-40"
              : "bg-[#f8fafc] text-[#111827] hover:bg-[#f1f5f9]"
          }`}
          title="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className={`${btnBase} bg-[#f8fafc] text-[#111827]`}
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => go(p)}
              className={`${btnBase} ${
                p === current
                  ? "bg-[#ec8d47] border-[#ec8d47] text-white shadow-sm"
                  : "bg-[#f8fafc] text-[#111827] hover:bg-[#f1f5f9]"
              }`}
            >
              <span className="text-base sm:text-sm">{p}</span>
            </button>
          )
        )}

        <button
          onClick={() => go(current + 1)}
          disabled={current === total}
          className={`${btnBase} ${
            current === total
              ? "bg-[#f8fafc] text-[#d1d5db] disabled:opacity-40"
              : "bg-[#f8fafc] text-[#111827] hover:bg-[#f1f5f9]"
          }`}
          title="Next page"
        >
          <ChevronRight size={14} />
        </button>

        <button
          onClick={() => go(total)}
          disabled={current === total}
          className={`${btnBase} bg-[#f8fafc] text-[#111827] hover:bg-[#f1f5f9] disabled:opacity-40`}
          title="Last page"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
