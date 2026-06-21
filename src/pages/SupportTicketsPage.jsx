import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Eye,
  Loader2,
  Search,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";
import Pagination from "../components/Pagination";
import {
  clearSelectedTicket,
  deleteTicket,
  fetchTicketById,
  fetchTickets,
} from "../features/support/supportSlice";

const PAGE_LIMIT = 10;
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_ORDER = "desc";
const DEBOUNCE_DELAY = 300;

const formatTicketDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  const formattedDate = date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate}, ${formattedTime}`;
};

const truncateMessage = (value, maxLength = 40) => {
  const message = String(value || "").trim();
  if (message.length <= maxLength) return message || "N/A";
  return `${message.slice(0, maxLength)}...`;
};

const getInitials = (value) => {
  const parts = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
};

const MobileInfoField = ({ label, value, strong = false }) => (
  <div className="rounded-lg border border-[#eceff3] bg-white px-3 py-2.5 min-w-0">
    <p className="text-[11px] font-medium uppercase tracking-wide text-[#8b95a5]">{label}</p>
    <p className={`mt-1 text-sm wrap-break-word ${strong ? "font-semibold text-[#111827]" : "text-[#374151]"}`}>
      {value}
    </p>
  </div>
);

const TicketModalShell = ({ children, onClose, title, footer }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-4 md:py-6">
    <div className="relative w-full max-w-xl  max-h-[90vh] md:max-h-[85vh] rounded-xl bg-white shadow-xl flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 border-b border-gray-100 px-4 md:px-4 py-3 md:py-4 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-y-contain">
        <div className="px-4 md:px-4 py-4 md:py-5">{children}</div>
      </div>

      {/* Fixed Footer */}
      {footer && (
        <div className="sticky bottom-0 z-10 border-t border-gray-100 px-4 md:px-4 py-3 md:py-4 bg-white">
          {footer}
        </div>
      )}
    </div>
  </div>
);

const SupportTicketsPage = () => {
  const dispatch = useDispatch();
  const { tickets, meta, loading, error, selectedTicket, detailLoading, detailError, deleteLoading, deleteError } =
    useSelector((state) => state.support);

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT_BY);
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT_ORDER);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  const limit = PAGE_LIMIT;
  const totalTickets = Number(meta?.total || 0);
  const totalPages = Number(meta?.pages || 1);
  const showingStart = totalTickets === 0 ? 0 : (page - 1) * limit + 1;
  const showingEnd = totalTickets === 0 ? 0 : Math.min(page * limit, totalTickets);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  useEffect(() => {
    dispatch(
      fetchTickets({
        page,
        limit,
        sortBy,
        sortOrder,
        search: debouncedSearch,
      }),
    );
  }, [dispatch, page, limit, sortBy, sortOrder, debouncedSearch]);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (detailError) {
      toast.error(detailError);
    }
  }, [detailError]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError);
    }
  }, [deleteError]);

  const retryFetch = () => {
    dispatch(
      fetchTickets({
        page,
        limit,
        sortBy,
        sortOrder,
        search: debouncedSearch,
      }),
    );
  };

  const handleSort = (column) => {
    setPage(1);
    if (sortBy === column) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(column);
    setSortOrder(column === "createdAt" ? DEFAULT_SORT_ORDER : "asc");
  };

  const openViewModal = (ticketId) => {
    dispatch(clearSelectedTicket());
    setIsViewModalOpen(true);
    dispatch(fetchTicketById(ticketId));
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    dispatch(clearSelectedTicket());
  };

  const openDeleteModal = (ticket) => {
    setTicketToDelete(ticket);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTicketToDelete(null);
  };

  const handleDeleteTicket = async () => {
    if (!ticketToDelete?.id) return;

    const shouldMoveBack = page > 1 && tickets.length === 1;
    const nextPage = shouldMoveBack ? page - 1 : page;
    const currentParams = {
      page,
      limit,
      sortBy,
      sortOrder,
      search: debouncedSearch,
    };

    try {
      await dispatch(deleteTicket(ticketToDelete.id)).unwrap();
      toast.success("Ticket deleted successfully");
      closeDeleteModal();
      closeViewModal();

      if (shouldMoveBack) {
        setPage(nextPage);
        return;
      }

      dispatch(fetchTickets(currentParams));
    } catch {
      // The slice and toast effect handle the error state.
    }
  };

  const sortIndicator = useMemo(
    () => ({
      createdAt: sortBy === "createdAt" ? sortOrder : null,
      name: sortBy === "name" ? sortOrder : null,
      email: sortBy === "email" ? sortOrder : null,
    }),
    [sortBy, sortOrder],
  );

  const renderSortIcon = (column) => {
    const indicator = sortIndicator[column];

    if (!indicator) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }

    return indicator === "asc" ? (
      <ChevronUp className="h-4 w-4 text-gray-700" />
    ) : (
      <ChevronDown className="h-4 w-4 text-gray-700" />
    );
  };

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="px-2 md:px-0">
        <h1 className="text-2xl sm:text-3xl md:text-[38px] leading-none font-semibold text-[#111827]">
          Support Tickets
        </h1>
        <p className="mt-2 text-sm md:text-base text-[#6b7280]">
          Review incoming support requests and manage tickets.
        </p>
      </div>

      <div className="rounded-lg overflow-hidden">
       

        {loading && (
          <div className="px-2 md:px-4 py-6 text-sm text-[#6b7280]">Loading tickets...</div>
        )}

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-225 text-left text-sm md:text-base">
            <thead>
              <tr className="border-b border-[#efefef] text-sm md:text-base text-[#000000] bg-[#F9FAFB]">
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">#</th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">
             
                    Name 
              
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">
                 
                    Email
                 
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Message</th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">
          
                    Date 
                
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket, index) => {
                const ticketId = ticket?.id ?? ticket?._id ?? index;
                const ticketName = String(ticket?.name || "N/A");
                const ticketEmail = String(ticket?.email || "N/A");
                const ticketMessage = String(ticket?.message || "");

                return (
                  <tr
                    key={ticketId}
                    className="border border-[#e4e4e4] text-sm md:text-base text-[#374151] bg-white"
                  >
                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-2 md:px-4 py-3 md:py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f766e] text-sm font-semibold text-white flex-shrink-0">
                          {getInitials(ticketName)}
                        </div>
                        <p className="text-sm font-semibold text-gray-900 wrap-break-word">{ticketName}</p>
                      </div>
                    </td>
                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">{ticketEmail}</td>
                    <td className="px-2 md:px-4 py-3 md:py-4">{truncateMessage(ticketMessage, 40)}</td>
                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">{formatTicketDate(ticket?.createdAt)}</td>
                    <td className="px-2 md:px-4 py-3 md:py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openViewModal(ticketId)}
                          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-[#0f766e] hover:bg-[#ecfdf5]"
                          aria-label="View ticket"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(ticket)}
                          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-[#ef4444] hover:bg-[#fff1f2]"
                          aria-label="Delete ticket"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && tickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-[#6b7280]">
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden">
          <div className="space-y-3 px-2">
            {tickets.map((ticket, index) => {
              const ticketId = ticket?.id ?? ticket?._id ?? index;
              const ticketName = String(ticket?.name || "N/A");
              const ticketEmail = String(ticket?.email || "N/A");
              const ticketMessage = String(ticket?.message || "");

              return (
                <article
                  key={ticketId}
                  className="rounded-xl border border-[#e9edf2] bg-[#fcfcfd] p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
                >
                  <div className="flex min-h-64.5 flex-col gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#8b95a5]">Ticket From</p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f766e] text-xs font-semibold text-white flex-shrink-0">
                          {getInitials(ticketName)}
                        </div>
                        <p className="text-base font-semibold leading-tight text-[#111827] wrap-break-word">
                          {ticketName}
                        </p>
                      </div>
                    </div>

                    <MobileInfoField label="Email" value={ticketEmail} />

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#8b95a5]">Message</p>
                      <p className="mt-2 rounded-lg border border-[#eceff3] bg-white px-3 py-2.5 text-sm leading-relaxed text-[#374151] wrap-break-word">
                        {ticketMessage || "N/A"}
                      </p>
                    </div>

                    <MobileInfoField label="Date" value={formatTicketDate(ticket?.createdAt)} />

                    <div className="mt-auto border-t border-[#ececec] pt-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-[#0f766e] hover:bg-[#ecfdf5]"
                          aria-label="View ticket"
                          onClick={() => openViewModal(ticketId)}
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-[#ef4444] hover:bg-[#fff1f2]"
                          aria-label="Delete ticket"
                          onClick={() => openDeleteModal(ticket)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {!loading && tickets.length === 0 && (
              <div className="rounded-xl border border-[#e9edf2] bg-[#fcfcfd] p-4 text-center text-sm text-[#6b7280]">
                No tickets found.
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="px-2 md:px-4 py-6">
            <div className="flex items-center gap-3 rounded-lg bg-red-50 px-4 py-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                type="button"
                onClick={retryFetch}
                className="ml-2 text-sm font-medium text-red-600 hover:text-red-700 flex-shrink-0"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && tickets.length > 0 && (
          <Pagination
            current={page}
            total={totalPages}
            onPageChange={setPage}
            totalResults={totalTickets}
            resultsPerPage={limit}
          />
        )}
      </div>

      {isViewModalOpen && (
        <TicketModalShell
          title="Ticket Details"
          onClose={closeViewModal}
          footer={
            !detailLoading && !detailError && selectedTicket ? (
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={closeViewModal}
                  className="rounded-lg border border-gray-300 px-3 md:px-4 py-2 md:py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTicketToDelete(selectedTicket);
                    setIsDeleteModalOpen(true);
                  }}
                  className="rounded-lg bg-red-50 px-3 md:px-4 py-2 md:py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            ) : null
          }
        >
          {detailLoading ? (
            <div className="space-y-4">
              <div className="h-4 w-1/3 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
              <div className="h-24 rounded bg-gray-200 animate-pulse" />
            </div>
          ) : detailError ? (
            <div className="text-sm text-red-600">{detailError}</div>
          ) : selectedTicket ? (
            <div className="space-y-5">
              <div className="flex items-center justify-start gap-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Name : </p>
                <p className="mt-1 text-sm font-medium text-gray-900">{selectedTicket?.name || "N/A"}</p>
              </div>
              <div className="flex items-center justify-start gap-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email : </p>
                <p className="mt-1 text-sm font-medium text-gray-900">{selectedTicket?.email || "N/A"}</p>
              </div>
              <div className="flex items-center justify-start gap-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Date : </p>
                <p className="mt-1 text-sm font-medium text-gray-900">{formatTicketDate(selectedTicket?.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Message</p>
                <p className="mt-2 whitespace-pre-line rounded-lg border border-gray-200 bg-gray-50 px-3 md:px-4 py-2.5 md:py-3 text-sm leading-6 text-gray-700">
                  {selectedTicket?.message || "N/A"}
                </p>
              </div>
            </div>
          ) : null}
        </TicketModalShell>
      )}

      {isDeleteModalOpen && ticketToDelete && (
        <TicketModalShell 
          title="Delete Ticket" 
          onClose={closeDeleteModal}
          footer={
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-lg border border-gray-300 px-3 md:px-4 py-2 md:py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTicket}
                disabled={deleteLoading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 md:px-4 py-2 md:py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deleteLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{ticketToDelete?.name || "this ticket"}</span>?
            </p>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
          </div>
        </TicketModalShell>
      )}
    </div>
  );
};

export default SupportTicketsPage;
