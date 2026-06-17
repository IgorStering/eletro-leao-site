import * as fs from 'fs';
import * as path from 'path';
import { fetchAndDownloadProductImage } from '../lib/unsplash';
import { Product } from '../lib/types';

async function downloadProductImages() {
  try {
    console.log('🖼️  Downloading product images from Unsplash...\n');

    // Read products.json
    const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');

    if (!fs.existsSync(productsPath)) {
      console.error('❌ products.json not found. Run "npm run sync" first.');
      process.exit(1);
    }

    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    const products: Product[] = productsData.products || [];

    if (products.length === 0) {
      console.warn('⚠️  No products found');
      return;
    }

    console.log(`Found ${products.length} products. Starting download...\n`);

    let downloaded = 0;
    let failed = 0;
    let alreadyExists = 0;

    // Download images for each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const imagePath = `images/products/${product.produto_id}.jpg`;
      const fullImagePath = path.join(process.cwd(), 'public', imagePath);

      // Check if image already exists
      if (fs.existsSync(fullImagePath)) {
        console.log(`⏭️  [${i + 1}/${products.length}] Image exists: ${product.nome_produto}`);
        alreadyExists++;
        products[i].imagem = `/${imagePath}`;
        continue;
      }

      // Download image
      console.log(
        `⬇️  [${i + 1}/${products.length}] Downloading: ${product.nome_produto}...`
      );

      const imageUrl = await fetchAndDownloadProductImage(
        product.marca,
        product.nome_produto,
        product.produto_id,
        imagePath
      );

      if (imageUrl) {
        products[i].imagem = imageUrl;
        downloaded++;
      } else {
        failed++;
        console.warn(`   ⚠️  Failed to download for: ${product.nome_produto}`);
      }

      // Add small delay to respect API rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Update products.json with image URLs
    const updatedData = {
      ...productsData,
      products,
      lastImageSync: new Date().toISOString(),
    };

    fs.writeFileSync(
      productsPath,
      JSON.stringify(updatedData, null, 2),
      'utf-8'
    );

    console.log('\n📊 Download Summary:');
    console.log(`   ✓ Downloaded: ${downloaded}`);
    console.log(`   ↩️  Already exists: ${alreadyExists}`);
    console.log(`   ✗ Failed: ${failed}`);
    console.log(`\n✅ Updated products.json with image references!`);
  } catch (error) {
    console.error('❌ Error downloading images:', error);
    process.exit(1);
  }
}

downloadProductImages();
