// --- OPUS CAMERA AI SYSTEM 2026-2027 ---
// Quản lý: Hardware Flash, Digital Zoom, Auto-Save, Elite Stamp, AI Safety (Vibe Guard)
// STATUS: 100% ORIGINAL LOGIC + DUAL-SAVE SYSTEM + INSTANT RATING
// [MENTOR UPDATE]: TẤT CẢ CÁC NÚT ĐỀU TỰ ĐỘNG LƯU VỀ MÁY USER.

let isFlashOn = false;
let currentZoom = 1;
let videoTrack = null;
let userCoords = null;
let geoWatchId = null; 
let lastRatingTime = 0; 

// --- 1. KÍCH HOẠT LENS AI & RE-DESIGN UI ---
window.activateAILens = async () => {
    const container = document.getElementById('opus-lens-container');
    const video = document.getElementById('camera-feed');
    const overlay = container?.querySelector('.lens-overlay');
    if (!container || !video || !overlay) return;

    container.style.display = 'block';
    isFlashOn = false; 
    currentZoom = 1; 
    
    const existingControls = overlay.querySelectorAll('button, .absolute.bottom-12');
    existingControls.forEach(el => el.remove());

    const eliteUI = `
        <div id="opus-dynamic-controls" class="absolute bottom-10 left-0 right-0 flex justify-center items-end gap-6 px-6 pointer-events-auto z-[10000]">
            
            <div class="flex flex-col items-center gap-2 mb-2">
                <button onclick="window.stopAILens()" class="w-12 h-12 bg-black/20 backdrop-blur-md rounded-full text-white/50 flex items-center justify-center active:scale-90 transition border border-white/10">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
                <span class="text-[7px] text-white/30 font-bold uppercase tracking-widest">Close</span>
            </div>

            <div class="flex flex-col items-center gap-2 mb-2">
                <button onclick="window.capturePhoto('FREE')" class="w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center active:scale-90 transition shadow-lg">
                    <i data-lucide="camera" class="text-white w-6 h-6"></i>
                </button>
                <span class="text-[8px] text-white/60 font-black uppercase tracking-tighter">Gallery</span>
            </div>

            <div class="flex flex-col items-center gap-2">
                <div id="rating-cooldown-msg" class="absolute -top-10 text-[9px] text-yellow-500 font-black uppercase tracking-widest hidden animate-pulse">Recharging...</div>
                <button id="btn-rating-main" onclick="window.capturePhoto('RATING')" class="w-20 h-20 rounded-full bg-yellow-500 border-[6px] border-black/30 shadow-[0_0_30px_rgba(251,191,36,0.5)] flex items-center justify-center active:scale-95 transition-all relative overflow-hidden">
                    <i data-lucide="star" class="text-black w-10 h-10"></i>
                    <div id="rating-loader" class="absolute inset-0 bg-black/40 origin-bottom scale-y-0"></div>
                </button>
                <span class="text-[10px] text-yellow-500 font-black uppercase tracking-[0.2em]">Opus Rate</span>
            </div>

            <div class="flex flex-col items-center gap-2 mb-2">
                <button id="flash-btn-lens" onclick="window.toggleFlash()" class="w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center active:scale-90 transition shadow-lg">
                    <i data-lucide="zap" class="text-white w-6 h-6"></i>
                </button>
                <span class="text-[8px] text-white/60 font-black uppercase tracking-tighter">Flash</span>
            </div>
        </div>
    `;
    overlay.insertAdjacentHTML('beforeend', eliteUI);
    if(window.lucide) lucide.createIcons();

    if (navigator.geolocation) {
        geoWatchId = navigator.geolocation.watchPosition(
            (p) => { userCoords = `${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`; },
            (err) => { console.warn("Opus GPS: Searching..."); },
            { enableHighAccuracy: true }
        );
    }
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } } 
        });
        video.srcObject = stream;
        videoTrack = stream.getVideoTracks()[0];
        setupZoomInteractions(video);
        const suggestion = document.getElementById('ai-suggestion');
        if (suggestion) suggestion.innerText = "AI Lens: Elite Mode Active";
    } catch (err) { 
        alert("Opus System: Camera Permission Required!"); 
        window.stopAILens(); 
    }
};

// --- 2. LOGIC ZOOM (PRESERVED) ---
function setupZoomInteractions(videoElement) {
    if (!videoTrack) return;
    videoElement.onclick = () => {
        currentZoom = (currentZoom >= 3) ? 1 : currentZoom + 1;
        applyZoom();
    };
}

async function applyZoom() {
    if (!videoTrack) return;
    const capabilities = videoTrack.getCapabilities();
    if (!capabilities.zoom) return;
    const min = capabilities.zoom.min || 1;
    const max = capabilities.zoom.max || 5;
    currentZoom = Math.min(Math.max(currentZoom, min), max);
    try {
        await videoTrack.applyConstraints({ advanced: [{ zoom: currentZoom }] });
        const suggestion = document.getElementById('ai-suggestion');
        if (suggestion) suggestion.innerText = `Opus Zoom: ${currentZoom.toFixed(1)}x`;
    } catch (e) { console.error("Zoom Error:", e); }
}

// --- 3. ĐÓNG LENS (RESET) ---
window.stopAILens = () => {
    const videoElement = document.getElementById('camera-feed');
    if (videoElement?.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }
    if (geoWatchId !== null) {
        navigator.geolocation.clearWatch(geoWatchId);
        geoWatchId = null;
    }
    videoTrack = null;
    isFlashOn = false;
    userCoords = null;
    document.getElementById('opus-lens-container').style.display = 'none';
};

// --- 4. HARDWARE FLASH (PRESERVED) ---
window.toggleFlash = async () => {
    if (!videoTrack) return;
    const capabilities = videoTrack.getCapabilities();
    if (!capabilities.torch) return;
    try {
        isFlashOn = !isFlashOn;
        await videoTrack.applyConstraints({ advanced: [{ torch: isFlashOn }] });
        document.getElementById('flash-btn-lens').classList.toggle('text-yellow-500', isFlashOn);
    } catch (err) { console.error("Flash Error:", err); }
};

// --- 5. VIBE GUARD (PRESERVED) ---
const checkSafety = (ctx, w, h) => {
    const imgData = ctx.getImageData(0, 0, w, h).data;
    let badPoints = 0;
    const sampleStep = 60; 
    for (let i = 0; i < imgData.length; i += sampleStep) {
        const r = imgData[i], g = imgData[i+1], b = imgData[i+2];
        if (r > 160 && g < 50 && b < 50) badPoints++;
    }
    return (badPoints / (imgData.length / sampleStep)) < 0.12;
};

// --- 6. CHỤP ẢNH (COOLDOWN SYSTEM - ALWAYS AUTOSAVE) ---
window.capturePhoto = async (mode = 'FREE') => {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('capture-canvas');
    if (!video || video.readyState !== 4 || !canvas) return;

    if (mode === 'RATING') {
        const now = Date.now();
        const cooldown = 5000;
        if (now - lastRatingTime < cooldown) {
            const msg = document.getElementById('rating-cooldown-msg');
            if(msg) {
                msg.classList.remove('hidden');
                setTimeout(() => msg.classList.add('hidden'), 2000);
            }
            return;
        }

        const loader = document.getElementById('rating-loader');
        if(loader) {
            loader.style.transition = 'none';
            loader.style.scaleY = '1';
            setTimeout(() => {
                loader.style.transition = `scale-y ${cooldown}ms linear`;
                loader.style.scaleY = '0';
            }, 50);
        }

        lastRatingTime = now;
        executeEliteCapture(video, canvas, true);
    } else {
        executeEliteCapture(video, canvas, false);
    }
};

// --- 7. ĐÓNG DẤU ELITE STAMP & DUAL ACTION (SAVE + RATING) ---
function executeEliteCapture(video, canvas, isRating = false) {
    const TARGET_WIDTH = 1920;
    const scaleFactor = TARGET_WIDTH / video.videoWidth;
    canvas.width = TARGET_WIDTH;
    canvas.height = video.videoHeight * scaleFactor;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if(!checkSafety(ctx, canvas.width, canvas.height)) {
        alert("OPUS AI ERROR: Vibe Violation.");
        return;
    }
    
    // --- RENDER STAMP (BẢO LƯU 100%) ---
    const pad = canvas.width * 0.03;
    const fontSize = canvas.width * 0.022;
    const timestampNow = Date.now();
    const timeStr = new Date().toLocaleString('en-US', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' }).toUpperCase();

    const drawEliteText = (text, x, y, font, color, align = "left") => {
        ctx.textAlign = align; ctx.font = font;
        ctx.strokeStyle = "black"; ctx.lineWidth = fontSize * 0.15; ctx.lineJoin = "round";
        ctx.strokeText(text, x, y); ctx.fillStyle = color; ctx.fillText(text, x, y);
    };

    drawEliteText("CAPTURED BY HUMAN", pad, canvas.height - (pad * 3.8), `300 ${fontSize}px sans-serif`, "white");
    drawEliteText("VERIFIED BY OPUS-MAP AI", pad, canvas.height - (pad * 2.8), `bold ${fontSize * 0.9}px sans-serif`, "#fbbf24");
    drawEliteText(userCoords ? "LOC: " + userCoords : "LOC: SIGNAL ENCRYPTED", pad, canvas.height - (pad * 2.0), `500 ${fontSize * 0.6}px monospace`, "white");
    drawEliteText("TIME: " + timeStr, pad, canvas.height - (pad * 1.3), `500 ${fontSize * 0.6}px monospace`, "white");
    drawEliteText("OPUS_VERIFIED_" + timestampNow, canvas.width - pad, canvas.height - pad, `${fontSize * 0.5}px monospace`, "rgba(255, 255, 255, 0.5)", "right");

    // --- [ACTION 1]: ALWAYS AUTOSAVE FOR ALL MODES ---
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const prefix = isRating ? "OPUS_MASTERPIECE" : "OPUS_FREE";
        link.download = `${prefix}_${timestampNow}.webp`;
        link.click();
        
        // --- [ACTION 2]: IF RATING MODE -> REDIRECT TO AI BRAIN ---
        if (isRating) {
            const smallCanvas = document.createElement('canvas');
            smallCanvas.width = 800;
            smallCanvas.height = canvas.height * (800 / canvas.width);
            smallCanvas.getContext('2d').drawImage(canvas, 0, 0, 800, smallCanvas.height);
            const compressedBase64 = smallCanvas.toDataURL('image/jpeg', 0.6);

            if (window.sendToCurator) {
                // Bridge sẽ đóng Lens và mở Chatbot tự động
                window.sendToCurator({ image: compressedBase64, gps: userCoords, time: timestampNow });
            }
        }
    }, 'image/webp', 0.85);
}

// --- 8. PHÒNG THỦ (PRESERVED) ---
(function(){
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('dragstart', e => { if(['IMG', 'VIDEO', 'CANVAS'].includes(e.target.nodeName)) e.preventDefault(); });
})();