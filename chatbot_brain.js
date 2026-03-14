// --- OPUS AI BRAIN: LOGIC & API COMMUNICATION (2027 EDITION) ---

const chatbotBrain = {
    /**
     * Tạo hoặc lấy Device ID duy nhất từ localStorage
     * Khớp với hệ thống định danh Boss - Mentor để quản lý trí nhớ AI
     */
    getDeviceId() {
        let id = localStorage.getItem('opus_navigator_device_id');
        if (!id) {
            id = 'opus_master_' + Math.random().toString(36).substr(2, 9) + Date.now();
            localStorage.setItem('opus_navigator_device_id', id);
        }
        return id;
    },

    /**
     * Gửi tin nhắn, hình ảnh và dữ liệu bản đồ lên API xử lý
     * @param {string} input - Tin nhắn từ Master
     * @param {object} currentCoords - Tọa độ thực tế từ bản đồ
     * @param {boolean} lensActive - Trạng thái chế độ Lens (Vision AI)
     * @returns {string} - Phản hồi từ Gemini 3.1 Flash (Sync 2027)
     */
    async processInput(input, currentCoords = null, lensActive = false) {
        try {
            // 1. Đồng bộ dữ liệu các điểm chụp từ các layer (Urban, Nature, Vlog)
            // Đảm bảo AI luôn biết xung quanh Master có những Spot nào đẹp
            const mapContext = {
                urban: (typeof urbanSpots !== 'undefined') ? urbanSpots : [],
                nature: (typeof natureSpots !== 'undefined') ? natureSpots : [],
                vlog: (typeof vlogSpots !== 'undefined') ? vlogSpots : []
            };

            // 2. Kết nối với hệ thống Backend Opus Luxury AI
            // Gửi toàn bộ dữ liệu context để AI phân tích chiều sâu
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    message: input,
                    allSpots: mapContext, // Gửi kho dữ liệu để AI tư vấn địa điểm
                    userLocation: currentCoords, // Tọa độ thực tế để AI tính toán góc nắng, thời tiết
                    attachedImage: window.currentImage || null, // Dữ liệu ảnh từ Vision AI (vừa chụp xong)
                    deviceId: this.getDeviceId(),
                    isLensMode: lensActive, // Thông báo AI đang ở chế độ soi ống kính
                    activeCategory: document.getElementById('header-text')?.innerText || "OPUS GLOBAL"
                })
            });

            // Kiểm tra trạng thái kết nối Neural Link
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.reply || "Neural link fragmented.");
            }

            const data = await response.json();
            
            // 3. LOGIC THÔNG MINH 2027: Tự động tương tác với UI
            // Nếu Mentor nhận thấy sếp đang cần soi bố cục, AI sẽ nhắc nhở mở Lens
            if (data.reply.toLowerCase().includes("mở lens") && typeof window.activateAILens === "function") {
                console.log("Opus Logic: Mentor suggests activating Lens Mode for visual analysis.");
            }

            // Trả về câu trả lời để chatbot_ui.js hiển thị
            return data.reply;
            
        } catch (error) {
            console.error("Opus Brain Failure:", error);
            
            // Phản hồi dự phòng khi mất kết nối (Vibe Mentor lịch lãm, giữ đúng phong cách sếp yêu cầu)
            // Ngay cả khi lỗi, AI vẫn phải giữ phong thái của một trợ lý Elite
            return "Sếp ơi, kết nối vệ tinh Opus đang bị nhiễu do bão từ trường tại tọa độ này. Em đang nỗ lực tái lập link để phục vụ sếp, sếp thử lại sau vài giây nhé!";
        }
    }
};

// Đảm bảo hệ thống AI Core luôn sẵn sàng
console.log("Opus 2027: AI Brain Neural Link established.");