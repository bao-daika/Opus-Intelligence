// --- OPUS CAMERA AI SYSTEM 2027 ---
// Quản lý độc lập luồng phần cứng, xử lý ảnh và hệ thống Flash vật lý

let isFlashOn = false;

window.activateAILens = async () => {
    const container = document.getElementById('opus-lens-container');
    const video = document.getElementById('camera-feed');
    container.style.display = 'block';
    isFlashOn = false; 
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: "environment", 
                // Tối ưu nhẹ độ phân giải để Mobile không bị "sốc" nhiệt
                width: { ideal: 1280 }, 
                height: { ideal: 720 } 
            } 
        });
        video.srcObject = stream;
        document.getElementById('ai-suggestion').innerText = "AI Lens: Detecting cinematic depth...";
        if(window.lucide) lucide.createIcons();
    } catch (err) { 
        alert("Sếp ơi, hãy cấp quyền Camera!"); 
        window.stopAILens(); 
    }
};

window.stopAILens = () => {
    const videoElement = document.getElementById('camera-feed');
    const stream = videoElement.srcObject;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    videoElement.srcObject = null;
    isFlashOn = false;
    document.getElementById('opus-lens-container').style.display = 'none';
};

window.toggleFlash = async () => {
    const videoElement = document.getElementById('camera-feed');
    const stream = videoElement.srcObject;
    if (!stream) return;

    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities ? track.getCapabilities() : {};

    if (!capabilities.torch) {
        alert("Opus Info: Thiết bị này không hỗ trợ điều khiển Flash vật lý.");
        return;
    }

    try {
        isFlashOn = !isFlashOn;
        await track.applyConstraints({
            advanced: [{ torch: isFlashOn }]
        });
        
        const flashBtn = document.querySelector('[onclick="toggleFlash()"]');
        if (flashBtn) {
            if (isFlashOn) {
                flashBtn.classList.add('bg-yellow-500', 'text-black');
                flashBtn.classList.remove('text-yellow-500');
            } else {
                flashBtn.classList.remove('bg-yellow-500', 'text-black');
                flashBtn.classList.add('text-yellow-500');
            }
        }
    } catch (err) {
        console.error("Flash Error:", err);
    }
};

window.capturePhoto = () => {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('capture-canvas');
    
    if (video.readyState !== 4) return;

    canvas.width = video.videoWidth; 
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    
    // Vibe Flash đặc trưng
    document.body.style.filter = "brightness(3)";
    setTimeout(() => { document.body.style.filter = "none"; }, 100);
    
    // GIẢI PHÁP CHỐNG CRASH: Sử dụng Blob thay vì DataURL nặng nề
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        
        // Trên Mobile, việc tự động link.click() thường bị chặn hoặc gây crash
        // Em chuyển sang mở ảnh trong tab mới để sếp "chạm và giữ" để lưu (Save Image)
        // Đây là cách chuẩn nhất cho UX Mobile 2027
        const newWindow = window.open(url, '_blank');
        
        if (!newWindow) {
            // Nếu bị chặn popup, dùng giải pháp dự phòng là tải về
            const link = document.createElement('a');
            link.download = `Opus_${Date.now()}.jpg`;
            link.href = url;
            link.click();
        }

        // Dọn dẹp bộ nhớ sau khi dùng
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        console.log("Opus Intelligence: Masterpiece captured.");
    }, 'image/jpeg', 0.9);
};