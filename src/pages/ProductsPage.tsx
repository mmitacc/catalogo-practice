import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../types/Product";
import { useTipoCambio } from "../hooks/useTipoCambio.ts";
import { productosService } from "../services/productos.ts";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hayMas, setHayMas] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Api para tipo de cambio
  const { solesPorDolar } = useTipoCambio();
  console.log("solesPorDolar => ", solesPorDolar);

  // Estados para Búsqueda (Texto plano local)
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Constantes para paginados mediante URL con useSearchParams
  const POR_PAGINA = 6;
  const [searchParams, setSearchParams] = useSearchParams();
  const pagina = Math.max(1, Number(searchParams.get("pagina")) || 1);
  const categoria = searchParams.get("categoria") ?? "Todas";

  // Funciones para cambiar de página y categoría actualizando la URL
  const irAPagina = (nueva: number) => {
    setSearchParams({ pagina: String(nueva), categoria });
  };

  const cambiarCategoria = (nueva: string) => {
    setSearchParams({ pagina: "1", categoria: nueva });
  };

  // Petición a la API usando el servicio paginado
  const cargarProducts = () => {
    setLoading(true);
    // Mapeamos "todas" de la URL al formato "Todas" esperado por tu servicio de backend
    const categoriaFormateada = categoria === "Todas" ? "Todas" : categoria;

    productosService
      .getPagina(pagina, POR_PAGINA, categoriaFormateada)
      .then((resultado) => {
        setProducts(resultado.productos);
        setHayMas(resultado.hayMas);
        setError(null);
      })
      .catch(() =>
        setError(
          "No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.",
        ),
      )
      .finally(() => setLoading(false));
  };

  // El efecto se dispara cada vez que la página o categoría en la URL cambian
  useEffect(() => {
    cargarProducts();
  }, [pagina, categoria]);

  // Lista de categorías estáticas o predefinidas (ya que con paginación la API no te devolverá todas en la primera página)
  const [allCategories, setAllCategories] = useState<string[]>(["todas"]);
  useEffect(() => {
    productosService
      .getAll()
      .then((todosLosProductos) => {
        // Extraemos las categorías únicas conservando sus mayúsculas originales
        const categoriasUnicas = new Set(
          todosLosProductos
            .map((p) => p.category)
            .filter((cat): cat is string => !!cat),
        );

        // Guardamos "todas" junto a las categorías originales
        setAllCategories(["todas", ...categoriasUnicas]);
      })
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  // Lógica de Filtrado Combinado (Ahora solo filtra localmente por buscador de texto, ya que la categoría viene filtrada del backend)
  const filteredProducts = products.filter((product) => {
    return (
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
            onClick={() => cargarProducts()}
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
                Marketplace FUNVAL
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
              <div className="relative w-full sm:w-56">
                <select
                  value={categoria}
                  onChange={(e) => cambiarCategoria(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer appearance-none capitalize"
                >
                  {allCategories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="capitalize text-gray-700 font-medium"
                    >
                      {category === "todas"
                        ? "📦 todas las categorías"
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-center">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  solesPorDolar={solesPorDolar}
                />
              ))}
            </div>

            {/* Controles de Paginación Estilizados */}
            <div className="flex justify-center items-center gap-4 mt-12 bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm max-w-xs mx-auto">
              <button
                disabled={pagina === 1}
                onClick={() => irAPagina(pagina - 1)}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                aria-label="Página anterior"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <span className="text-sm font-semibold text-gray-700 tracking-wide min-w-[70px] text-center">
                Pág. {pagina}
              </span>

              <button
                disabled={!hayMas}
                onClick={() => irAPagina(pagina + 1)}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                aria-label="Página siguiente"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
