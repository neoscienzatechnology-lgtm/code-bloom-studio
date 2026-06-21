// Estado do entitlement "Pro" compartilhado pelo app.
//
// Fonte da verdade: o RevenueCat (no app nativo, quando configurado). Sem
// billing real, cai no estado local persistido (localStorage) — o que também
// permite um "desbloqueio de teste" para QA/dev e demos. Default: grátis.

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { readString, writeString, removeKey, STORAGE_KEYS } from "@/lib/storage";
import {
  fetchProEntitlement,
  initPurchases,
  purchaseProSubscription,
  restorePurchases,
} from "@/lib/revenuecat";

interface EntitlementValue {
  isPro: boolean;
  ready: boolean;
  purchasing: boolean;
  buyPro: () => Promise<{ ok: boolean; reason?: string }>;
  restore: () => Promise<boolean>;
  /** Desbloqueio manual (QA/dev/demo). Persiste localmente. */
  setProForTesting: (value: boolean) => void;
}

const EntitlementContext = createContext<EntitlementValue | null>(null);

function storedPro(): boolean {
  return readString(STORAGE_KEYS.entitlement) === "pro";
}

export function EntitlementProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState<boolean>(storedPro);
  const [ready, setReady] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const apply = useCallback((value: boolean) => {
    setIsPro(value);
    if (value) writeString(STORAGE_KEYS.entitlement, "pro");
    else removeKey(STORAGE_KEYS.entitlement);
  }, []);

  // Ao abrir, pergunta à loja (no nativo configurado). null = sem resposta da
  // loja → mantém o estado local.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await initPurchases();
        const fromStore = await fetchProEntitlement();
        if (active && fromStore !== null) apply(fromStore);
      } catch {
        /* billing indisponível — segue com o estado local */
      } finally {
        if (active) setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [apply]);

  const buyPro = useCallback(async () => {
    setPurchasing(true);
    try {
      const result = await purchaseProSubscription();
      if (result.ok) apply(true);
      return result;
    } catch {
      return { ok: false, reason: "erro" };
    } finally {
      setPurchasing(false);
    }
  }, [apply]);

  const restore = useCallback(async () => {
    try {
      const ok = await restorePurchases();
      if (ok) apply(true);
      return ok;
    } catch {
      return false;
    }
  }, [apply]);

  const setProForTesting = useCallback((value: boolean) => apply(value), [apply]);

  return (
    <EntitlementContext.Provider value={{ isPro, ready, purchasing, buyPro, restore, setProForTesting }}>
      {children}
    </EntitlementContext.Provider>
  );
}

// Fallback seguro quando usado fora do provider (ex.: testes que montam um
// componente isolado): trata como grátis e não quebra.
const FREE_FALLBACK: EntitlementValue = {
  isPro: false,
  ready: true,
  purchasing: false,
  buyPro: async () => ({ ok: false, reason: "sem-provider" }),
  restore: async () => false,
  setProForTesting: () => {},
};

export function useEntitlement(): EntitlementValue {
  return useContext(EntitlementContext) ?? FREE_FALLBACK;
}
