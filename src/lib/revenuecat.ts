// Bridge para o RevenueCat (assinatura via Google Play).
//
// Web é sempre no-op: `purchasesAvailable()` exige app nativo + a chave pública
// configurada (VITE_REVENUECAT_ANDROID_KEY). O plugin nativo só é importado
// dinamicamente (lazy chunk) DEPOIS desse check, então o bundle web não carrega
// nada do RevenueCat até rodar no Android com a chave presente.
//
// Go-live: criar a conta/produtos no RevenueCat + Play, definir
// VITE_REVENUECAT_ANDROID_KEY e VITE_MONETIZATION_ENABLED=true. Ver docs/MONETIZACAO.md.

import { Capacitor } from "@capacitor/core";
import { MONETIZATION } from "@/config/monetization";

/** True só quando dá para cobrar de verdade (app nativo + chave configurada). */
export function purchasesAvailable(): boolean {
  return Capacitor.isNativePlatform() && MONETIZATION.revenueCatAndroidKey.length > 0;
}

let configured = false;

export async function initPurchases(): Promise<void> {
  if (!purchasesAvailable() || configured) return;
  const { Purchases } = await import("@revenuecat/purchases-capacitor");
  await Purchases.configure({ apiKey: MONETIZATION.revenueCatAndroidKey });
  configured = true;
}

/**
 * Estado atual do entitlement "pro" segundo a loja.
 * Retorna null quando NÃO dá para saber (web/sem billing) — o chamador mantém
 * o estado local. Retorna boolean quando a loja respondeu.
 */
export async function fetchProEntitlement(): Promise<boolean | null> {
  if (!purchasesAvailable()) return null;
  const { Purchases } = await import("@revenuecat/purchases-capacitor");
  const { customerInfo } = await Purchases.getCustomerInfo();
  return Boolean(customerInfo.entitlements.active[MONETIZATION.entitlementId]);
}

export async function purchaseProSubscription(): Promise<{ ok: boolean; reason?: string }> {
  if (!purchasesAvailable()) return { ok: false, reason: "indisponivel" };
  try {
    const { Purchases } = await import("@revenuecat/purchases-capacitor");
    const offerings = await Purchases.getOfferings();
    const pkg = offerings.current?.availablePackages?.[0];
    if (!pkg) return { ok: false, reason: "sem-oferta" };
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    return { ok: Boolean(customerInfo.entitlements.active[MONETIZATION.entitlementId]) };
  } catch (e) {
    const err = e as { userCancelled?: boolean };
    return { ok: false, reason: err?.userCancelled ? "cancelado" : "erro" };
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!purchasesAvailable()) return false;
  const { Purchases } = await import("@revenuecat/purchases-capacitor");
  const { customerInfo } = await Purchases.restorePurchases();
  return Boolean(customerInfo.entitlements.active[MONETIZATION.entitlementId]);
}
