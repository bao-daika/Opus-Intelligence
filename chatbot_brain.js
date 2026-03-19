// --- OPUS AI BRAIN: LOGIC & API COMMUNICATION (2027 GLOBAL ELITE) ---
// [STATUS]: 100% PERFECT SYNC WITH CAMERA LENS & UI FORM
// [STRATEGY]: 1 MEMBER = 1 DOC (UID OVERWRITE) + INSTANT NEURAL BRIDGE

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
     * QUOTA CHECK: Limit 5 uploads per week per device (PRESERVED 100%)
     */
    checkUploadQuota() {
        const quotaKey = `opus_quota_${this.getDeviceId()}`;
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        
        let data = JSON.parse(localStorage.getItem(quotaKey)) || { count: 0, startTime: now };

        if (now - data.startTime > oneWeek) {
            data = { count: 0, startTime: now };
            localStorage.setItem(quotaKey, JSON.stringify(data));
        }

        if (data.count >= 5) {
            const daysLeft = Math.ceil((data.startTime + oneWeek - now) / (24 * 60 * 60 * 1000));
            alert(`Opus Limit: Boss, you have reached your limit of 5 masterpieces this week. Please wait ${daysLeft} day(s) to contribute again.`);
            return false;
        }

        return true;
    },

    /**
     * Consistency Logic: Sha-256 Fingerprinting (DNA MEMORY)
     */
    async getImageHash(base64Str) {
        if (!base64Str) return null;
        // Lấy mẫu 5000 ký tự cuối để hash nhanh mà vẫn chính xác cho Base64
        const msgUint8 = new TextEncoder().encode(base64Str.substring(base64Str.length - 5000)); 
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Payload Optimization for 2027 Satellites
     */
    getOptimizedContext() {
        const limit = 10;
        const filter = (spots) => (Array.isArray(spots) ? spots.slice(0, limit).map(s => ({ n: s.name, l: [s.lat, s.lng] })) : []);
        
        return {
            u: filter(window.urbanSpots),
            n: filter(window.natureSpots),
            a: filter(window.alienSpots),
            h: filter(window.hauntedSpots)
        };
    },

    /**
     * Core Processing: AI Analysis & Score Detection (INSTANT FLOW)
     * [MENTOR FIX]: Đã khai báo đầy đủ biến imageHash và timeoutId để tránh lỗi Logic.
     */
    async processInput(input, currentCoords = null, hasImage = false, tempImgData = null) {
        try {
            // 1. Đồng bộ ảnh từ Camera hoặc Global State
            const activeImage = tempImgData || window.currentImage || null;
            let imageHash = null;

            if (activeImage) {
                imageHash = await this.getImageHash(activeImage);
            }

            // 2. Thiết lập Network Controller cho Satellite Link
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 25000); 

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    allSpots: this.getOptimizedContext(), 
                    userLocation: currentCoords, 
                    attachedImage: activeImage, // SYNCED WITH SERVER
                    isLensMode: !!activeImage,
                    deviceId: this.getDeviceId()
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                if (response.status === 413) return "Boss, the image is too heavy. Use a lighter version.";
                if (response.status === 403 || response.status === 422) return "Boss, vibe violation detected. Request denied.";
                throw new Error("Neural link fragmented.");
            }

            const data = await response.json();
            const aiReply = data.reply || "Processing vision, Boss.";
            const score = data.score || 0;
            const detectedCategory = data.category || "Urban";
            const canUpload = data.canUpload || false; 

            // 3. Lưu Memory & Kích hoạt UI Form (DNA Consistency)
            if (imageHash) {
                localStorage.setItem(`opus_vision_${imageHash}`, JSON.stringify({
                    reply: aiReply,
                    score: score,
                    category: detectedCategory,
                    timestamp: Date.now() 
                }));
            }

            // [INSTANT BRIDGE]: Tự động đẩy data sang Form nếu AI xác nhận
            if (canUpload && window.injectUploadAction && activeImage) {
                window.injectUploadAction({
                    image: activeImage,
                    score: score,
                    category: detectedCategory,
                    lat: currentCoords?.lat || 0,
                    lng: currentCoords?.lng || 0
                });
            }

            return aiReply;

        } catch (error) {
            console.error("Opus Brain Failure:", error);
            if (error.name === 'AbortError') return "Connection timed out, Boss. Try again!";
            return "Neural Link reconnecting... Standby, Boss!";
        }
    },

    /**
     * SECURE UPLOAD: FINAL GATEWAY (INSTANT SYNC & OVERWRITE LOGIC)
     */
    async secureUpload(metadata) {
        if (!this.checkUploadQuota()) return false;

        // Nội dung chống độc hại (Blacklist sếp cung cấp)
        const blacklist = ["nude", "sex", "blood", "kill", "shit", "fuck", "máu", "chết", "cứt", "đái", "dâm", "vú", "lồn", "buồi"];
        const combinedText = `${metadata.title} ${metadata.desc} ${metadata.hardware}`.toLowerCase();
        if (blacklist.some(word => combinedText.includes(word))) {
            alert("Opus Security: Inappropriate content. Blocked, Boss.");
            return false;
        }

        try {
            const user = firebase.auth().currentUser;
            if (!user) { alert("Enter Opus to go Global, Boss!"); return false; }

            const imageHash = await this.getImageHash(metadata.image);
            const cachedData = JSON.parse(localStorage.getItem(`opus_vision_${imageHash}`));
            
            if (!cachedData) {
                alert("Opus Security: AI Verification missing.");
                return false;
            }

            // Gói payload gửi đi (1 Member = 1 Doc qua UID Overwrite trên Server)
            const payload = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                imageData: metadata.image, 
                title: metadata.title,
                description: metadata.desc,
                hardware: metadata.hardware,
                lat: metadata.lat || 0,
                lng: metadata.lng || 0,
                score: cachedData.score,
                category: cachedData.category || "Urban",
                artistLinks: metadata.artistLinks
            };

            const response = await fetch('/api/masterpiece-injection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                alert(errData.error || "Opus Sync Error: Injection failed.");
                return false;
            }

            // Cập nhật Quota thành công
            const quotaKey = `opus_quota_${this.getDeviceId()}`;
            let qData = JSON.parse(localStorage.getItem(quotaKey));
            qData.count += 1;
            localStorage.setItem(quotaKey, JSON.stringify(qData));

            return true;

        } catch (err) {
            console.error("Opus Sync Error:", err);
            return false;
        }
    }
};

/**
 * [INSTANT BRIDGE 2027]: KẾT NỐI CAMERA -> CHATBOT
 */
window.sendToCurator = async (data) => {
    window.currentImage = data.image; // Lưu vào biến toàn cục cho Chatbot UI lấy
    if (window.stopAILens) window.stopAILens();

    const chatWin = document.getElementById('chat-window');
    if (chatWin) chatWin.style.display = 'flex';

    const verifyId = `OPUS_VERIFIED_${data.time}`;
    const analysisMsg = `[Opus Rate System]: Analyzing ${verifyId} captured at ${data.gps || "Unknown Coordinates"}.`;
    
    if (window.sendMessage) {
        await window.sendMessage(analysisMsg);
        const msgBox = document.getElementById('chat-messages');
        if(msgBox) msgBox.scrollTop = msgBox.scrollHeight;
    }
};

// --- HỆ THỐNG PHÒNG THỦ OPUS 2027 (BẢO LƯU 100%) ---
(function() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.onkeydown = e => {
        if (e.keyCode == 123 || 
            (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67)) || 
            (e.ctrlKey && (e.keyCode == 85 || e.keyCode == 83))
        ) return false;
    };
    document.addEventListener('dragstart', e => { 
        if(['IMG', 'VIDEO', 'CANVAS'].includes(e.target.nodeName)) e.preventDefault(); 
    });
    document.addEventListener('keyup', e => { 
        if(e.key === 'PrintScreen') { 
            navigator.clipboard.writeText(''); 
            alert('Opus Security: Screenshot is disabled.'); 
        } 
    });
})();

console.log("Opus 2027: Neural Brain Sync Completed.");