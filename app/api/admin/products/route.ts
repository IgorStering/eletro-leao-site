import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

const PRODUCTS_FILE = join(process.cwd(), 'data', 'products.json');

interface ProductInput {
  nome_produto: string;
  categoria: string;
  marca: string;
  descricao: string;
  preco: string;
  imagem: string;
  diferenciais: string;
}

interface Product extends ProductInput {
  id: number;
  produto_id: string;
  estoque: number;
  ativo: boolean;
}

function validateAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === 'Bearer authorized';
}

export async function POST(request: NextRequest) {
  try {
    if (!validateAuth(request)) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body: ProductInput = await request.json();

    // Validação básica
    if (!body.nome_produto || !body.categoria || !body.marca || !body.preco || !body.imagem) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Lê o arquivo atual
    const fileContent = readFileSync(PRODUCTS_FILE, 'utf-8');
    const products: Product[] = JSON.parse(fileContent);

    // Gera novo ID
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;
    const newProductId = `PROD${String(newId).padStart(4, '0')}`;

    // Cria novo produto
    const newProduct: Product = {
      id: newId,
      produto_id: newProductId,
      nome_produto: body.nome_produto,
      categoria: body.categoria,
      marca: body.marca,
      descricao: body.descricao,
      preco: parseFloat(body.preco),
      estoque: 5, // Padrão
      diferenciais: body.diferenciais,
      imagem: body.imagem,
      ativo: true,
    };

    // Adiciona o novo produto
    products.push(newProduct);

    // Salva o arquivo
    writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

    return NextResponse.json(
      { message: 'Produto cadastrado com sucesso', product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar produto' },
      { status: 500 }
    );
  }
}
