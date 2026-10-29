import api from "../lib/axios";
import type { Product } from "../types/Product";
import type { CreateProductDto, UpdateProductDto } from "../types/Product";

interface ProductoApi {
  id: number;
  name: string;
  category: string | null;
  price: string | number;
  stock: number;
  description: string | null;
  image_url: string | null;
}

interface ProductoApiUpdate {
  name?: string;
  category?: string;
  price?: number; // 👈 Tu API exige estrictamente un número aquí
  stock?: number;
  description?: string;
  image_url?: string | null;
}

const convertirProducto = (producto: ProductoApi): Product => ({
  id: producto.id,
  name: producto.name,
  category: producto.category ?? "Sin categoría",
  price: Number(producto.price),
  stock: producto.stock,
  description: producto.description ?? "",
  // 🛠️ SOLUCIÓN 1: Si es null, lo convertimos a undefined (o viceversa según tu interfaz Product)
  image_url: producto.image_url ?? undefined,
});

const convertirDatos = (datos: UpdateProductDto): ProductoApiUpdate => ({
  ...(datos.name !== undefined && { name: datos.name }),
  ...(datos.category !== undefined && { category: datos.category }),
  // 🛠️ SOLUCIÓN 2: Forzar conversión numérica para satisfacer a ProductoApiUpdate
  ...(datos.price !== undefined && { price: Number(datos.price) }),
  ...(datos.stock !== undefined && { stock: datos.stock }),
  ...(datos.description !== undefined && { description: datos.description }),
  // 🛠️ SOLUCIÓN 1.2: Asegurar compatibilidad convirtiendo undefined a null si tu API lo prefiere
  ...(datos.image_url !== undefined && { image_url: datos.image_url ?? null }),
});

export const productosService = {
  getAll: async (categoria?: string) => {
    const respuesta = await api.get<ProductoApi[]>("/products/", {
      params: categoria && categoria !== "Todas" ? { category: categoria } : {},
    });

    return respuesta.data.map(convertirProducto);
  },

  getPagina: async (pagina: number, porPagina: number, categoria: string) => {
    const params: Record<string, string | number> = {
      skip: (pagina - 1) * porPagina,
      limit: porPagina + 1,
    };
    if (categoria !== "Todas") {
      params.category = categoria;
    }

    const respuesta = await api.get<ProductoApi[]>("/products/", { params });
    const productos = respuesta.data.map(convertirProducto);

    return {
      productos: productos.slice(0, porPagina),
      hayMas: productos.length > porPagina,
    };
  },

  delete: (id: number) => api.delete(`/products/${id}`),

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await api.post<ProductoApi>(
      "/products/",
      convertirDatos(data),
    );
    return convertirProducto(response.data);
  },

  update: async (id: number, data: UpdateProductDto): Promise<Product> => {
    const response = await api.put<ProductoApi>(
      `/products/${id}`,
      convertirDatos(data),
    );
    return convertirProducto(response.data);
  },
};
