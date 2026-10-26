declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

const MEASUREMENT_ID =
  ((import.meta as any).env.VITE_GA_MEASUREMENT_ID as string) || "";

let gaLoaderRegistered = false;
let gaScriptLoaded = false;

function ensureGtagStub() {
  window.dataLayer = window.dataLayer || [];

  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
}

function loadGAAfterInteraction() {
  if (!MEASUREMENT_ID) return;
  if (gaScriptLoaded) return;

  gaScriptLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag?.("js", new Date());
  window.gtag?.("config", MEASUREMENT_ID, {
    send_page_view: false,
  });

  window.removeEventListener("scroll", loadGAAfterInteraction);
  window.removeEventListener("click", loadGAAfterInteraction);
  window.removeEventListener("touchstart", loadGAAfterInteraction);
}

/**
 * Initializes GA4 in delayed mode.
 * This does NOT download gtag.js during initial page load.
 */
export function initGA() {
  if (!MEASUREMENT_ID) {
    console.warn("GA4 Measurement ID is missing. Analytics is running in placeholder mode.");
    return;
  }

  ensureGtagStub();

  if (gaLoaderRegistered) return;
  gaLoaderRegistered = true;

  window.addEventListener("scroll", loadGAAfterInteraction, {
    once: true,
    passive: true,
  });

  window.addEventListener("click", loadGAAfterInteraction, {
    once: true,
  });

  window.addEventListener("touchstart", loadGAAfterInteraction, {
    once: true,
    passive: true,
  });
}

/**
 * Tracks custom events to GA4.
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
  additionalParams?: Record<string, any>
) {
  if (window.gtag && MEASUREMENT_ID) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
      ...additionalParams,
    });
  } else {
    console.debug(`[GA4 Tracker] Event: ${action}`, {
      category,
      label,
      value,
      ...additionalParams,
    });
  }
}

/**
 * Tracks page views based on custom state navigation routing.
 */
export function trackPageView(viewName: string, title?: string) {
  if ((window as any).fbq) {
    (window as any).fbq("track", "PageView");
  }

  if (window.gtag && MEASUREMENT_ID) {
    window.gtag("config", MEASUREMENT_ID, {
      page_path: `/${viewName}`,
      page_title: title || viewName,
    });
  } else {
    console.debug(`[GA4 Track Handled]: /${viewName} ("${title || viewName}")`);
  }
}

export function trackAddToCart(
  productId: string,
  productName: string,
  price: number,
  quantity: number = 1
): void {
  if (typeof window !== "undefined" && window.gtag && MEASUREMENT_ID) {
    window.gtag("event", "add_to_cart", {
      currency: "INR",
      value: price * quantity,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price,
          quantity,
        },
      ],
    });
  }

  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "AddToCart", {
      content_ids: [productId],
      content_name: productName,
      content_type: "product",
      value: price * quantity,
      currency: "INR",
    });
  }
}

export function trackProductView(
  productId: string,
  productName: string,
  price: number
) {
  if ((window as any).fbq) {
    (window as any).fbq("track", "ViewContent", {
      content_ids: [productId],
      content_name: productName,
      content_type: "product",
      value: price,
      currency: "INR",
    });
  }

  trackEvent("view_item", "Ecommerce", productName, price, {
    items: [
      {
        item_id: productId,
        item_name: productName,
        price,
      },
    ],
  });
}

export function trackAmazonClick(productName: string, amazonUrl: string) {
  trackEvent("click_amazon", "Outbound Marketplace", productName, undefined, {
    destination_url: amazonUrl,
  });
}

export function trackWhatsAppClick(context: string) {
  trackEvent("click_whatsapp", "Customer Engagement", context);
}



// Track Begin Checkout event for GA4 Ecommerce Funnel
export function trackBeginCheckout(items: any[], totalValue: number): void {
  const gaItems = (items || []).map((item: any) => ({
    item_id: item.product?.id || item.productId || "PAW001",
    item_name: item.product?.name || item.productName || "Pawwcious Product",
    price: Number(item.product?.price || item.price || 0),
    quantity: Number(item.quantity || 1),
    item_variant: item.selectedSize || "Standard"
  }));

  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "InitiateCheckout", {
      value: Number(totalValue || 0),
      currency: "INR",
      num_items: gaItems.length,
    });
  }

  trackEvent("begin_checkout", "Ecommerce", "Checkout Initiated", Number(totalValue || 0), {
    currency: "INR",
    value: Number(totalValue || 0),
    items: gaItems,
  });
}

// Track Purchase event for GA4 Ecommerce Funnel
export function trackPurchase(orderData: {
  orderId: string;
  totalAmount: number;
  subtotal?: number;
  shippingFee?: number;
  gstAmount?: number;
  discount?: number;
  items: Array<{
    productId?: string;
    productName?: string;
    price: number;
    quantity: number;
    selectedSize?: string;
  }>;
}): void {
  const gaItems = (orderData.items || []).map((item) => ({
    item_id: item.productId || "PAW001",
    item_name: item.productName || "Pawwcious Product",
    price: Number(item.price || 0),
    quantity: Number(item.quantity || 1),
    item_variant: item.selectedSize || "Standard"
  }));

  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "Purchase", {
      value: Number(orderData.totalAmount || 0),
      currency: "INR",
      content_type: "product",
    });
  }

  trackEvent("purchase", "Ecommerce", orderData.orderId, Number(orderData.totalAmount || 0), {
    transaction_id: orderData.orderId,
    value: Number(orderData.totalAmount || 0),
    tax: Number(orderData.gstAmount || 0),
    shipping: Number(orderData.shippingFee || 0),
    currency: "INR",
    items: gaItems,
  });
}

// Track Contact form submission
export function trackContactSubmit(subject: string, name?: string): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "contact_submit", {
    subject: subject,
    user_name: name || "Anonymous"
  });
}

