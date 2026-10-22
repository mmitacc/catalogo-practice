import React from "react";
import type { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const { name, description, price, stock, category, image_url } = product;

  // Formatear el nombre de la categoría (ej. "Panaderia-galleta" -> "Panaderia / galleta")
  // Si category es null o undefined, usará un texto por defecto como 'General'
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
          // Si image_url es null o no existe, usa una imagen por defecto
          src={image_url || "https://placehold.co"}
          // Si name es null, evita romper el atributo alt usando un string vacío
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
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
            {name}
          </h3>
          <span className="text-xl font-black text-indigo-600 whitespace-nowrap">
            S/. {parseFloat(price).toFixed(2)}
          </span>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* Info de Stock y Botón de Acción */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
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
                ? "bg-gray-150 text-gray-400 cursor-not-allowed"
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
