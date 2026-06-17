import { useEffect, useMemo, useState } from "react";
import { Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PricingModal from "./PricingModal";
import {
  createService,
  fetchServiceCategories,
  fetchServiceCategoryDetail,
  selectCreateServiceLoading,
  selectServiceCategories,
  selectServiceCategoriesLoading,
  selectServiceSubcategoriesByCategory,
} from "../../../features/services/servicesSlice";
import {
  fetchCountries,
  fetchRegionsByCountry,
  selectCountries,
  selectCountriesLoading,
  selectRegions,
  selectRegionsLoading,
} from "../../../features/auth/authSlice";

export default function CreateServiceModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const createLoading = useSelector(selectCreateServiceLoading);
  const categories = useSelector(selectServiceCategories);
  const categoriesLoading = useSelector(selectServiceCategoriesLoading);
  const subcategoriesByCategory = useSelector(selectServiceSubcategoriesByCategory);
  const countries = useSelector(selectCountries);
  const countriesLoading = useSelector(selectCountriesLoading);
  const regions = useSelector(selectRegions);
  const regionsLoading = useSelector(selectRegionsLoading);

  const [createdServiceId, setCreatedServiceId] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    subCategoryId: "",
    countryId: "",
    regionId: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    facebookUrl: "",
    instagramUrl: "",
  });

  const [serviceImageFiles, setServiceImageFiles] = useState([]);
  const [serviceImagePreviews, setServiceImagePreviews] = useState([]);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState([]);

  const resetModalState = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      categoryId: "",
      subCategoryId: "",
      countryId: "",
      regionId: "",
      address: "",
      contactEmail: "",
      contactPhone: "",
      facebookUrl: "",
      instagramUrl: "",
    });
    setServiceImageFiles([]);
    setServiceImagePreviews([]);
    setGalleryImageFiles([]);
    setGalleryImagePreviews([]);
  };

  const subcategories = useMemo(
    () => subcategoriesByCategory[String(form.categoryId)] || [],
    [form.categoryId, subcategoriesByCategory]
  );

  useEffect(() => {
    if (!isOpen) return;
    dispatch(fetchServiceCategories());
    dispatch(fetchCountries());
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (form.categoryId) {
      dispatch(fetchServiceCategoryDetail(form.categoryId));
    }
  }, [dispatch, form.categoryId]);

  useEffect(() => {
    if (form.countryId) {
      dispatch(fetchRegionsByCountry(form.countryId));
    }
  }, [dispatch, form.countryId]);

  const handleCloseCreateModal = () => {
    setIsPricingOpen(false);
    setCreatedServiceId("");
    resetModalState();
    onClose();
  };

  const handleOpenPricingModal = (serviceId) => {
    setCreatedServiceId(String(serviceId || ""));
    setIsPricingOpen(true);
  };

  const handleClosePricingModal = () => {
    setIsPricingOpen(false);
    setCreatedServiceId("");
    resetModalState();
    onClose();
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => {
      if (field === "categoryId") {
        return { ...prev, categoryId: value, subCategoryId: "" };
      }

      if (field === "countryId") {
        return { ...prev, countryId: value, regionId: "" };
      }

      return { ...prev, [field]: value };
    });
  };

  const handleServiceImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 4 - serviceImageFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    setServiceImageFiles((prev) => [...prev, ...filesToAdd]);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setServiceImagePreviews((prev) => [...prev, reader.result]);
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

  const removeServiceImage = (index) => {
    setServiceImageFiles((prev) => prev.filter((_, i) => i !== index));
    setServiceImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeGalleryImage = (index) => {
    setGalleryImageFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAndContinue = async () => {
    const required = [
      "title",
      "description",
      "price",
      "categoryId",
      "subCategoryId",
      "countryId",
      "regionId",
      "address",
      "contactEmail",
      "contactPhone",
    ];

    const missingRequired = required.some((field) => !String(form[field] || "").trim());
    if (missingRequired) {
      toast.error("Please fill all required fields");
      return;
    }

    if (serviceImageFiles.length === 0) {
      toast.error("Please upload at least one service image");
      return;
    }

    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    payload.append("price", form.price);
    payload.append("categoryId", form.categoryId);
    payload.append("subCategoryId", form.subCategoryId);
    payload.append("countryId", form.countryId);
    payload.append("regionId", form.regionId);
    payload.append("address", form.address.trim());
    payload.append("contactEmail", form.contactEmail.trim());
    payload.append("contactPhone", form.contactPhone.trim());
    payload.append("facebookUrl", form.facebookUrl.trim());
    payload.append("instagramUrl", form.instagramUrl.trim());

    serviceImageFiles.forEach((file) => {
      payload.append("serviceImages", file);
    });

    galleryImageFiles.forEach((file) => {
      payload.append("serviceGallery", file);
    });

    try {
      const result = await dispatch(createService(payload)).unwrap();
      if (!result?.serviceId) {
        toast.error("Service created but ID not found for purchase");
        return;
      }

      toast.success("Service created successfully");
      handleOpenPricingModal(result.serviceId);
    } catch (error) {
      toast.error(error || "Failed to create service");
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
              <h2 className="text-lg font-semibold text-gray-800">Create Service</h2>
              <button
                onClick={handleCloseCreateModal}
                className="text-gray-600 hover:text-gray-700 transition"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4 space-y-5 overflow-y-auto min-h-0">
              <div>
                <h3 className="text-base text-[#0C0C0C] font-semibold mb-3">Service Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Service Title</label>
                    <input
                      type="text"
                      placeholder="Write service title"
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
                      className="w-full border border-gray-200 rounded px-3 py-2 text-base focus:outline-none focus:border-orange-300 bg-[#F8D6C0] text-[#373737] disabled:opacity-70"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Sub Category</label>
                    <select
                      value={form.subCategoryId}
                      onChange={(e) => handleInputChange("subCategoryId", e.target.value)}
                      disabled={!form.categoryId}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-base focus:outline-none focus:border-orange-300 bg-[#F8D6C0] text-[#373737] disabled:opacity-70"
                    >
                      <option value="">Select sub category</option>
                      {subcategories.map((subCategory) => (
                        <option key={subCategory.id} value={subCategory.id}>
                          {subCategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
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
                </div>

                <div className="mb-3">
                  <label className="block text-base text-[#0C0C0C] mb-1">Description</label>
                  <textarea
                    placeholder="Describe your service..."
                    rows={4}
                    value={form.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-orange-300 bg-[#F8D6C0] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
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
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Location</label>
                    <select
                      value={form.regionId}
                      onChange={(e) => handleInputChange("regionId", e.target.value)}
                      disabled={!form.countryId || regionsLoading}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-base focus:outline-none focus:border-orange-300 bg-[#F8D6C0] text-[#373737] disabled:opacity-70"
                    >
                      <option value="">Location</option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-base text-[#0C0C0C] mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="Enter full address"
                    value={form.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-orange-300 bg-[#F8D6C0]"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-base text-[#0C0C0C] font-semibold mb-3">Service Image ({serviceImageFiles.length}/4)</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                  {serviceImagePreviews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded overflow-hidden bg-gray-100">
                      <img src={src} alt={`service-${i}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeServiceImage(i)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition"
                      >
                        <X size={20} className="text-white" />
                      </button>
                    </div>
                  ))}

                  {serviceImageFiles.length < 4 && (
                    <label className="aspect-square rounded border-2 border-dashed border-orange-300 flex items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition">
                      <div className="text-center">
                        <Upload size={20} className="text-orange-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">Upload</span>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleServiceImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base text-[#0C0C0C] font-semibold mb-3">Provider Contact Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="write your email"
                      value={form.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-300 bg-[#F8D6C0]"
                    />
                  </div>
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="enter phone number"
                      value={form.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
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
                      value={form.facebookUrl}
                      onChange={(e) => handleInputChange("facebookUrl", e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-300 bg-[#F8D6C0]"
                    />
                  </div>
                  <div>
                    <label className="block text-base text-[#0C0C0C] mb-1">Instagram</label>
                    <input
                      type="url"
                      placeholder="Instagram URL"
                      value={form.instagramUrl}
                      onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-300 bg-[#F8D6C0]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Service Gallery ({galleryImageFiles.length}/8)</h3>
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
                      : "bg-orange-400  text-white"
                  }`}
                >
                  {createLoading ? "Creating Service..." : "Submit & Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PricingModal
        isOpen={isPricingOpen}
        serviceId={createdServiceId}
        onClose={handleClosePricingModal}
      />
    </>
  );
}
