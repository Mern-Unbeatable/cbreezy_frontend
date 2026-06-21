import apiClient from "../../services/apiClient";

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const extractPayload = (data) => data?.data || data?.result || data;

const normalizeEventStatus = (value) => {
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
    ...(Array.isArray(item?.eventImages) ? item.eventImages : []),
    ...(Array.isArray(item?.images) ? item.images : []),
    ...(Array.isArray(item?.gallery) ? item.gallery : []),
  ];

  const first = gallery.find(Boolean);
  if (!first) return "";
  if (typeof first === "string") return first;

  return first?.url || first?.image || first?.src || "";
};

const normalizeEventCategory = (item) => ({
  id: item?.id ?? item?._id ?? item?.categoryId ?? item?.name,
  name: item?.name ?? item?.categoryName ?? item?.title,
});

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

const normalizeEventItem = (item) => ({
  id: item?.id ?? item?._id,
  title: item?.title ?? item?.eventTitle ?? item?.name ?? "Untitled Event",
  description: item?.description ?? item?.shortDescription ?? "",
  price: item?.price ?? item?.startingPrice ?? "$0",
  image: pickPrimaryImage(item),
  categoryId: item?.categoryId ?? item?.category?._id ?? item?.category?.id,
  category: item?.category?.name ?? item?.categoryName ?? item?.category ?? "",
  countryId: item?.countryId ?? item?.country?._id ?? item?.country?.id,
  regionId: item?.regionId ?? item?.region?._id ?? item?.region?.id,
  status: normalizeEventStatus(item?.status ?? item?.eventStatus ?? item?.listingStatus ?? item?.approvalStatus),
  showRenew: Boolean(item?.showRenew ?? item?.isRenewable),
});

const normalizeEvents = (payload) => {
  const list = normalizeList(payload);
  return list.map(normalizeEventItem);
};

const normalizeProvider = (provider = {}, fallbackLocation = "") => ({
  name: provider?.name ?? provider?.fullName ?? provider?.providerName ?? "Event Organizer",
  title: provider?.title ?? provider?.designation ?? "Organizer",
  phone: provider?.phone ?? provider?.phoneNumber ?? "N/A",
  email: provider?.email ?? provider?.contactEmail ?? "N/A",
  address: provider?.address ?? fallbackLocation,
  avatar: provider?.avatar ?? provider?.image ?? provider?.profileImage ?? "",
  startDate: provider?.startDate ?? null,
  endDate: provider?.endDate ?? null,
});

const normalizeFeatureItem = (feature, index) => ({
  icon: feature?.icon ?? (index % 2 === 0 ? "camera" : "sparkles"),
  title: feature?.title ?? feature?.name ?? `Feature ${index + 1}`,
  desc: feature?.desc ?? feature?.description ?? "",
});

const toArrayOfStrings = (value) => {
  if (!value) return [];
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === "string" ? item : item?.name || item?.title || "")).filter(Boolean);
};

const toImageArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item : item?.url || item?.image || item?.src || ""))
    .filter(Boolean);
};

const normalizeEventDetail = (payload) => {
  const item = payload?.data || payload?.result || payload;
  const image = item?.image ?? item?.imageUrl ?? item?.thumbnail ?? "";
  const thumbnails = toImageArray(item?.thumbnails || item?.images || item?.gallery || []);
  const galleryImages = toImageArray(item?.galleryImages || item?.gallery || item?.images || []);

  const location =
    item?.location ||
    item?.address ||
    item?.region?.name ||
    item?.country?.name ||
    "";

  const provider = normalizeProvider(item?.provider || item?.owner || item?.user, location);

  provider.startDate = provider.startDate || item?.startDate || null;
  provider.endDate = provider.endDate || item?.endDate || null;

  return {
    id: item?.id ?? item?._id,
    title: item?.title ?? item?.eventTitle ?? item?.name ?? "Untitled Event",
    price: item?.price ?? item?.startingPrice ?? "$0",
    description: item?.description ?? item?.shortDescription ?? "",
    location,
    category: item?.category?.name ?? item?.categoryName ?? item?.category ?? "",
    subCategory: item?.subCategory?.name ?? item?.subCategoryName ?? item?.subCategory ?? "",
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
    provider,
  };
};

export const fetchEventsAPI = async (params = {}) => {
  const normalizedCategoryId = params.categoryId ?? params.category ?? params.eventCategoryId;
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
    eventCategoryId: normalizedCategoryId,
    countryId: normalizedCountryId,
    country: normalizedCountryId,
    regionId: normalizedRegionId,
    region: normalizedRegionId,
  };

  const response = await apiClient.get("/api/events", { params: requestParams });

  return {
    items: normalizeEvents(response.data),
    pagination: normalizePagination(response.data, params.page, params.limit),
  };
};

export const fetchMyEventsAPI = async (params = {}) => {
  const response = await apiClient.get("/api/events/me", { params });

  return {
    items: normalizeEvents(response.data),
    pagination: normalizePagination(response.data, params.page, params.limit),
  };
};

export const updateMyEventAPI = async (eventId, payload) => {
  const response = await apiClient.put(`/api/events/me/${eventId}`, payload);
  const source = extractPayload(response.data);

  return {
    item: normalizeEventItem(source),
    raw: response.data,
  };
};

export const deleteMyEventAPI = async (eventId) => {
  const response = await apiClient.delete(`/api/events/me/${eventId}`);

  return {
    eventId: String(eventId),
    raw: response.data,
  };
};

export const fetchEventCategoriesAPI = async () => {
  const response = await apiClient.get("/api/categories/event");
  const list = normalizeList(response.data);
  return list.map(normalizeEventCategory).filter((item) => item.id && item.name);
};

export const fetchEventByIdAPI = async (eventId) => {
  const response = await apiClient.get(`/api/events/${eventId}`);
  return normalizeEventDetail(response.data);
};

export const reportEventSpamAPI = async (eventId) => {
  const response = await apiClient.post(`/api/events/${eventId}/report-spam`);
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
  return source?.id ?? source?._id ?? source?.eventId;
};

export const createEventAPI = async (formData) => {
  const response = await apiClient.post("/api/events", formData);
  const eventId = extractIdFromPayload(response.data);

  return {
    eventId: eventId ? String(eventId) : "",
    raw: response.data,
  };
};

export const fetchEventPricingPlansEligibilityAPI = async () => {
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

export const purchaseEventAPI = async (eventId, payload) => {
  const normalizedEventId = String(eventId || "").trim();
  const endpointCandidates = [
    `/api/events/${normalizedEventId}/purchase`,
    `/api/event/${normalizedEventId}/purchase`,
  ];

  let response;
  let lastError = null;

  for (const endpoint of endpointCandidates) {
    try {
      response = await apiClient.post(endpoint, payload);
      break;
    } catch (error) {
      if (error?.response?.status === 404) {
        lastError = error;
        continue;
      }

      throw error;
    }
  }

  if (!response) {
    throw lastError;
  }

  const source = response?.data?.data || response?.data?.result || response?.data;

  return {
    checkoutUrl: source?.checkoutUrl || source?.url || source?.checkoutSessionUrl || source?.sessionUrl || "",
    checkoutSessionId: source?.checkoutSessionId || source?.sessionId || "",
    selectedPlanId: source?.selectedPlan?.id || source?.planId || source?.pricingPlanId || "",
    raw: response?.data,
  };
};

export const confirmEventPurchaseAPI = async (eventId, payload) => {
  const normalizedEventId = String(eventId || "").trim();
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
    `/api/events/${normalizedEventId}/purchase/confirm`,
    `/api/event/${normalizedEventId}/purchase/confirm`,
    `/api/events/purchase/confirm`,
    `/api/event/purchase/confirm`,
    `/api/events/${normalizedEventId}/confirm-purchase`,
    `/api/event/${normalizedEventId}/confirm-purchase`,
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

export const renewEventAPI = async (eventId, payload) => {
  const normalizedEventId = String(eventId || "").trim();

  const endpointCandidates = [
    `/api/events/${normalizedEventId}/renew`,
    `/api/event/${normalizedEventId}/renew`,
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

export const confirmEventRenewAPI = async (eventId, payload) => {
  const normalizedEventId = String(eventId || "").trim();
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
    `/api/events/${normalizedEventId}/renew/confirm`,
    `/api/event/${normalizedEventId}/renew/confirm`,
    `/api/events/renew/confirm`,
    `/api/event/renew/confirm`,
    `/api/events/${normalizedEventId}/confirm-renew`,
    `/api/event/${normalizedEventId}/confirm-renew`,
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
