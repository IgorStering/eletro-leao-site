'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById, getAllProducts } from '@/lib/products';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const product = getProductById(parseInt(id) || id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-semibold">
            ← Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.preco);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5571981945017';
  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no produto: ${product.nome_produto}\n\nMarca: ${product.marca}\nPreço: ${formattedPrice}\n\nPode me enviar mais informações?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const diferenciais = product.diferenciais.split(',').map((d) => d.trim());

  const getCategoryEmoji = (categoria: string) => {
    const emojiMap: { [key: string]: string } = {
      'Ar-Condicionado': '❄️',
      'Notebook': '💻',
      'Smartphone': '📱',
    };
    return emojiMap[categoria] || '📦';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-8 font-semibold">
          ← Voltar
        </Link>

        {/* Main Container - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Information */}
          <div className="flex flex-col justify-start">
            {/* Category Badge */}
            <div className="inline-flex items-center mb-4">
              <span className="text-orange-600 font-bold text-sm uppercase tracking-wider">
                {product.categoria}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {product.nome_produto}
            </h1>

            {/* Brand */}
            <p className="text-gray-600 text-lg mb-8">
              {product.marca}
            </p>

            {/* Price */}
            <div className="mb-8">
              <p className="text-gray-600 text-sm font-semibold mb-2">PREÇO</p>
              <p className="text-5xl font-bold text-orange-600">
                {formattedPrice}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-gray-600 text-sm font-semibold mb-3">DESCRIÇÃO</p>
              <p className="text-gray-700 text-lg leading-relaxed">
                {product.descricao}
              </p>
            </div>

            {/* Diferenciais */}
            <div className="mb-12">
              <p className="text-gray-600 text-sm font-semibold mb-4">DESTAQUES</p>
              <ul className="space-y-3">
                {diferenciais.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-orange-600 font-bold mr-3">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg transition text-center text-lg"
              >
                💬 Comprar agora
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition"
              >
                💚
              </a>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="flex items-center justify-center">
            {product.imagem ? (
              <div className="relative w-full h-full min-h-96 lg:min-h-screen flex items-center justify-center">
                <Image
                  src={product.imagem}
                  alt={product.nome_produto}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-96 lg:h-screen bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center text-8xl">
                {getCategoryEmoji(product.categoria)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
