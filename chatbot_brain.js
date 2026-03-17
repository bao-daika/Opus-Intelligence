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
     * QUOTA CHECK: Limit 5 uploads per week per device
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
            v: filter(window.vlogSpots)
        };
    },

    /**
     * Core Processing: AI Analysis & Score Detection
     */
    async processInput(input, currentCoords = null, hasImage = false, tempImgData = null) {
        try {
            const activeImage = tempImgData || window.currentImage || null;
            let imageHash = null;

            if (activeImage) {
                imageHash = await this.getImageHash(activeImage);
                const cachedResult = localStorage.getItem(`opus_vision_${imageHash}`);
                
                if (cachedResult) {
                    const memory = JSON.parse(cachedResult);
                    console.log("Opus Brain: Memory Match. Consistent score retrieved.");
                    if (memory.score >= 9 && window.injectUploadAction) {
                        window.injectUploadAction(activeImage);
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

            const scoreMatch = aiReply.match(/(\d+(\.\d+)?)\/10/);
            const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;

            if (imageHash) {
                localStorage.setItem(`opus_vision_${imageHash}`, JSON.stringify({
                    reply: aiReply,
                    score: score,
                    timestamp: Date.now()
                }));
            }

            if ((score >= 9 || aiReply.toUpperCase().includes("MASTERPIECE")) && window.injectUploadAction && activeImage) {
                window.injectUploadAction(activeImage);
            }

            const triggers = ["góc", "đẹp", "chụp", "bố cục", "ánh sáng", "view", "angle", "lighting", "composition"];
            if (triggers.some(t => input.toLowerCase().includes(t)) && !hasImage) {
                console.log("Opus AI Suggestion: Boss, activate Lens Mode for a better perspective.");
            }

            return aiReply;

        } catch (error) {
            console.error("Opus Brain Failure:", error);
            if (error.name === 'AbortError') return "Connection timed out. The satellite is busy, Boss. Try again!";
            return "Neural Link reconnecting... Standby, Boss!";
        }
    },

    /**
     * SECURE UPLOAD: FIRESTORE BASE64 INJECTION (No Storage Required)
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
            const aiScore = cachedData ? cachedData.score : 0;

            // Cấu trúc Data chuẩn để index.html vẽ (giống Urban.js)
            const newPin = {
                name: metadata.title,
                camera: metadata.hardware,
                Description: metadata.desc, 
                lat: (typeof userMarker !== 'undefined' && userMarker) ? userMarker.getLatLng().lat : 0,
                lng: (typeof userMarker !== 'undefined' && userMarker) ? userMarker.getLatLng().lng : 0,
                images: [imageData], // Nhét Base64 thẳng vào mảng images
                timestamp: new Date().toISOString(),
                verified: "USER", // Để vẽ chấm Tím/Blue nhỏ
                category: document.getElementById('header-text')?.innerText || "Urban",
                score: aiScore,
                id: 'opus_' + Date.now()
            };

            // BRODCAST THẲNG LÊN FIRESTORE (Lách lỗi Storage Toronto)
            if (typeof firebase !== 'undefined' && firebase.firestore) {
                await firebase.firestore().collection("global_masterpieces").add(newPin);
                console.log("Opus 2027: Masterpiece injected into Firestore successfully.");
            }

            // Cập nhật Quota Local
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

console.log("Opus 2027: Global Brain Sync Completed (Firestore Mode).");

// --- HỆ THỐNG PHÒNG THỦ OPUS 2027 (CẤM XÓA - 100% UNTOUCHED) ---
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = e => {
    if (e.keyCode == 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67)) || 
        (e.ctrlKey && (e.keyCode == 85 || e.keyCode == 83))
    ) return false;
};
document.addEventListener('dragstart', e => { if(e.target.nodeName==='IMG' || e.target.nodeName==='VIDEO') e.preventDefault(); });
document.addEventListener('keyup', e => { if(e.key === 'PrintScreen') { navigator.clipboard.writeText(''); alert('Opus Security: Screenshot is disabled.'); } });