import { useEffect, useMemo, useState } from "react";
import { Pencil, Pause, Play, Search, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Pagination from "../../../components/Pagination";
import {
  createAdminSubAdmin,
  deleteAdminUser,
  fetchAdminUsers,
  updateAdminSubAdmin,
  updateAdminSubAdminStatus,
} from "../../../features/admin/adminSlice";
import SubAdminModal from "./SubAdminModal";

const USER_TABS = [
  { key: "sub-admins", label: "Sub-Admin", role: "SUB_ADMIN" },
  { key: "users", label: "User list", role: "USER" },
];

const MobileInfoField = ({ label, value, strong = false }) => (
  <div className="rounded-lg border border-[#eceff3] bg-white px-3 py-2.5 min-w-0">
    <p className="text-[11px] font-medium uppercase tracking-wide text-[#8b95a5]">{label}</p>
    <p className={`mt-1 text-sm wrap-break-word ${strong ? "font-semibold text-[#111827]" : "text-[#374151]"}`}>
      {value}
    </p>
  </div>
);

const StatusBadge = ({ isActive }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
      isActive ? "bg-[#ecfdf3] text-[#027a48]" : "bg-[#fff7ed] text-[#c2410c]"
    }`}
  >
    {isActive ? "Active" : "Paused"}
  </span>
);

const AdminUser = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.admin.users);
  const usersLoading = useSelector((state) => state.admin.usersLoading);
  const usersError = useSelector((state) => state.admin.usersError);
  const usersPagination = useSelector((state) => state.admin.usersPagination);
  const deleteUserLoadingById = useSelector((state) => state.admin.deleteUserLoadingById);
  const createSubAdminLoading = useSelector((state) => state.admin.createSubAdminLoading);
  const updateSubAdminLoadingById = useSelector((state) => state.admin.updateSubAdminLoadingById);
  const updateSubAdminStatusLoadingById = useSelector((state) => state.admin.updateSubAdminStatusLoadingById);

  const [activeTab, setActiveTab] = useState("sub-admins");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSubAdminModalOpen, setIsSubAdminModalOpen] = useState(false);
  const [subAdminModalMode, setSubAdminModalMode] = useState("create");
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null);
  const resultsPerPage = 6;

  const activeTabConfig = useMemo(
    () => USER_TABS.find((tab) => tab.key === activeTab) || USER_TABS[0],
    [activeTab],
  );
  const isSubAdminTab = activeTab === "sub-admins";

  const totalPages = Math.max(1, Number(usersPagination?.totalPages || 1));
  const totalResults = Number(usersPagination?.total || 0);
  const paginatedUsers = users;

  const buildFetchParams = (page = currentPage) => ({
    search: debouncedSearch || undefined,
    role: activeTabConfig.role,
    sortBy: "createdAt",
    sortOrder: "desc",
    page,
    limit: resultsPerPage,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    dispatch(fetchAdminUsers(buildFetchParams()));
  }, [activeTab, currentPage, debouncedSearch, dispatch]);

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

  const refetchUsers = (page = currentPage) => {
    dispatch(fetchAdminUsers(buildFetchParams(page)));
  };

  const handleDeleteUser = async (id, label = "user") => {
    try {
      await toast.promise(dispatch(deleteAdminUser(id)).unwrap(), {
        pending: `Deleting ${label}...`,
        success: `${label === "sub-admin" ? "Sub-admin" : "User"} deleted successfully`,
        error: {
          render({ data }) {
            return data || `Failed to delete ${label}`;
          },
        },
      });

      if (paginatedUsers.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
        return;
      }

      refetchUsers();
    } catch {
      // Error toast handled by toast.promise.
    }
  };

  const openCreateSubAdminModal = () => {
    setSubAdminModalMode("create");
    setSelectedSubAdmin(null);
    setIsSubAdminModalOpen(true);
  };

  const openEditSubAdminModal = (subAdmin) => {
    setSubAdminModalMode("edit");
    setSelectedSubAdmin(subAdmin);
    setIsSubAdminModalOpen(true);
  };

  const handleSubAdminSubmit = async ({ fullName, email, password }) => {
    try {
      if (subAdminModalMode === "create") {
        await toast.promise(
          dispatch(createAdminSubAdmin({ fullName, email, password })).unwrap(),
          {
            pending: "Creating sub-admin...",
            success: "Sub-admin created successfully",
            error: {
              render({ data }) {
                return data || "Failed to create sub-admin";
              },
            },
          },
        );
      } else {
        const managedUserId = selectedSubAdmin?.managedUserId || selectedSubAdmin?.id;
        await toast.promise(
          dispatch(
            updateAdminSubAdmin({
              managedUserId,
              fullName,
              email,
              ...(password ? { password } : {}),
            }),
          ).unwrap(),
          {
            pending: "Updating sub-admin...",
            success: "Sub-admin updated successfully",
            error: {
              render({ data }) {
                return data || "Failed to update sub-admin";
              },
            },
          },
        );
      }

      setIsSubAdminModalOpen(false);
      setSelectedSubAdmin(null);
      refetchUsers();
    } catch {
      // Error toast handled by toast.promise.
    }
  };

  const handleToggleSubAdminStatus = async (subAdmin) => {
    const managedUserId = subAdmin?.managedUserId || subAdmin?.id;
    const nextIsActive = !subAdmin?.isActive;

    try {
      await toast.promise(
        dispatch(updateAdminSubAdminStatus({ managedUserId, isActive: nextIsActive })).unwrap(),
        {
          pending: nextIsActive ? "Activating sub-admin..." : "Pausing sub-admin...",
          success: nextIsActive ? "Sub-admin activated" : "Sub-admin paused",
          error: {
            render({ data }) {
              return data || "Failed to update sub-admin status";
            },
          },
        },
      );
    } catch {
      // Error toast handled by toast.promise.
    }
  };

  const renderSubAdminActions = (userRow) => {
    const rowId = String(userRow.managedUserId || userRow.id);
    const isDeleting = Boolean(deleteUserLoadingById[rowId]);
    const isUpdating = Boolean(updateSubAdminLoadingById[rowId]);
    const isTogglingStatus = Boolean(updateSubAdminStatusLoadingById[rowId]);

    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={isUpdating}
          className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md text-[#374151] hover:bg-[#f3f4f6] disabled:opacity-60"
          aria-label="Edit sub-admin"
          onClick={() => openEditSubAdminModal(userRow)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={isTogglingStatus}
          className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md text-[#0f766e] hover:bg-[#ecfdf5] disabled:opacity-60"
          aria-label={userRow.isActive ? "Pause sub-admin" : "Activate sub-admin"}
          onClick={() => handleToggleSubAdminStatus(userRow)}
        >
          {userRow.isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          disabled={isDeleting}
          className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md text-[#ef4444] hover:bg-[#fff1f2] disabled:opacity-60"
          aria-label="Delete sub-admin"
          onClick={() => handleDeleteUser(rowId, "sub-admin")}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    );
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
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name, email, or phone"
            className="w-full rounded-md border border-[#d1d5db] bg-white pl-9 pr-3 py-2 text-sm text-[#111827] focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-lg overflow-hidden">
        <div className="px-2 md:px-3 py-2 overflow-x-auto">
          <div className="flex items-center justify-between gap-4 min-w-max">
            <div className="flex justify-start gap-4 md:gap-8">
              {USER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key);
                    setCurrentPage(1);
                    setSearchInput("");
                    setDebouncedSearch("");
                  }}
                  className={`relative min-w-24 md:min-w-40 py-4 md:py-5 text-base md:text-lg font-semibold transition-colors text-center whitespace-nowrap cursor-pointer ${
                    activeTab === tab.key ? "text-[#004C48]" : "text-[#373737]"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 md:h-0.75 rounded-full transition-all duration-200 ${
                      activeTab === tab.key ? "w-full bg-[#0f172a]" : "w-0 bg-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>

            {isSubAdminTab && (
              <button
                type="button"
                onClick={openCreateSubAdminModal}
                className="h-10 shrink-0 rounded-md bg-[#E97C35] px-4 text-sm font-medium text-white hover:bg-[#cf6d2e]"
              >
                Add sub admin
              </button>
            )}
          </div>
        </div>

        <section className="border border-[#ececec] bg-white overflow-hidden">
          <div className="border-b border-[#ececec] px-3 md:px-4 py-2.5 md:py-3">
            <h2 className="text-lg sm:text-xl md:text-[24px] leading-none font-semibold text-[#111827]">
              {isSubAdminTab ? "Sub-Admin List" : "User List"}
            </h2>
          </div>

          <div className="hidden sm:block overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-225 text-left text-sm md:text-base">
              <thead>
                <tr className="border-b border-[#efefef] text-sm md:text-base text-[#374151]">
                  <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">User Name</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Email</th>
                  {!isSubAdminTab && (
                    <>
                      <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Phone</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Country</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Location</th>
                      <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Listings</th>
                    </>
                  )}
                  {isSubAdminTab && (
                    <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Status</th>
                  )}
                  <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Joined</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.map((userRow) => (
                  <tr key={userRow.id} className="border-b border-[#f3f4f6] text-sm md:text-base text-[#374151]">
                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">{userRow.name}</td>
                    <td className="px-2 md:px-4 py-3 md:py-4 wrap-break-word max-w-55 lg:max-w-xs">{userRow.email}</td>
                    {!isSubAdminTab && (
                      <>
                        <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">{userRow.phone}</td>
                        <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">{userRow.country}</td>
                        <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">{userRow.location}</td>
                        <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">{userRow.listings}</td>
                      </>
                    )}
                    {isSubAdminTab && (
                      <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">
                        <StatusBadge isActive={userRow.isActive} />
                      </td>
                    )}
                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">{userRow.joined}</td>
                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">
                      {isSubAdminTab ? (
                        renderSubAdminActions(userRow)
                      ) : (
                        <button
                          type="button"
                          disabled={Boolean(deleteUserLoadingById[String(userRow.managedUserId || userRow.id)])}
                          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-[#ef4444] hover:bg-[#fff1f2] hover:text-[#dc2626] disabled:opacity-60"
                          aria-label="Delete user"
                          onClick={() => handleDeleteUser(userRow.managedUserId || userRow.id)}
                        >
                          <Trash2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
                      {isSubAdminTab ? (
                        <StatusBadge isActive={userRow.isActive} />
                      ) : (
                        <button
                          type="button"
                          disabled={Boolean(deleteUserLoadingById[String(userRow.managedUserId || userRow.id)])}
                          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-[#fecdd3] bg-[#fff1f2] text-[#ef4444] disabled:opacity-60"
                          aria-label="Delete user"
                          onClick={() => handleDeleteUser(userRow.managedUserId || userRow.id)}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                        </button>
                      )}
                    </div>

                    <div className="rounded-lg border border-[#eceff3] bg-white px-3 py-2.5 min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#8b95a5]">Email</p>
                      <p className="mt-1 text-sm text-[#374151] break-all">{userRow.email}</p>
                    </div>

                    {!isSubAdminTab && (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <MobileInfoField label="Phone" value={userRow.phone} />
                          <MobileInfoField label="Country" value={userRow.country} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <MobileInfoField label="Location" value={userRow.location} />
                          <MobileInfoField label="Listings" value={userRow.listings} strong />
                        </div>
                      </>
                    )}

                    <MobileInfoField label="Joined" value={userRow.joined} />

                    {isSubAdminTab && (
                      <div className="flex items-center justify-end gap-2 pt-1">
                        {renderSubAdminActions(userRow)}
                      </div>
                    )}
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
              {isSubAdminTab ? "No sub-admins found." : "No users found."}
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

      <SubAdminModal
        isOpen={isSubAdminModalOpen}
        mode={subAdminModalMode}
        initialValues={selectedSubAdmin}
        loading={
          subAdminModalMode === "create"
            ? createSubAdminLoading
            : Boolean(updateSubAdminLoadingById[String(selectedSubAdmin?.id || "")])
        }
        onClose={() => {
          setIsSubAdminModalOpen(false);
          setSelectedSubAdmin(null);
        }}
        onSubmit={handleSubAdminSubmit}
      />
    </div>
  );
};

export default AdminUser;
