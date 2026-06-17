import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PricingModal from "./PricingModal";
import {
  createEvent,
  fetchEventCategories,
  selectCreateEventLoading,
  selectEventCategories,
  selectEventCategoriesLoading,
} from "../../../features/events/eventsSlice";
import {
  fetchCountries,
  fetchRegionsByCountry,
  selectCountries,
  selectCountriesLoading,
  selectRegions,
  selectRegionsLoading,
} from "../../../features/auth/authSlice";

export default function CreateEventModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const createLoading = useSelector(selectCreateEventLoading);
  const categories = useSelector(selectEventCategories);
  const categoriesLoading = useSelector(selectEventCategoriesLoading);
  const countries = useSelector(selectCountries);
  const countriesLoading = useSelector(selectCountriesLoading);
  const regions = useSelector(selectRegions);
  const regionsLoading = useSelector(selectRegionsLoading);

  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [createdEventId, setCreatedEventId] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    countryId: "",
    regionId: "",
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
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    dispatch(fetchEventCategories());
    dispatch(fetchCountries());
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (form.countryId) {
      dispatch(fetchRegionsByCountry(form.countryId));
    }
  }, [dispatch, form.countryId]);

  const resetModalState = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      categoryId: "",
      countryId: "",
      regionId: "",
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
    setGalleryImageFiles([]);
    setGalleryImagePreviews([]);
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => {
      if (field === "countryId") {
        return { ...prev, countryId: value, regionId: "" };
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
    const remainingSlots = 4 - eventImageFiles.length;
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
    const remainingSlots = 8 - galleryImageFiles.length;
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

  const handleCloseCreateModal = () => {
    setIsPricingOpen(false);
    setCreatedEventId("");
    resetModalState();
    onClose();
  };

  const handleClosePricingModal = () => {
    setIsPricingOpen(false);
    setCreatedEventId("");
    resetModalState();
    onClose();
  };

  const handleSubmitAndContinue = async () => {
    const required = [
      "title",
      "description",
      "price",
      "categoryId",
      "countryId",
      "regionId",
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

      toast.success("Event created successfully");
      setCreatedEventId(String(result.eventId));
      setIsPricingOpen(true);
    } catch (error) {
      toast.error(error || "Failed to create event");
    }
  };

  if (!isOpen && !isPricingOpen) return null;

  return (
    <>
      {!isPricingOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto"
          onClick={handleCloseCreateModal}
        >
          <div
            className="bg-[#FDF2EB] rounded-lg w-full max-w-2xl max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh] shadow-2xl flex flex-col overflow-visible my-3 sm:my-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-[#F5C3A2] border-b rounded-t-lg border-gray-100">
              <h2 className="text-lg font-semibold text-[#0C0C0C]">Create Event</h2>
              <button
                onClick={handleCloseCreateModal}
                className="text-[#000000]"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4 space-y-5 overflow-y-auto min-h-0">
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
                    <label className="block text-base text-[#0C0C0C] mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="Event location"
                      value={form.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-orange-300 bg-[#F8D6C0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Event Start</label>
                    <input
                      type="datetime-local"
                      value={toLocalDateTimeValue(form.eventStart)}
                      onChange={(e) => handleInputChange("eventStart", e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-base focus:outline-none focus:border-orange-300 bg-[#F8D6C0] text-[#373737]"
                    />
                  </div>
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Event End</label>
                    <input
                      type="datetime-local"
                      value={toLocalDateTimeValue(form.eventEnd)}
                      onChange={(e) => handleInputChange("eventEnd", e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-base focus:outline-none focus:border-orange-300 bg-[#F8D6C0] text-[#373737]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base text-[#0C0C0C] font-semibold mb-3">Event Image ({eventImageFiles.length}/4)</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
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

                  {eventImageFiles.length < 4 && (
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
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Event Gallery ({galleryImageFiles.length}/8)</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
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

                  {galleryImageFiles.length < 8 && (
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

              <div>
                <button
                  onClick={handleSubmitAndContinue}
                  disabled={createLoading}
                  className={`w-full font-semibold px-6 py-2.5 rounded transition text-sm ${
                    createLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-orange-400 text-white"
                  }`}
                >
                  {createLoading ? "Creating Event..." : "Submit & Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PricingModal
        isOpen={isPricingOpen}
        eventId={createdEventId}
        actionType="purchase"
        onClose={handleClosePricingModal}
      />
    </>
  );
}
