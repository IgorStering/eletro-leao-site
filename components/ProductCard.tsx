import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.preco);

  const diferenciais = product.diferenciais
    .split(',')
    .slice(0, 3)
    .map((d) => d.trim());

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Imagem */}
        <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          {product.imagem ? (
            <Image
              src={product.imagem}
              alt={product.nome_produto}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="text-gray-400 text-center p-4">
              <p>Sem imagem</p>
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Marca */}
          <p className="text-sm text-gray-500 uppercase tracking-wide">{product.marca}</p>

          {/* Nome */}
          <h3 className="font-semibold text-gray-900 mt-2 line-clamp-2 flex-grow">
            {product.nome_produto}
          </h3>

          {/* Preço */}
          <p className="text-xl font-bold text-blue-600 mt-3">{formattedPrice}</p>

          {/* Diferenciais */}
          {diferenciais.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600 font-semibold mb-2">Destaques:</p>
              <ul className="text-xs text-gray-700 space-y-1">
                {diferenciais.map((d, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="line-clamp-1">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Estoque */}
          {product.estoque <= 3 && product.estoque > 0 && (
            <p className="text-xs text-orange-600 font-semibold mt-2">
              ⚠️ Apenas {product.estoque} em estoque!
            </p>
          )}
          {product.estoque === 0 && (
            <p className="text-xs text-red-600 font-semibold mt-2">❌ Fora de estoque</p>
          )}
        </div>
      </div>
    </Link>
  );
}
