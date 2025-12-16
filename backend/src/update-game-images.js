const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const { Game } = require("./models/Game");

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hacknohu";

// Game images từ hacknohu79.com - chuyển relative paths thành full URLs
const gameImages = {
  "777": "https://hacknohu79.com/assets/777.png",
  "Đường Mạt Chược": "https://hacknohu79.com/assets/duong-mat-chuoc.png",
  "Kho Báu Aztec": "https://hacknohu79.com/assets/kho-bau-aztec.png",
  "Đường Mạt Chược 2": "https://hacknohu79.com/assets/duong-mat-chuoc-2.png",
  "QUYẾT CHIẾN TIỀN THƯỞNG": "https://hacknohu79.com/assets/quyet-chien-tien-thuong.png",
  "Neko May Mắn": "https://hacknohu79.com/assets/neko-may-man.png",
  "Wild Đạo Tặc": "https://hacknohu79.com/assets/wild-dao-tac.png",
  "Kỳ Lân Mách Nước": "https://hacknohu79.com/assets/ky-lan-mach-nuoc.png",
  "Thỏ May Mắn": "https://hacknohu79.com/assets/tho-may-man.png",
  "Quý bà say rượu": "https://hacknohu79.com/assets/quy-ba-say-ruou.png",
  "Chiến Thắng Cai Shen": "https://hacknohu79.com/assets/chien-thang-cai-shen.png",
  "Cuộc phiêu lưu kho báu": "https://hacknohu79.com/assets/cuoc-phieu-luu-kho-bau.png",
  "Kỳ Quan Inca": "https://hacknohu79.com/assets/ky-quan-inca.png",
  "Rắn vàng chiếu ái": "https://hacknohu79.com/assets/ran-vang-chieu-ai.png",
  "Yakuza Honor": "https://hacknohu79.com/assets/yakuza-honor.png",
  "Geisha's Revenge": "https://hacknohu79.com/assets/geishas-revenge.png",
  "Sôcôla Cao Cấp": "https://hacknohu79.com/assets/socola-cao-cap.png",
  "Sóng Fantasia": "https://hacknohu79.com/assets/song-fantasia.png",
  "Museum Mystery": "https://hacknohu79.com/assets/museum-mystery.png",
  "Oishi Delights": "https://hacknohu79.com/assets/oishi-delights.png",
  "Ba chú heo điên": "https://hacknohu79.com/assets/ba-chu-heo-dien.png",
  "Cánh Cửa Iguazu": "https://hacknohu79.com/assets/canh-cua-iguazu.png",
  "Thợ Săn Cá Mập": "https://hacknohu79.com/assets/tho-san-ca-map.png",
  "Sức nóng bóng đá": "https://hacknohu79.com/assets/suc-nong-bong-da.png",
  "Cuộc Đua Gà Con": "https://hacknohu79.com/assets/cuoc-dua-ga-con.png",
  "Đại Dịch Xác Sống": "https://hacknohu79.com/assets/dai-dich-xac-song.png",
  "Cơn Thịnh Nộ Của Anubis": "https://hacknohu79.com/assets/con-thinh-no-cua-anubis.png",
  "Độc Dược Thần Bí": "https://hacknohu79.com/assets/doc-duoc-than-bi.png",
  "Pinata Wins": "https://hacknohu79.com/assets/pinata-wins.png",
  "Wild Ape #3258": "https://hacknohu79.com/assets/wild-ape-3258.png",
  "Cash Mania": "https://hacknohu79.com/assets/cash-mania.png",
  "Đá Quý Và Vàng": "https://hacknohu79.com/assets/da-quy-va-vang.png",
  "Chú Rồng May Mắn": "https://hacknohu79.com/assets/chu-rong-may-man.png",
  "Long Sinh 2": "https://hacknohu79.com/assets/long-sinh-2.png",
  "Cuộc Đi Săn Của Người Sói": "https://hacknohu79.com/assets/cuoc-di-san-cua-nguoi-soi.png",
  "Kho Báu Của Sa Hoàng": "https://hacknohu79.com/assets/kho-bau-cua-sa-hoang.png",
  "Băng Nhóm Mafia": "https://hacknohu79.com/assets/bang-nhom-mafia.png",
  "Lò Rèn Giàu Có": "https://hacknohu79.com/assets/lo-ren-giau-co.png",
  "Giàu Sang Hạ Gục": "https://hacknohu79.com/assets/giau-sang-ha-guc.png",
  "Thiếu Nữ Cuồng Nộ": "https://hacknohu79.com/assets/thieu-nu-cuong-no.png",
  "Graffiti Đường Phố": "https://hacknohu79.com/assets/graffiti-duong-pho.png",
  
  // Map với tên game trong database (English names)
  "Dragon's Return": "https://hacknohu79.com/assets/long-sinh-2.png", // Rồng Trở Lại -> Long Sinh 2
  "Fortune Ox": "https://hacknohu79.com/assets/trau-vang.png", // Trâu Vàng
  "Gates of Olympus": "https://hacknohu79.com/assets/canh-cua-iguazu.png", // Cổng Olympus -> Cánh Cửa Iguazu (tạm thời)
  "Sweet Bonanza": "https://hacknohu79.com/assets/keo-thach.png", // Kẹo Ngọt -> Kẹo Thạch (tạm thời)
  "Starlight Princess": "https://hacknohu79.com/assets/cong-chua-joker.png", // Công Chúa Ánh Sao -> Công chúa joker (tạm thời)
  "Sugar Rush": "https://hacknohu79.com/assets/sugar-boom.png", // Đường Ngọt -> SUGAR BOOM
  "Wild West Gold": "https://hacknohu79.com/assets/cao-boi-mien-tay.png", // Miền Tây Hoang Dã -> Cao Bồi Miền Tây
  "The Dog House": "https://hacknohu79.com/assets/chu-cho-may-man.png", // Ngôi Nhà Chó -> Chú chó may mắn
  "Big Bass Bonanza": "https://hacknohu79.com/assets/big-bass-bonanza-1000.png", // Cá Lớn
  "Fire Strike": "https://hacknohu79.com/assets/ngon-lua-sieu-cap.png", // Lửa Cháy -> Ngọn Lửa Siêu Cấp
  "Aztec Gems": "https://hacknohu79.com/assets/kho-bau-aztec.png", // Đá Quý Aztec -> Kho Báu Aztec
  "Mahjong Ways": "https://hacknohu79.com/assets/duong-mat-chuoc.png", // Mahjong -> Đường Mạt Chược
  "Lucky Neko": "https://hacknohu79.com/assets/neko-may-man.png", // Mèo May Mắn
  "Piggy Bankers": "https://hacknohu79.com/assets/ba-chu-heo-dien.png", // Heo Tiết Kiệm -> Ba chú heo điên
  "Caishen Wins": "https://hacknohu79.com/assets/chien-thang-cai-shen.png", // Thần Tài -> Chiến Thắng Cai Shen
  "5 Lions Megaways": "https://hacknohu79.com/assets/5-su-tu-tai-sinh.png", // 5 Sư Tử -> 5 Sư Tử Tái Sinh
};

// Mapping Vietnamese names to English names (từ seed.js)
const nameMapping = {
  "Rồng Trở Lại": "Dragon's Return",
  "Trâu Vàng": "Fortune Ox",
  "Cổng Olympus": "Gates of Olympus",
  "Kẹo Ngọt": "Sweet Bonanza",
  "Công Chúa Ánh Sao": "Starlight Princess",
  "Đường Ngọt": "Sugar Rush",
  "Miền Tây Hoang Dã": "Wild West Gold",
  "Ngôi Nhà Chó": "The Dog House",
  "Cá Lớn": "Big Bass Bonanza",
  "Lửa Cháy": "Fire Strike",
  "Đá Quý Aztec": "Aztec Gems",
  "Mahjong": "Mahjong Ways",
  "Mèo May Mắn": "Lucky Neko",
  "Heo Tiết Kiệm": "Piggy Bankers",
  "Thần Tài": "Caishen Wins",
  "5 Sư Tử": "5 Lions Megaways",
};

async function updateGameImages() {
  try {
    await connectDB(MONGO_URI);
    console.log("Connected to MongoDB\n");

    let updated = 0;
    let notFound = 0;

    // Update bằng English names
    for (const [gameName, imageUrl] of Object.entries(gameImages)) {
      // Tìm game bằng English name
      let game = await Game.findOne({ name: gameName });
      
      // Nếu không tìm thấy, thử tìm bằng Vietnamese name
      if (!game) {
        game = await Game.findOne({ vietnamese_name: gameName });
      }
      
      // Nếu vẫn không tìm thấy, thử tìm bằng mapping
      if (!game && nameMapping[gameName]) {
        game = await Game.findOne({ name: nameMapping[gameName] });
      }
      
      if (game) {
        game.image_url = imageUrl;
        await game.save();
        console.log(`✅ Updated: ${game.name} (${game.vietnamese_name})`);
        console.log(`   URL: ${imageUrl}\n`);
        updated++;
      } else {
        console.log(`⚠️  Not found: ${gameName}\n`);
        notFound++;
      }
    }

    console.log("=".repeat(60));
    console.log(`✅ Updated: ${updated} games`);
    if (notFound > 0) {
      console.log(`⚠️  Not found: ${notFound} games`);
    }
    console.log("=".repeat(60));
    console.log("\n💡 Tip: Nếu có game không tìm thấy, có thể tên game trong database khác với tên trong danh sách.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to update game images:", error);
    process.exit(1);
  }
}

updateGameImages();
