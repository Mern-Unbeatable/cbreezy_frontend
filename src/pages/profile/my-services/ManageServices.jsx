import { useEffect, useState } from "react";
import { Search, Edit2, Trash2, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CreateServiceModal from "./CreateServiceModal";
import EditServiceModal from "./EditServiceModal";
import PricingModal from "./PricingModal";
import ExpiredServicesGrid from "./ExpiredServicesGrid";
import SuspendedServicesGrid from "./SuspendedServicesGrid";
import Pagination from "../../../components/Pagination";
import {
  deleteMyService,
  fetchMyServices,
  selectMyServices,
  selectMyServicesError,
  selectMyServicesLoading,
  selectMyServicesPagination,
  updateMyService,
} from "../../../features/services/servicesSlice";

const toApiStatus = (value) => {
  const status = String(value || "").trim().toUpperCase();
  if (status === "EXPIRED" || status === "SUSPENDED" || status === "ACTIVE") {
    return status;
  }
  return "ACTIVE";
};

function StatusBadge({ status }) {
  const colors = {
    Expired: "bg-[#ED965D]",
    Active: "bg-[#2c9b73]",
    Suspended: "bg-[#EF4444]",
  };

  return (
    <span
      className={`absolute bottom-0 left-1.5 sm:bottom-0 sm:left-2 rounded-bl-sm px-1 sm:px-1.5 py-0.5 text-[7px] sm:text-[9px] font-medium uppercase tracking-wide text-white ${
        colors[status] ?? "bg-[#6B7280]"
      }`}
    >
      {status}
    </span>
  );
}

function ServiceCard({ service, onEdit, onDelete, onRenew }) {
  return (
    <div className="flex h-full min-h-[330px] sm:min-h-[360px] md:min-h-[400px] flex-col overflow-hidden rounded-lg sm:rounded-[10px] border border-[#EAEAEA] bg-[#FDF2EB] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="relative px-1.5 sm:px-2 pt-1.5 sm:pt-2">
        <img
          src={service.image || "https://via.placeholder.com/400x176?text=Service"}
          alt={service.title}
          className="h-44 sm:h-40 md:h-48 w-full rounded-sm sm:rounded-md object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x176?text=Service";
          }}
        />
        <StatusBadge status={service.status} />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 sm:gap-2 px-2 sm:px-3 pb-2.5 sm:pb-3 pt-1.5 sm:pt-2">
        <h3
          className="text-sm sm:text-base md:text-lg font-semibold leading-tight text-[#0C0C0C] min-h-[2.6rem]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={service.title}
        >
          {service.title}
        </h3>
        <p
          className="flex-1 text-xs sm:text-sm md:text-base leading-[1.35] text-[#373737] min-h-[3.8rem]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={service.description}
        >
          {service.description}
        </p>

        <div className="pt-1">
          {service.showRenew ? (
            <button
              type="button"
              onClick={() => onRenew(service.id)}
              className="flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded-md border border-[#004C48] bg-[#E6EDED] py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-semibold text-[#004C48]"
            >
              <RefreshCw size={12} className="sm:w-4 sm:h-4" />
              Renew
            </button>
          ) : (
            <div className="flex gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => onEdit(service.id)}
                className="flex flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-md border border-[#004C48] bg-[#E6EDED] py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-semibold text-[#0f6e6a] "
              >
                <Edit2 size={11} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(service.id)}
                className="flex flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-md border border-[#CC1610] bg-[#FAE8E7] py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-semibold text-[#CC1610] "
              >
                <Trash2 size={11} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ManageServices() {
  const dispatch = useDispatch();
  const myServices = useSelector(selectMyServices);
  const myServicesLoading = useSelector(selectMyServicesLoading);
  const myServicesError = useSelector(selectMyServicesError);
  const myServicesPagination = useSelector(selectMyServicesPagination);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [pricingServiceId, setPricingServiceId] = useState("");
  const [pricingActionType, setPricingActionType] = useState("purchase");
  const [editingService, setEditingService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    if (isCreateModalOpen) return;

    const query = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (activeFilter !== "All") {
      query.status = activeFilter.toUpperCase();
    }

    const searchText = search.trim();
    if (searchText) {
      query.search = searchText;
    }

    dispatch(fetchMyServices(query));
  }, [dispatch, activeFilter, currentPage, search, isCreateModalOpen]);

  useEffect(() => {
    if (myServicesError) {
      toast.error(myServicesError);
    }
  }, [myServicesError]);

  const filters = ["All", "Expired", "Suspended"];
  const filtered = Array.isArray(myServices) ? myServices : [];
  const totalPages = Math.max(1, Number(myServicesPagination?.totalPages || 1));
  const totalResults = Number(myServicesPagination?.total || 0);

  // Reset to page 1 when filter or search changes
  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setCurrentPage(1);
  };

  const handleEditService = (serviceId) => {
    const targetService = filtered.find((item) => item.id === serviceId);
    if (!targetService) return;

    setEditingService(targetService);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedService = async (updatedService) => {
    try {
      await dispatch(
        updateMyService({
          serviceId: updatedService.id,
          payload: {
            title: updatedService.title?.trim() || undefined,
            description: updatedService.description?.trim() || undefined,
            contactEmail: updatedService.email?.trim() || undefined,
            contactPhone: updatedService.phone?.trim() || undefined,
            status: toApiStatus(updatedService.status),
          },
        })
      ).unwrap();

      setIsEditModalOpen(false);
      setEditingService(null);
      toast.success("Service updated successfully");
    } catch (error) {
      toast.error(error || "Failed to update service");
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = async (serviceId) => {
    const deletedService = filtered.find((item) => item.id === serviceId);

    try {
      await dispatch(deleteMyService(serviceId)).unwrap();

      if (filtered.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      toast.info(deletedService ? `Service deleted: ${deletedService.title}` : "Service deleted");
    } catch (error) {
      toast.error(error || "Failed to delete service");
    }
  };

  const handleOpenPricingModal = (serviceId, actionType = "purchase") => {
    setPricingServiceId(String(serviceId || ""));
    setPricingActionType(actionType);
    setIsPricingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6 py-6 sm:py-8 ">
        <div className="bg-[#004C48] rounded-lg sm:rounded-xl md:rounded-2xl px-4 sm:px-5 md:px-6 py-4  mb-6 sm:mb-8">
          <div className="flex flex-col xs:gap-3 sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
            <h1 className="text-white text-2xl xs:text-2.5xl sm:text-3xl  font-bold tracking-tight leading-tight">
              Manage your Services
            </h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex w-full sm:w-auto items-center justify-center sm:justify-start gap-2 bg-[#E97C35] text-white text-xs sm:text-base md:text-base font-semibold px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-sm hover:bg-[#d96b2a] transition-colors duration-200"
            >
              Create Service
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 md:items-center md:justify-between">
            <div className="inline-flex w-fit items-center gap-0.5 sm:gap-1 rounded-md bg-white p-1">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`rounded-md px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-semibold leading-none transition-colors ${
                    activeFilter === f
                      ? "bg-[#E97C35] text-white"
                      : "text-[#4a4a4a] hover:bg-[#f5f5f5]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-1/3 lg:w-1/4">
              <Search
                size={14}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search service listings........"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-9 sm:h-11 w-full rounded-md border border-transparent bg-[#FFFFFF] pl-8 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-base text-black placeholder:text-gray-500 placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-[#E97C35]"
              />
            </div>
          </div>
        </div>

        {myServicesLoading ? (
          <div className="text-center py-12 sm:py-16 md:py-20 text-gray-500 text-xs sm:text-sm md:text-base">
            Loading services...
          </div>
        ) : filtered.length > 0 ? (
          activeFilter === "Expired" ? (
            <ExpiredServicesGrid
              services={filtered}
              onRenewClick={(serviceId) => handleOpenPricingModal(serviceId, "renew")}
            />
          ) : activeFilter === "Suspended" ? (
            <SuspendedServicesGrid services={filtered} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {filtered.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={handleEditService}
                  onDelete={handleDeleteService}
                  onRenew={(serviceId) => handleOpenPricingModal(serviceId, "renew")}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 sm:py-16 md:py-20 text-gray-400 text-xs sm:text-sm md:text-base">
            No services found.
          </div>
        )}

        {filtered.length > 0 && (
          <Pagination
            current={currentPage}
            total={totalPages}
            onPageChange={setCurrentPage}
            totalResults={totalResults}
            resultsPerPage={itemsPerPage}
          />
        )}
      </div>

      <CreateServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditServiceModal
        isOpen={isEditModalOpen}
        service={editingService}
        onClose={handleCloseEditModal}
        onSave={handleSaveEditedService}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        serviceId={pricingServiceId}
        actionType={pricingActionType}
        onClose={() => {
          setIsPricingModalOpen(false);
          setPricingServiceId("");
          setPricingActionType("purchase");
        }}
      />
    </div>
  );
}
