// AdMob ad-unit configuration.
//
// Defaults are Google's OFFICIAL TEST ad units — they always serve test ads
// and are safe to ship during development. Before the Play Store release,
// set the real ad-unit ids via env (VITE_ADMOB_BANNER_ID /
// VITE_ADMOB_INTERSTITIAL_ID) and the real App ID in
// android/app/src/main/res/values/strings.xml.
const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";
const TEST_INTERSTITIAL_ID = "ca-app-pub-3940256099942544/1033173712";

export const ADS_CONFIG = {
  bannerAdId: import.meta.env.VITE_ADMOB_BANNER_ID?.trim() || TEST_BANNER_ID,
  interstitialAdId: import.meta.env.VITE_ADMOB_INTERSTITIAL_ID?.trim() || TEST_INTERSTITIAL_ID,
  /** True while no real ad unit is configured — keeps AdMob in test mode. */
  isTesting: !import.meta.env.VITE_ADMOB_INTERSTITIAL_ID?.trim(),
  /** Minimum completed lessons between two interstitials. */
  interstitialEveryNLessons: 4,
  /** Minimum time between two interstitials, in minutes. */
  interstitialMinIntervalMinutes: 5,
} as const;
