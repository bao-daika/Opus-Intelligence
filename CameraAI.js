// --- OPUS CAMERA AI SYSTEM 2027 ---
// Quản lý: Hardware Flash, Digital Zoom, Auto-Save, Elite Stamp, AI Safety (Vibe Guard)
// STATUS: 100% ORIGINAL LOGIC + STRICT URBAN/NATURE FILTER
// [MENTOR NOTE]: PRESERVED SYNC LOGIC. ADDED ADVANCED PIXEL-SCAN FOR BLOOD/NUDE/WASTE.

let isFlashOn = false;
let currentZoom = 1;
let videoTrack = null;
let userCoords = null;

window.activateAILens = async () => {
    const container = document.getElementById('opus-lens-container');
    const video = document.getElementById('camera-feed');
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
        
        document.getElementById('ai-suggestion').innerText = "AI Lens: Elite Mode Active";
        setupZoomInteractions(video);

        if(window.lucide) lucide.createIcons();
    } catch (err) { 
        alert("Opus System: Mentor requires Camera Permission to proceed!"); 
        window.stopAILens(); 
    }
};

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

window.stopAILens = () => {
    const videoElement = document.getElementById('camera-feed');
    if (videoElement && videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }
    videoTrack = null;
    isFlashOn = false;
    document.getElementById('opus-lens-container').style.display = 'none';
};

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

// --- [URBAN/NATURE VIBE GUARD] - BỘ LỌC MẠNH MẼ ---
const checkSafety = (ctx, w, h) => {
    const imgData = ctx.getImageData(0, 0, w, h).data;
    let bloodPoints = 0; // Máu me (Red saturation)
    let skinPoints = 0;  // Nude/Sensitive (Skin tones)
    let wastePoints = 0; // Cứt đái/Dơ bẩn (Ocher/Brown/Dirty Green)
    
    const sampleStep = 40; // Quét mẫu mật độ cao
    for (let i = 0; i < imgData.length; i += sampleStep) {
        const r = imgData[i];
        const g = imgData[i+1];
        const b = imgData[i+2];

        // 1. Chặn Máu (Red High Saturation)
        if (r > 160 && g < 40 && b < 40) bloodPoints++;
        
        // 2. Chặn Nude (Skin Tone Detection 2027 Logic)
        if (r > 190 && g > 140 && b > 110 && r > g && g > b) skinPoints++;

        // 3. Chặn Dơ bẩn/Cứt đái (Dirty Brown/Ocher)
        if (r > 80 && r < 140 && g > 60 && g < 100 && b < 40) wastePoints++;
    }

    const totalSamples = imgData.length / sampleStep;
    const violationRatio = (bloodPoints + skinPoints + wastePoints) / totalSamples;

    // Nếu vi phạm > 12% diện tích bề mặt hoặc có dấu hiệu máu tập trung -> CÚT.
    if (violationRatio > 0.12 || (bloodPoints / totalSamples) > 0.05) {
        console.error("Opus Safety: Vibe Violation Detected.");
        return false;
    }
    return true; 
};

// --- [FIXED LOGIC] CHỤP ẢNH VÀ BẮT BUỘC ĐỢI XÁC NHẬN TỌA ĐỘ ---
window.capturePhoto = async () => {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('capture-canvas');
    if (!video || video.readyState !== 4) return;

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
            console.warn("Opus: GPS Signal Weak or Denied.");
            userCoords = null; 
        }
    }

    executeEliteCapture(video, canvas);
};

function executeEliteCapture(video, canvas) {
    canvas.width = video.videoWidth; 
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    // KIỂM TRA FILTER TRƯỚC KHI ĐÓNG DẤU VÀ LƯU
    if(!checkSafety(ctx, canvas.width, canvas.height)) {
        alert("OPUS AI ERROR: Content does not match Urban/Nature standards. System rejected storage.");
        const sub = document.getElementById('ai-suggestion');
        if(sub) sub.innerText = "Vibe Violation: Capture Aborted";
        return;
    }
    
    const pad = canvas.width * 0.03;
    const fontSize = canvas.width * 0.022;

    if (userCoords) {
        const [lat, lng] = userCoords.split(',').map(Number);
        ctx.fillStyle = `rgba(${Math.abs(Math.floor(lat))}, ${Math.floor((lat % 1) * 255)}, ${Math.abs(Math.floor(lng))}, 0.01)`;
        ctx.fillRect(0, 0, 1, 1);
    }

    ctx.shadowColor = "black";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const fontElite = "italic 300 " + fontSize + "px 'Inter', sans-serif";
    ctx.font = fontElite;
    ctx.fillStyle = "white";
    ctx.letterSpacing = "2px";
    ctx.fillText("CAPTURED BY HUMAN", pad, canvas.height - (pad * 2.8));

    ctx.font = "bold " + (fontSize * 0.9) + "px 'Inter', sans-serif";
    ctx.fillStyle = "#fbbf24"; 
    ctx.letterSpacing = "4px";
    ctx.fillText("VERIFIED BY OPUS-MAP AI", pad, canvas.height - (pad * 1.8));

    ctx.font = "500 " + (fontSize * 0.6) + "px monospace";
    ctx.fillStyle = "rgba(251, 191, 36, 0.7)";
    const displayLoc = userCoords ? "LOC: " + userCoords : "LOC: SIGNAL ENCRYPTED // GLOBAL CITIZEN";
    ctx.fillText(displayLoc, pad, canvas.height - (pad * 1.1));

    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = (fontSize * 0.5) + "px monospace";
    ctx.fillText("OPUS_VERIFIED_" + Date.now(), canvas.width - pad, canvas.height - pad);

    document.body.style.filter = "brightness(2.5)";
    setTimeout(() => { document.body.style.filter = "none"; }, 80);
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const geoTag = userCoords ? userCoords.replace(/, /g, '_') : "GLOBAL";
        link.download = `OPUS_MAP_${geoTag}_${Date.now()}.jpg`;
        link.click();
        
        const sub = document.getElementById('ai-suggestion');
        if(sub) {
            sub.innerText = "Masterpiece Saved with Elite Stamp!";
            setTimeout(() => { if(videoTrack) sub.innerText = "Opus Zoom: " + currentZoom.toFixed(1) + "x"; }, 2000);
        }
    }, 'image/jpeg', 1.0);
}

// --- HỆ THỐNG PHÒNG THỦ OPUS 2027 (PRESERVED) ---
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