import * as fs from 'fs';
import * as path from 'path';
import { getGoogleSheetsData } from '../lib/google-sheets';
import { Product } from '../lib/types';

async function syncSheetsToJson() {
  try {
    console.log('🔄 Synchronizing Google Sheets to products.json...\n');

    // Fetch data from Google Sheets
    const products = await getGoogleSheetsData();

    if (products.length === 0) {
      console.warn('⚠️  No products found in Google Sheets');
      return;
    }

    // Prepare output file path
    const outputPath = path.join(process.cwd(), 'src', 'data', 'products.json');
    const outputDir = path.dirname(outputPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Prepare data structure
    const data = {
      lastSync: new Date().toISOString(),
      totalProducts: products.length,
      products,
    };

    // Write to file
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');

    console.log(`\n✅ Successfully synced ${products.length} products!`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log('\n📋 Product summary:');

    // Group by category
    const byCategory: { [key: string]: number } = {};
    products.forEach((p) => {
      byCategory[p.categoria] = (byCategory[p.categoria] || 0) + 1;
    });

    Object.entries(byCategory).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count} products`);
    });

    console.log('\n⏭️  Next step: Run "npm run download-images" to download product images');
  } catch (error) {
    console.error('❌ Error syncing data:', error);
    process.exit(1);
  }
}

syncSheetsToJson();
