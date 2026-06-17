'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, removeAuthToken, getAuthToken } from '@/lib/auth';
import Link from 'next/link';

const CATEGORIES = ['Ar-Condicionado', 'Notebook', 'Smartphone'];

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nome_produto: '',
    categoria: 'Notebook',
    marca: '',
    descricao: '',
    preco: '',
    imagem: '',
    diferenciais: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
    } else {
      setAuthenticated(true);
      setLoading(false);
    }
  }, [router]);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          nome_produto: '',
          categoria: 'Notebook',
          marca: '',
          descricao: '',
          preco: '',
          imagem: '',
          diferenciais: '',
        });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar produto');
    }

    setSubmitting(false);
  };

  const handleLogout = () => {
    removeAuthToken();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Eletro Leão Admin</h1>
            <p className="text-orange-600 text-sm">Cadastro de Produtos</p>
          </div>
          <div className="flex gap-4">
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
      <div className="max-w-4xl mx-auto px-4 py-12">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✅ Produto cadastrado com sucesso! Verifique na home.
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Novo Produto</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome do Produto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  name="nome_produto"
                  value={formData.nome_produto}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="Ex: Notebook Samsung Galaxy Book 4"
                />
              </div>

              {/* Marca */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Marca *
                </label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="Ex: Samsung"
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preço */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="Ex: 4500.00"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="Descrição detalhada do produto..."
              />
            </div>

            {/* Diferenciais */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destaques (separados por vírgula) *
              </label>
              <textarea
                name="diferenciais"
                value={formData.diferenciais}
                onChange={handleInputChange}
                required
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="Ex: Intel Core i5 12ª gen, 16GB RAM, SSD 512GB, NVIDIA MX570"
              />
            </div>

            {/* URL da Imagem */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL da Imagem (Mercado Livre) *
              </label>
              <input
                type="url"
                name="imagem"
                value={formData.imagem}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="https://http2.mlstatic.com/..."
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Copie a URL da imagem do Mercado Livre
              </p>
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
            >
              {submitting ? 'Salvando...' : '✅ Cadastrar Produto'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
