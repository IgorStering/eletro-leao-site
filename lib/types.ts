export interface Product {
  id: number;
  produto_id: string;
  nome_produto: string;
  categoria: string;
  marca: string;
  descricao: string;
  preco: string;
  estoque: number;
  diferenciais: string;
  imagem?: string;
  ativo: boolean;
}

export interface ProductFilter {
  categoria?: string;
  marca?: string;
  preco_min?: number;
  preco_max?: number;
  search?: string;
}

export interface GoogleSheetsRow {
  [key: string]: string | number | boolean;
}
