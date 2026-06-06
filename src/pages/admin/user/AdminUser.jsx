import { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Pagination from "../../../components/Pagination";
import { deleteAdminUser, fetchAdminUsers } from "../../../features/admin/adminSlice";

const MobileInfoField = ({ label, value, strong = false }) => (
  <div className="rounded-lg border border-[#eceff3] bg-white px-3 py-2.5 min-w-0">
    <p className="text-[11px] font-medium uppercase tracking-wide text-[#8b95a5]">{label}</p>
    <p className={`mt-1 text-sm wrap-break-word ${strong ? "font-semibold text-[#111827]" : "text-[#374151]"}`}>
      {value}
    </p>
  </div>
);

const AdminUser = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.admin.users);
  const usersLoading = useSelector((state) => state.admin.usersLoading);
  const usersError = useSelector((state) => state.admin.usersError);
  const usersPagination = useSelector((state) => state.admin.usersPagination);
  const deleteUserLoadingById = useSelector((state) => state.admin.deleteUserLoadingById);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const resultsPerPage = 20;

  const totalPages = Math.max(1, Number(usersPagination?.totalPages || 1));
  const totalResults = Number(usersPagination?.total || 0);
  const paginatedUsers = users;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    dispatch(
      fetchAdminUsers({
        search: debouncedSearch || undefined,
        role: "USER",
        sortBy: "createdAt",
        sortOrder: "desc",
        page: currentPage,
        limit: resultsPerPage,
      }),
    );
  }, [currentPage, debouncedSearch, dispatch]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (usersError) {
      toast.error(usersError);
    }
  }, [usersError]);

  const handleDeleteUser = async (id) => {
    try {
      await toast.promise(dispatch(deleteAdminUser(id)).unwrap(), {
        pending: "Deleting user...",
        success: "User deleted successfully",
        error: {
          render({ data }) {
            return data || "Failed to delete user";
          },
        },
      });

      dispatch(
        fetchAdminUsers({
          search: debouncedSearch || undefined,
          role: "USER",
          sortBy: "createdAt",
          sortOrder: "desc",
          page: currentPage,
          limit: resultsPerPage,
        }),
      );
    } catch {
      // Error toast handled by toast.promise.
    }
  };

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="px-2 md:px-0">
        <h1 className="text-2xl sm:text-3xl md:text-[38px] leading-none font-semibold text-[#111827]">User Management</h1>
        <p className="mt-2 text-sm md:text-base text-[#6b7280]">View and manage all registered platform users.</p>
      </div>

      <div className="px-2 md:px-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, email, or phone"
            className="w-full rounded-md border border-[#d1d5db] bg-white pl-9 pr-3 py-2 text-sm text-[#111827] focus:outline-none"
          />
        </div>
      </div>

      <section className="rounded-lg border border-[#ececec] bg-white overflow-hidden">
        <div className="border-b border-[#ececec] px-3 md:px-4 py-2.5 md:py-3">
          <h2 className="text-lg sm:text-xl md:text-[24px] leading-none font-semibold text-[#111827]">User List</h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-225 text-left text-sm md:text-base">
            <thead>
              <tr className="border-b border-[#efefef] text-sm md:text-base text-[#374151]">
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">User Name</th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Email</th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Phone</th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Country</th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Location</th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Listings</th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Joined</th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((userRow) => (
                <tr key={userRow.id} className="border-b border-[#f3f4f6] text-sm md:text-base text-[#374151]">
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">{userRow.name}</td>
                  <td className="px-2 md:px-4 py-3 md:py-4 wrap-break-word max-w-55 lg:max-w-xs text-sm md:text-base">{userRow.email}</td>
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap text-sm md:text-base">{userRow.phone}</td>
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">{userRow.country}</td>
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">{userRow.location}</td>
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">{userRow.listings}</td>
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap text-sm md:text-base">{userRow.joined}</td>
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">
                    <button
                      type="button"
                      disabled={Boolean(deleteUserLoadingById[String(userRow.managedUserId || userRow.id)])}
                      className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-[#ef4444] hover:bg-[#fff1f2] hover:text-[#dc2626] disabled:opacity-60"
                      aria-label="Delete user"
                      onClick={() => handleDeleteUser(userRow.managedUserId || userRow.id)}
                    >
                      <Trash2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden">
          <div className="space-y-3 p-3">
            {paginatedUsers.map((userRow) => (
              <article key={userRow.id} className="rounded-xl border border-[#e9edf2] bg-[#fcfcfd] p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#8b95a5]">User Name</p>
                      <p className="mt-1 text-base font-semibold leading-tight text-[#111827] wrap-break-word">{userRow.name}</p>
                    </div>
                    <button
                      type="button"
                      disabled={Boolean(deleteUserLoadingById[String(userRow.managedUserId || userRow.id)])}
                      className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-[#fecdd3] bg-[#fff1f2] text-[#ef4444] active:bg-[#ffe4e6] disabled:opacity-60"
                      aria-label="Delete user"
                      onClick={() => handleDeleteUser(userRow.managedUserId || userRow.id)}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                  </div>

                  <div className="rounded-lg border border-[#eceff3] bg-white px-3 py-2.5 min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#8b95a5]">Email</p>
                    <p className="mt-1 text-sm text-[#374151] break-all">{userRow.email}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <MobileInfoField label="Phone" value={userRow.phone} />
                    <MobileInfoField label="Country" value={userRow.country} />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <MobileInfoField label="Location" value={userRow.location} />
                    <MobileInfoField label="Listings" value={userRow.listings} strong />
                  </div>

                  <MobileInfoField label="Joined" value={userRow.joined} />
                </div>
              </article>
            ))}
          </div>
        </div>

        {usersLoading && (
          <div className="px-3 md:px-4 py-8 text-center text-sm text-[#6b7280]">Loading users...</div>
        )}

        {!usersLoading && paginatedUsers.length === 0 && (
          <div className="px-3 md:px-4 py-8 text-center text-sm text-[#6b7280]">
            No users found.
          </div>
        )}

        <div className="mt-3 md:mt-4 px-2 sm:px-3 md:px-4 pb-2 md:pb-3 flex justify-center">
          <Pagination
            current={currentPage}
            total={totalPages}
            onPageChange={setCurrentPage}
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
          />
        </div>
      </section>
    </div>
  );
};

export default AdminUser;
