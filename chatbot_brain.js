// --- OPUS AI BRAIN: LOGIC & API COMMUNICATION (2027 EDITION) ---

const chatbotBrain = {
    /**
     * Tạo hoặc lấy Device ID duy nhất từ localStorage
     * Khớp với hệ thống định danh Master - Assistant để quản lý trí nhớ AI
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
     * @param {boolean} hasImage - Trạng thái có đính kèm ảnh hay không (từ chatbot_ui.js)
     * @returns {string} - Phản hồi từ Gemini 3.1 Flash (Sync 2027)
     */
    async processInput(input, currentCoords = null, hasImage = false) {
        try {
            // 1. ĐỒNG BỘ DỮ LIỆU BỐI CẢNH (CONTEXT)
            // Đảm bảo Assistant luôn biết xung quanh Master có những Spot nào đẹp
            const mapContext = {
                urban: (typeof urbanSpots !== 'undefined') ? urbanSpots : [],
                nature: (typeof natureSpots !== 'undefined') ? natureSpots : [],
                vlog: (typeof vlogSpots !== 'undefined') ? vlogSpots : []
            };

            // 2. KẾT NỐI VỚI HỆ THỐNG BACKEND OPUS LUXURY AI
            // Gửi dữ liệu kèm chỉ thị Photography Assistant chuyên sâu
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    message: input,
                    allSpots: mapContext, 
                    userLocation: currentCoords, 
                    attachedImage: window.currentImage || null, 
                    deviceId: this.getDeviceId(),
                    isLensMode: hasImage, // Đồng bộ hóa việc đang phân tích hình ảnh
                    // Chỉ thị nghiêm ngặt: Urban/Nature Only & Anti-Toxic Content
                    systemMode: "Photography_Assistant_2027_Strict",
                    activeCategory: document.getElementById('header-text')?.innerText || "OPUS GLOBAL"
                })
            });

            // 3. KIỂM TRA TRẠNG THÁI KẾT NỐI & NỘI DUNG
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                // Nếu Backend trả về lỗi do vi phạm Content Policy (Nudes/Toxic/Waste)
                if (response.status === 403 || response.status === 422) {
                    return "Sếp ơi, hình ảnh hoặc nội dung này không phù hợp với tiêu chuẩn Urban & Nature cao cấp của Opus. Em xin phép từ chối xử lý để giữ gìn không gian nghệ thuật của chúng ta ạ!";
                }
                
                throw new Error(errorData.reply || "Neural link fragmented.");
            }

            const data = await response.json();
            
            // 4. LOGIC TƯƠNG TÁC THÔNG MINH: Gợi ý sử dụng Lens AI
            // Nếu AI nhận thấy sếp đang hỏi về kỹ thuật chụp, nó sẽ nhắc sếp dùng Lens
            const suggestLens = ["góc chụp", "bố cục", "ánh sáng", "composition", "frame", "lighting"];
            if (suggestLens.some(word => data.reply.toLowerCase().includes(word)) && typeof window.activateAILens === "function") {
                console.log("Opus Logic: Assistant suggests activating Lens Mode for photography guidance.");
            }

            // Trả về câu trả lời để chatbot_ui.js hiển thị
            return data.reply;
            
        } catch (error) {
            console.error("Opus Brain Failure:", error);
            
            // Phản hồi dự phòng giữ đúng phong thái trợ lý Elite của sếp
            return "Sếp ơi, kết nối vệ tinh Opus đang bị nhiễu do bão từ trường tại tọa độ này. Em đang nỗ lực tái lập link để phục vụ sếp, sếp đợi em vài giây nhé!";
        }
    }
};

// Khởi tạo Neural Link thành công
console.log("Opus 2027: Photography Assistant Brain Neural Link established.");