// --- OPUS AI BRAIN: LOGIC & API COMMUNICATION (2027 ELITE EDITION) ---

const chatbotBrain = {
    getDeviceId() {
        let id = localStorage.getItem('opus_navigator_device_id');
        if (!id) {
            id = 'opus_master_' + Math.random().toString(36).substr(2, 9) + Date.now();
            localStorage.setItem('opus_navigator_device_id', id);
        }
        return id;
    },

    /**
     * Tối ưu hóa dữ liệu Spot gửi đi để tránh lỗi request quá nặng (Payload Too Large)
     */
    getOptimizedContext() {
        const limit = 10; // Chỉ gửi 10 điểm gần nhất hoặc quan trọng nhất để AI không bị "loạn"
        const filter = (spots) => (Array.isArray(spots) ? spots.slice(0, limit).map(s => ({ n: s.name, l: [s.lat, s.lng] })) : []);
        
        return {
            u: filter(window.urbanSpots),
            n: filter(window.natureSpots),
            v: filter(window.vlogSpots)
        };
    },

    async processInput(input, currentCoords = null, hasImage = false) {
        try {
            // 1. CHUẨN BỊ CONTEXT TINH GỌN
            const mapContext = this.getOptimizedContext();

            // 2. GỌI API VỚI CƠ CHẾ TIMEOUT (Chống treo kết nối)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 25000); 

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    allSpots: mapContext, 
                    userLocation: currentCoords, 
                    // SỬA ĐÚNG CHỖ NÀY: Dùng biến hasImage (nếu UI truyền tempImgData vào đây)
                    attachedImage: (typeof hasImage === 'string') ? hasImage : (window.currentImage || null), 
                    deviceId: this.getDeviceId(),
                    isLensMode: !!hasImage,
                    activeCategory: document.getElementById('header-text')?.innerText || "OPUS GLOBAL"
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // 3. XỬ LÝ PHẢN HỒI THEO TỪNG TRẠNG THÁI (MULTI-LANGUAGE ELITE)
if (!response.ok) {
    const isVN = navigator.language.startsWith('vi');

    if (response.status === 413) {
        return isVN 
            ? "Sếp ơi, bức ảnh này quá nặng, vệ tinh Opus không tải nổi. Sếp chụp lại hoặc chọn ảnh nhẹ hơn nhé!" 
            : "Boss, this image is too heavy for the Opus satellite. Please capture a lighter version!";
    }
    if (response.status === 403 || response.status === 422) {
        return isVN 
            ? "Sếp ơi, hình ảnh hoặc nội dung này không phù hợp với tiêu chuẩn Opus. Em xin phép từ chối để bảo vệ 'vibe' nghệ thuật ạ!" 
            : "Boss, this content doesn't meet Opus Elite standards. I must decline to preserve our artistic vibe!";
    }
    throw new Error("Neural link fragmented.");
}

            const data = await response.json();

            // 4. SMART SUGGESTION: Tự động nhắc sếp dùng Lens nếu đang bàn về kỹ thuật
            const triggers = ["góc", "đẹp", "chụp", "bố cục", "ánh sáng", "view"];
            if (triggers.some(t => input.toLowerCase().includes(t)) && !hasImage) {
                console.log("Opus AI Suggestion: Sếp ơi, bật Lens lên để em nhìn hộ bối cảnh cho!");
            }

            return data.reply || "Em đang nghe đây, thưa sếp.";

        } catch (error) {
            console.error("Opus Brain Failure:", error);
            if (error.name === 'AbortError') return "Kết nối vệ tinh quá lâu, có lẽ do ảnh quá nét. Sếp thử lại lần nữa nhé!";
            return "Sếp ơi, hệ thống Neural Link đang tái khởi động. Sếp đợi em trong giây lát!";
        }
    }
};

console.log("Opus 2027: Elite Photography Assistant Brain Sync Completed.");

// --- HỆ THỐNG PHÒNG THỦ OPUS 2027 (CẤM XÓA) ---

// 1. Chặn chuột phải
document.addEventListener('contextmenu', e => e.preventDefault());

// 2. Chặn phím tắt DevTools & Save
document.onkeydown = e => {
    if (e.keyCode == 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67)) || 
        (e.ctrlKey && (e.keyCode == 85 || e.keyCode == 83))
    ) return false;
};

// 3. Chặn kéo thả ảnh
document.addEventListener('dragstart', e => { if(e.target.nodeName==='IMG' || e.target.nodeName==='VIDEO') e.preventDefault(); });

// 4. Phát hiện chụp màn hình
document.addEventListener('keyup', e => { if(e.key === 'PrintScreen') { navigator.clipboard.writeText(''); alert('Opus Security: Screenshot is disabled.'); } });