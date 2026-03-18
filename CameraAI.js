// --- OPUS CAMERA AI SYSTEM 2027 ---
// Quản lý: Hardware Flash, Digital Zoom, Auto-Save, Elite Stamp, AI Safety (Vibe Guard)
// STATUS: 100% ORIGINAL LOGIC + STRICT URBAN/NATURE FILTER
// [MENTOR NOTE]: ĐÃ ĐỒNG BỘ VỚI CHATBOT_BRAIN & UI. GIỮ NGUYÊN HỆ THỐNG PHÒNG THỦ.

let isFlashOn = false;
let currentZoom = 1;
let videoTrack = null;
let userCoords = null;

// --- 1. KÍCH HOẠT LENS AI ---
window.activateAILens = async () => {
    const container = document.getElementById('opus-lens-container');
    const video = document.getElementById('camera-feed');
    if (!container || !video) return;

    container.style.display = 'block';
    isFlashOn = false; 
    currentZoom = 1; 
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: "environment", 
                width: { ideal: 1920 },
                height: { ideal: 1080 } 
            } 
        });
        video.srcObject = stream;
        videoTrack = stream.getVideoTracks()[0];
        
        const suggestion = document.getElementById('ai-suggestion');
        if (suggestion) suggestion.innerText = "AI Lens: Elite Mode Active";
        
        setupZoomInteractions(video);

        if(window.lucide) lucide.createIcons();
    } catch (err) { 
        alert("Opus System: Mentor requires Camera Permission to proceed!"); 
        window.stopAILens(); 
    }
};

// --- 2. LOGIC ZOOM (MOUSE WHEEL & SLIDER) ---
function setupZoomInteractions(videoElement) {
    if (!videoTrack) return;
    const capabilities = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {};
    if (!capabilities.zoom) return;

    videoElement.addEventListener('wheel', (e) => {
        e.preventDefault();
        let zoomStep = capabilities.zoom.step || 0.1;
        if (e.deltaY < 0) currentZoom += zoomStep * 2;
        else currentZoom -= zoomStep * 2;
        applyZoom();
    }, { passive: false });
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

window.changeZoom = (value) => { currentZoom = parseFloat(value); applyZoom(); };

// --- 3. ĐÓNG LENS ---
window.stopAILens = () => {
    const videoElement = document.getElementById('camera-feed');
    if (videoElement && videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }
    videoTrack = null;
    isFlashOn = false;
    const container = document.getElementById('opus-lens-container');
    if (container) container.style.display = 'none';
};

// --- 4. HARDWARE FLASH CONTROL ---
window.toggleFlash = async () => {
    if (!videoTrack) return;
    const capabilities = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {};
    if (!capabilities.torch) { 
        alert("Opus Info: Physical Flash is not supported on this device."); 
        return; 
    }
    try {
        isFlashOn = !isFlashOn;
        await videoTrack.applyConstraints({ advanced: [{ torch: isFlashOn }] });
        const flashBtn = document.getElementById('flash-btn');
        if (flashBtn) {
            flashBtn.classList.toggle('bg-yellow-500', isFlashOn);
            flashBtn.classList.toggle('text-black', isFlashOn);
        }
    } catch (err) { console.error("Flash Error:", err); }
};

// --- 5. [URBAN/NATURE VIBE GUARD] - BỘ LỌC CHỐNG NUDE/BLOOD/WASTE ---
const checkSafety = (ctx, w, h) => {
    const imgData = ctx.getImageData(0, 0, w, h).data;
    let bloodPoints = 0; 
    let skinPoints = 0;  
    let wastePoints = 0; 
    
    const sampleStep = 40; 
    for (let i = 0; i < imgData.length; i += sampleStep) {
        const r = imgData[i];
        const g = imgData[i+1];
        const b = imgData[i+2];

        // Chặn Máu (Red High Saturation)
        if (r > 160 && g < 40 && b < 40) bloodPoints++;
        // Chặn Nude (Skin Tone 2027 Logic)
        if (r > 190 && g > 140 && b > 110 && r > g && g > b) skinPoints++;
        // Chặn Dơ bẩn (Dirty Brown/Ocher)
        if (r > 80 && r < 140 && g > 60 && g < 100 && b < 40) wastePoints++;
    }

    const totalSamples = imgData.length / sampleStep;
    const violationRatio = (bloodPoints + skinPoints + wastePoints) / totalSamples;

    if (violationRatio > 0.12 || (bloodPoints / totalSamples) > 0.05) {
        console.error("Opus Safety: Vibe Violation Detected.");
        return false;
    }
    return true; 
};

// --- 6. CHỤP ẢNH & SYNC GPS ---
window.capturePhoto = async () => {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('capture-canvas');
    if (!video || video.readyState !== 4 || !canvas) return;

    const sub = document.getElementById('ai-suggestion');
    if (sub) sub.innerText = "Syncing Satellite Data...";

    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { 
                    enableHighAccuracy: true, 
                    timeout: 8000 
                });
            });
            userCoords = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`;
        } catch (err) {
            console.warn("Opus: GPS Signal Weak.");
            userCoords = null; 
        }
    }

    executeEliteCapture(video, canvas);
};

// --- 7. ĐÓNG DẤU ELITE STAMP & LƯU ---
function executeEliteCapture(video, canvas) {
    canvas.width = video.videoWidth; 
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    if(!checkSafety(ctx, canvas.width, canvas.height)) {
        alert("OPUS AI ERROR: Content does not match Urban/Nature standards.");
        const sub = document.getElementById('ai-suggestion');
        if(sub) sub.innerText = "Vibe Violation: Aborted";
        return;
    }
    
    const pad = canvas.width * 0.03;
    const fontSize = canvas.width * 0.022;

    // Watermark & Stamp Logic
    ctx.shadowColor = "black";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const fontElite = `italic 300 ${fontSize}px 'Inter', sans-serif`;
    ctx.font = fontElite;
    ctx.fillStyle = "white";
    ctx.letterSpacing = "2px";
    ctx.fillText("CAPTURED BY HUMAN", pad, canvas.height - (pad * 2.8));

    ctx.font = `bold ${fontSize * 0.9}px 'Inter', sans-serif`;
    ctx.fillStyle = "#fbbf24"; 
    ctx.letterSpacing = "4px";
    ctx.fillText("VERIFIED BY OPUS-MAP AI", pad, canvas.height - (pad * 1.8));

    ctx.font = `500 ${fontSize * 0.6}px monospace`;
    ctx.fillStyle = "rgba(251, 191, 36, 0.7)";
    const displayLoc = userCoords ? "LOC: " + userCoords : "LOC: SIGNAL ENCRYPTED // GLOBAL CITIZEN";
    ctx.fillText(displayLoc, pad, canvas.height - (pad * 1.1));

    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = (fontSize * 0.5) + "px monospace";
    ctx.fillText("OPUS_VERIFIED_" + Date.now(), canvas.width - pad, canvas.height - pad);

    // Flash effect UI
    document.body.style.filter = "brightness(2.5)";
    setTimeout(() => { document.body.style.filter = "none"; }, 80);
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        
        // 1. Lệnh tải về ngầm (vào App Files)
        const link = document.createElement('a');
        link.href = url;
        const geoTag = userCoords ? userCoords.replace(/, /g, '_') : "GLOBAL";
        link.download = `OPUS_MAP_${geoTag}_${Date.now()}.jpg`;
        link.click();
        
        // 2. MỞ TAB MỚI (Dành riêng cho iPhone/Safari sếp đang dùng)
        // Lưu ý: Sếp phải cho phép Popup trên Safari nếu nó hỏi nhé.
        const newWindow = window.open(url, '_blank');
        
        const sub = document.getElementById('ai-suggestion');
        if(sub) {
            if (newWindow) {
                sub.innerText = "Masterpiece Ready! Long-press image to Save to Photos.";
            } else {
                sub.innerText = "Check your 'Files' app for the Elite Stamp!";
            }
            
            // Trả lại trạng thái Zoom sau 4 giây
            setTimeout(() => { 
                if(videoTrack) sub.innerText = "Opus Zoom: " + currentZoom.toFixed(1) + "x"; 
            }, 4000);
        }
    }, 'image/jpeg', 1.0);
}


// --- 8. HỆ THỐNG PHÒNG THỦ OPUS 2027 (STRICT PRESERVED) ---
(function(_0xOpus){
    document.addEventListener('contextmenu', _ => _.preventDefault());
    document.onkeydown = function(e) {
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
            alert('Opus Security: Screenshot disabled.'); 
        } 
    });
})(window);