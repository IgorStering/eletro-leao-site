import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

const PRODUCTS_FILE = join(process.cwd(), 'data', 'products.json');

interface Product {
  id: number;
  produto_id: string;
  nome_produto: string;
  categoria: string;
  marca: string;
  descricao: string;
  preco: string;
  estoque: number;
  diferenciais: string;
  imagem: string;
  ativo: boolean;
}

function validateAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === 'Bearer authorized';
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateAuth(request)) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id: idString } = await params;
    const id = parseInt(idString);
    const body = await request.json();

    const fileContent = readFileSync(PRODUCTS_FILE, 'utf-8');
    const products: Product[] = JSON.parse(fileContent);

    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Atualiza apenas o campo ativo (ou outros campos conforme necessário)
    if ('ativo' in body) {
      products[productIndex].ativo = body.ativo;
    }

    writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

    return NextResponse.json({
      message: 'Produto atualizado com sucesso',
      product: products[productIndex],
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateAuth(request)) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id: idString } = await params;
    const id = parseInt(idString);

    const fileContent = readFileSync(PRODUCTS_FILE, 'utf-8');
    const products: Product[] = JSON.parse(fileContent);

    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

    return NextResponse.json({
      message: 'Produto deletado com sucesso',
      product: deletedProduct,
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar produto' },
      { status: 500 }
    );
  }
}
