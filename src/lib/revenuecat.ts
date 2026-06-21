// Bridge para o RevenueCat (assinatura via Google Play).
//
// HOJE é um stub SEGURO: enquanto não houver conta RevenueCat + o plugin
// `@revenuecat/purchases-capacitor` instalado + VITE_REVENUECAT_ANDROID_KEY,
// tudo resolve para "sem Pro" e nenhuma compra acontece. A interface já é a
// final, então o go-live é só preencher os TODOs abaixo (ver docs/MONETIZACAO.md).
//
// Como em ads.ts: web é sempre no-op (o plugin nativo só seria importado
// dinamicamente após o check de plataforma nativa).

import { Capacitor } from "@capacitor/core";
import { MONETIZATION } from "@/config/monetization";

/** True só quando dá para cobrar de verdade (app nativo + chave configurada). */
export function purchasesAvailable(): boolean {
  return Capacitor.isNativePlatform() && MONETIZATION.revenueCatAndroidKey.length > 0;
}

export async function initPurchases(): Promise<void> {
  if (!purchasesAvailable()) return;
  // TODO go-live:
  // const { Purchases } = await import(/* @vite-ignore */ "@revenuecat/purchases-capacitor");
  // await Purchases.configure({ apiKey: MONETIZATION.revenueCatAndroidKey });
}

/**
 * Estado atual do entitlement "pro" segundo a loja.
 * Retorna null quando NÃO dá para saber (web/sem billing) — o chamador mantém
 * o estado local. Retorna boolean quando a loja respondeu.
 */
export async function fetchProEntitlement(): Promise<boolean | null> {
  if (!purchasesAvailable()) return null;
  // TODO go-live:
  // const { Purchases } = await import(/* @vite-ignore */ "@revenuecat/purchases-capacitor");
  // const info = await Purchases.getCustomerInfo();
  // return Boolean(info.customerInfo.entitlements.active[MONETIZATION.entitlementId]);
  return null;
}

export async function purchaseProSubscription(): Promise<{ ok: boolean; reason?: string }> {
  if (!purchasesAvailable()) return { ok: false, reason: "indisponivel" };
  // TODO go-live:
  // const { Purchases } = await import(/* @vite-ignore */ "@revenuecat/purchases-capacitor");
  // const offerings = await Purchases.getOfferings();
  // const pkg = offerings.current?.availablePackages?.[0];
  // if (!pkg) return { ok: false, reason: "sem-oferta" };
  // const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
  // return { ok: Boolean(customerInfo.entitlements.active[MONETIZATION.entitlementId]) };
  return { ok: false, reason: "indisponivel" };
}

export async function restorePurchases(): Promise<boolean> {
  if (!purchasesAvailable()) return false;
  // TODO go-live:
  // const { Purchases } = await import(/* @vite-ignore */ "@revenuecat/purchases-capacitor");
  // const { customerInfo } = await Purchases.restorePurchases();
  // return Boolean(customerInfo.entitlements.active[MONETIZATION.entitlementId]);
  return false;
}
