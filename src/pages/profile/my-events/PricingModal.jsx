import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  clearEventPricingState,
  fetchEventPricingPlansEligibility,
  purchaseEvent,
  renewEvent,
  selectEventPricingEligibility,
  selectEventPricingPlans,
  selectEventPricingPlansError,
  selectEventPricingPlansLoading,
  selectEventPurchaseError,
  selectEventPurchaseLoading,
  selectEventRenewError,
  selectEventRenewLoading,
} from "../../../features/events/eventsSlice";

export default function PricingModal({ isOpen, onClose, eventId, actionType = "purchase" }) {
  const dispatch = useDispatch();
  const plans = useSelector(selectEventPricingPlans);
  const pricingEligibility = useSelector(selectEventPricingEligibility);
  const pricingLoading = useSelector(selectEventPricingPlansLoading);
  const pricingError = useSelector(selectEventPricingPlansError);
  const purchaseLoading = useSelector(selectEventPurchaseLoading);
  const purchaseError = useSelector(selectEventPurchaseError);
  const renewLoading = useSelector(selectEventRenewLoading);
  const renewError = useSelector(selectEventRenewError);
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

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    dispatch(fetchEventPricingPlansEligibility());
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
      dispatch(clearEventPricingState());
      setSelected("");
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (!plans.length) {
      setSelected("");
      return;
    }

    if (lockToLowestPlan && lowestPlanId) {
      setSelected(lowestPlanId);
      return;
    }

    const introductory = plans.find((plan) => plan.isIntroductory);
    setSelected(introductory?.id || plans[0]?.id || "");
  }, [lockToLowestPlan, lowestPlanId, plans]);

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
    if (!eventId) {
      toast.error(`Event ID not found for ${isRenewFlow ? "renew" : "purchase"}`);
      return;
    }

    if (!selected) {
      toast.error("Please select a pricing plan");
      return;
    }

    const successUrl = `${window.location.origin}/profile/my-events/purchase-success?eventId=${encodeURIComponent(
      eventId
    )}&planId=${encodeURIComponent(selected)}&flow=${encodeURIComponent(actionType)}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${window.location.origin}/profile/my-events?${isRenewFlow ? "renew" : "purchase"}=cancelled`;

    try {
      const thunk = isRenewFlow ? renewEvent : purchaseEvent;
      const result = await dispatch(
        thunk({
          eventId,
          payload: {
            planId: selected,
            successUrl,
            cancelUrl,
          },
        })
      ).unwrap();

      if (!result?.checkoutUrl) {
        toast.error(`Checkout URL not found from ${isRenewFlow ? "renew" : "purchase"} API`);
        return;
      }

      const confirmedPlanId = result?.selectedPlanId || selected;
      const confirmedCheckoutSessionId = result?.checkoutSessionId || "";

      sessionStorage.setItem(
        "eventPaymentConfirmContext",
        JSON.stringify({
          eventId,
          planId: confirmedPlanId,
          checkoutSessionId: confirmedCheckoutSessionId,
          flow: actionType,
          createdAt: Date.now(),
        })
      );

      window.location.assign(result.checkoutUrl);
    } catch {
      // Error toast is handled from redux error state.
    }
  };

  if (!isOpen) return null;

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

          {!pricingLoading && plans.length === 0 && (
            <p className="text-sm text-gray-600">No active pricing plans found.</p>
          )}

          {plans.map((plan, index) => {
            const isSelected = selected === plan.id;
            const isOptionLocked = lockToLowestPlan && String(plan.id) !== String(lowestPlanId);
            return (
              <label
                key={`${plan.id}-${plan.duration}-${index}`}
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

        <div className="px-6 pb-6">
          <button
            disabled={submitLoading || pricingLoading || !selected}
            className="w-full py-3 rounded-xl bg-[#E97C35] active:bg-[#c45a0f] text-white font-semibold text-sm tracking-wide transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#E97C35] focus:ring-offset-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handlePurchase}
          >
            {submitLoading ? "Redirecting..." : isRenewFlow ? "Renew Now" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
