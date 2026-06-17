import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const UNSPLASH_API_URL = 'https://api.unsplash.com';

export interface UnsplashPhoto {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  photographer?: string;
}

export async function searchUnsplash(query: string): Promise<UnsplashPhoto | null> {
  const apiKey = process.env.UNSPLASH_API_KEY;

  if (!apiKey) {
    throw new Error('Missing UNSPLASH_API_KEY in environment variables');
  }

  try {
    const response = await axios.get<{
      results: UnsplashPhoto[];
    }>(`${UNSPLASH_API_URL}/search/photos`, {
      params: {
        query,
        page: 1,
        per_page: 1,
      },
      headers: {
        'Authorization': `Client-ID ${apiKey}`,
      },
    });

    const results = response.data.results;
    if (!results || results.length === 0) {
      console.warn(`No Unsplash results for: "${query}"`);
      return null;
    }

    return results[0];
  } catch (error) {
    console.error(`Error searching Unsplash for "${query}":`, error);
    return null;
  }
}

export async function downloadImage(
  photoUrl: string,
  outputPath: string
): Promise<boolean> {
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Download image
    const response = await axios.get(photoUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
    });

    // Save to file
    fs.writeFileSync(outputPath, response.data);
    console.log(`✓ Downloaded image to ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Error downloading image from ${photoUrl}:`, error);
    return false;
  }
}

export async function fetchAndDownloadProductImage(
  marca: string,
  nome: string,
  productId: string,
  publicImagePath: string
): Promise<string | null> {
  try {
    // Search for image on Unsplash
    const searchQuery = `${marca} ${nome}`;
    const photo = await searchUnsplash(searchQuery);

    if (!photo) {
      console.warn(`Could not find image for: ${searchQuery}`);
      return null;
    }

    // Download the image
    const outputPath = path.join(process.cwd(), 'public', publicImagePath);
    const success = await downloadImage(photo.urls.regular, outputPath);

    if (!success) {
      return null;
    }

    // Return the public path
    return `/${publicImagePath}`;
  } catch (error) {
    console.error(`Error fetching image for ${marca} ${nome}:`, error);
    return null;
  }
}
