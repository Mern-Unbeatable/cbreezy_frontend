import { useContext, useEffect, useState } from "react";
import { Check, Eye, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Pagination from "../../../components/Pagination";
import { AuthContext, ROLES } from "../../../context/AuthContext";
import CreateServiceModal from "../../profile/my-services/CreateServiceModal";
import CreateEventModal from "../../profile/my-events/CreateEventModal";
import AddListingModal from "./AddListingModal";
import {
  canApproveListing,
  canDeleteListing,
  canSuspendListing,
  getListingStatusKey,
} from "./listingActions";
import {
  deleteAdminListing,
  fetchAdminListings,
  updateAdminListingStatus,
} from "../../../features/admin/adminSlice";

const MobileInfoField = ({ label, value, strong = false }) => (
  <div className="rounded-lg border border-[#eceff3] bg-white px-3 py-2.5 min-w-0">
    <p className="text-[11px] font-medium uppercase tracking-wide text-[#8b95a5]">{label}</p>
    <p className={`mt-1 text-sm wrap-break-word ${strong ? "font-semibold text-[#111827]" : "text-[#374151]"}`}>
      {value}
    </p>
  </div>
);

const AdminListings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role, isSubAdmin: checkIsSubAdmin } = useContext(AuthContext);
  const isAdmin = role === ROLES.ADMIN;
  const isSubAdmin = checkIsSubAdmin();
  const listings = useSelector((state) => state.admin.listings);
  const listingsLoading = useSelector((state) => state.admin.listingsLoading);
  const listingsError = useSelector((state) => state.admin.listingsError);
  const listingsPagination = useSelector((state) => state.admin.listingsPagination);
  const tabs = useSelector((state) => state.admin.listingTabs);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [isCreateServiceOpen, setIsCreateServiceOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const resultsPerPage = 6;

  const totalPages = Math.max(1, Number(listingsPagination?.totalPages || 1));
  const paginatedListings = Array.isArray(listings) ? listings : [];

  const buildListingsParams = (page = currentPage) => {
    const params = {
      page,
      limit: resultsPerPage,
    };

    if (activeTab !== "all") {
      params.status = activeTab.toUpperCase();
    }

    return params;
  };

  useEffect(() => {
    dispatch(fetchAdminListings(buildListingsParams()));
  }, [activeTab, currentPage, dispatch]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const showLoader = listingsLoading;
  const showSpamReport = activeTab !== "pending";

  const handleViewListing = (item) => {
    toast.info("Opening listing details...");
    navigate(`/admin/listings/${item.id}`, { state: { listing: item } });
  };

  const refetchCurrentTab = () => dispatch(fetchAdminListings(buildListingsParams()));

  const handleAddListingType = (type) => {
    setIsAddListingOpen(false);

    if (type === "event") {
      setIsCreateEventOpen(true);
      return;
    }

    setIsCreateServiceOpen(true);
  };

  const handleListingCreated = async () => {
    setIsCreateServiceOpen(false);
    setIsCreateEventOpen(false);
    await refetchCurrentTab();
  };

  const renderListingActions = (item, mobile = false) => {
    const statusKey = getListingStatusKey(item);
    const iconClass = mobile ? "h-5 w-5" : "h-5 w-5";
    const buttonClass = mobile
      ? "inline-flex min-h-10 min-w-10 items-center justify-center rounded-md"
      : "inline-flex min-h-10 min-w-10 items-center justify-center rounded-md";

    return (
      <div className={`flex items-center gap-2 ${mobile ? "justify-end" : ""}`}>
        <button
          type="button"
          className={`${buttonClass} text-[#000000] hover:bg-[#f3f4f6]`}
          aria-label="View listing"
          onClick={() => handleViewListing(item)}
        >
          <Eye className={iconClass} />
        </button>

        {canApproveListing(statusKey) && (
          <button
            type="button"
            className={`${buttonClass} text-[#004C48] hover:bg-[#ecf2f1]`}
            aria-label="Approve listing"
            onClick={() => handleApproveListing(item.id)}
          >
            <Check className={iconClass} />
          </button>
        )}

        {canSuspendListing(statusKey) && (
          <button
            type="button"
            className={`${buttonClass} text-[#E00000] hover:bg-[#fff1f2]`}
            aria-label="Suspend listing"
            onClick={() => handleSuspendListing(item.id)}
          >
            <X className={iconClass} />
          </button>
        )}

        {canDeleteListing(statusKey, isAdmin) && (
          <button
            type="button"
            className={`${buttonClass} text-[#ef4444] hover:bg-[#fff1f2]`}
            aria-label="Delete listing"
            onClick={() => handleDeleteListing(item.id)}
          >
            <Trash2 className={iconClass} />
          </button>
        )}
      </div>
    );
  };

  const handleApproveListing = async (id) => {
    await toast.promise(
      dispatch(updateAdminListingStatus({ listingId: id, status: "APPROVED" })).unwrap(),
      {
      pending: "Approving listing...",
      success: "Listing approved successfully",
      error: "Failed to approve listing",
      },
    );

    await refetchCurrentTab();
  };

  const handleSuspendListing = async (id) => {
    await toast.promise(
      dispatch(updateAdminListingStatus({ listingId: id, status: "SUSPENDED" })).unwrap(),
      {
      pending: "Suspending listing...",
      success: "Listing suspended successfully",
      error: "Failed to suspend listing",
      },
    );

    await refetchCurrentTab();
  };

  const handleDeleteListing = async (id) => {
    await toast.promise(dispatch(deleteAdminListing(id)).unwrap(), {
      pending: "Deleting listing...",
      success: "Listing deleted successfully",
      error: "Failed to delete listing",
    });

    if (paginatedListings.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      return;
    }

    await refetchCurrentTab();
  };

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="px-2 md:px-0">
        <h1 className="text-2xl sm:text-3xl md:text-[38px] leading-none font-semibold text-[#111827]">
          Listing Management
        </h1>
        <p className="mt-2 text-sm md:text-base text-[#6b7280]">
          Review and moderate platform listings.
        </p>
        {listingsError && <p className="mt-2 text-sm text-red-600">{listingsError}</p>}
      </div>

      <div className="rounded-lg overflow-hidden">
        <div className="px-2 md:px-3 py-4 overflow-x-auto">
          <div className="flex items-center justify-between gap-4 min-w-max">
            <div className="flex justify-start gap-4 md:gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key);
                    setCurrentPage(1);
                  }}
                  className={`relative w-26 md:w-60 py-4 md:py-5 text-base md:text-lg font-semibold transition-colors text-center whitespace-nowrap cursor-pointer ${
                    activeTab === tab.key ? "text-[#004C48]" : "text-[#373737]"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 md:h-0.75 rounded-full transition-all duration-200 ${
                      activeTab === tab.key
                        ? "w-full bg-[#0f172a]"
                        : "w-0 bg-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>

            {isSubAdmin && (
              <button
                type="button"
                onClick={() => setIsAddListingOpen(true)}
                className="h-10 shrink-0 rounded-md bg-[#E97C35] px-4 text-sm font-medium text-white hover:bg-[#cf6d2e]"
              >
                Add listing
              </button>
            )}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto overscroll-x-contain border-x border-b border-[#ececec] bg-white">
          <table className="w-full min-w-225 text-left text-sm md:text-base">
            <thead>
              <tr className="border-b border-[#efefef] text-sm md:text-base text-[#111827] bg-[#F9FAFB]">
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">
                  Listing Name
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">
                  Listing Type
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">
                  Category
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">
                  User name
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">
                  Country
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">
                  Location
                </th>
                {showSpamReport && (
                  <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">
                    Spam Report
                  </th>
                )}
                <th className="px-2 md:px-4 py-2 md:py-3 font-medium whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {showLoader ? (
                <tr>
                  <td colSpan={showSpamReport ? 8 : 7} className="px-4 py-16">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E97C35]" />
                    </div>
                  </td>
                </tr>
              ) : (
                <>
              {paginatedListings.map((item) => (
                <tr
                  key={item.id}
                  className="border border-[#e4e4e4] text-sm md:text-base text-[#374151] bg-white"
                >
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">
                    {item.title}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">
                    {item.listingType}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4">
                    <span className="inline-flex rounded px-2 py-0.5 text-sm md:text-base bg-[#00534f] text-white whitespace-nowrap">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">
                    {item.userName}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">
                    {item.country}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">
                    {item.location}
                  </td>
                  {showSpamReport && (
                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">
                      {item.spamReport}
                    </td>
                  )}
                  <td className="px-2 md:px-4 py-3 md:py-4">
                    {renderListingActions(item)}
                  </td>
                </tr>
              ))}

              {!listingsLoading && paginatedListings.length === 0 && (
                <tr>
                  <td
                    colSpan={showSpamReport ? 8 : 7}
                    className="px-4 py-6 text-center text-sm text-[#6b7280]"
                  >
                    No listings found.
                  </td>
                </tr>
              )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden border-x border-b border-[#ececec] bg-white">
          {showLoader ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E97C35]" />
            </div>
          ) : (
          <div className="space-y-3 p-3">
            {paginatedListings.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-[#e9edf2] bg-[#fcfcfd] p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
              >
                <div className="flex min-h-64.5 flex-col gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#8b95a5]">Listing Name</p>
                    <p className="mt-1 text-base font-semibold leading-tight text-[#111827] wrap-break-word">
                      {item.title}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-[#eceff3] bg-white px-3 py-2.5 min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#8b95a5]">Category</p>
                      <span className="mt-1 inline-flex rounded px-2 py-0.5 text-xs bg-[#00534f] text-white whitespace-nowrap">
                        {item.category}
                      </span>
                    </div>
                    {showSpamReport && (
                      <MobileInfoField label="Spam Report" value={item.spamReport} strong />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <MobileInfoField label="User" value={item.userName} />
                    <MobileInfoField label="Country" value={item.country} />
                  </div>

                  <MobileInfoField label="Location" value={item.location} />

                  <div className="mt-auto border-t border-[#ececec] pt-3">
                    {renderListingActions(item, true)}
                  </div>

                </div>
              </article>
            ))}

            {!listingsLoading && paginatedListings.length === 0 && (
              <div className="rounded-xl border border-[#e9edf2] bg-[#fcfcfd] p-4 text-center text-sm text-[#6b7280]">
                No listings found.
              </div>
            )}
          </div>
          )}
        </div>

        <div className="mt-3 md:mt-4 px-2 sm:px-3 md:px-4 pb-2 md:pb-3 flex justify-center">
          <Pagination
            current={currentPage}
            total={totalPages}
            onPageChange={setCurrentPage}
            totalResults={Number(listingsPagination?.total || 0)}
            resultsPerPage={resultsPerPage}
          />
        </div>
      </div>

      <AddListingModal
        isOpen={isAddListingOpen}
        onClose={() => setIsAddListingOpen(false)}
        onSelectType={handleAddListingType}
      />

      <CreateServiceModal
        isOpen={isCreateServiceOpen}
        onClose={() => setIsCreateServiceOpen(false)}
        onSaved={handleListingCreated}
        complimentaryListing={isSubAdmin}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onSaved={handleListingCreated}
        complimentaryListing={isSubAdmin}
      />
    </div>
  );
};

export default AdminListings;
