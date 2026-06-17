import fs from 'fs';
import path from 'path';
import https from 'https';
import { createWriteStream } from 'fs';

const PRODUCTS_FILE = path.join(__dirname, '../../data/products.json');
const PUBLIC_IMAGES_DIR = path.join(__dirname, '../../public/images');

// Criar diretório se não existir
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
  fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
}

interface Product {
  id: number;
  produto_id: string;
  nome_produto: string;
  marca: string;
  categoria: string;
  imagem?: string;
  [key: string]: any;
}

interface ProductsData {
  lastSync: string;
  totalProducts: number;
  products: Product[];
}

// URLs de imagens públicas por categoria
const imageUrlsByCategory: { [key: string]: string[] } = {
  'Ar-Condicionado': [
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop',
  ],
  'Notebook': [
    'https://images.unsplash.com/photo-1522869635100-ce89c6b6614d?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1588872657840-218e7e66e13e?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop',
  ],
  'Smartphone': [
    'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1462012482333-7d1fa17cc78a?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1601972773176-f8e1cc3e67e8?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1511694712202-d440c1b90bb2?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1488227540707-4273c59f5f7c?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1591290619762-f8cfc99e3fa9?w=500&h=500&fit=crop',
  ],
};

function downloadImage(
  imageUrl: string,
  filename: string
): Promise<boolean> {
  return new Promise((resolve) => {
    const filepath = path.join(PUBLIC_IMAGES_DIR, filename);

    https.get(imageUrl, (res) => {
      const file = createWriteStream(filepath);
      res.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✓ Imagem baixada: ${filename}`);
        resolve(true);
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {});
        console.error(`✗ Erro ao baixar ${filename}: ${err.message}`);
        resolve(false);
      });
    }).on('error', (e) => {
      console.error(`✗ Erro na requisição: ${e.message}`);
      resolve(false);
    });
  });
}

async function main() {
  console.log('🔍 Iniciando download de imagens dos produtos...\n');

  // Ler arquivo de produtos
  const productsData: ProductsData = JSON.parse(
    fs.readFileSync(PRODUCTS_FILE, 'utf-8')
  );

  let updated = 0;
  let failed = 0;

  for (const product of productsData.products) {
    // Skip se já tem imagem
    if (product.imagem) {
      console.log(`⊘ ${product.nome_produto} - já tem imagem`);
      continue;
    }

    console.log(`⏳ Baixando imagem: ${product.nome_produto}...`);

    // Obter lista de URLs para a categoria
    const categoryImages = imageUrlsByCategory[product.categoria] ||
      imageUrlsByCategory['Smartphone'];

    // Selecionar uma imagem aleatória da categoria
    const imageUrl = categoryImages[product.id % categoryImages.length];

    // Download da imagem
    const filename = `product-${product.id}.jpg`;
    const downloaded = await downloadImage(imageUrl, filename);

    if (downloaded) {
      product.imagem = `/images/${filename}`;
      updated++;
    } else {
      failed++;
    }

    // Delay para não sobrecarregar
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  // Salvar arquivo atualizado
  fs.writeFileSync(
    PRODUCTS_FILE,
    JSON.stringify(productsData, null, 2),
    'utf-8'
  );

  console.log('\n📊 Resumo:');
  console.log(`✓ Imagens baixadas: ${updated}`);
  console.log(`✗ Falhas: ${failed}`);
  console.log(`\n✅ Processo concluído! Imagens salvas em: ${PUBLIC_IMAGES_DIR}`);
}

main().catch((error) => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
