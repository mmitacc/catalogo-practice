import { useEffect, useState } from "react";
import { tipoCambioService } from "../services/tipoCambioService";

export function useTipoCambio() {
  const [solesPorDolar, setSolesPorDolar] = useState<number | null>(null);
  const [error, setError] = useState<String | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    tipoCambioService
      .obtenerSolesPorDolar(controller.signal)
      .then((valor) => setSolesPorDolar(valor))
      .catch((err) => {
        if (err instanceof DOMException && err.name == "AbortError") return;

        setError(
          err instanceof Error
            ? err.message
            : "Error el obtener el tipo de cambio",
        );
      });

    return () => controller.abort();
  }, []);
  return { solesPorDolar, error };
}
