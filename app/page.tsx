'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getAllProducts,
  getCategories,
  filterProducts,
} from '@/lib/products';
import { Product, ProductFilter } from '@/lib/types';

export default function Home() {
  const products = getAllProducts();
  const categories = getCategories();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'todos') {
      const filters: ProductFilter = {
        search: search || undefined,
      };
      return filterProducts(filters);
    } else {
      const filters: ProductFilter = {
        search: search || undefined,
        categoria: selectedCategory,
      };
      return filterProducts(filters);
    }
  }, [search, selectedCategory]);

  const getCategoryEmoji = (categoria: string) => {
    const emojiMap: { [key: string]: string } = {
      'Ar-Condicionado': '❄️',
      'Notebook': '💻',
      'Smartphone': '📱',
    };
    return emojiMap[categoria] || '📦';
  };


  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-black to-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Encontre os Melhores Eletrônicos</h1>
          <p className="text-lg text-gray-300 mb-8">
            Qualidade, preço e variedade para todos os seus produtos eletrônicos
          </p>

          {/* Search */}
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 outline-none focus:ring-2 focus:ring-orange-600"
            />
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 rounded-lg font-semibold transition">
              🔍
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 py-6 px-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Filtrar por Categoria</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('todos')}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                selectedCategory === 'todos'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-lg font-semibold text-gray-900">
              {filteredProducts.length === 0
                ? 'Nenhum produto encontrado'
                : filteredProducts.length === 1
                ? '1 produto encontrado'
                : `${filteredProducts.length} produtos encontrados`}
            </p>
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const formattedPrice = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(product.preco);

                return (
                  <Link
                    key={product.id}
                    href={`/produto/${product.id}`}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-105 text-left flex flex-col h-full"
                  >
                    {/* Image */}
                    {product.imagem ? (
                      <div className="relative w-full h-48 bg-gray-100">
                        <Image
                          src={product.imagem}
                          alt={product.nome_produto}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-5xl">
                        {getCategoryEmoji(product.categoria)}
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="text-orange-600 text-xs font-bold uppercase tracking-wide mb-1">
                        {product.categoria}
                      </div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                        {product.nome_produto}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{product.marca}</p>

                      <div className="mt-auto">
                        <div className="text-lg font-bold text-orange-600">
                          {formattedPrice}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
