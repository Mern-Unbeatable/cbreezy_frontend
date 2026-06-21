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

const toImageArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item : item?.url || item?.image || item?.src || ""))
    .filter(Boolean);
};

const pickPrimaryImage = (item) => {
  const direct =
    item?.mainImage ?? item?.eventImage ?? item?.image ?? item?.imageUrl ?? item?.thumbnail;
  if (typeof direct === "string" && direct.trim()) return direct;

  const gallery = [
    ...(Array.isArray(item?.eventImages) ? item.eventImages : []),
    ...(Array.isArray(item?.serviceImages) ? item.serviceImages : []),
    ...(Array.isArray(item?.images) ? item.images : []),
    ...(Array.isArray(item?.gallery) ? item.gallery : []),
    ...(Array.isArray(item?.eventGallery) ? item.eventGallery : []),
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

const normalizeEventItem = (item) => {
  const eventImages = toImageArray(
    item?.eventImages || item?.serviceImages || item?.thumbnails || item?.images || []
  );
  const galleryImages = toImageArray(item?.eventGallery || item?.gallery || item?.galleryImages || []);
  const image = pickPrimaryImage(item) || eventImages[0] || "";

  return {
    id: item?.id ?? item?._id,
    title: item?.title ?? item?.eventTitle ?? item?.name ?? "Untitled Event",
    description: item?.description ?? item?.shortDescription ?? "",
    price: item?.price ?? item?.startingPrice ?? "$0",
    image,
    mainImage: item?.mainImage || item?.eventImage || image,
    eventImages: eventImages.length > 0 ? eventImages : image ? [image] : [],
    galleryImages,
    categoryId: item?.categoryId ?? item?.category?._id ?? item?.category?.id,
    category: item?.category?.name ?? item?.categoryName ?? item?.category ?? "",
    countryId: item?.countryId ?? item?.country?.id ?? item?.country?._id ?? "",
    regionId: item?.regionId ?? item?.region?.id ?? item?.region?._id ?? "",
    cityId: item?.cityId ?? item?.city?.id ?? item?.city?._id ?? "",
    address: item?.address ?? "",
    location: item?.location || item?.address || "",
    contactEmail: item?.contactEmail ?? item?.email ?? "",
    contactPhone: item?.contactPhone ?? item?.phone ?? "",
    facebookUrl: item?.facebookUrl ?? item?.facebook ?? "",
    instagramUrl: item?.instagramUrl ?? item?.instagram ?? "",
    startDate: item?.startDate ?? item?.eventStart ?? null,
    endDate: item?.endDate ?? item?.eventEnd ?? null,
    eventStart: item?.eventStart ?? item?.startDate ?? null,
    eventEnd: item?.eventEnd ?? item?.endDate ?? null,
    status: normalizeEventStatus(item?.status ?? item?.eventStatus ?? item?.listingStatus ?? item?.approvalStatus),
    showRenew: Boolean(item?.showRenew ?? item?.isRenewable),
    payments: Array.isArray(item?.payments) ? item.payments : [],
  };
};

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

const normalizeEventDetail = (payload) => {
  const item = payload?.data || payload?.result || payload;
  const eventImages = toImageArray(
    item?.eventImages || item?.thumbnails || item?.images || []
  );
  const galleryImages = toImageArray(item?.gallery || item?.eventGallery || item?.galleryImages || []);
  const image =
    eventImages[0] ||
    item?.image ||
    item?.imageUrl ||
    item?.thumbnail ||
    "";

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
    thumbnails: eventImages.length > 0 ? eventImages : image ? [image] : [],
    galleryImages,
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

const appendIfPresent = (formData, key, value) => {
  if (value === undefined || value === null) return;
  if (typeof value === "string" && !value.trim()) return;
  formData.append(key, value);
};

export const fetchMyEventForEditAPI = async ({ categoryId, eventId }) => {
  const response = await apiClient.get(`/api/categories/event/${categoryId}`);
  const payload = extractPayload(response.data);
  const events = Array.isArray(payload?.events) ? payload.events : [];
  const rawEvent = events.find((item) => String(item?.id) === String(eventId));

  if (!rawEvent) {
    throw new Error("Event not found for edit");
  }

  return normalizeEventItem(rawEvent);
};

export const updateMyEventAPI = async (eventId, payload) => {
  const formData = payload instanceof FormData ? payload : new FormData();

  if (!(payload instanceof FormData)) {
    appendIfPresent(formData, "title", payload?.title);
    appendIfPresent(formData, "description", payload?.description);
    appendIfPresent(formData, "price", payload?.price);
    appendIfPresent(formData, "categoryId", payload?.categoryId);
    appendIfPresent(formData, "countryId", payload?.countryId);
    appendIfPresent(formData, "regionId", payload?.regionId);
    appendIfPresent(formData, "cityId", payload?.cityId);
    appendIfPresent(formData, "location", payload?.location);
    appendIfPresent(formData, "address", payload?.address);
    appendIfPresent(formData, "eventStart", payload?.eventStart);
    appendIfPresent(formData, "eventEnd", payload?.eventEnd);
    appendIfPresent(formData, "email", payload?.email);
    appendIfPresent(formData, "contactEmail", payload?.contactEmail);
    appendIfPresent(formData, "phone", payload?.phone);
    appendIfPresent(formData, "contactPhone", payload?.contactPhone);
    appendIfPresent(formData, "facebook", payload?.facebook);
    appendIfPresent(formData, "facebookUrl", payload?.facebookUrl);
    appendIfPresent(formData, "instagram", payload?.instagram);
    appendIfPresent(formData, "instagramUrl", payload?.instagramUrl);
    appendIfPresent(formData, "mainImage", payload?.mainImage);

    if (Array.isArray(payload?.removedEventImages)) {
      payload.removedEventImages.forEach((url) => {
        if (url) formData.append("removedEventImages", url);
      });
    }

    if (Array.isArray(payload?.removedGalleryImages)) {
      payload.removedGalleryImages.forEach((url) => {
        if (url) formData.append("removedGalleryImages", url);
      });
    }

    if (Array.isArray(payload?.eventImages)) {
      payload.eventImages.forEach((url) => {
        if (url) formData.append("eventImages", url);
      });
    }
  }

  const response = await apiClient.put(`/api/events/me/${eventId}`, formData);
  const source = extractPayload(response.data);

  return {
    item: normalizeEventItem(source),
    raw: response.data,
  };
};

export const removeMyEventImageAPI = async (eventId, { imageUrl, imageType }) => {
  const response = await apiClient.delete(`/api/events/me/${eventId}/images`, {
    data: {
      imageUrl,
      ...(imageType ? { imageType } : {}),
    },
  });
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
  const userLifecycle = source?.userLifecycle || {};
  const isEligibleForFree = Boolean(userLifecycle?.isEligibleForFree);
  const isEligibleForDiscount = Boolean(userLifecycle?.isEligibleForDiscount);

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
    userLifecycle,
    isEligibleForFree,
    isEligibleForDiscount,
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
