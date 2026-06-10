// AdMob integration for the Android (Capacitor) build.
//
// Every function is a safe no-op on the web build: the plugin is only
// imported after a native-platform check, so neither the Vercel deploy nor
// the bundle size are affected. The interstitial is frequency-capped so the
// learning flow is never interrupted twice in a row.

import { Capacitor } from "@capacitor/core";
import { ADS_CONFIG } from "@/config/ads";
import { readJson, writeJson, STORAGE_KEYS } from "@/lib/storage";

const AD_STATE_KEY = STORAGE_KEYS.ads;

interface AdState {
  lessonsSinceLastAd: number;
  lastAdShownAt: number; // epoch ms, 0 = never
}

const DEFAULT_AD_STATE: AdState = { lessonsSinceLastAd: 0, lastAdShownAt: 0 };

function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

let initialized = false;
let interstitialReady = false;

/**
 * Pure frequency-cap rule (exported for tests): show only after N completed
 * lessons AND a minimum quiet interval since the previous ad.
 */
export function isInterstitialDue(state: AdState, now: number): boolean {
  const enoughLessons = state.lessonsSinceLastAd >= ADS_CONFIG.interstitialEveryNLessons;
  const quietMs = ADS_CONFIG.interstitialMinIntervalMinutes * 60_000;
  const enoughTime = state.lastAdShownAt === 0 || now - state.lastAdShownAt >= quietMs;
  return enoughLessons && enoughTime;
}

/**
 * Initializes the AdMob SDK and runs the UMP consent flow (GDPR/LGPD).
 * Call once at app start; resolves quietly on web or on any failure —
 * ads must never break the app.
 */
export async function initAds(): Promise<void> {
  if (!isNative() || initialized) return;
  try {
    const { AdMob, AdmobConsentStatus } = await import("@capacitor-community/admob");

    await AdMob.initialize();

    const consentInfo = await AdMob.requestConsentInfo();
    if (consentInfo.isConsentFormAvailable && consentInfo.status === AdmobConsentStatus.REQUIRED) {
      await AdMob.showConsentForm();
    }

    initialized = true;
    void prepareInterstitial();
  } catch {
    /* sem rede, consentimento negado ou SDK indisponível — segue sem ads */
  }
}

async function prepareInterstitial(): Promise<void> {
  if (!isNative() || !initialized || interstitialReady) return;
  try {
    const { AdMob } = await import("@capacitor-community/admob");
    await AdMob.prepareInterstitial({
      adId: ADS_CONFIG.interstitialAdId,
      isTesting: ADS_CONFIG.isTesting,
    });
    interstitialReady = true;
  } catch {
    interstitialReady = false;
  }
}

/**
 * Records a completed lesson and shows the interstitial when the frequency
 * cap allows it. Fire-and-forget: resolves immediately on web.
 */
export async function recordLessonCompletedAndMaybeShowAd(): Promise<void> {
  if (!isNative()) return;

  const state = { ...DEFAULT_AD_STATE, ...readJson<Partial<AdState>>(AD_STATE_KEY, {}) };
  state.lessonsSinceLastAd += 1;

  if (!initialized || !isInterstitialDue(state, Date.now())) {
    writeJson(AD_STATE_KEY, state);
    void prepareInterstitial();
    return;
  }

  try {
    if (!interstitialReady) await prepareInterstitial();
    if (!interstitialReady) {
      writeJson(AD_STATE_KEY, state);
      return;
    }

    const { AdMob } = await import("@capacitor-community/admob");
    await AdMob.showInterstitial();
    interstitialReady = false;

    writeJson(AD_STATE_KEY, { lessonsSinceLastAd: 0, lastAdShownAt: Date.now() });
    void prepareInterstitial();
  } catch {
    writeJson(AD_STATE_KEY, state);
  }
}

/**
 * Optional bottom banner (not enabled anywhere yet — banners overlap the
 * WebView and need per-screen layout care; enable deliberately, screen by
 * screen, after testing on a device).
 */
export async function showBanner(): Promise<void> {
  if (!isNative() || !initialized) return;
  try {
    const { AdMob, BannerAdSize, BannerAdPosition } = await import("@capacitor-community/admob");
    await AdMob.showBanner({
      adId: ADS_CONFIG.bannerAdId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: ADS_CONFIG.isTesting,
    });
  } catch {
    /* banner é opcional */
  }
}

export async function hideBanner(): Promise<void> {
  if (!isNative() || !initialized) return;
  try {
    const { AdMob } = await import("@capacitor-community/admob");
    await AdMob.removeBanner();
  } catch {
    /* ignore */
  }
}
