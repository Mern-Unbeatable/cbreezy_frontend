import { useEffect, useState } from "react";
import {
  Search,
  Edit2,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CreateEventModal from "./CreateEventModal";
import PricingModal from "./PricingModal";
import ExpiredEventsGrid from "./ExpiredEventsGrid";
import SuspendedEventsGrid from "./SuspendedEventsGrid";
import Pagination from "../../../components/Pagination";
import {
  deleteMyEvent,
  fetchMyEvents,
  fetchMyEventForEdit,
  fetchEventPricingPlansEligibility,
  purchaseEvent,
  selectMyEvents,
  selectMyEventsError,
  selectMyEventsLoading,
  selectMyEventsPagination,
} from "../../../features/events/eventsSlice";

function StatusBadge({ status }) {
  const key = String(status || "").trim().toUpperCase();

  const styles = {
    PENDING: "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black font-bold",
    APPROVED: "bg-gradient-to-r from-emerald-400 to-green-600 text-white font-bold",
    SUSPENDED: "bg-gradient-to-r from-red-400 to-red-600 text-white font-bold",
    EXPIRED: "bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold",
    DEFAULT: "bg-gray-400 text-white font-bold",
  };

  const styleClass = styles[key] || styles.DEFAULT;

  return (
    <span
      className={`absolute bottom-1 left-3 rounded-md px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide ${styleClass} shadow-sm`}
    >
      {String(status || "").toUpperCase()}
    </span>
  );
}

function EventCard({ event, onEdit, onDelete, onRenew, onPay, editLoading = false }) {
  const [isActivating, setIsActivating] = useState(false);
  const isUnpaid =
    !Array.isArray(event?.payments) ||
    event.payments.length === 0 ||
    String(event.payments[0]?.status || "").toUpperCase() !== "SUCCESS";
  return (
    <div className="flex h-full min-h-[330px] sm:min-h-[360px] md:min-h-[400px] flex-col overflow-hidden rounded-lg sm:rounded-[10px] border border-[#EAEAEA] bg-[#FDF2EB] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="relative px-1.5 sm:px-2 pt-1.5 sm:pt-2">
        <img
          src={event.image || "/logo.png"}
          alt={event.title}
          className="h-44 sm:h-40 md:h-48 w-full rounded-sm sm:rounded-md object-cover"
          onError={(e) => {
            e.target.src = "/logo.png";
          }}
        />
        <StatusBadge status={event.status} />
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
          title={event.title}
        >
          {event.title}
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
          title={event.description}
        >
          {event.description}
        </p>

        <div className="pt-1">
          {event.showRenew ? (
            <button
              type="button"
              onClick={() => onRenew(event.id)}
              className="flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded-md border border-[#004C48] bg-[#E6EDED] py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-semibold text-[#004C48] hover:bg-[#dce4e4] transition-colors"
            >
              <RefreshCw size={12} className="sm:w-4 sm:h-4" />
              Renew
            </button>
          ) : (
            <div className="flex gap-1.5 sm:gap-2">
              {isUnpaid && (
                <button
                  type="button"
                  disabled={isActivating}
                  onClick={async () => {
                    setIsActivating(true);
                    try {
                      await onPay(event.id);
                    } finally {
                      setIsActivating(false);
                    }
                  }}
                  className="flex flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-md border border-[#0f6e6a] bg-[#FFEFD6] py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-semibold text-[#0f6e6a] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isActivating ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#0f6e6a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Activate"
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => onEdit(event.id)}
                disabled={editLoading}
                className="flex flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-md border border-[#004C48] bg-[#E6EDED] py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-semibold text-[#0f6e6a] hover:bg-[#dce4e4] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Edit2 size={11} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                className="flex flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-md border border-[#CC1610] bg-[#FAE8E7] py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-semibold text-[#CC1610] hover:bg-[#f4ddd7] transition-colors"
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

export default function ManageEvents() {
  const dispatch = useDispatch();
  const myEvents = useSelector(selectMyEvents);
  const myEventsLoading = useSelector(selectMyEventsLoading);
  const myEventsError = useSelector(selectMyEventsError);
  const myEventsPagination = useSelector(selectMyEventsPagination);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [pricingEventId, setPricingEventId] = useState("");
  const [pricingActionType, setPricingActionType] = useState("purchase");
  const [editingEvent, setEditingEvent] = useState(null);
  const [editEventLoading, setEditEventLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

    dispatch(fetchMyEvents(query));
  }, [dispatch, activeFilter, currentPage, search, isCreateModalOpen]);

  useEffect(() => {
    if (myEventsError) {
      toast.error(myEventsError);
    }
  }, [myEventsError]);

  const filters = ["All", "Expired", "Suspended"];
  const filtered = Array.isArray(myEvents) ? myEvents : [];
  const totalPages = Math.max(1, Number(myEventsPagination?.totalPages || 1));
  const totalResults = Number(myEventsPagination?.total || 0);

  // Reset to page 1 when filter or search changes
  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setCurrentPage(1);
  };

  const handleEditEvent = async (eventId) => {
    const targetEvent = filtered.find((item) => item.id === eventId);
    if (!targetEvent) return;

    if (!targetEvent.categoryId) {
      toast.error("Category not found for this event");
      return;
    }

    setEditEventLoading(true);
    try {
      const fullEvent = await dispatch(
        fetchMyEventForEdit({ categoryId: targetEvent.categoryId, eventId })
      ).unwrap();
      setEditingEvent(fullEvent);
      setIsEditModalOpen(true);
    } catch (error) {
      toast.error(error || "Failed to load event details for edit");
    } finally {
      setEditEventLoading(false);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (eventId) => {
    const deletedEvent = filtered.find((item) => item.id === eventId);

    try {
      await dispatch(deleteMyEvent(eventId)).unwrap();

      if (filtered.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      toast.info(deletedEvent ? `Event deleted: ${deletedEvent.title}` : "Event deleted");
    } catch (error) {
      toast.error(error || "Failed to delete event");
    }
  };

  const handleOpenPricingModal = (eventId) => {
    setPricingEventId(String(eventId || ""));
    setPricingActionType("renew");
    setIsPricingModalOpen(true);
  };

  const handlePayActivate = async (eventId) => {
    try {
      const cancelUrl = `${window.location.origin}/profile/my-events?purchase=cancelled`;

      const elig = await dispatch(fetchEventPricingPlansEligibility()).unwrap();
      const plans = elig?.plans || [];
      const userLifecycle = elig?.userLifecycle || {};
      const freePlan = plans.find((p) => String(p.title || "").toLowerCase() === "free activation");
      const promoPlan = plans.find((p) => String(p.title || "").toLowerCase() === "intro pricing");
      const standardPlan = plans.find((p) => String(p.title || "").toLowerCase() === "standard pricing");

      let planId = "";
      if (userLifecycle?.isEligibleForFree) {
        planId = freePlan?.id || promoPlan?.id || standardPlan?.id || (plans[0] && plans[0].id);
      } else if (userLifecycle?.isEligibleForDiscount) {
        planId = promoPlan?.id || standardPlan?.id || (plans[0] && plans[0].id);
      } else {
        planId = standardPlan?.id || promoPlan?.id || (plans[0] && plans[0].id);
      }

      if (!planId) {
        toast.error("No pricing plan available for purchase");
        return;
      }

      const successUrl = `${window.location.origin}/profile/my-events/purchase-success?eventId=${encodeURIComponent(
        eventId
      )}&planId=${encodeURIComponent(planId)}&flow=purchase&session_id={CHECKOUT_SESSION_ID}`;

      const result = await dispatch(purchaseEvent({ eventId, payload: { planId, successUrl, cancelUrl } })).unwrap();

      const checkoutUrl = result?.checkoutUrl || result?.raw?.data?.checkoutUrl;
      const noPaymentRequired = result?.raw?.data?.noPaymentRequired || result?.noPaymentRequired || false;
      const checkoutSessionId =
        result?.checkoutSessionId ||
        result?.raw?.data?.checkoutSessionId ||
        result?.raw?.data?.sessionId ||
        "";

      if (noPaymentRequired) {
        toast.success("Activated for free");
        dispatch(fetchMyEvents({ page: currentPage, limit: itemsPerPage }));
        return;
      }

      if (checkoutUrl) {
        sessionStorage.setItem(
          "eventPaymentConfirmContext",
          JSON.stringify({
            eventId: String(eventId),
            planId,
            checkoutSessionId,
            flow: "purchase",
            createdAt: Date.now(),
          })
        );
        window.location.assign(checkoutUrl);
        return;
      }

      toast.error("Unexpected purchase response");
    } catch (err) {
      toast.error(err || "Failed to start payment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6 py-6 sm:py-8 ">

        <div className="bg-[#004C48] rounded-lg sm:rounded-xl md:rounded-2xl px-4 sm:px-5 md:px-6 py-4  mb-6 sm:mb-8">

          <div className="flex flex-col xs:gap-3 sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
            <h1 className="text-white text-2xl xs:text-2.5xl sm:text-3xl  font-bold tracking-tight leading-tight">
              Manage your Events
            </h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex w-full sm:w-auto items-center justify-center sm:justify-start gap-2 bg-[#E97C35] text-white text-xs sm:text-base md:text-base font-semibold px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-sm hover:bg-[#d96b2a] transition-colors duration-200"
            >
              Create Event
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
                placeholder="Search event listings........"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-9 sm:h-11 w-full rounded-md border border-transparent bg-[#FFFFFF] pl-8 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-base text-black placeholder:text-gray-500 placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-[#E97C35]"
              />
            </div>
          </div>
        </div>

        {myEventsLoading ? (
          <div className="text-center py-12 sm:py-16 md:py-20 text-gray-500 text-xs sm:text-sm md:text-base">
            Loading events...
          </div>
        ) : filtered.length > 0 ? (
          activeFilter === "Expired" ? (
            <ExpiredEventsGrid
              events={filtered}
              onRenewClick={handleOpenPricingModal}
            />
          ) : activeFilter === "Suspended" ? (
            <SuspendedEventsGrid events={filtered} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {filtered.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  onRenew={handleOpenPricingModal}
                  onPay={handlePayActivate}
                  editLoading={editEventLoading}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 sm:py-16 md:py-20 text-gray-400 text-xs sm:text-sm md:text-base">
            No events found.
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

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSaved={() => dispatch(fetchMyEvents({ page: currentPage, limit: itemsPerPage }))}
      />

      <CreateEventModal
        isOpen={isEditModalOpen}
        editEvent={editingEvent}
        onClose={handleCloseEditModal}
        onSaved={() => dispatch(fetchMyEvents({ page: currentPage, limit: itemsPerPage }))}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        eventId={pricingEventId}
        actionType={pricingActionType}
        onClose={() => {
          setIsPricingModalOpen(false);
          setPricingEventId("");
          setPricingActionType("purchase");
        }}
      />
    </div>
  );
}
