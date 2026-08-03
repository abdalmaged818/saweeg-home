import { siteConfig } from "./config/site.ts";

export const analyticsEvents = [
  "menu_click",
  "store_click",
  "hungerstation_click",
  "keeta_click",
  "branch_map_click",
  "branch_menu_click",
  "whatsapp_click",
  "tiktok_click",
  "x_click",
  "language_switch"
] as const;

export type AnalyticsEvent = typeof analyticsEvents[number];

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = siteConfig.analytics.ga4MeasurementId.trim();
const supportedEvents = new Set<string>(analyticsEvents);

const sendToDataLayer = (...args: unknown[]): void => {
  window.dataLayer ??= [];
  window.dataLayer.push(args);
};

export const initAnalytics = (): void => {
  if (!measurementId) return;

  window.gtag = sendToDataLayer;
  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  if (document.querySelector("script[data-ga4-loader]")) return;
  const script = document.createElement("script");
  script.async = true;
  script.dataset.ga4Loader = "true";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
};

export const trackEvent = (name: AnalyticsEvent, parameters?: Record<string, string>): void => {
  if (!measurementId || !window.gtag) return;
  window.gtag("event", name, parameters ?? {});
};

export const bindAnalyticsEvents = (): void => {
  document.querySelectorAll<HTMLElement>("[data-analytics-event]").forEach((element) => {
    const eventName = element.dataset.analyticsEvent;
    if (!eventName || !supportedEvents.has(eventName)) return;

    element.addEventListener("click", () => {
      const label = element.dataset.analyticsLabel
        ?? element.dataset.localeSwitch
        ?? element.textContent?.trim();
      trackEvent(eventName as AnalyticsEvent, label ? { link_label: label } : undefined);
    });
  });
};
