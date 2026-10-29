export interface Product {
  id: number;
  name: string;
  description: string;
  price: string | number; // Viene como string en tu JSON ("8.00")
  stock: number;
  category: string;
  image_url?: string;
}

export type CreateProductDto = Omit<Product, "id">;

export type UpdateProductDto = Partial<CreateProductDto>;
