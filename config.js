// --- OPUS CONFIGURATION & INTEGRATED BRAIN (2027 SYNC) ---

// 1. CẤU HÌNH MENU & GIAO DIỆN
// Trong config.js
const menuConfig = [
    { id: "urban", label: "URBAN", icon: "building", type: "category" }, // Đổi từ "Urban Landscapes" thành "URBAN"
    { id: "nature", label: "NATURE", icon: "mountain-snow", type: "category" },
    { id: "vlog", label: "VLOG", icon: "trending-up", type: "category" }
];

const markerColors = { 
    urban: "#fbbf24", 
    nature: "#10b981", 
    vlog: "#ff0050" 
};

// 2. BỘ NÃO AI TÍCH HỢP (PHÁT ÂM THANH & TƯ VẤN NHIẾP ẢNH)
const chatbotBrain = {
    /**
     * CHỨC NĂNG PHÁT ÂM THANH (Luxury Voice)
     * AI sẽ trực tiếp trò chuyện với sếp bằng giọng trầm ấm
     */
    speak(text) {
        if (!window.speechSynthesis) return;
        // Hủy các câu nói cũ để không bị đè thanh
        window.speechSynthesis.cancel(); 
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN'; 
        utterance.pitch = 0.9;     // Tông giọng thượng lưu
        utterance.rate = 1.0;      // Tốc độ chuẩn mực
        window.speechSynthesis.speak(utterance);
    },

    /**
     * TÍNH TOÁN GIỜ VÀNG (Metadata 2027)
     * AI dựa trên thời gian thực để đưa ra thông số kỹ thuật (ISO, Khẩu độ)
     */
    getGoldenHour() {
        const now = new Date();
        const hour = now.getHours();
        let advice = "";
        
        if (hour >= 16 && hour <= 18) {
            advice = "Đang là GOLDEN HOUR! Sếp dùng ISO 100, f/8 để lấy chi tiết tốt nhất nhé.";
        } else if (hour < 16) {
            advice = `Còn khoảng ${17 - hour} tiếng nữa tới Giờ Vàng. Sếp nên khảo sát góc trước.`;
        } else {
            advice = "Giờ Vàng đã qua. Chuyển sang chụp Blue Hour hoặc Night City với Tripod thôi sếp!";
        }
        
        this.speak(advice); 
        return advice;
    },

    /**
     * XỬ LÝ NGÔN NGỮ TỰ NHIÊN (Internal Logic)
     * Khớp hoàn toàn với các hàm activateAILens trong chatbot_ui.js
     */
    async processInput(text, coords = null, hasImage = false) {
        const msg = text.toLowerCase();
        let response = "";

        // Ưu tiên xử lý ảnh nếu có (Dành cho chức năng khen ảnh sếp vừa chụp)
        if (hasImage) {
            response = "Tuyệt phẩm sếp ơi! Độ tương phản và đường dẫn hướng này đúng chuẩn nghệ thuật vị nhân sinh của năm 2027 rồi.";
        } 
        // Logic Giờ Vàng
        else if (msg.includes("giờ vàng") || msg.includes("golden")) {
            return this.getGoldenHour();
        }
        // Logic Bố cục & Lens
        else if (msg.includes("bố cục") || msg.includes("overlay") || msg.includes("đẹp") || msg.includes("lens")) {
            if (typeof window.activateAILens === "function") {
                window.activateAILens();
                response = "Em đã kích hoạt AI Lens. Sếp nhìn vào các đường dẫn hướng màu vàng để căn khung hình nhé!";
            } else {
                response = "Hệ thống Lens đang khởi động, sếp chờ em vài giây...";
            }
        } 
        // Logic Trending/Vlog
        else if (msg.includes("trending") || msg.includes("vlog") || msg.includes("hot")) {
            response = "Xung quanh sếp đang có các điểm trending cực hot. Em đã lọc danh mục Vlog cho sếp!";
            // Tự động chuyển category trên Map sang Vlog nếu có hàm handleMenuClick
            if (typeof window.handleMenuClick === "function") {
                window.handleMenuClick('vlog', 'Vlog Hotspots');
            }
        } 
        // Phản hồi mặc định
        else {
            response = "Opus Mentor đã sẵn sàng. Sếp muốn check Golden Hour, kích hoạt AI Lens hay tìm điểm Vlog hot nhất?";
        }

        this.speak(response); 
        return response;
    }
};

console.log("Opus Config: Neural System & Voice Engine Ready.");