import apiClient from "../../services/apiClient";

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const extractPayload = (data) => data?.data || data?.result || data;

const normalizeServiceStatus = (value) => {
  const raw = String(value || "").trim().toLowerCase();

  if (!raw) return "Active";
  if (raw === "expired") return "Expired";
  if (raw === "suspended") return "Suspended";
  if (raw === "active") return "Active";

  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const pickPrimaryImage = (item) => {
  const direct = item?.image ?? item?.imageUrl ?? item?.thumbnail;
  if (typeof direct === "string" && direct.trim()) return direct;

  const gallery = [
    ...(Array.isArray(item?.serviceImages) ? item.serviceImages : []),
    ...(Array.isArray(item?.images) ? item.images : []),
    ...(Array.isArray(item?.gallery) ? item.gallery : []),
  ];

  const first = gallery.find(Boolean);
  if (!first) return "";

  if (typeof first === "string") return first;
  return first?.url || first?.image || first?.src || "";
};

const normalizeServiceItem = (item) => ({
  id: item?.id ?? item?._id,
  title: item?.title ?? item?.serviceTitle ?? item?.name ?? "Untitled Service",
  description: item?.description ?? item?.shortDescription ?? "",
  price: item?.price ?? item?.startingPrice ?? "$0",
  image: pickPrimaryImage(item),
  categoryId: item?.categoryId ?? item?.category?._id ?? item?.category?.id,
  subCategoryId: item?.subCategoryId ?? item?.subCategory?._id ?? item?.subCategory?.id,
  countryId: item?.countryId,
  regionId: item?.regionId,
  contactEmail: item?.contactEmail ?? item?.email ?? "",
  contactPhone: item?.contactPhone ?? item?.phone ?? "",
  status: normalizeServiceStatus(item?.status ?? item?.serviceStatus ?? item?.listingStatus ?? item?.approvalStatus),
  showRenew: Boolean(item?.showRenew ?? item?.isRenewable),
});

const normalizeServices = (payload) => {
  const list = normalizeList(payload);
  return list.map(normalizeServiceItem);
};

const normalizePagination = (payload, fallbackPage = 1, fallbackLimit = 12) => {
  const source = extractPayload(payload);
  const pageInfo = payload?.meta || payload?.pagination || source?.pagination || source?.meta || {};

  const page = Number(pageInfo?.page ?? source?.page ?? fallbackPage) || fallbackPage;
  const limit = Number(pageInfo?.limit ?? source?.limit ?? fallbackLimit) || fallbackLimit;
  const total = Number(pageInfo?.total ?? pageInfo?.totalItems ?? source?.total ?? 0) || 0;
  const totalPages =
    Number(pageInfo?.totalPages ?? source?.totalPages ?? (total > 0 ? Math.ceil(total / limit) : 1)) || 1;

  return {
    page,
    limit,
    total,
    totalPages,
  };
};

const normalizeCategory = (item) => ({
  id: item?.id ?? item?._id ?? item?.categoryId ?? item?.name,
  name: item?.name ?? item?.categoryName ?? item?.title,
});

const normalizeSubCategory = (item) => ({
  id: item?.id ?? item?._id ?? item?.subCategoryId ?? item?.name,
  name: item?.name ?? item?.subCategoryName ?? item?.title,
});

const normalizeProvider = (provider = {}, fallbackLocation = "") => ({
  name: provider?.name ?? provider?.fullName ?? provider?.providerName ?? "Service Provider",
  title: provider?.title ?? provider?.designation ?? "Provider",
  phone: provider?.phone ?? provider?.phoneNumber ?? "N/A",
  email: provider?.email ?? provider?.contactEmail ?? "N/A",
  address: provider?.address ?? fallbackLocation,
  avatar: provider?.avatar ?? provider?.image ?? provider?.profileImage ?? "",
});

const normalizeFeatureItem = (feature, index) => ({
  icon: feature?.icon ?? (index % 2 === 0 ? "✦" : "◉"),
  title: feature?.title ?? feature?.name ?? `Feature ${index + 1}`,
  desc: feature?.desc ?? feature?.description ?? "",
});

const toArrayOfStrings = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === "string" ? item : item?.name || item?.title || "")).filter(Boolean);
  }
  return [];
};

const toImageArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item : item?.url || item?.image || item?.src || ""))
    .filter(Boolean);
};

const normalizeServiceDetail = (payload) => {
  const item = payload?.data || payload?.result || payload;

  const image = item?.image ?? item?.imageUrl ?? item?.thumbnail ?? "";
  const thumbnails = toImageArray(item?.thumbnails || item?.images || item?.gallery || []);
  const galleryImages = toImageArray(item?.galleryImages || item?.gallery || item?.images || []);
  const categoryName = item?.category?.name ?? item?.categoryName ?? item?.category ?? "";
  const subCategoryName = item?.subCategory?.name ?? item?.subCategoryName ?? item?.subCategory ?? "";
  const location =
    item?.location ||
    item?.address ||
    item?.region?.name ||
    item?.country?.name ||
    "";

  return {
    id: item?.id ?? item?._id,
    title: item?.title ?? item?.serviceTitle ?? item?.name ?? "Untitled Service",
    price: item?.price ?? item?.startingPrice ?? 0,
    description: item?.description ?? item?.shortDescription ?? "",
    location,
    category: categoryName,
    subCategory: subCategoryName,
    image,
    thumbnails: thumbnails.length > 0 ? thumbnails : image ? [image] : [],
    galleryImages: galleryImages.length > 0 ? galleryImages : thumbnails,
    features: Array.isArray(item?.features)
      ? item.features.map(normalizeFeatureItem)
      : Array.isArray(item?.benefits)
      ? item.benefits.map(normalizeFeatureItem)
      : [],
    serviceTargets: toArrayOfStrings(item?.serviceTargets || item?.targets || item?.targetAudience),
    commonServices: toArrayOfStrings(item?.commonServices || item?.includes || item?.services),
    provider: normalizeProvider(item?.provider || item?.owner || item?.user, location),
  };
};

export const fetchServicesAPI = async (params = {}) => {
  const normalizedCategoryId = params.categoryId ?? params.category ?? params.serviceCategoryId;
  const normalizedSubCategoryId = params.subCategoryId ?? params.subcategoryId;
  const normalizedCountryId = params.countryId ?? params.country;
  const normalizedRegionId = params.regionId ?? params.region;
  const normalizedPriceRangeRaw = String(params.priceRange || "").trim().toLowerCase();
  const normalizedPriceRange =
    normalizedPriceRangeRaw === "500+" || normalizedPriceRangeRaw === "500plus"
      ? "500plus"
      : params.priceRange;

  const requestParams = {
    ...params,
    priceRange: normalizedPriceRange,
    categoryId: normalizedCategoryId,
    category: normalizedCategoryId,
    serviceCategoryId: normalizedCategoryId,
    subCategoryId: normalizedSubCategoryId,
    subcategoryId: normalizedSubCategoryId,
    countryId: normalizedCountryId,
    country: normalizedCountryId,
    regionId: normalizedRegionId,
    region: normalizedRegionId,
  };

  const response = await apiClient.get("/api/services", { params: requestParams });

  return {
    items: normalizeServices(response.data),
    pagination: normalizePagination(response.data, params.page, params.limit),
  };
};

export const fetchMyServicesAPI = async (params = {}) => {
  const response = await apiClient.get("/api/services/me", { params });

  return {
    items: normalizeServices(response.data),
    pagination: normalizePagination(response.data, params.page, params.limit),
  };
};

const appendIfPresent = (formData, key, value) => {
  if (value === undefined || value === null) return;
  if (typeof value === "string" && !value.trim()) return;
  formData.append(key, value);
};

export const updateMyServiceAPI = async (serviceId, payload) => {
  const formData = payload instanceof FormData ? payload : new FormData();

  if (!(payload instanceof FormData)) {
    appendIfPresent(formData, "title", payload?.title);
    appendIfPresent(formData, "description", payload?.description);
    appendIfPresent(formData, "price", payload?.price);
    appendIfPresent(formData, "contactEmail", payload?.contactEmail);
    appendIfPresent(formData, "contactPhone", payload?.contactPhone);
    appendIfPresent(formData, "countryId", payload?.countryId);
    appendIfPresent(formData, "regionId", payload?.regionId);
    appendIfPresent(formData, "categoryId", payload?.categoryId);
    appendIfPresent(formData, "status", payload?.status);
    appendIfPresent(formData, "mainImage", payload?.mainImage);
  }

  const response = await apiClient.put(`/api/services/me/${serviceId}`, formData);
  const source = extractPayload(response.data);

  return {
    item: normalizeServiceItem(source),
    raw: response.data,
  };
};

export const deleteMyServiceAPI = async (serviceId) => {
  const response = await apiClient.delete(`/api/services/me/${serviceId}`);

  return {
    serviceId: String(serviceId),
    raw: response.data,
  };
};

export const fetchServiceCategoriesAPI = async () => {
  const response = await apiClient.get("/api/categories/service");
  const list = normalizeList(response.data);
  return list.map(normalizeCategory).filter((item) => item.id && item.name);
};

export const fetchServiceCategoryDetailAPI = async (categoryId) => {
  const response = await apiClient.get(`/api/categories/service/${categoryId}`);
  const payload = extractPayload(response.data);

  const possibleSubcategories =
    payload?.subcategories ||
    payload?.subCategories ||
    payload?.children ||
    payload?.subCategoryList ||
    payload;

  const list = normalizeList(possibleSubcategories);
  return list.map(normalizeSubCategory).filter((item) => item.id && item.name);
};

export const fetchServiceByIdAPI = async (serviceId) => {
  const response = await apiClient.get(`/api/services/${serviceId}`);
  return normalizeServiceDetail(response.data);
};

export const reportServiceSpamAPI = async (serviceId) => {
  const response = await apiClient.post(`/api/services/${serviceId}/report-spam`);
  return response?.data;
};

const normalizePricingPlan = (item) => ({
  id: item?.id ?? item?._id,
  title: item?.title ?? item?.name ?? "Plan",
  price: Number(item?.price ?? 0),
  duration: Number(item?.duration ?? 30),
  isActive: Boolean(item?.isActive),
  isIntroductory: Boolean(item?.isIntroductory),
});

const dedupePricingPlans = (plans) => {
  const seenIds = new Set();
  const seenFingerprints = new Set();

  return plans.filter((plan) => {
    if (!plan?.id) return false;

    const planId = String(plan.id);
    if (seenIds.has(planId)) return false;

    const fingerprint = [
      String(plan?.title || "").trim().toLowerCase(),
      Number(plan?.price ?? 0).toFixed(2),
      String(Number(plan?.duration ?? 0)),
      String(Boolean(plan?.isIntroductory)),
    ].join("|");

    if (seenFingerprints.has(fingerprint)) return false;

    seenIds.add(planId);
    seenFingerprints.add(fingerprint);
    return true;
  });
};

const extractIdFromPayload = (payload) => {
  const source = payload?.data || payload?.result || payload;
  return source?.id ?? source?._id ?? source?.serviceId;
};

export const createServiceAPI = async (formData) => {
  const response = await apiClient.post("/api/services", formData);
  const serviceId = extractIdFromPayload(response.data);

  return {
    serviceId: serviceId ? String(serviceId) : "",
    raw: response.data,
  };
};

export const fetchPricingPlansEligibilityAPI = async () => {
  const response = await apiClient.get("/api/pricing-plans/eligibility");
  const source = response?.data?.data || response?.data?.result || response?.data || {};
  const isUnderFirstThreeMonths = Boolean(source?.isUnderFirstThreeMonths);
  const introductoryPlanId = String(source?.introductoryPlanId || source?.introductoryPlan?.id || "");

  let rawPlans = normalizeList(response.data);

  if (!rawPlans.length && source && typeof source === "object") {
    rawPlans = [
      source?.introductoryPlan,
      source?.standardPlan,
      source?.currentPlan,
      ...(Array.isArray(source?.plans) ? source.plans : []),
    ].filter(Boolean);
  }

  const activePlans = dedupePricingPlans(rawPlans.map(normalizePricingPlan).filter((plan) => plan.id && plan.isActive));

  return {
    plans: activePlans,
    isUnderFirstThreeMonths,
    introductoryPlanId,
    stripePublishableKey: source?.stripePublishableKey || "",
    stripeCurrency: source?.stripeCurrency || source?.currency || "",
  };
};

export const purchaseServiceAPI = async (serviceId, payload) => {
  const response = await apiClient.post(`/api/services/${serviceId}/purchase`, payload);
  const source = response?.data?.data || response?.data?.result || response?.data;

  return {
    checkoutUrl: source?.checkoutUrl || source?.url || source?.checkoutSessionUrl || source?.sessionUrl || "",
    checkoutSessionId: source?.checkoutSessionId || source?.sessionId || "",
    selectedPlanId: source?.selectedPlan?.id || source?.planId || source?.pricingPlanId || "",
    raw: response.data,
  };
};

export const renewServiceAPI = async (serviceId, payload) => {
  const normalizedServiceId = String(serviceId || "").trim();
  const endpointCandidates = [
    `/api/services/${normalizedServiceId}/renew`,
    `/api/service/${normalizedServiceId}/renew`,
  ];

  let lastError = null;

  for (const endpoint of endpointCandidates) {
    try {
      const response = await apiClient.post(endpoint, payload);
      const source = response?.data?.data || response?.data?.result || response?.data;

      return {
        checkoutUrl: source?.checkoutUrl || source?.url || source?.checkoutSessionUrl || source?.sessionUrl || "",
        checkoutSessionId: source?.checkoutSessionId || source?.sessionId || "",
        selectedPlanId: source?.selectedPlan?.id || source?.planId || source?.pricingPlanId || "",
        raw: response?.data,
      };
    } catch (error) {
      if (error?.response?.status === 404) {
        lastError = error;
        continue;
      }

      throw error;
    }
  }

  throw lastError;
};

export const confirmServicePurchaseAPI = async (serviceId, payload) => {
  const normalizedServiceId = String(serviceId || "").trim();
  const planId = payload?.planId || payload?.pricingPlanId || payload?.pricing_plan_id;

  const requestBody = {
    planId: planId || payload?.pricingPlanId,
    pricingPlanId: payload?.pricingPlanId || payload?.planId || payload?.pricing_plan_id,
    pricing_plan_id: payload?.pricing_plan_id || payload?.pricingPlanId || payload?.planId,
    checkoutSessionId: payload?.checkoutSessionId || payload?.sessionId || payload?.session_id,
    sessionId: payload?.sessionId || payload?.checkoutSessionId || payload?.session_id,
    session_id: payload?.session_id || payload?.checkoutSessionId || payload?.sessionId,
    checkout_session_id:
      payload?.checkout_session_id || payload?.checkoutSessionId || payload?.sessionId || payload?.session_id,
  };

  const endpointCandidates = [
    `/api/services/${normalizedServiceId}/purchase/confirm`,
    `/api/service/${normalizedServiceId}/purchase/confirm`,
    `/api/services/purchase/confirm`,
    `/api/service/purchase/confirm`,
  ];

  let lastError = null;

  for (const endpoint of endpointCandidates) {
    try {
      const response = await apiClient.post(endpoint, requestBody);
      return response?.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        lastError = error;
        continue;
      }

      throw error;
    }
  }

  throw lastError;
};

export const confirmServiceRenewAPI = async (serviceId, payload) => {
  const normalizedServiceId = String(serviceId || "").trim();
  const planId = payload?.planId || payload?.pricingPlanId || payload?.pricing_plan_id;

  const requestBody = {
    planId: planId || payload?.pricingPlanId,
    pricingPlanId: payload?.pricingPlanId || payload?.planId || payload?.pricing_plan_id,
    pricing_plan_id: payload?.pricing_plan_id || payload?.pricingPlanId || payload?.planId,
    checkoutSessionId: payload?.checkoutSessionId || payload?.sessionId || payload?.session_id,
    sessionId: payload?.sessionId || payload?.checkoutSessionId || payload?.session_id,
    session_id: payload?.session_id || payload?.checkoutSessionId || payload?.sessionId,
    checkout_session_id:
      payload?.checkout_session_id || payload?.checkoutSessionId || payload?.sessionId || payload?.session_id,
  };

  const endpointCandidates = [
    `/api/services/${normalizedServiceId}/renew/confirm`,
    `/api/service/${normalizedServiceId}/renew/confirm`,
    `/api/services/renew/confirm`,
    `/api/service/renew/confirm`,
  ];

  let lastError = null;

  for (const endpoint of endpointCandidates) {
    try {
      const response = await apiClient.post(endpoint, requestBody);
      return response?.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        lastError = error;
        continue;
      }

      throw error;
    }
  }

  throw lastError;
};
