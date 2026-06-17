import productsData from '@/data/products.json';
import { Product, ProductFilter } from './types';

export function getAllProducts(): Product[] {
  return productsData.products || [];
}

export function getProductById(id: number | string): Product | undefined {
  const products = getAllProducts();
  return products.find((p) =>
    String(p.id) === String(id) || p.produto_id === String(id)
  );
}

export function filterProducts(filters: ProductFilter): Product[] {
  let products = getAllProducts();

  if (filters.search) {
    const search = filters.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.nome_produto.toLowerCase().includes(search) ||
        p.marca.toLowerCase().includes(search) ||
        p.descricao.toLowerCase().includes(search) ||
        p.diferenciais.toLowerCase().includes(search)
    );
  }

  if (filters.categoria) {
    products = products.filter(
      (p) => p.categoria.toLowerCase() === filters.categoria!.toLowerCase()
    );
  }

  if (filters.marca) {
    products = products.filter(
      (p) => p.marca.toLowerCase() === filters.marca!.toLowerCase()
    );
  }

  if (filters.preco_min !== undefined) {
    products = products.filter((p) => p.preco >= filters.preco_min!);
  }

  if (filters.preco_max !== undefined) {
    products = products.filter((p) => p.preco <= filters.preco_max!);
  }

  return products.sort((a, b) => a.nome_produto.localeCompare(b.nome_produto));
}

export function getCategories(): string[] {
  const products = getAllProducts();
  return Array.from(new Set(products.map((p) => p.categoria))).sort();
}

export function getBrands(): string[] {
  const products = getAllProducts();
  return Array.from(new Set(products.map((p) => p.marca))).sort();
}

export function getPriceRange(): { min: number; max: number } {
  const products = getAllProducts();
  if (products.length === 0) return { min: 0, max: 0 };

  const prices = products.map((p) => p.preco);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

export function getRelatedProducts(
  category: string,
  currentProductId: number,
  limit: number = 4
): Product[] {
  const products = getAllProducts();
  return products
    .filter(
      (p) =>
        p.categoria.toLowerCase() === category.toLowerCase() &&
        p.id !== currentProductId
    )
    .slice(0, limit);
}
