'use client';

import { useState } from 'react';

interface FiltersProps {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  onCategoryChange: (category: string | undefined) => void;
  onBrandChange: (brand: string | undefined) => void;
  onPriceChange: (min: number | undefined, max: number | undefined) => void;
  selectedCategory?: string;
  selectedBrand?: string;
}

export default function Filters({
  categories,
  brands,
  priceRange,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  selectedCategory,
  selectedBrand,
}: FiltersProps) {
  const [priceMin, setPriceMin] = useState<number>(priceRange.min);
  const [priceMax, setPriceMax] = useState<number>(priceRange.max);

  const handlePriceMinChange = (value: string) => {
    const num = value ? parseFloat(value) : priceRange.min;
    setPriceMin(num);
    onPriceChange(num, priceMax);
  };

  const handlePriceMaxChange = (value: string) => {
    const num = value ? parseFloat(value) : priceRange.max;
    setPriceMax(num);
    onPriceChange(priceMin, num);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Categoria</h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              value=""
              checked={!selectedCategory}
              onChange={() => onCategoryChange(undefined)}
              className="w-4 h-4"
            />
            <span className="ml-2 text-gray-700">Todas</span>
          </label>
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={() => onCategoryChange(category)}
                className="w-4 h-4"
              />
              <span className="ml-2 text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Marca</h3>
        <select
          value={selectedBrand || ''}
          onChange={(e) => onBrandChange(e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as marcas</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Faixa de Preço</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Mínimo</label>
            <input
              type="number"
              value={priceMin}
              onChange={(e) => handlePriceMinChange(e.target.value)}
              min={priceRange.min}
              max={priceRange.max}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Máximo</label>
            <input
              type="number"
              value={priceMax}
              onChange={(e) => handlePriceMaxChange(e.target.value)}
              min={priceRange.min}
              max={priceRange.max}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500">
            Intervalo: R$ {priceRange.min.toFixed(2)} - R$ {priceRange.max.toFixed(2)}
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          onCategoryChange(undefined);
          onBrandChange(undefined);
          onPriceChange(priceRange.min, priceRange.max);
          setPriceMin(priceRange.min);
          setPriceMax(priceRange.max);
        }}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition"
      >
        Limpar Filtros
      </button>
    </div>
  );
}
