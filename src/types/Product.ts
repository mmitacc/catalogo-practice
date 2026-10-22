export interface Product {
  id: number;
  name: string;
  description: string;
  price: string; // Viene como string en tu JSON ("8.00")
  stock: number;
  category: string;
  image_url: string;
  created_at: string;
}
