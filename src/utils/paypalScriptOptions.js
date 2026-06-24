export const buildPayPalScriptOptions = (clientId, currency = "USD") => ({
  "client-id": clientId,
  currency,
  intent: "capture",
  components: "buttons",
});

export const PAYPAL_SDK_LOAD_ERROR =
  "PayPal could not load. The Client ID is invalid or not active in PayPal Developer Dashboard (Live app → Sidegurus).";
