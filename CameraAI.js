// --- OPUS CAMERA AI SYSTEM 2027 ---
// Quản lý: Hardware Flash, Digital Zoom, Auto-Save, Elite Stamp
// STATUS: 100% ORIGINAL LOGIC + STAMP RELIABILITY ENHANCEMENT

let isFlashOn = false;
let currentZoom = 1;
let videoTrack = null;
let userCoords = null;

// Lắng nghe định vị ngay khi khởi động để sẵn sàng cho Stamp
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (p) => { userCoords = `${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`; },
        null, { enableHighAccuracy: true }
    );
}

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
        
        document.getElementById('ai-suggestion').innerText = "AI Lens: Zoom & Flash Active";
        setupZoomInteractions(video);

        if(window.lucide) lucide.createIcons();
    } catch (err) { 
        alert("Sếp ơi, Mentor cần quyền Camera!"); 
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
    if (!capabilities.torch) { alert("Opus Info: Không hỗ trợ Flash vật lý."); return; }
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

// --- LOGIC CHỤP ẢNH & IN STAMP SANG CHẢNH (UPGRADED) ---
window.capturePhoto = () => {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('capture-canvas');
    if (!video || video.readyState !== 4) return;

    canvas.width = video.videoWidth; 
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(video, 0, 0);
    
    const pad = canvas.width * 0.03;
    const fontSize = canvas.width * 0.022;

    ctx.shadowColor = "black";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // 1. TỐI ƯU PHÔNG CHỮ: Kiểm tra Inter, nếu không có dùng font hệ thống Elite
    const fontElite = "italic 300 " + fontSize + "px 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif";
    ctx.font = fontElite;
    ctx.fillStyle = "white";
    ctx.letterSpacing = "2px";
    ctx.fillText("CAPTURED BY HUMAN", pad, canvas.height - (pad * 2.8));

    ctx.shadowBlur = 10;
    ctx.font = "bold " + (fontSize * 0.9) + "px 'Inter', sans-serif";
    ctx.fillStyle = "#fbbf24"; 
    ctx.letterSpacing = "4px";
    ctx.fillText("VERIFIED BY OPUS-MAP AI", pad, canvas.height - (pad * 1.8));

    // 2. XỬ LÝ DÒNG 3: Luôn đầy đặn Vibe 2027
    ctx.shadowBlur = 5;
    ctx.font = "500 " + (fontSize * 0.6) + "px monospace";
    ctx.fillStyle = "rgba(251, 191, 36, 0.7)";
    ctx.letterSpacing = "1px";
    
    const displayLoc = userCoords ? "LOC: " + userCoords : "LOC: SIGNAL ENCRYPTED // GLOBAL CITIZEN";
    ctx.fillText(displayLoc, pad, canvas.height - (pad * 1.1));

    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = (fontSize * 0.5) + "px monospace";
    ctx.fillText("OPUS_STAMP_" + Date.now(), canvas.width - pad, canvas.height - pad);

    document.body.style.filter = "brightness(2.5)";
    setTimeout(() => { document.body.style.filter = "none"; }, 80);
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "OpusMap_Elite_" + Date.now() + ".jpg";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        const sub = document.getElementById('ai-suggestion');
        if(sub) {
            sub.innerText = "Masterpiece Saved with Elite Stamp!";
            setTimeout(() => { if(videoTrack) sub.innerText = "Opus Zoom: " + currentZoom.toFixed(1) + "x"; }, 2000);
        }
    }, 'image/jpeg', 1.0);
};

// --- HỆ THỐNG PHÒNG THỦ OPUS 2027 (CẤM XÓA - MÃ HÓA MÙ PROTECTED) ---

(function(_0xOpus){
    // Chặn chuột phải
    document.addEventListener('contextmenu', _ => _.preventDefault());
    
    // Chặn phím tắt DevTools & View Source
    document.onkeydown = function(e) {
        if (e.keyCode == 123 || 
            (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67)) || 
            (e.ctrlKey && (e.keyCode == 85 || e.keyCode == 83))
        ) return false;
    };
    
    // Chặn kéo thả tài sản trí tuệ
    document.addEventListener('dragstart', e => { 
        if(['IMG', 'VIDEO', 'CANVAS'].includes(e.target.nodeName)) e.preventDefault(); 
    });
    
    // Chặn PrintScreen & Clear Clipboard
    document.addEventListener('keyup', e => { 
        if(e.key === 'PrintScreen') { 
            navigator.clipboard.writeText(''); 
            alert('Opus Security: Screenshot disabled. Use the official Capture button.'); 
        } 
    });
})(window);

console.log("Opus 2027: Camera Brain & Security Sync Completed.");