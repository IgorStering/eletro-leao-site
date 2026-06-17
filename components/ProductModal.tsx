'use client';

import Image from 'next/image';
import { Product } from '@/lib/types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  whatsappNumber,
}: ProductModalProps) {
  if (!isOpen || !product) return null;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.preco);

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no produto: ${product.nome_produto}\n\nMarca: ${product.marca}\nPreço: ${formattedPrice}\n\nPode me enviar mais informações?`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const getCategoryEmoji = (categoria: string) => {
    const emojiMap: { [key: string]: string } = {
      'Ar-Condicionado': '❄️',
      'Notebook': '💻',
      'Smartphone': '📱',
    };
    return emojiMap[categoria] || '📦';
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-white rounded-lg shadow-2xl max-w-lg w-full my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-orange-600 transition text-2xl font-bold z-10"
          >
            ×
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Image */}
            {product.imagem ? (
              <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={product.imagem}
                  alt={product.nome_produto}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            ) : (
              <div className="w-full h-64 mb-6 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-6xl">
                {getCategoryEmoji(product.categoria)}
              </div>
            )}

            {/* Category */}
            <div className="text-orange-600 font-bold text-sm uppercase tracking-wider mb-2">
              {product.categoria}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {product.nome_produto}
            </h2>

            {/* Brand */}
            <p className="text-gray-600 mb-4">por {product.marca}</p>

            {/* Price */}
            <div className="text-3xl font-bold text-orange-600 mb-6">
              {formattedPrice}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.descricao}
            </p>

            {/* Specs */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Especificações</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="border-b border-gray-200 pb-2">
                  <strong>Categoria:</strong> {product.categoria}
                </li>
                <li className="border-b border-gray-200 pb-2">
                  <strong>Marca:</strong> {product.marca}
                </li>
                <li>
                  <strong>Diferenciais:</strong> {product.diferenciais}
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition text-center"
              >
                💬 Comprar pelo WhatsApp
              </a>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 rounded-lg transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
