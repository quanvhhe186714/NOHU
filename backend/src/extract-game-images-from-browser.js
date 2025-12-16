// Script này sẽ giúp bạn extract hình ảnh game từ hacknohu79.com
// Chạy script này trong browser console sau khi đã đăng nhập

const extractGameImages = `
// Chạy script này trong browser console (F12) sau khi đã đăng nhập vào hacknohu79.com

(async function() {
  console.log('🔍 Đang tìm hình ảnh game...');
  
  // Lấy tất cả hình ảnh game từ DOM
  const gameImages = [];
  
  // Tìm tất cả img tags trong game cards
  const images = document.querySelectorAll('img');
  
  images.forEach((img, index) => {
    const src = img.src || img.getAttribute('src');
    if (src && !src.includes('background') && !src.includes('icon') && !src.includes('logo')) {
      // Kiểm tra xem có phải hình ảnh game không
      const parent = img.closest('[class*="game"], [class*="card"]');
      if (parent) {
        const gameName = parent.querySelector('[class*="name"], [class*="title"]')?.textContent?.trim();
        gameImages.push({
          index: index + 1,
          src: src,
          gameName: gameName || 'Unknown',
          alt: img.alt || ''
        });
      }
    }
  });
  
  // Hoặc tìm từ API response nếu có
  try {
    const response = await fetch('https://api.hacknohu79.com/api/dashboard/games/1', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    const data = await response.json();
    
    if (data.success && data.data) {
      console.log('📋 Game data from API:');
      data.data.forEach((game, index) => {
        console.log(\`\${index + 1}. \${game.name || game.vietnamese_name}\`);
        console.log(\`   Image URL: \${game.image_url || game.imageUrl || game.logo}\`);
        console.log('');
      });
    }
  } catch (e) {
    console.log('⚠️  Could not fetch from API:', e.message);
  }
  
  // In kết quả
  console.log('\\n📋 Hình ảnh tìm thấy:');
  console.log('='.repeat(80));
  gameImages.forEach(item => {
    console.log(\`\${item.index}. \${item.gameName}\`);
    console.log(\`   URL: \${item.src}\`);
    console.log('');
  });
  
  // Copy to clipboard
  const urls = gameImages.map(item => \`"\${item.gameName}": "\${item.src}"\`).join(',\\n  ');
  console.log('\\n📋 Copy đoạn code này vào update-game-images.js:');
  console.log('='.repeat(80));
  console.log(\`const gameImages = {\\n  \${urls}\\n};\`);
})();
`;

console.log('📝 Script để extract hình ảnh game:');
console.log('='.repeat(80));
console.log(extractGameImages);
console.log('='.repeat(80));
console.log('\n📌 Hướng dẫn:');
console.log('1. Mở hacknohu79.com và đăng nhập');
console.log('2. Mở Developer Tools (F12)');
console.log('3. Vào tab Console');
console.log('4. Copy và paste script trên vào console');
console.log('5. Nhấn Enter để chạy');
console.log('6. Copy kết quả và cập nhật vào update-game-images.js');

