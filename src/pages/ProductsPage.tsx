import { useState, useEffect } from "react";
import api from "../lib/axios";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../types/Product";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para Filtros y Búsqueda
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Petición a la API con Axios
  const cargarProducts = () => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() =>
        setError(
          "No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.",
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarProducts();
  }, []);

  // Extraer categorías únicas dinámicamente omitiendo valores nulos o vacíos
  const categories = [
    "all",
    ...new Set(
      products.map((p) => p.category).filter((cat): cat is string => !!cat), // Filtra null o undefined
    ),
  ];

  // Lógica de Filtrado Combinado (Buscador + Selector de Categoría)
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      // selectedCategory === "all" || product.category === selectedCategory;
      product.category === "BeluPapeleria";
      return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    console.log(`Agregar al carrito: ${product.name}`);
  };

  // 1. Renderizado en estado de Carga (Skeletons)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">
          Cargando catálogo de productos...
        </p>
      </div>
    );
  }

  // 2. Renderizado en estado de Error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-md max-w-md w-full border border-red-100 text-center">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            ⚠️
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Ocurrió un problema
          </h3>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-indigo-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera Principal y Controles */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Título e Info */}
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Marketplace BeluPapeleria
              </h1>
              <p className="text-gray-500 mt-1 text-sm font-medium">
                Explora nuestra variedad de productos disponibles (
                {filteredProducts.length}).
              </p>
            </div>

            {/* Contenedor de Buscador y Filtro Desplegable */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              {/* Buscador */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400 font-medium"
                />
              </div>

              {/* Selector Desplegable de Categorías (Select) */}
              {/*
              <div className="relative w-full sm:w-56">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer appearance-none capitalize"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="capitalize text-gray-700 font-medium"
                    >
                      {category === "all"
                        ? "📦 Todas las categorías"
                        : category.replace("-", " / ")}
                    </option>
                  ))}
                </select>

                
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              */}
            </div>
          </div>
        </div>

        {/* Grid de Productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
            <p className="text-gray-400 font-medium">
              No se encontraron productos en esta sección.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
