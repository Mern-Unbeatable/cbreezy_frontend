export const getListingStatusKey = (item) => String(item?.status || "").trim().toLowerCase();

export const canApproveListing = (statusKey) => statusKey === "pending" || statusKey === "suspended";

export const canSuspendListing = (statusKey) => statusKey === "pending" || statusKey === "approved";

export const canDeleteListing = (statusKey, isAdmin) =>
  isAdmin && (statusKey === "approved" || statusKey === "suspended");
