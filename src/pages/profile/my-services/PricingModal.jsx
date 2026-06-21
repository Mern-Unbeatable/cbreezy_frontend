import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  clearPricingState,
  fetchPricingPlansEligibility,
  purchaseService,
  renewService,
  selectPricingEligibility,
  selectPricingPlans,
  selectPricingPlansError,
  selectPricingPlansLoading,
  selectServicePurchaseError,
  selectServicePurchaseLoading,
  selectServiceRenewError,
  selectServiceRenewLoading,
} from "../../../features/services/servicesSlice";

export default function PricingModal({
  isOpen,
  onClose,
  serviceId,
  actionType = "purchase",
  forcePlanId = "",
  lockSelection = false,
  hideFreePlans = false,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const plans = useSelector(selectPricingPlans);
  const pricingEligibility = useSelector(selectPricingEligibility);
  const pricingLoading = useSelector(selectPricingPlansLoading);
  const pricingError = useSelector(selectPricingPlansError);
  const purchaseLoading = useSelector(selectServicePurchaseLoading);
  const purchaseError = useSelector(selectServicePurchaseError);
  const renewLoading = useSelector(selectServiceRenewLoading);
  const renewError = useSelector(selectServiceRenewError);
  const [selected, setSelected] = useState("");
  const onCloseRef = useRef(onClose);
  const isRenewFlow = actionType === "renew";
  const submitLoading = isRenewFlow ? renewLoading : purchaseLoading;
  const submitError = isRenewFlow ? renewError : purchaseError;

  const pickLowestPricePlanId = (list) => {
    if (!Array.isArray(list) || list.length === 0) return "";

    const sorted = [...list].sort((a, b) => {
      const priceA = Number(a?.price ?? 0);
      const priceB = Number(b?.price ?? 0);

      if (priceA !== priceB) return priceA - priceB;
      return Number(a?.duration ?? 0) - Number(b?.duration ?? 0);
    });

    return sorted[0]?.id || "";
  };

  const lockToLowestPlan = Boolean(pricingEligibility?.isUnderFirstThreeMonths);
  const lowestPlanId = lockToLowestPlan ? pickLowestPricePlanId(plans) : "";
  const forcedPlanId = String(forcePlanId || "");

  const isEligibleForFree = Boolean(
    pricingEligibility?.isEligibleForFree || pricingEligibility?.userLifecycle?.isEligibleForFree
  );
  const isEligibleForDiscount = Boolean(
    pricingEligibility?.isEligibleForDiscount || pricingEligibility?.userLifecycle?.isEligibleForDiscount
  );

  const getVisiblePlans = (list) => {
    return list.filter((p) => {
      const isFree = String(p?.tier || "").toLowerCase() === "free" || Number(p?.price || 0) === 0;
      const isPromo = String(p?.tier || "").toLowerCase() === "promo" || p?.isIntroductory || String(p?.title || "").toLowerCase().includes("intro");

      if (hideFreePlans && isFree) return false;
      if (!isEligibleForFree && isFree) return false;
      if (!isEligibleForDiscount && isPromo) return false;
      return true;
    });
  };

  const findIntroPlanId = (list) => {
    const introPlan =
      list.find((p) => p.isIntroductory) ||
      list.find((p) => String(p?.title || "").toLowerCase().includes("intro"));
    return String(introPlan?.id || pricingEligibility?.introductoryPlanId || lowestPlanId || "");
  };

  const findStandardPlanId = (list) => {
    const standardPlan =
      list.find((p) => String(p?.title || "").toLowerCase().includes("standard")) ||
      list.find((p) => !p.isIntroductory && Number(p?.price || 0) > 0);
    return String(standardPlan?.id || "");
  };

  const resolveEligibilityLockedPlanId = (list) => {
    if (!list.length) return "";

    if (lockToLowestPlan && lowestPlanId) {
      return lowestPlanId;
    }

    if (!isEligibleForFree && isEligibleForDiscount) {
      return findIntroPlanId(list);
    }

    if (!isEligibleForFree && !isEligibleForDiscount) {
      return findStandardPlanId(list);
    }

    return "";
  };

  const visiblePlans = getVisiblePlans(plans);
  const eligibilityLockedPlanId = resolveEligibilityLockedPlanId(visiblePlans);
  const effectiveForcedPlanId = forcedPlanId || eligibilityLockedPlanId;
  const effectiveLockSelection = lockSelection || Boolean(eligibilityLockedPlanId);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    dispatch(fetchPricingPlansEligibility());
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onCloseRef.current?.();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(clearPricingState());
      setSelected("");
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (!plans.length) {
      setSelected("");
      return;
    }

    const nextVisiblePlans = getVisiblePlans(plans);
    const nextEligibilityLockedPlanId = resolveEligibilityLockedPlanId(nextVisiblePlans);
    const nextEffectiveForcedPlanId = forcedPlanId || nextEligibilityLockedPlanId;
    const nextEffectiveLockSelection = lockSelection || Boolean(nextEligibilityLockedPlanId);

    if (nextEffectiveForcedPlanId) {
      const exists = nextVisiblePlans.find((p) => String(p.id) === String(nextEffectiveForcedPlanId));
      if (exists) {
        setSelected(String(nextEffectiveForcedPlanId));
        return;
      }
    }

    if (nextEffectiveLockSelection && nextEffectiveForcedPlanId) {
      setSelected(String(nextEffectiveForcedPlanId));
      return;
    }

    if (lockToLowestPlan && lowestPlanId) {
      setSelected(lowestPlanId);
      return;
    }

    const introductory = nextVisiblePlans.find((plan) => plan.isIntroductory);
    setSelected(introductory?.id || nextVisiblePlans[0]?.id || "");
  }, [
    lockToLowestPlan,
    lowestPlanId,
    plans,
    forcedPlanId,
    lockSelection,
    hideFreePlans,
    pricingEligibility,
  ]);

  useEffect(() => {
    if (pricingError) {
      toast.error(pricingError);
    }
  }, [pricingError]);

  useEffect(() => {
    if (submitError) {
      toast.error(submitError);
    }
  }, [submitError]);

  const handlePurchase = async () => {
    if (!serviceId) {
      toast.error(`Service ID not found for ${isRenewFlow ? "renew" : "purchase"}`);
      return null;
    }

    if (!selected) {
      toast.error("Please select a pricing plan");
      return null;
    }

    const successUrl = `${window.location.origin}/profile/my-services/purchase-success?serviceId=${encodeURIComponent(
      serviceId
    )}&planId=${encodeURIComponent(selected)}&flow=${encodeURIComponent(actionType)}`;
    const cancelUrl = `${window.location.origin}/profile/my-services?${isRenewFlow ? "renew" : "purchase"}=cancelled`;

    try {
      const thunk = isRenewFlow ? renewService : purchaseService;
      const result = await dispatch(
        thunk({
          serviceId,
          payload: {
            planId: selected,
            successUrl,
            cancelUrl,
          },
        })
      ).unwrap();

      const confirmedPlanId = result?.selectedPlanId || selected;
      const confirmedCheckoutSessionId = result?.checkoutSessionId || "";

      sessionStorage.setItem(
        "servicePaymentConfirmContext",
        JSON.stringify({
          serviceId,
          planId: confirmedPlanId,
          checkoutSessionId: confirmedCheckoutSessionId,
          flow: actionType,
          createdAt: Date.now(),
        })
      );

      if (result?.checkoutSessionId) {
        return result.checkoutSessionId;
      }

      if (!result?.checkoutUrl) {
        const redirectUrl = `/profile/my-services/purchase-success?serviceId=${encodeURIComponent(
          serviceId
        )}&planId=${encodeURIComponent(selected)}&flow=${encodeURIComponent(actionType)}&session_id=${confirmedCheckoutSessionId}`;
        navigate(redirectUrl);
        return null;
      }

      return null;
    } catch {
      return null;
    }
  };

  if (!isOpen) return null;

  const displayPlans = visiblePlans;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-modal-title"
    >
      <div
        className="relative w-full max-w-sm mx-4 bg-[#FDF2EB] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-gray-900"
          aria-label="Close pricing modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="px-6 pt-6 pb-4">
          <h2
            id="pricing-modal-title"
            className="text-2xl font-semibold text-[#0C0C0C] tracking-tight"
          >
            Pricing Plan
          </h2>
        </div>

        <div className="px-6 py-5 space-y-3">
          {pricingLoading && <p className="text-sm text-gray-600">Loading pricing plans...</p>}

          {!pricingLoading && displayPlans.length === 0 && (
            <p className="text-sm text-gray-600">No active pricing plans found.</p>
          )}

          {displayPlans.map((plan, index) => {
            const isSelected = selected === plan.id;
            const isOptionLocked =
              (lockToLowestPlan && String(plan.id) !== String(lowestPlanId)) ||
              (effectiveLockSelection &&
                Boolean(effectiveForcedPlanId) &&
                String(plan.id) !== String(effectiveForcedPlanId));
            return (
              <label
                key={`${plan.id}-${plan.duration}-${index}`}
                onClick={() => {
                  if (isOptionLocked) return;
                  setSelected(plan.id);
                }}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-150 ${
                  isSelected
                    ? "border-[#E97C35] bg-[#F8D6C0]"
                    : "border-[#E97C35] bg-[#FDF2EB]"
                } ${isOptionLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span className="mt-0.5 shrink-0 relative">
                  <input
                    type="radio"
                    name="plan"
                    value={plan.id}
                    checked={isSelected}
                    onChange={() => {
                      if (isOptionLocked) return;
                      setSelected(plan.id);
                    }}
                    disabled={isOptionLocked}
                    className="sr-only"
                  />
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${
                      isSelected
                        ? "border-[#E97C35] bg-[#F8D6C0]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-3 h-3 rounded-full bg-[#E97C35] border-2 border-[#E97C35] block" />
                    )}
                  </span>
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#373737] font-medium mb-0.5 leading-tight">{plan.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="inline-block px-3 py-1 rounded-lg text-[#004C48] text-3xl font-bold">
                      ${Number(plan.price || 0).toFixed(2)}
                    </span>
                    <span className="text-3xl font-bold text-[#004C48]">/ {plan.duration} days</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {lockToLowestPlan && (
          <div className="px-6 pb-2">
            <p className="text-xs text-[#6b7280]">
              Introductory eligibility is active. The lowest-price plan is selected automatically.
            </p>
          </div>
        )}

        <div className="px-6 pb-6 min-h-[48px]">
          {(!pricingEligibility?.paypalClientId || Number(displayPlans.find(p => String(p.id) === String(selected))?.price || 0) === 0) ? (
            <button
              disabled={submitLoading || pricingLoading || !selected}
              className="w-full py-3 rounded-xl bg-[#E97C35] active:bg-[#c45a0f] text-white font-semibold text-sm tracking-wide transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#E97C35] focus:ring-offset-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={handlePurchase}
            >
              {submitLoading ? "Processing..." : isRenewFlow ? "Renew Now" : "Activate"}
            </button>
          ) : (
            <PayPalScriptProvider options={{ "client-id": pricingEligibility.paypalClientId, currency: "USD" }}>
              <PayPalButtons
                style={{ layout: "vertical", shape: "rect", color: "gold" }}
                disabled={submitLoading || pricingLoading || !selected}
                createOrder={async () => {
                  return await handlePurchase();
                }}
                onApprove={(data, actions) => {
                  const successUrl = `/profile/my-services/purchase-success?serviceId=${encodeURIComponent(
                    serviceId
                  )}&planId=${encodeURIComponent(selected)}&flow=${encodeURIComponent(actionType)}&session_id=${data.orderID}`;
                  navigate(successUrl);
                }}
              />
            </PayPalScriptProvider>
          )}
        </div>
      </div>
    </div>
  );
}
