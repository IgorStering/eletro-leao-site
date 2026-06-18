'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, removeAuthToken, getAuthToken } from '@/lib/auth';
import Link from 'next/link';

interface Product {
  id: number;
  produto_id: string;
  nome_produto: string;
  categoria: string;
  marca: string;
  preco: string;
  imagem: string;
  ativo: boolean;
}

export default function ProdutosPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
    } else {
      setAuthenticated(true);
      loadProducts();
    }
  }, [router]);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/admin/products?all=true', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
    setLoading(false);
  };

  const handleToggleStatus = async (id: number, ativo: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ ativo: !ativo }),
      });

      if (response.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ativo: !ativo } : p))
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        alert('Produto deletado com sucesso');
      } else {
        alert('Erro ao deletar produto');
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      alert('Erro ao deletar produto');
    }
    setDeleting(null);
  };

  const handleLogout = () => {
    removeAuthToken();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Eletro Leão Admin</h1>
            <p className="text-orange-600 text-sm">Gerenciamento de Produtos</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="hover:text-orange-600 transition font-semibold"
            >
              Novo Produto
            </Link>
            <Link
              href="/"
              className="hover:text-orange-600 transition font-semibold"
            >
              Ver Loja
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Produtos ({products.length})
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600 mb-4">Nenhum produto cadastrado</p>
              <Link
                href="/admin"
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded font-semibold"
              >
                Adicionar Primeiro Produto
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                        !product.ativo ? 'bg-gray-50 opacity-60' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {product.nome_produto}
                          </p>
                          <p className="text-sm text-gray-500">{product.marca}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {product.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          R$ {parseFloat(product.preco).toFixed(2)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleToggleStatus(product.id, product.ativo)
                          }
                          className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                            product.ativo
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          }`}
                        >
                          {product.ativo ? '✓ Ativo' : '○ Inativo'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded transition disabled:opacity-50"
                        >
                          {deleting === product.id ? '...' : '🗑️ Deletar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
