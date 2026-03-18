// --- OPUS CONFIGURATION 2027 ---
// Mentor Update: Chuyển đổi Vlog thành Aliens & Haunted Areas (Bắt trend 2026-2027)
const menuConfig = [
    { id: "urban", label: "URBAN", icon: "building", dataKey: "Urban" }, // Khớp với AI
    { id: "nature", label: "NATURE", icon: "mountain-snow", dataKey: "Nature" }, // Khớp với AI
    { id: "aliens", label: "ALIENS & UFO", icon: "orbit", dataKey: "Aliens" }, // Thay thế Vlog, dùng icon orbit (quỹ đạo) cực vibe
    { id: "haunted", label: "HAUNTED AREAS", icon: "ghost", dataKey: "Haunted" } // Thêm mới Tab huyền bí
];

// FIREBASE ELITE KEY 2027 - GIỮ NGUYÊN 100% THEO LỆNH SẾP
const opusFirebaseConfig = {
    apiKey: "AIzaSyAAH3Ue7HciHJAURntnEcN6VTTuwdnwxZI",
    authDomain: "opus-map-2027.firebaseapp.com",
    projectId: "opus-map-2027",
    storageBucket: "opus-map-2027.firebasestorage.app",
    messagingSenderId: "878459720195",
    appId: "1:878459720195:web:16161a2ebf4df24283b436"
};

const chatbotBrainConfig = {
    // Mọi logic đã nằm trong chatbot_brain.js như ý sếp!
    // Ghi chú Mentor: AI Lens sẽ tự động nhận diện tag "Aliens" và "Haunted" từ đây.
};