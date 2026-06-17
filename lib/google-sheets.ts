import axios from 'axios';
import { Product, GoogleSheetsRow } from './types';

const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

export async function getGoogleSheetsData(): Promise<Product[]> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetsId = process.env.NEXT_PUBLIC_SHEETS_ID;

  if (!apiKey || !sheetsId) {
    throw new Error(
      'Missing GOOGLE_SHEETS_API_KEY or NEXT_PUBLIC_SHEETS_ID in environment variables'
    );
  }

  try {
    const url = `${SHEETS_API_URL}/${sheetsId}/values/Produtos?key=${apiKey}`;
    const response = await axios.get(url);

    const rows = response.data.values || [];
    if (rows.length === 0) {
      throw new Error('No data found in Google Sheets');
    }

    // First row is header
    const headers = rows[0];
    const dataRows = rows.slice(1);

    const products: Product[] = dataRows
      .map((row: string[], index: number) => {
        // Create object from headers and row values
        const rowData: GoogleSheetsRow = {};
        headers.forEach((header: string, i: number) => {
          rowData[header.toLowerCase().trim()] = row[i] || '';
        });

        // Map Google Sheets columns to Product interface
        const product: Product = {
          id: index + 1,
          produto_id: String(rowData['produto_id'] || '').trim(),
          nome_produto: String(rowData['nome_produto'] || '').trim(),
          categoria: String(rowData['categoria'] || '').trim(),
          marca: String(rowData['marca'] || '').trim(),
          descricao: String(rowData['descricao'] || '').trim(),
          preco: parseFloat(String(rowData['preco'] || '0')) || 0,
          estoque: parseInt(String(rowData['estoque'] || '0')) || 0,
          diferenciais: String(rowData['diferenciais'] || '').trim(),
          ativo:
            String(rowData['ativo'] || 'true').toLowerCase() === 'true' ||
            String(rowData['ativo']).toLowerCase() === 'sim',
        };

        return product;
      })
      .filter((p) => p.produto_id && p.nome_produto && p.ativo);

    console.log(`✓ Loaded ${products.length} products from Google Sheets`);
    return products;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw error;
  }
}
