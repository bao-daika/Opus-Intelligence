// --- OPUS CAMERA AI SYSTEM 2027 ---
// Quản lý: Hardware Flash, Digital Zoom, Auto-Save, Elite Stamp, AI Safety (Vibe Guard)
// STATUS: 100% ORIGINAL LOGIC + TEXT STROKE RENDERING + INSTANT GPS TRACKING
// [MENTOR NOTE]: ĐÃ THÊM VIỀN CHỮ (STROKE) ĐỂ CHỐNG BLEND NỀN, CAPTURED BY HUMAN THẲNG.
// [UPDATE]: TÍCH HỢP WATCHPOSITION ĐỂ TRIỆT TIÊU DELAY KHI CHỤP.

let isFlashOn = false;
let currentZoom = 1;
let videoTrack = null;
let userCoords = null;
let geoWatchId = null; // Quản lý chu kỳ tracking

// --- 1. KÍCH HOẠT LENS AI (UPGRADED WITH INSTANT TRACKING) ---
window.activateAILens = async () => {
    const container = document.getElementById('opus-lens-container');
    const video = document.getElementById('camera-feed');
    if (!container || !video) return;

    container.style.display = 'block';
    isFlashOn = false; 
    currentZoom = 1; 
    
    // --- KHỞI CHẠY TRACKING TỌA ĐỘ NGAY KHI MỞ LENS ---
    if (navigator.geolocation) {
        geoWatchId = navigator.geolocation.watchPosition(
            (position) => {
                userCoords = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`;
                console.log("Opus Satellite: Locked");
            },
            (err) => { console.warn("Opus GPS: Signal searching..."); },
            { enableHighAccuracy: true }
        );
    }
    
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

// --- 2. LOGIC ZOOM (PRESERVED - DO NOT TOUCH) ---
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

// --- 3. ĐÓNG LENS (RESET CHU KỲ - PRESERVED) ---
window.stopAILens = () => {
    const videoElement = document.getElementById('camera-feed');
    if (videoElement && videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }
    
    // Ngắt tracking GPS để bảo vệ pin và kết thúc phiên làm việc
    if (geoWatchId !== null) {
        navigator.geolocation.clearWatch(geoWatchId);
        geoWatchId = null;
    }
    
    videoTrack = null;
    isFlashOn = false;
    userCoords = null; // Reset tọa độ cho chu kỳ mới
    const container = document.getElementById('opus-lens-container');
    if (container) container.style.display = 'none';
};

// --- 4. HARDWARE FLASH CONTROL (PRESERVED - DO NOT TOUCH) ---
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

// --- 5. [URBAN/NATURE VIBE GUARD] (PRESERVED - DO NOT TOUCH) ---
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

        if (r > 160 && g < 40 && b < 40) bloodPoints++;
        if (r > 190 && g > 140 && b > 110 && r > g && g > b) skinPoints++;
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

// --- 6. CHỤP ẢNH (INSTANT MODE - TRIỆT TIÊU DELAY) ---
window.capturePhoto = async () => {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('capture-canvas');
    if (!video || video.readyState !== 4 || !canvas) return;

    // Tọa độ đã được sync liên tục trong biến userCoords, chụp ngay lập tức!
    executeEliteCapture(video, canvas);
};

// --- 7. ĐÓNG DẤU ELITE STAMP & LƯU (PRESERVED - DO NOT TOUCH) ---
function executeEliteCapture(video, canvas) {
    const TARGET_WIDTH = 1920;
    const scaleFactor = TARGET_WIDTH / video.videoWidth;
    canvas.width = TARGET_WIDTH;
    canvas.height = video.videoHeight * scaleFactor;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if(!checkSafety(ctx, canvas.width, canvas.height)) {
        alert("OPUS AI ERROR: Content does not match Urban/Nature standards.");
        const sub = document.getElementById('ai-suggestion');
        if(sub) sub.innerText = "Vibe Violation: Aborted";
        return;
    }
    
    const pad = canvas.width * 0.03;
    const fontSize = canvas.width * 0.022;

    const getFormattedTime = () => {
        const now = new Date();
        const useNY = !userCoords;
        const timeZone = useNY ? "America/New_York" : undefined;
        const prefix = useNY ? "NEW YORK'S TIME: " : "TIME: ";

        const formatter = new Intl.DateTimeFormat('en-US', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: true, timeZone: timeZone
        });

        const parts = formatter.formatToParts(now);
        const day = parts.find(p => p.type === 'day').value;
        const month = parts.find(p => p.type === 'month').value;
        const year = parts.find(p => p.type === 'year').value;
        const hour = parts.find(p => p.type === 'hour').value;
        const min = parts.find(p => p.type === 'minute').value;
        const sec = parts.find(p => p.type === 'second').value;
        const dayPeriod = parts.find(p => p.type === 'dayPeriod').value;

        return `${prefix}${day} - ${month} - ${year}, ${hour}:${min}:${sec} ${dayPeriod}`;
    };

    const drawEliteText = (text, x, y, font, color, align = "left") => {
        ctx.textAlign = align;
        ctx.font = font;
        ctx.strokeStyle = "black";
        ctx.lineWidth = fontSize * 0.15;
        ctx.lineJoin = "round";
        ctx.strokeText(text, x, y);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    };

    ctx.shadowColor = "transparent";

    drawEliteText("CAPTURED BY HUMAN", pad, canvas.height - (pad * 3.8), `300 ${fontSize}px 'Inter', sans-serif`, "white");
    drawEliteText("VERIFIED BY OPUS-MAP AI", pad, canvas.height - (pad * 2.8), `bold ${fontSize * 0.9}px 'Inter', sans-serif`, "#fbbf24");

    const displayLoc = userCoords ? "LOC: " + userCoords : "LOC: SIGNAL ENCRYPTED // GLOBAL CITIZEN";
    drawEliteText(displayLoc, pad, canvas.height - (pad * 2.0), `500 ${fontSize * 0.6}px monospace`, "white");

    drawEliteText(getFormattedTime(), pad, canvas.height - (pad * 1.3), `500 ${fontSize * 0.6}px monospace`, "white");
    drawEliteText("OPUS_VERIFIED_" + Date.now(), canvas.width - pad, canvas.height - pad, `${fontSize * 0.5}px monospace`, "rgba(255, 255, 255, 0.5)", "right");

    document.body.style.filter = "brightness(2.5)";
    setTimeout(() => { document.body.style.filter = "none"; }, 80);
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const geoTag = userCoords ? userCoords.replace(/, /g, '_') : "GLOBAL";
        link.download = `OPUS_ELITE_${geoTag}_${Date.now()}.webp`;
        link.click();
        window.open(url, '_blank');
        
        const sub = document.getElementById('ai-suggestion');
        if(sub) {
            sub.innerText = `Elite Masterpiece: ${(blob.size/1024).toFixed(0)}KB | WebP 0.7 Ready`;
            setTimeout(() => { if(videoTrack) sub.innerText = "Opus Zoom: " + currentZoom.toFixed(1) + "x"; }, 4000);
        }
    }, 'image/webp', 0.7); 
}

// --- 8. HỆ THỐNG PHÒNG THỦ OPUS 2027 (PRESERVED - DO NOT TOUCH) ---
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