import React, { useState } from "react";
import type { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  solesPorDolar: number | null;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  solesPorDolar,
}) => {
  const { name, description, price, stock, category, image_url } = product;

  // Estado local para controlar la moneda activa: 'PEN' o 'USD'
  const [currency, setCurrency] = useState<"PEN" | "USD">("PEN");

  const precioSol = parseFloat(String(price));
  const precioUsd = solesPorDolar ? precioSol / solesPorDolar : null;

  // Formatear el nombre de la categoría (ej. "Panaderia-galleta" -> "Panaderia / galleta")
  const formattedCategory = category ? category.replace("-", " / ") : "General";

  // Validar si hay stock disponible
  const isOutOfStock = stock === 0;

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      {/* Contenedor de la Imagen */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
            isOutOfStock ? "grayscale opacity-75" : ""
          }`}
          src={image_url || "https://placehold.co"}
          alt={name || "Producto"}
          loading="lazy"
        />

        {/* Etiqueta de Categoría */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm capitalize">
          {formattedCategory}
        </span>

        {/* Alerta de Sin Stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-sm px-4 py-2 rounded-lg uppercase tracking-wider">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Contenido de la Card */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Cabecera Interna: Título y Precios Dinámicos */}
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3
            className="text-lg font-bold text-gray-800 line-clamp-2 flex-1"
            title={name}
          >
            {name}
          </h3>

          {/* Bloque de Moneda y Selector */}
          <div className="flex flex-col items-end shrink-0 text-right min-w-[100px]">
            {/* Monto Dinámico según la Moneda seleccionada */}
            <div className="h-7 flex items-center justify-end">
              {currency === "PEN" ? (
                <span className="text-xl font-black text-indigo-600 whitespace-nowrap animate-fade-in">
                  S/. {precioSol.toFixed(2)}
                </span>
              ) : (
                <span className="text-xl font-black text-emerald-600 whitespace-nowrap animate-fade-in">
                  ${precioUsd ? precioUsd.toFixed(2) : "0.00"} USD
                </span>
              )}
            </div>

            {/* Selector interactivo de moneda (Switch tipo Pill) */}
            {precioUsd !== null && (
              <div className="inline-flex rounded-lg p-0.5 bg-gray-100 mt-2 border border-gray-200/50">
                <button
                  type="button"
                  onClick={() => setCurrency("PEN")}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${
                    currency === "PEN"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  S/.
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${
                    currency === "USD"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  USD
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* Info de Stock y Botón de Acción */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">
              Disponibles
            </span>
            <span
              className={`text-sm font-bold ${stock <= 5 ? "text-amber-500" : "text-gray-700"}`}
            >
              {stock} und.
            </span>
          </div>

          <button
            onClick={() => onAddToCart?.(product)}
            disabled={isOutOfStock}
            className={`flex-grow px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 text-center ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-100"
            }`}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};
