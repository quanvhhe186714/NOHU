const https = require('https');
const http = require('http');

// List of games from seed.js
const games = [
  { name: "Dragon's Return", slug: "dragons-return", altSlugs: ["dragon-return", "dragon", "dragons"] },
  { name: "Fortune Ox", slug: "fortune-ox", altSlugs: ["fortune", "ox"] },
  { name: "Gates of Olympus", slug: "gates-of-olympus", altSlugs: ["gates-olympus", "olympus", "gates"] },
  { name: "Sweet Bonanza", slug: "sweet-bonanza", altSlugs: ["sweet", "bonanza"] },
  { name: "Starlight Princess", slug: "starlight-princess", altSlugs: ["starlight", "princess"] },
  { name: "Sugar Rush", slug: "sugar-rush", altSlugs: ["sugar", "rush"] },
  { name: "Wild West Gold", slug: "wild-west-gold", altSlugs: ["wild-west", "west-gold"] },
  { name: "The Dog House", slug: "the-dog-house", altSlugs: ["dog-house", "dog"] },
  { name: "Big Bass Bonanza", slug: "big-bass-bonanza", altSlugs: ["big-bass", "bass"] },
  { name: "Fire Strike", slug: "fire-strike", altSlugs: ["fire", "strike"] },
  { name: "Aztec Gems", slug: "aztec-gems", altSlugs: ["aztec", "gems"] },
  { name: "Mahjong Ways", slug: "mahjong-ways", altSlugs: ["mahjong", "ways"] },
  { name: "Lucky Neko", slug: "lucky-neko", altSlugs: ["lucky", "neko"] },
  { name: "Piggy Bankers", slug: "piggy-bankers", altSlugs: ["piggy", "bankers"] },
  { name: "Caishen Wins", slug: "caishen-wins", altSlugs: ["caishen", "wins"] },
  { name: "5 Lions Megaways", slug: "5-lions-megaways", altSlugs: ["lions", "megaways"] },
];

// Extended URL patterns to try
const urlPatterns = [
  // Original patterns
  (slug) => `https://hacknohu79.com/assets/games/${slug}.jpg`,
  (slug) => `https://hacknohu79.com/assets/games/${slug}.png`,
  (slug) => `https://hacknohu79.com/static/media/${slug}.jpg`,
  (slug) => `https://hacknohu79.com/static/media/${slug}.png`,
  (slug) => `https://hacknohu79.com/images/games/${slug}.jpg`,
  (slug) => `https://hacknohu79.com/images/games/${slug}.png`,
  (slug) => `https://hacknohu79.com/games/${slug}.jpg`,
  (slug) => `https://hacknohu79.com/games/${slug}.png`,
  // New patterns
  (slug) => `https://hacknohu79.com/static/games/${slug}.jpg`,
  (slug) => `https://hacknohu79.com/static/games/${slug}.png`,
  (slug) => `https://hacknohu79.com/assets/${slug}.jpg`,
  (slug) => `https://hacknohu79.com/assets/${slug}.png`,
  (slug) => `https://hacknohu79.com/img/games/${slug}.jpg`,
  (slug) => `https://hacknohu79.com/img/games/${slug}.png`,
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https:') ? https : http;
    const req = protocol.get(url, { 
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      // Check if it's actually an image (not a redirect to login page)
      const contentType = res.headers['content-type'] || '';
      const isImage = contentType.startsWith('image/');
      const isRedirect = res.statusCode >= 300 && res.statusCode < 400;
      
      if (res.statusCode === 200 && isImage && !isRedirect) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function findImageUrl(game) {
  console.log(`\n🔍 Checking images for: ${game.name}...`);
  
  // Try main slug first
  for (const pattern of urlPatterns) {
    const url = pattern(game.slug);
    const exists = await checkUrl(url);
    if (exists) {
      console.log(`✅ Found: ${url}`);
      return url;
    }
  }
  
  // Try alternative slugs
  for (const altSlug of game.altSlugs || []) {
    for (const pattern of urlPatterns) {
      const url = pattern(altSlug);
      const exists = await checkUrl(url);
      if (exists) {
        console.log(`✅ Found (alt slug): ${url}`);
        return url;
      }
    }
  }
  
  // Fallback: use a placeholder
  console.log(`⚠️  No image found, using placeholder`);
  return "https://hacknohu79.com/assets/background.gif";
}

async function main() {
  console.log('🚀 Starting to fetch game images (v2 - with better checking)...\n');
  
  const results = [];
  for (const game of games) {
    const imageUrl = await findImageUrl(game);
    results.push({
      ...game,
      image_url: imageUrl,
    });
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n📋 Results:');
  console.log('='.repeat(80));
  results.forEach((game, index) => {
    console.log(`${index + 1}. ${game.name}`);
    console.log(`   URL: ${game.image_url}`);
  });
  
  console.log('\n✅ Done! Copy the URLs above to update seed.js');
  console.log('\n⚠️  NOTE: If all URLs are placeholders, the images may require authentication or use different paths.');
}

main().catch(console.error);

