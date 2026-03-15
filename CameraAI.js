// --- OPUS CAMERA AI SYSTEM 2027 ---
// Quản lý: Hardware Flash, Digital Zoom, Auto-Save
// TRẠNG THÁI: GIỮ NGUYÊN LOGIC GỐC 100% - CHỈ KẾT NỐI UI

let isFlashOn = false;
let currentZoom = 1;
let videoTrack = null;

window.activateAILens = async () => {
    const container = document.getElementById('opus-lens-container');
    const video = document.getElementById('camera-feed');
    container.style.display = 'block';
    isFlashOn = false; 
    currentZoom = 1; // Reset zoom khi mở lại
    
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
        
        // Kích hoạt Zoom bằng bánh xe chuột hoặc kéo trên mobile (Logic gốc của sếp)
        setupZoomInteractions(video);

        if(window.lucide) lucide.createIcons();
    } catch (err) { 
        alert("Sếp ơi, Mentor cần quyền Camera!"); 
        window.stopAILens(); 
    }
};

// --- LOGIC ZOOM THỜI ĐẠI 2027 ---
function setupZoomInteractions(videoElement) {
    if (!videoTrack) return;
    const capabilities = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {};
    
    // Kiểm tra xem thiết bị có hỗ trợ Zoom phần cứng không
    if (!capabilities.zoom) {
        console.warn("Opus Info: Thiết bị không hỗ trợ Zoom phần cứng.");
        return;
    }

    // Lắng nghe sự kiện cuộn (Wheel) để Zoom (Logic gốc)
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
    
    // Nếu không hỗ trợ zoom phần cứng, thoát ra để tránh lỗi logic
    if (!capabilities.zoom) return;

    const min = capabilities.zoom.min || 1;
    const max = capabilities.zoom.max || 5;

    currentZoom = Math.min(Math.max(currentZoom, min), max);
    
    try {
        await videoTrack.applyConstraints({ advanced: [{ zoom: currentZoom }] });
        
        // Cập nhật giao diện (khớp với index.html)
        const suggestion = document.getElementById('ai-suggestion');
        if (suggestion) suggestion.innerText = `Opus Zoom: ${currentZoom.toFixed(1)}x`;
        
        // Cập nhật giá trị thanh slider trong HTML (nếu có)
        const zoomSlider = document.querySelector('input[type="range"]');
        if (zoomSlider) zoomSlider.value = currentZoom;

    } catch (e) {
        console.error("Zoom Error:", e);
    }
}

// HÀM QUAN TRỌNG: Khớp với onclick="window.setZoom(this.value)" hoặc nút bấm trong HTML
window.setZoom = (value) => {
    currentZoom = parseFloat(value);
    applyZoom();
};

// HÀM KHÁC: Để hỗ trợ các nút bấm nhanh 1x, 2x, 5x nếu sếp thêm vào sau này
window.changeZoom = (value) => {
    currentZoom = parseFloat(value);
    applyZoom();
};

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
        alert("Opus Info: Thiết bị không hỗ trợ Flash vật lý.");
        return;
    }

    try {
        isFlashOn = !isFlashOn;
        await videoTrack.applyConstraints({ advanced: [{ torch: isFlashOn }] });
        
        const flashBtn = document.getElementById('flash-btn');
        if (flashBtn) {
            flashBtn.classList.toggle('bg-yellow-500', isFlashOn);
            flashBtn.classList.toggle('text-black', isFlashOn);
            flashBtn.classList.toggle('text-yellow-500', !isFlashOn);
        }
    } catch (err) {
        console.error("Flash Error:", err);
    }
};

window.capturePhoto = () => {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('capture-canvas');
    if (!video || video.readyState !== 4) return;

    canvas.width = video.videoWidth; 
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    
    // Hiệu ứng Flash trắng màn hình khi chụp (Vibe 2027)
    document.body.style.filter = "brightness(2.5)";
    setTimeout(() => { document.body.style.filter = "none"; }, 80);
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const fileName = `OpusMap_${Date.now()}.jpg`;
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        const sub = document.getElementById('ai-suggestion');
        if(sub) {
            sub.innerText = "Masterpiece Saved!";
            setTimeout(() => {
                if(videoTrack) sub.innerText = `Opus Zoom: ${currentZoom.toFixed(1)}x`;
            }, 2000);
        }
    }, 'image/jpeg', 1.0);
};