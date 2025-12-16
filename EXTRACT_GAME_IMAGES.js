// ============================================
// SCRIPT ĐỂ LẤY HÌNH ẢNH GAME TỪ HACKNOHU79.COM
// ============================================
// 
// HƯỚNG DẪN:
// 1. Mở https://hacknohu79.com và đăng nhập
// 2. Mở Developer Tools (F12)
// 3. Vào tab Console
// 4. Copy toàn bộ script này và paste vào console
// 5. Nhấn Enter để chạy
// 6. Copy kết quả và gửi cho tôi để cập nhật

(async function() {
  console.log('🔍 Đang tìm hình ảnh game từ hacknohu79.com...\n');
  
  const gameImages = {};
  
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ Không tìm thấy token. Vui lòng đăng nhập lại.');
      return;
    }
    
    console.log('✅ Đã tìm thấy token\n');
    
    // Lấy danh sách lobbies
    const lobbiesResponse = await fetch('https://api.hacknohu79.com/api/dashboard/lobbies', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const lobbiesData = await lobbiesResponse.json();
    
    if (!lobbiesData.success) {
      console.error('❌ Không thể lấy danh sách lobbies:', lobbiesData.message);
      return;
    }
    
    console.log(`✅ Tìm thấy ${lobbiesData.data.length} lobbies\n`);
    
    // Lấy games từ mỗi lobby
    for (const lobby of lobbiesData.data) {
      try {
        const gamesResponse = await fetch(`https://api.hacknohu79.com/api/dashboard/games/${lobby.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const gamesData = await gamesResponse.json();
        
        if (gamesData.success && gamesData.data) {
          gamesData.data.forEach(game => {
            if (game.image_url || game.imageUrl || game.logo) {
              const imageUrl = game.image_url || game.imageUrl || game.logo;
              const gameName = game.name || game.vietnamese_name || 'Unknown';
              gameImages[gameName] = imageUrl;
            }
          });
        }
        
        // Delay để tránh rate limit
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (e) {
        console.warn(`⚠️  Lỗi khi lấy games từ lobby ${lobby.name}:`, e.message);
      }
    }
    
    // In kết quả
    console.log('\n📋 HÌNH ẢNH GAME TÌM THẤY:');
    console.log('='.repeat(80));
    
    const entries = Object.entries(gameImages);
    if (entries.length === 0) {
      console.log('⚠️  Không tìm thấy hình ảnh nào. Có thể API trả về format khác.');
      console.log('\n📝 Thử cách khác: Kiểm tra Network tab trong DevTools để xem hình ảnh được load từ đâu.');
    } else {
      entries.forEach(([name, url], index) => {
        console.log(`${index + 1}. ${name}`);
        console.log(`   ${url}\n`);
      });
      
      // Format để copy vào update-game-images.js
      console.log('\n📋 COPY ĐOẠN CODE NÀY VÀO update-game-images.js:');
      console.log('='.repeat(80));
      const formatted = entries.map(([name, url]) => `  "${name}": "${url}"`).join(',\n');
      console.log(`const gameImages = {\n${formatted}\n};`);
    }
    
    // Copy to clipboard nếu có thể
    if (navigator.clipboard && entries.length > 0) {
      const formatted = entries.map(([name, url]) => `  "${name}": "${url}"`).join(',\n');
      const code = `const gameImages = {\n${formatted}\n};`;
      navigator.clipboard.writeText(code).then(() => {
        console.log('\n✅ Đã copy vào clipboard!');
      }).catch(() => {
        console.log('\n⚠️  Không thể copy tự động. Vui lòng copy thủ công.');
      });
    }
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
    console.log('\n📝 Thử cách khác:');
    console.log('1. Mở Network tab trong DevTools');
    console.log('2. Refresh trang');
    console.log('3. Tìm các request hình ảnh (filter: img)');
    console.log('4. Copy URL của các hình ảnh game');
  }
})();

