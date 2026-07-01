import { useContext, useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AuthContext, ROLES } from "../../../context/AuthContext";
import PricingModal from "./PricingModal";
import {
  createEvent,
  updateMyEvent,
  removeMyEventImage,
  fetchEventCategories,
  fetchEventPricingPlansEligibility,
  purchaseEvent,
  selectCreateEventLoading,
  selectEventCategories,
  selectEventCategoriesLoading,
} from "../../../features/events/eventsSlice";
import {
  fetchCountries,
  fetchRegionsByCountry,
  fetchCitiesByRegion,
  clearCities,
  selectCountries,
  selectCountriesLoading,
  selectRegions,
  selectRegionsLoading,
  selectCities,
  selectCitiesLoading,
} from "../../../features/auth/authSlice";

export default function CreateEventModal({ isOpen, onClose, editEvent = null, onSaved, complimentaryListing = false }) {
  const dispatch = useDispatch();
  const { role } = useContext(AuthContext);
  const isComplimentaryFlow = complimentaryListing || role === ROLES.SUB_ADMIN;
  const isEditMode = Boolean(editEvent?.id);
  const [updateLoading, setUpdateLoading] = useState(false);
  const createLoading = useSelector(selectCreateEventLoading);
  const categories = useSelector(selectEventCategories);
  const categoriesLoading = useSelector(selectEventCategoriesLoading);
  const countries = useSelector(selectCountries);
  const countriesLoading = useSelector(selectCountriesLoading);
  const regions = useSelector(selectRegions);
  const regionsLoading = useSelector(selectRegionsLoading);
  const cities = useSelector(selectCities);
  const citiesLoading = useSelector(selectCitiesLoading);

  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [createdEventId, setCreatedEventId] = useState("");
  const [pricingForcePlanId, setPricingForcePlanId] = useState("");
  const [pricingLockSelection, setPricingLockSelection] = useState(false);
  const [pricingHideFree, setPricingHideFree] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    countryId: "",
    regionId: "",
    cityId: "",
    location: "",
    eventStart: "",
    eventEnd: "",
    email: "",
    phone: "",
    facebook: "",
    instagram: "",
  });

  const [eventImageFiles, setEventImageFiles] = useState([]);
  const [eventImagePreviews, setEventImagePreviews] = useState([]);
  const [existingEventImages, setExistingEventImages] = useState([]);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);
  const [removingImageUrl, setRemovingImageUrl] = useState("");

  const syncImagesFromEvent = (event) => {
    setExistingEventImages(resolveEditEventImages(event));
    setExistingGalleryImages(resolveEditGalleryImages(event));
  };

  const resolveEditEventImages = (event) => {
    if (Array.isArray(event?.eventImages) && event.eventImages.length > 0) {
      return event.eventImages;
    }
    if (Array.isArray(event?.serviceImages) && event.serviceImages.length > 0) {
      return event.serviceImages;
    }
    if (event?.mainImage) return [event.mainImage];
    if (event?.eventImage) return [event.eventImage];
    if (event?.image) return [event.image];
    return [];
  };

  const resolveEditGalleryImages = (event) => {
    if (Array.isArray(event?.galleryImages) && event.galleryImages.length > 0) {
      return event.galleryImages;
    }
    if (Array.isArray(event?.eventGallery) && event.eventGallery.length > 0) {
      return event.eventGallery;
    }
    if (Array.isArray(event?.gallery) && event.gallery.length > 0) {
      return event.gallery;
    }
    return [];
  };

  useEffect(() => {
    if (!isOpen) return;
    dispatch(fetchEventCategories());
    dispatch(fetchCountries());
  }, [dispatch, isOpen]);

  // Pre-fill form in edit mode
  useEffect(() => {
    if (!isEditMode || !editEvent) return;
    const parsePrice = (v) => String(v || "").replace(/[^0-9.]/g, "");
    setForm({
      title: editEvent.title || "",
      description: editEvent.description || "",
      price: parsePrice(editEvent.price),
      categoryId: editEvent.categoryId || "",
      countryId: editEvent.countryId || "",
      regionId: editEvent.regionId || "",
      cityId: editEvent.cityId || "",
      location: editEvent.location || editEvent.address || "",
      eventStart: editEvent.eventStart || editEvent.startDate || "",
      eventEnd: editEvent.eventEnd || editEvent.endDate || "",
      email: editEvent.contactEmail || editEvent.email || "",
      phone: editEvent.contactPhone || editEvent.phone || "",
      facebook: editEvent.facebookUrl || editEvent.facebook || "",
      instagram: editEvent.instagramUrl || editEvent.instagram || "",
    });
    syncImagesFromEvent(editEvent);
    setEventImageFiles([]);
    setEventImagePreviews([]);
    setGalleryImageFiles([]);
    setGalleryImagePreviews([]);
  }, [editEvent, isEditMode]);

  useEffect(() => {
    if (form.countryId) {
      dispatch(fetchRegionsByCountry(form.countryId));
    }
  }, [dispatch, form.countryId]);

  useEffect(() => {
    if (!form.regionId) {
      dispatch(clearCities());
      return;
    }

    dispatch(fetchCitiesByRegion(form.regionId));
  }, [dispatch, form.regionId]);

  useEffect(() => {
    if (!isEditMode || !editEvent?.cityId || cities.length === 0) return;

    const matchedCity = cities.some((item) => String(item.id) === String(editEvent.cityId));
    if (matchedCity) {
      setForm((prev) =>
        prev.cityId === String(editEvent.cityId) ? prev : { ...prev, cityId: String(editEvent.cityId) }
      );
    }
  }, [isEditMode, editEvent?.cityId, cities]);

  const resetModalState = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      categoryId: "",
      countryId: "",
      regionId: "",
      cityId: "",
      location: "",
      eventStart: "",
      eventEnd: "",
      email: "",
      phone: "",
      facebook: "",
      instagram: "",
    });
    setEventImageFiles([]);
    setEventImagePreviews([]);
    setExistingEventImages([]);
    setGalleryImageFiles([]);
    setGalleryImagePreviews([]);
    setExistingGalleryImages([]);
    setRemovingImageUrl("");
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => {
      if (field === "countryId") {
        return { ...prev, countryId: value, regionId: "", cityId: "" };
      }

      if (field === "regionId") {
        return { ...prev, regionId: value, cityId: "" };
      }

      return { ...prev, [field]: value };
    });
  };

  const toLocalDateTimeValue = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "";

    const pad = (n) => String(n).padStart(2, "0");
    return `${parsedDate.getFullYear()}-${pad(parsedDate.getMonth() + 1)}-${pad(parsedDate.getDate())}T${pad(parsedDate.getHours())}:${pad(parsedDate.getMinutes())}`;
  };

  const handleEventImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 4 - existingEventImages.length - eventImageFiles.length;

    if (remainingSlots <= 0) {
      toast.error("Remove an existing event image first to upload a new one");
      e.target.value = "";
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);

    setEventImageFiles((prev) => [...prev, ...filesToAdd]);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleGalleryImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 8 - existingGalleryImages.length - galleryImageFiles.length;

    if (remainingSlots <= 0) {
      toast.error("Remove an existing gallery image first to upload a new one");
      e.target.value = "";
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);

    setGalleryImageFiles((prev) => [...prev, ...filesToAdd]);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeEventImage = (index) => {
    setEventImageFiles((prev) => prev.filter((_, i) => i !== index));
    setEventImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeGalleryImage = (index) => {
    setGalleryImageFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingEventImage = async (index) => {
    const imageUrl = existingEventImages[index];
    if (!imageUrl || !editEvent?.id) return;

    setRemovingImageUrl(imageUrl);
    try {
      const result = await dispatch(
        removeMyEventImage({
          eventId: editEvent.id,
          imageUrl,
          imageType: "eventImages",
        })
      ).unwrap();

      syncImagesFromEvent(result?.item || {});
      toast.success("Event image removed");
    } catch (error) {
      toast.error(error || "Failed to remove event image");
    } finally {
      setRemovingImageUrl("");
    }
  };

  const removeExistingGalleryImage = async (index) => {
    const imageUrl = existingGalleryImages[index];
    if (!imageUrl || !editEvent?.id) return;

    setRemovingImageUrl(imageUrl);
    try {
      const result = await dispatch(
        removeMyEventImage({
          eventId: editEvent.id,
          imageUrl,
          imageType: "gallery",
        })
      ).unwrap();

      syncImagesFromEvent(result?.item || {});
      toast.success("Gallery image removed");
    } catch (error) {
      toast.error(error || "Failed to remove gallery image");
    } finally {
      setRemovingImageUrl("");
    }
  };

  const handleCloseCreateModal = () => {
    setIsPricingOpen(false);
    setCreatedEventId("");
    setPricingForcePlanId("");
    setPricingLockSelection(false);
    setPricingHideFree(false);
    resetModalState();
    onClose();
  };

  const handleOpenPricingModal = (eventId) => {
    setCreatedEventId(String(eventId || ""));
    setIsPricingOpen(true);
  };

  const handleClosePricingModal = () => {
    setIsPricingOpen(false);
    setCreatedEventId("");
    setPricingForcePlanId("");
    setPricingLockSelection(false);
    setPricingHideFree(false);
    resetModalState();
    onClose();
  };

  const handleSubmitAndContinue = async () => {
    if (!String(form.title || "").trim()) {
      toast.error("Event title is required");
      return;
    }

    // ── EDIT MODE ──
    if (isEditMode) {
      const payload = new FormData();
      payload.append("title", form.title.trim());
      payload.append("description", form.description.trim());
      if (form.price) payload.append("price", String(form.price).trim());
      if (form.categoryId) payload.append("categoryId", form.categoryId);
      if (form.countryId) payload.append("countryId", form.countryId);
      if (form.regionId) payload.append("regionId", form.regionId);
      if (form.cityId) payload.append("cityId", form.cityId);
      if (form.location.trim()) { payload.append("location", form.location.trim()); payload.append("address", form.location.trim()); }
      if (form.eventStart) payload.append("eventStart", new Date(form.eventStart).toISOString());
      if (form.eventEnd) payload.append("eventEnd", new Date(form.eventEnd).toISOString());
      if (form.email.trim()) { payload.append("email", form.email.trim()); payload.append("contactEmail", form.email.trim()); }
      if (form.phone.trim()) { payload.append("phone", form.phone.trim()); payload.append("contactPhone", form.phone.trim()); }
      if (form.facebook.trim()) { payload.append("facebook", form.facebook.trim()); payload.append("facebookUrl", form.facebook.trim()); }
      if (form.instagram.trim()) { payload.append("instagram", form.instagram.trim()); payload.append("instagramUrl", form.instagram.trim()); }
      eventImageFiles.forEach((file) => payload.append("eventImages", file));
      galleryImageFiles.forEach((file) => payload.append("eventGallery", file));

      setUpdateLoading(true);
      try {
        const result = await dispatch(updateMyEvent({ eventId: editEvent.id, payload })).unwrap();
        if (result?.item) {
          syncImagesFromEvent(result.item);
        }
        toast.success("Event updated successfully");
        if (onSaved) onSaved();
        onClose();
      } catch (error) {
        toast.error(error || "Failed to update event");
      } finally {
        setUpdateLoading(false);
      }
      return;
    }

    // ── CREATE MODE ──
    const required = [
      "title",
      "description",
      "price",
      "categoryId",
      "countryId",
      "regionId",
      "cityId",
      "location",
      "eventStart",
      "eventEnd",
      "email",
      "phone",
    ];

    const missingRequired = required.some((field) => !String(form[field] || "").trim());
    if (missingRequired) {
      toast.error("Please fill all required fields");
      return;
    }

    if (eventImageFiles.length === 0) {
      toast.error("Please upload at least one event image");
      return;
    }

    if (new Date(form.eventStart).getTime() >= new Date(form.eventEnd).getTime()) {
      toast.error("Event end time must be after start time");
      return;
    }

    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    payload.append("price", String(form.price).trim());
    payload.append("categoryId", form.categoryId);
    payload.append("countryId", form.countryId);
    payload.append("regionId", form.regionId);
    payload.append("cityId", form.cityId);
    payload.append("location", form.location.trim());
    payload.append("address", form.location.trim());
    payload.append("eventStart", new Date(form.eventStart).toISOString());
    payload.append("eventEnd", new Date(form.eventEnd).toISOString());
    payload.append("email", form.email.trim());
    payload.append("contactEmail", form.email.trim());
    payload.append("phone", form.phone.trim());
    payload.append("contactPhone", form.phone.trim());
    payload.append("facebook", form.facebook.trim());
    payload.append("facebookUrl", form.facebook.trim());
    payload.append("instagram", form.instagram.trim());
    payload.append("instagramUrl", form.instagram.trim());

    eventImageFiles.forEach((file) => {
      payload.append("eventImages", file);
    });

    galleryImageFiles.forEach((file) => {
      payload.append("eventGallery", file);
    });

    try {
      const result = await dispatch(createEvent(payload)).unwrap();
      if (!result?.eventId) {
        toast.error("Event created but ID not found for purchase");
        return;
      }

      toast.info(isComplimentaryFlow ? "Event created — activating listing..." : "Event created — please complete payment to activate.");
      const eventId = String(result.eventId);

      if (isComplimentaryFlow) {
        try {
          const eligibility = await dispatch(fetchEventPricingPlansEligibility()).unwrap();
          const plan =
            eligibility?.plans?.find((item) => item?.id) ||
            eligibility?.plans?.[0];
          if (!plan?.id) {
            toast.error("No pricing plan available to activate listing");
            return;
          }

          const successUrl = `${window.location.origin}/admin/listings`;
          const cancelUrl = `${window.location.origin}/admin/listings`;
          await dispatch(
            purchaseEvent({
              eventId,
              payload: { planId: plan.id, successUrl, cancelUrl },
            }),
          ).unwrap();

          toast.success("Event published successfully");
          handleCloseCreateModal();
          if (onSaved) await onSaved();
          return;
        } catch (error) {
          toast.error(error || "Failed to activate listing");
          return;
        }
      }

      try {
        const eligibility = await dispatch(fetchEventPricingPlansEligibility()).unwrap();
        const plans = eligibility?.plans || [];
        const userLifecycle = eligibility?.userLifecycle || {};
        const isEligibleForFree = Boolean(eligibility?.isEligibleForFree || userLifecycle?.isEligibleForFree);
        const isEligibleForDiscount = Boolean(eligibility?.isEligibleForDiscount || userLifecycle?.isEligibleForDiscount);

        if (isEligibleForFree) {
          // auto purchase free plan
          const freePlan = plans.find((p) => String(p?.tier || "").toLowerCase() === "free" || Number(p?.price || 0) === 0) || plans[0];
          if (freePlan?.id) {
            const successUrl = `${window.location.origin}/profile/my-events/purchase-success?eventId=${encodeURIComponent(
              eventId
            )}&planId=${encodeURIComponent(freePlan.id)}&flow=purchase&session_id={CHECKOUT_SESSION_ID}`;
            const cancelUrl = `${window.location.origin}/profile/my-events?purchase=cancelled`;
            const purchaseResult = await dispatch(
              purchaseEvent({ eventId, payload: { planId: freePlan.id, successUrl, cancelUrl } })
            ).unwrap();
            if (purchaseResult?.checkoutUrl) {
              window.location.assign(purchaseResult.checkoutUrl);
              return;
            }

            toast.success("Activated for free");
            if (onSaved) onSaved();
            handleCloseCreateModal();
            return;
          }
        }

        // If discount eligibility -> show modal with Intro selected and locked, hide free
        if (!isEligibleForFree && isEligibleForDiscount) {
          const introId = String(eligibility?.introductoryPlanId || "") || String((plans.find((p) => p.isIntroductory) || {}).id || "");
          handleOpenPricingModal(eventId);
          setPricingForcePlanId(introId || "");
          setPricingLockSelection(true);
          setPricingHideFree(true);
          return;
        }

        const standardPlan = plans.find((p) => String(p?.title || "").toLowerCase().includes("standard")) || plans.find((p) => Number(p.price || 0) > 0) || plans[0];
        const standardId = String(standardPlan?.id || "");
        handleOpenPricingModal(eventId);
        setPricingForcePlanId(standardId);
        setPricingLockSelection(true);
        setPricingHideFree(true);
      } catch (err) {
        handleOpenPricingModal(result.eventId);
      }
    } catch (error) {
      toast.error(error || "Failed to create event");
    }
  };

  const totalEventImages = existingEventImages.length + eventImageFiles.length;
  const totalGalleryImages = existingGalleryImages.length + galleryImageFiles.length;

  if (!isOpen && !isPricingOpen && !isEditMode) return null;
  if (!isOpen && !isPricingOpen) return null;

  return (
    <>
      {!isPricingOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4 overflow-hidden"
          onClick={handleCloseCreateModal}
        >
          <div
            className="bg-[#FDF2EB] rounded-lg w-full max-w-2xl max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between px-4 sm:px-6 py-4 bg-[#F5C3A2] border-b rounded-t-lg border-gray-100">
              <h2 className="text-lg font-semibold text-[#0C0C0C]">{isEditMode ? "Edit Event" : "Create Event"}</h2>
              <button
                onClick={handleCloseCreateModal}
                className="text-[#000000]"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 space-y-5">
              <div>
                <h3 className="text-base text-[#0C0C0C] font-semibold mb-3">Event Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Event Title</label>
                    <input
                      type="text"
                      placeholder="Write event title"
                      value={form.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-orange-300 bg-[#F8D6C0]"
                    />
                  </div>
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Category</label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => handleInputChange("categoryId", e.target.value)}
                      disabled={categoriesLoading}
                      className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-orange-300 bg-[#F8D6C0] text-base text-[#0C0C0C] disabled:opacity-70"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-base text-[#0C0C0C] mb-1">Description</label>
                  <textarea
                    placeholder="Describe your event..."
                    rows={4}
                    value={form.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-base focus:outline-none focus:border-orange-300 bg-[#F8D6C0] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Price</label>
                    <input
                      type="number"
                      placeholder="Enter price"
                      value={form.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-orange-300 bg-[#F8D6C0]"
                    />
                  </div>
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Country</label>
                    <select
                      value={form.countryId}
                      onChange={(e) => handleInputChange("countryId", e.target.value)}
                      disabled={countriesLoading}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-base focus:outline-none focus:border-orange-300 bg-[#F8D6C0] text-[#373737] disabled:opacity-70"
                    >
                      <option value="">Select country</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Region</label>
                    <select
                      value={form.regionId}
                      onChange={(e) => handleInputChange("regionId", e.target.value)}
                      disabled={!form.countryId || regionsLoading}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-base focus:outline-none focus:border-orange-300 bg-[#F8D6C0] text-[#373737] disabled:opacity-70"
                    >
                      <option value="">Select region</option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">City</label>
                    <select
                      value={form.cityId}
                      onChange={(e) => handleInputChange("cityId", e.target.value)}
                      disabled={!form.regionId || citiesLoading}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-base focus:outline-none focus:border-orange-300 bg-[#F8D6C0] text-[#373737] disabled:opacity-70"
                    >
                      <option value="">Select city</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-base text-[#0C0C0C] mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Event location"
                    value={form.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-orange-300 bg-[#F8D6C0]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Event Start</label>
                    <input
                      type="datetime-local"
                      value={toLocalDateTimeValue(form.eventStart)}
                      min={toLocalDateTimeValue(new Date())}
                      onChange={(e) => handleInputChange("eventStart", e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-base focus:outline-none focus:border-orange-300 bg-[#F8D6C0] text-[#373737]"
                    />
                  </div>
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Event End</label>
                    <input
                      type="datetime-local"
                      value={toLocalDateTimeValue(form.eventEnd)}
                      min={toLocalDateTimeValue(form.eventStart) || toLocalDateTimeValue(new Date())}
                      onChange={(e) => handleInputChange("eventEnd", e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-base focus:outline-none focus:border-orange-300 bg-[#F8D6C0] text-[#373737]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base text-[#0C0C0C] font-semibold mb-1">
                  Event Image ({totalEventImages}/4)
                </h3>
                {isEditMode && (
                  <p className="text-xs text-gray-500 mb-3">
                    Tap the X on an image to remove it, then use Upload to add a replacement.
                  </p>
                )}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                  {existingEventImages.map((src, i) => (
                    <div key={`existing-event-${src}`} className="relative aspect-square rounded overflow-hidden bg-gray-100">
                      <img src={src} alt={`event-existing-${i}`} className="w-full h-full object-cover" />
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => removeExistingEventImage(i)}
                          disabled={Boolean(removingImageUrl)}
                          className="absolute top-1.5 right-1.5 rounded-full bg-black/70 p-1 text-white hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Remove event image"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}

                  {eventImagePreviews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded overflow-hidden bg-gray-100">
                      <img src={src} alt={`event-${i}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeEventImage(i)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition"
                      >
                        <X size={20} className="text-white" />
                      </button>
                    </div>
                  ))}

                  {totalEventImages < 4 && (
                    <label className="aspect-square rounded border-2 border-dashed border-orange-300 flex items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition">
                      <div className="text-center">
                        <Upload size={20} className="text-orange-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">Upload</span>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleEventImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base text-[#0C0C0C] font-semibold mb-3">Host Contact Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="write your email"
                      value={form.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-300 bg-[#F8D6C0]"
                    />
                  </div>
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="enter phone number"
                      value={form.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-300 bg-[#F8D6C0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Facebook</label>
                    <input
                      type="url"
                      placeholder="facebook URL"
                      value={form.facebook}
                      onChange={(e) => handleInputChange("facebook", e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-300 bg-[#F8D6C0]"
                    />
                  </div>
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Instagram</label>
                    <input
                      type="url"
                      placeholder="Instagram URL"
                      value={form.instagram}
                      onChange={(e) => handleInputChange("instagram", e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-300 bg-[#F8D6C0]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Event Gallery ({totalGalleryImages}/8)
                </h3>
                {isEditMode && (
                  <p className="text-xs text-gray-500 mb-3">
                    Tap the X on an image to remove it, then use Upload to add a replacement.
                  </p>
                )}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                  {existingGalleryImages.map((src, i) => (
                    <div key={`existing-gallery-${src}`} className="relative aspect-square rounded overflow-hidden bg-gray-100">
                      <img src={src} alt={`gallery-existing-${i}`} className="w-full h-full object-cover" />
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => removeExistingGalleryImage(i)}
                          disabled={Boolean(removingImageUrl)}
                          className="absolute top-1.5 right-1.5 rounded-full bg-black/70 p-1 text-white hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Remove gallery image"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}

                  {galleryImagePreviews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded overflow-hidden bg-gray-100">
                      <img src={src} alt={`gallery-${i}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeGalleryImage(i)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition"
                      >
                        <X size={20} className="text-white" />
                      </button>
                    </div>
                  ))}

                  {totalGalleryImages < 8 && (
                    <label className="aspect-square rounded border-2 border-dashed border-orange-300 flex items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition">
                      <div className="text-center">
                        <Upload size={20} className="text-orange-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">Upload</span>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-[#EAEAEA] bg-[#FDF2EB] px-4 sm:px-6 py-4 rounded-b-lg">
              <button
                onClick={handleSubmitAndContinue}
                disabled={createLoading || updateLoading}
                className={`w-full font-semibold px-6 py-2.5 rounded transition text-sm ${
                  createLoading || updateLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-orange-400 text-white"
                }`}
              >
                {isEditMode
                  ? updateLoading ? "Saving..." : "Save Changes"
                  : createLoading ? "Creating Event..." : "Submit & Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      <PricingModal
        isOpen={isPricingOpen}
        eventId={createdEventId}
        actionType="purchase"
        onClose={handleClosePricingModal}
        forcePlanId={pricingForcePlanId}
        lockSelection={pricingLockSelection}
        hideFreePlans={pricingHideFree}
      />
    </>
  );
}
