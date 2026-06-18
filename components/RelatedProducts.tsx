import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-12 border-t border-gray-200">
      <h2 className="text-2xl font-light text-gray-900 mb-2">
        Outros produtos da mesma categoria
      </h2>
      <p className="text-sm text-gray-500 mb-8">
        Conheça mais opções que podem interessá-lo
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const formattedPrice = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(parseFloat(product.preco));

          return (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-300 transition-all duration-300 h-full flex flex-col cursor-pointer">
                {/* Imagem */}
                <div className="relative w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {product.imagem ? (
                    <Image
                      src={product.imagem}
                      alt={product.nome_produto}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="text-gray-300 text-center p-4">
                      <p className="text-sm">Sem imagem</p>
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Marca */}
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                    {product.marca}
                  </p>

                  {/* Nome */}
                  <h3 className="font-light text-gray-900 mt-2 line-clamp-2 flex-grow text-sm">
                    {product.nome_produto}
                  </h3>

                  {/* Preço */}
                  <p className="text-lg font-semibold text-blue-600 mt-3">
                    {formattedPrice}
                  </p>

                  {/* Estoque */}
                  {product.estoque > 0 ? (
                    <p className="text-xs text-green-600 font-medium mt-2">
                      ✓ Em estoque
                    </p>
                  ) : (
                    <p className="text-xs text-red-600 font-medium mt-2">
                      ✗ Fora de estoque
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
