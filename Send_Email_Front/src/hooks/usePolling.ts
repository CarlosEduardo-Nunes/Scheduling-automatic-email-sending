import { useEffect, useRef } from "react";

type Options = {
  intervalMs: number;      // intervalo base
  enabled?: boolean;       // liga/desliga o polling
  backoffFactor?: number;  // multiplicador quando der erro (ex.: 2)
  maxIntervalMs?: number;  // teto do intervalo
};

/**
 * Chama `fn()` periodicamente enquanto a aba estiver visível e `enabled` for true.
 * Aplica backoff exponencial em caso de erro.
 */
export function usePolling(
  fn: () => Promise<void> | void,
  { intervalMs, enabled = true, backoffFactor = 2, maxIntervalMs = 60000 }: Options
) {
  const currentInterval = useRef(intervalMs);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    async function tick() {
      if (document.visibilityState !== "visible") {
        schedule(); // re-checa mais tarde
        return;
      }

      try {
        await fn();
        currentInterval.current = intervalMs; // sucesso: reseta intervalo
      } catch {
        // erro: aumenta o intervalo (backoff) até o teto
        currentInterval.current = Math.min(
          currentInterval.current * backoffFactor,
          maxIntervalMs
        );
      } finally {
        if (!cancelled) schedule();
      }
    }

    function schedule() {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(tick, currentInterval.current);
    }

    // primeira chamada
    schedule();

    return () => {
      cancelled = true;
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [fn, enabled, intervalMs, backoffFactor, maxIntervalMs]);
}
