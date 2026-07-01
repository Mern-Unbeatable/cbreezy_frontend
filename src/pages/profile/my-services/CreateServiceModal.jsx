import { useContext, useEffect, useMemo, useState } from "react";
import { Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AuthContext, ROLES } from "../../../context/AuthContext";
import PricingModal from "./PricingModal";
import {
  createService,
  updateMyService,
  removeMyServiceImage,
  fetchServiceCategories,
  fetchServiceCategoryDetail,
  fetchPricingPlansEligibility,
  purchaseService,
  selectCreateServiceLoading,
  selectServiceCategories,
  selectServiceCategoriesLoading,
  selectServiceSubcategoriesByCategory,
} from "../../../features/services/servicesSlice";
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

export default function CreateServiceModal({ isOpen, onClose, editService = null, onSaved, complimentaryListing = false }) {
  const dispatch = useDispatch();
  const { role } = useContext(AuthContext);
  const isComplimentaryFlow = complimentaryListing || role === ROLES.SUB_ADMIN;
  const isEditMode = Boolean(editService?.id);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const createLoading = useSelector(selectCreateServiceLoading);
  const categories = useSelector(selectServiceCategories);
  const categoriesLoading = useSelector(selectServiceCategoriesLoading);
  const subcategoriesByCategory = useSelector(selectServiceSubcategoriesByCategory);
  const countries = useSelector(selectCountries);
  const countriesLoading = useSelector(selectCountriesLoading);
  const regions = useSelector(selectRegions);
  const regionsLoading = useSelector(selectRegionsLoading);
  const cities = useSelector(selectCities);
  const citiesLoading = useSelector(selectCitiesLoading);

  const [createdServiceId, setCreatedServiceId] = useState("");
  const [pricingForcePlanId, setPricingForcePlanId] = useState("");
  const [pricingLockSelection, setPricingLockSelection] = useState(false);
  const [pricingHideFree, setPricingHideFree] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    subCategoryId: "",
    countryId: "",
    regionId: "",
    cityId: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    facebookUrl: "",
    instagramUrl: "",
  });

  const [serviceImageFiles, setServiceImageFiles] = useState([]);
  const [serviceImagePreviews, setServiceImagePreviews] = useState([]);
  const [existingServiceImages, setExistingServiceImages] = useState([]);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);
  const [removingImageUrl, setRemovingImageUrl] = useState("");

  const syncImagesFromService = (service) => {
    setExistingServiceImages(resolveEditServiceImages(service));
    setExistingGalleryImages(resolveEditGalleryImages(service));
  };

  const resolveEditServiceImages = (service) => {
    if (Array.isArray(service?.serviceImages) && service.serviceImages.length > 0) {
      return service.serviceImages;
    }
    if (service?.mainImage) return [service.mainImage];
    if (service?.image) return [service.image];
    return [];
  };

  const resolveEditGalleryImages = (service) => {
    if (Array.isArray(service?.galleryImages) && service.galleryImages.length > 0) {
      return service.galleryImages;
    }
    if (Array.isArray(service?.gallery) && service.gallery.length > 0) {
      return service.gallery;
    }
    return [];
  };

  const resetModalState = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      categoryId: "",
      subCategoryId: "",
      countryId: "",
      regionId: "",
      cityId: "",
      address: "",
      contactEmail: "",
      contactPhone: "",
      facebookUrl: "",
      instagramUrl: "",
    });
    setServiceImageFiles([]);
    setServiceImagePreviews([]);
    setExistingServiceImages([]);
    setGalleryImageFiles([]);
    setGalleryImagePreviews([]);
    setExistingGalleryImages([]);
    setRemovingImageUrl("");
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

  // Pre-fill form in edit mode
  useEffect(() => {
    if (!isEditMode || !editService) return;
    const parsePrice = (v) => String(v || "").replace(/[^0-9.]/g, "");
    setForm({
      title: editService.title || "",
      description: editService.description || "",
      price: parsePrice(editService.price),
      categoryId: editService.categoryId || "",
      subCategoryId: editService.subCategoryId || "",
      countryId: editService.countryId || "",
      regionId: editService.regionId || "",
      cityId: editService.cityId || "",
      address: editService.address || "",
      contactEmail: editService.contactEmail || "",
      contactPhone: editService.contactPhone || "",
      facebookUrl: editService.facebookUrl || "",
      instagramUrl: editService.instagramUrl || "",
    });
    setExistingServiceImages(resolveEditServiceImages(editService));
    setExistingGalleryImages(resolveEditGalleryImages(editService));
    setServiceImageFiles([]);
    setServiceImagePreviews([]);
    setGalleryImageFiles([]);
    setGalleryImagePreviews([]);
  }, [editService, isEditMode]);

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

  useEffect(() => {
    if (!form.regionId) {
      dispatch(clearCities());
      return;
    }

    dispatch(fetchCitiesByRegion(form.regionId));
  }, [dispatch, form.regionId]);

  useEffect(() => {
    if (!isEditMode || !editService?.cityId || cities.length === 0) return;

    const matchedCity = cities.some((item) => String(item.id) === String(editService.cityId));
    if (matchedCity) {
      setForm((prev) =>
        prev.cityId === String(editService.cityId) ? prev : { ...prev, cityId: String(editService.cityId) }
      );
    }
  }, [isEditMode, editService?.cityId, cities]);

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
        return { ...prev, countryId: value, regionId: "", cityId: "" };
      }

      if (field === "regionId") {
        return { ...prev, regionId: value, cityId: "" };
      }

      return { ...prev, [field]: value };
    });
  };

  const handleServiceImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 4 - existingServiceImages.length - serviceImageFiles.length;

    if (remainingSlots <= 0) {
      toast.error("Remove an existing service image first to upload a new one");
      e.target.value = "";
      return;
    }

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

  const removeServiceImage = (index) => {
    setServiceImageFiles((prev) => prev.filter((_, i) => i !== index));
    setServiceImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeGalleryImage = (index) => {
    setGalleryImageFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingServiceImage = async (index) => {
    const imageUrl = existingServiceImages[index];
    if (!imageUrl || !editService?.id) return;

    setRemovingImageUrl(imageUrl);
    try {
      const result = await dispatch(
        removeMyServiceImage({
          serviceId: editService.id,
          imageUrl,
          imageType: "serviceImages",
        })
      ).unwrap();

      syncImagesFromService(result?.item || {});
      toast.success("Service image removed");
    } catch (error) {
      toast.error(error || "Failed to remove service image");
    } finally {
      setRemovingImageUrl("");
    }
  };

  const removeExistingGalleryImage = async (index) => {
    const imageUrl = existingGalleryImages[index];
    if (!imageUrl || !editService?.id) return;

    setRemovingImageUrl(imageUrl);
    try {
      const result = await dispatch(
        removeMyServiceImage({
          serviceId: editService.id,
          imageUrl,
          imageType: "gallery",
        })
      ).unwrap();

      syncImagesFromService(result?.item || {});
      toast.success("Gallery image removed");
    } catch (error) {
      toast.error(error || "Failed to remove gallery image");
    } finally {
      setRemovingImageUrl("");
    }
  };

  const handleSubmitAndContinue = async () => {
    if (!String(form.title || "").trim()) {
      toast.error("Service title is required");
      return;
    }

    // ── EDIT MODE ──
    if (isEditMode) {
      const payload = new FormData();
      payload.append("title", form.title.trim());
      payload.append("description", form.description.trim());
      if (form.price) payload.append("price", form.price);
      if (form.categoryId) payload.append("categoryId", form.categoryId);
      if (form.subCategoryId) payload.append("subCategoryId", form.subCategoryId);
      if (form.countryId) payload.append("countryId", form.countryId);
      if (form.regionId) payload.append("regionId", form.regionId);
      if (form.cityId) payload.append("cityId", form.cityId);
      if (form.address.trim()) payload.append("address", form.address.trim());
      payload.append("contactEmail", form.contactEmail.trim());
      payload.append("contactPhone", form.contactPhone.trim());
      if (form.facebookUrl.trim()) payload.append("facebookUrl", form.facebookUrl.trim());
      if (form.instagramUrl.trim()) payload.append("instagramUrl", form.instagramUrl.trim());
      serviceImageFiles.forEach((file) => payload.append("serviceImages", file));
      galleryImageFiles.forEach((file) => payload.append("serviceGallery", file));

      setUpdateLoading(true);
      try {
        const result = await dispatch(updateMyService({ serviceId: editService.id, payload })).unwrap();
        if (result?.item) {
          syncImagesFromService(result.item);
        }
        toast.success("Service updated successfully");
        if (onSaved) onSaved();
        onClose();
      } catch (error) {
        toast.error(error || "Failed to update service");
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
      "subCategoryId",
      "countryId",
      "regionId",
      "cityId",
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
    payload.append("cityId", form.cityId);
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

      toast.info(isComplimentaryFlow ? "Service created — activating listing..." : "Service created — please complete payment to activate.");
      const serviceId = String(result.serviceId);

      if (isComplimentaryFlow) {
        try {
          const eligibility = await dispatch(fetchPricingPlansEligibility()).unwrap();
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
            purchaseService({
              serviceId,
              payload: { planId: plan.id, successUrl, cancelUrl },
            }),
          ).unwrap();

          toast.success("Listing published successfully");
          handleCloseCreateModal();
          if (onSaved) await onSaved();
          return;
        } catch (error) {
          toast.error(error || "Failed to activate listing");
          return;
        }
      }

      try {
        const eligibility = await dispatch(fetchPricingPlansEligibility()).unwrap();
        const plans = eligibility?.plans || [];
        const userLifecycle = eligibility?.userLifecycle || {};
        const isEligibleForFree = Boolean(eligibility?.isEligibleForFree || userLifecycle?.isEligibleForFree);
        const isEligibleForDiscount = Boolean(eligibility?.isEligibleForDiscount || userLifecycle?.isEligibleForDiscount);

        if (isEligibleForFree) {
          const freePlan = plans.find((p) => String(p?.tier || "").toLowerCase() === "free" || Number(p?.price || 0) === 0) || plans[0];
          if (freePlan?.id) {
            const successUrl = `${window.location.origin}/profile/my-services/purchase-success?serviceId=${encodeURIComponent(
              serviceId
            )}&planId=${encodeURIComponent(freePlan.id)}&flow=purchase&session_id={CHECKOUT_SESSION_ID}`;
            const cancelUrl = `${window.location.origin}/profile/my-services?purchase=cancelled`;
            const purchaseResult = await dispatch(purchaseService({ serviceId, payload: { planId: freePlan.id, successUrl, cancelUrl } })).unwrap();
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

        if (!isEligibleForFree && isEligibleForDiscount) {
          const introId = String(eligibility?.introductoryPlanId || "") || String((plans.find((p) => p.isIntroductory) || {}).id || "");
          handleOpenPricingModal(serviceId);
          setCreatedServiceId(serviceId);
          setPricingForcePlanId(introId || "");
          setPricingLockSelection(true);
          setPricingHideFree(true);
          return;
        }

        const standardPlan = plans.find((p) => String(p?.title || "").toLowerCase().includes("standard")) || plans.find((p) => Number(p.price || 0) > 0) || plans[0];
        const standardId = String(standardPlan?.id || "");
        handleOpenPricingModal(serviceId);
        setCreatedServiceId(serviceId);
        setPricingForcePlanId(standardId);
        setPricingLockSelection(true);
        setPricingHideFree(true);
      } catch (err) {
        handleOpenPricingModal(result.serviceId);
      }
    } catch (error) {
      toast.error(error || "Failed to create service");
    }
  };

  const totalServiceImages = existingServiceImages.length + serviceImageFiles.length;
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
              <h2 className="text-lg font-semibold text-gray-800">{isEditMode ? "Edit Service" : "Create Service"}</h2>
              <button
                onClick={handleCloseCreateModal}
                className="text-gray-600 hover:text-gray-700 transition"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 space-y-5">
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
                    <label className="block text-base text-[#0C0C0C] mb-1">Region</label>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
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
              </div>

              <div>
                <h3 className="text-base text-[#0C0C0C] font-semibold mb-1">
                  Service Image ({totalServiceImages}/4)
                </h3>
                {isEditMode && (
                  <p className="text-xs text-gray-500 mb-3">
                    Tap the X on an image to remove it, then use Upload to add a replacement.
                  </p>
                )}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                  {existingServiceImages.map((src, i) => (
                    <div key={`existing-service-${src}`} className="relative aspect-square rounded overflow-hidden bg-gray-100">
                      <img src={src} alt={`service-existing-${i}`} className="w-full h-full object-cover" />
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => removeExistingServiceImage(i)}
                          disabled={Boolean(removingImageUrl)}
                          className="absolute top-1.5 right-1.5 rounded-full bg-black/70 p-1 text-white hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Remove service image"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}

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

                  {totalServiceImages < 4 && (
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
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Service Gallery ({totalGalleryImages}/8)
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
                  : createLoading ? "Creating Service..." : "Submit & Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      <PricingModal
        isOpen={isPricingOpen}
        serviceId={createdServiceId}
        onClose={handleClosePricingModal}
        forcePlanId={pricingForcePlanId}
        lockSelection={pricingLockSelection}
        hideFreePlans={pricingHideFree}
      />
    </>
  );
}
