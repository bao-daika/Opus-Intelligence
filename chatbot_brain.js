// --- OPUS AI BRAIN: LOGIC & API COMMUNICATION (2027 GLOBAL ELITE) ---

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
            a: filter(window.alienSpots),  // Đồng bộ với Tab Aliens
            h: filter(window.hauntedSpots) // Đồng bộ với Tab Haunted
        };
    },

    /**
     * Core Processing: AI Analysis & Score Detection (SYNCED WITH 5-MIN WINDOW)
     */
    async processInput(input, currentCoords = null, hasImage = false, tempImgData = null) {
        try {
            const activeImage = tempImgData || window.currentImage || null;
            let imageHash = null;

            // --- MENTOR FIX: TRÍCH XUẤT TIMESTAMP ĐỂ KHỚP 100% VỚI BACKEND ---
            const opusIdMatch = input ? input.match(/OPUS_VERIFIED_(\d+)/) : null;
            const extractedTimestamp = opusIdMatch ? opusIdMatch[1] : Date.now();

            if (activeImage) {
                imageHash = await this.getImageHash(activeImage);
                const cachedResult = localStorage.getItem(`opus_vision_${imageHash}`);
                
                if (cachedResult) {
                    const memory = JSON.parse(cachedResult);
                    console.log("Opus Brain: Memory Match. Consistent score retrieved.");
                    
                    const isFresh = (Date.now() - memory.timestamp) < 300000;
                    if (memory.score >= 6 && isFresh && window.injectUploadAction) {
                        window.injectUploadAction(activeImage, memory.category || "Urban");
                    }
                    return memory.reply;
                }
            }

            const mapContext = this.getOptimizedContext();
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 25000); 

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    allSpots: mapContext, 
                    userLocation: currentCoords, 
                    attachedImage: activeImage, 
                    deviceId: this.getDeviceId(),
                    // TRUYỀN TIMESTAMP ĐỂ SERVER ĐỐI CHIẾU 5 PHÚT
                    clientTimestamp: extractedTimestamp, 
                    isLensMode: !!hasImage,
                    activeCategory: document.getElementById('header-text')?.innerText || "OPUS GLOBAL"
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                if (response.status === 413) return "Boss, the image is too heavy for the Opus satellite. Please use a lighter version.";
                if (response.status === 403 || response.status === 422) return "Boss, this content violates Opus standards. Request denied to preserve the vibe.";
                throw new Error("Neural link fragmented.");
            }

            const data = await response.json();
            const aiReply = data.reply || "I am processing your vision, Boss.";

            // ĐỒNG BỘ 100% VỚI CHAT.JS BACKEND
            const score = data.score || 0;
            const detectedCategory = data.category || "Urban";
            const canUpload = data.canUpload || false; 

            if (imageHash) {
                localStorage.setItem(`opus_vision_${imageHash}`, JSON.stringify({
                    reply: aiReply,
                    score: score,
                    category: detectedCategory,
                    timestamp: Date.now() 
                }));
            }

            // CHỈ HIỆN NÚT "GO GLOBAL" KHI SERVER XÁC NHẬN CAN UPLOAD (DƯỚI 5 PHÚT + SCORE >= 6)
            if (canUpload && window.injectUploadAction && activeImage) {
                window.injectUploadAction(activeImage, detectedCategory);
            }

            return aiReply;

        } catch (error) {
            console.error("Opus Brain Failure:", error);
            if (error.name === 'AbortError') return "Connection timed out. The satellite is busy, Boss. Try again!";
            return "Neural Link reconnecting... Standby, Boss!";
        }
    },

    /**
     * SECURE UPLOAD: FINAL GATEWAY (100% SYNCED WITH FIRESTORE & ARTIST LINKS)
     */
    async secureUpload(imageData, metadata) {
        if (!this.checkUploadQuota()) return false;

        const blacklist = ["nude", "sex", "blood", "kill", "shit", "fuck", "máu", "chết", "cứt", "đái", "dâm", "vú", "lồn", "buồi"];
        const combinedText = `${metadata.title} ${metadata.desc} ${metadata.hardware}`.toLowerCase();
        
        if (blacklist.some(word => combinedText.includes(word))) {
            alert("Opus Security: Inappropriate content detected. Upload blocked, Boss.");
            return false;
        }

        if (!metadata.title || metadata.title.length < 3) {
            alert("Opus Security: Title is too short or invalid, Boss.");
            return false;
        }

        try {
            const imageHash = await this.getImageHash(imageData);
            const cachedData = JSON.parse(localStorage.getItem(`opus_vision_${imageHash}`));
            
            if (!cachedData) {
                alert("Opus Security: AI Verification missing. Please re-analyze.");
                return false;
            }

            // LỚP PHÒNG THỦ CUỐI: Kiểm tra độ tươi ngay lúc bấm nút Upload cuối cùng
            const isFreshNow = (Date.now() - cachedData.timestamp) < 300000;
            if (!isFreshNow) {
                alert("Opus Security: 5-minute window expired during writing. Upload denied, Boss.");
                return false;
            }

            const aiScore = cachedData.score;
            const finalCategory = cachedData.category || "Urban";

            const newPin = {
                name: metadata.title,
                camera: metadata.hardware,
                Description: metadata.desc, 
                lat: (typeof userMarker !== 'undefined' && userMarker) ? userMarker.getLatLng().lat : 0,
                lng: (typeof userMarker !== 'undefined' && userMarker) ? userMarker.getLatLng().lng : 0,
                images: [imageData], 
                timestamp: new Date().toISOString(),
                verified: "USER", 
                category: finalCategory,
                score: aiScore,
                id: 'opus_' + Date.now(),
                // ĐỒNG BỘ 100% VỚI UI: Artist Social Links sếp yêu cầu
                artistLinks: metadata.artistLinks || { ig: "None", yt: "None", fb: "None", li: "None" }
            };

            if (typeof firebase !== 'undefined' && firebase.firestore) {
                await firebase.firestore().collection("global_masterpieces").add(newPin);
                console.log(`Opus 2027: Masterpiece injected into ${finalCategory} with Artist Profile.`);
            }

            const quotaKey = `opus_quota_${this.getDeviceId()}`;
            let qData = JSON.parse(localStorage.getItem(quotaKey));
            qData.count += 1;
            localStorage.setItem(quotaKey, JSON.stringify(qData));

            return true;
        } catch (err) {
            console.error("Opus Sync Error:", err);
            alert("Opus System: Neural link failed. Check your connection, Boss.");
            return false;
        }
    }
};

console.log("Opus 2027: Global Brain Sync Completed (Firestore & 5-Min Window).");

// --- HỆ THỐNG PHÒNG THỦ OPUS 2027 (CẤM XÓA - 100% UNTOUCHED) ---
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = e => {
    if (e.keyCode == 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67)) || 
        (e.ctrlKey && (e.keyCode == 85 || e.keyCode == 83))
    ) return false;
};
document.addEventListener('dragstart', e => { if(['IMG', 'VIDEO', 'CANVAS'].includes(e.target.nodeName)) e.preventDefault(); });
document.addEventListener('keyup', e => { if(e.key === 'PrintScreen') { navigator.clipboard.writeText(''); alert('Opus Security: Screenshot is disabled.'); } });