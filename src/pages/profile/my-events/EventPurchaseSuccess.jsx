import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmEventRenew,
  confirmEventPurchase,
  selectEventRenewConfirmError,
  selectEventRenewConfirmLoading,
  selectEventPurchaseConfirmError,
  selectEventPurchaseConfirmLoading,
} from "../../../features/events/eventsSlice";

export default function EventPurchaseSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const purchaseConfirmLoading = useSelector(selectEventPurchaseConfirmLoading);
  const purchaseConfirmError = useSelector(selectEventPurchaseConfirmError);
  const renewConfirmLoading = useSelector(selectEventRenewConfirmLoading);
  const renewConfirmError = useSelector(selectEventRenewConfirmError);
  const hasConfirmedRef = useRef(false);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [checkoutSessionId, setCheckoutSessionId] = useState("");
  const [hasConfirmedSuccess, setHasConfirmedSuccess] = useState(false);

  const isValidCheckoutSessionId = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return false;
    if (raw.includes("CHECKOUT_SESSION_ID") || raw.includes("{") || raw.includes("}")) return false;
    return raw.startsWith("cs_");
  };

  const eventId = searchParams.get("eventId") || "";
  const initialPlanId = searchParams.get("planId") || searchParams.get("pricingPlanId") || "";
  const flow = (searchParams.get("flow") || "purchase").toLowerCase();
  const isRenewFlow = flow === "renew";
  const initialCheckoutSessionId =
    searchParams.get("session_id") ||
    searchParams.get("checkoutSessionId") ||
    searchParams.get("sessionId") ||
    "";

  const savedContextRaw = sessionStorage.getItem("eventPaymentConfirmContext");
  let savedContext = null;

  try {
    savedContext = savedContextRaw ? JSON.parse(savedContextRaw) : null;
  } catch {
    savedContext = null;
  }

  const sameEventContext = String(savedContext?.eventId || "") === String(eventId || "");
  const resolvedPlanId = initialPlanId || (sameEventContext ? String(savedContext?.planId || "") : "");
  const hasUsableInitialSessionId = isValidCheckoutSessionId(initialCheckoutSessionId);
  const resolvedCheckoutSessionId =
    (hasUsableInitialSessionId ? initialCheckoutSessionId : "") ||
    (sameEventContext ? String(savedContext?.checkoutSessionId || "") : "");

  const missingParams = !hasConfirmedSuccess && (!eventId || !resolvedPlanId || !resolvedCheckoutSessionId);
  const callbackLoading = isRenewFlow ? renewConfirmLoading : purchaseConfirmLoading;
  const callbackError = isRenewFlow ? renewConfirmError : purchaseConfirmError;

  useEffect(() => {
    setSelectedPlanId(resolvedPlanId);
    setCheckoutSessionId(resolvedCheckoutSessionId);
  }, [resolvedCheckoutSessionId, resolvedPlanId]);

  useEffect(() => {
    if (missingParams || hasConfirmedRef.current || !selectedPlanId || !checkoutSessionId) return;

    hasConfirmedRef.current = true;
    const confirmThunk = isRenewFlow ? confirmEventRenew : confirmEventPurchase;

    dispatch(
      confirmThunk({
        eventId,
        payload: {
          planId: selectedPlanId,
          checkoutSessionId,
        },
      }),
    )
      .unwrap()
      .then((response) => {
        if (response?.success) {
          setHasConfirmedSuccess(true);
          setSelectedPlanId("");
          setCheckoutSessionId("");
          sessionStorage.removeItem("eventPaymentConfirmContext");
        }
      })
      .catch(() => {
        // Error UI is rendered from redux state.
      });
  }, [checkoutSessionId, dispatch, eventId, isRenewFlow, missingParams, selectedPlanId]);

  if (missingParams) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center px-4">
        <div className="text-center max-w-lg w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Invalid Payment Callback</h1>
          <p className="text-gray-600 mb-6">Missing eventId, planId or checkoutSessionId in callback URL.</p>
          <button
            onClick={() => navigate("/profile/my-events")}
            className="px-6 py-2.5 rounded bg-[#E97C35] text-white font-semibold"
          >
            Go To Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center px-4">
      <div className="text-center max-w-lg w-full">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#d8f5ea]">
          <CheckCircle2 size={34} className="text-[#22b581]" />
        </div>
        <h1 className="text-5xl font-bold text-black mb-4">Payment Successful</h1>
        <p className="text-2xl text-gray-600 leading-relaxed mb-8">
          {isRenewFlow
            ? "Your renewal payment has been successfully processed. Your listing renewal is now submitted for admin review."
            : "Your payment has been successfully processed. Your event listing has been submitted and will appear on the platform once it is approved."}
        </p>

        {callbackLoading && (
          <p className="text-sm text-[#6b7280] mb-4">Finalizing your purchase confirmation...</p>
        )}

        {!callbackLoading && callbackError && (
          <p className="text-sm text-red-600 mb-4">{callbackError}</p>
        )}

        <button
          onClick={() => navigate("/profile/my-events")}
          className="inline-flex items-center justify-center px-8 py-3 rounded bg-[#E97C35] text-white font-semibold hover:bg-[#d06b2f] transition-colors"
        >
          View Events
        </button>
      </div>
    </div>
  );
}
