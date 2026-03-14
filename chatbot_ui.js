// --- OPUS AI UI: DISPLAY LOGIC (SYNCED WITH INDEX.HTML 2027) ---

window.currentImage = null;

// 1. KHỞI TẠO HỆ THỐNG PHÍM TẮT & EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
    // Khớp với ID 'ai-input' trong index.html của sếp
    const input = document.getElementById('ai-input');
    const sendBtn = document.getElementById('send-btn');

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.sendMessage();
            }
        });
    }

    if (sendBtn) {
        sendBtn.onclick = () => window.sendMessage();
    }
});

// 2. ĐIỀU KHIỂN CỬA SỔ CHAT (SYNC VỚI TOGGLECHAT TRONG INDEX)
window.toggleChat = () => {
    const win = document.getElementById('chat-window');
    if (!win) return;
    const isHidden = win.style.display === 'none' || win.style.display === '';
    win.style.display = isHidden ? 'flex' : 'none';
    
    if (isHidden) {
        const input = document.getElementById('ai-input');
        if (input) setTimeout(() => input.focus(), 100);
        lucide.createIcons(); // Đảm bảo icon x được render
    }
};

// 3. HỆ THỐNG VISION AI: LENS & CAMERA
window.activateAILens = async () => {
    const lensContainer = document.getElementById('opus-lens-container');
    if(lensContainer) lensContainer.style.display = 'block';
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: "environment", 
                width: { ideal: 1920 }, 
                height: { ideal: 1080 } 
            } 
        });
        const video = document.getElementById('camera-feed');
        if(video) {
            video.srcObject = stream;
            video.onloadedmetadata = () => video.play();
        }
        
        const suggestion = document.getElementById('ai-suggestion');
        if(suggestion) suggestion.innerText = "AI Lens: Aligning Aesthetics...";
        
        lucide.createIcons();
    } catch (err) {
        console.error("Camera Access Denied:", err);
        alert("Sếp ơi, Opus AI cần quyền camera để soi bố cục và ánh sáng ạ!");
        window.stopAILens();
    }
};

window.stopAILens = () => {
    const video = document.getElementById('camera-feed');
    if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    const lensContainer = document.getElementById('opus-lens-container');
    if(lensContainer) lensContainer.style.display = 'none';
};

// 4. HÀM CHỤP ẢNH - LƯU MÁY - GỬI MENTOR (PHIÊN BẢN CỦA SẾP)
window.capturePhoto = async () => {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('capture-canvas');
    if(!video || !canvas) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    window.currentImage = dataUrl;

    // A. Hiệu ứng Flash sang trọng
    document.body.style.backgroundColor = "white";
    
    // B. Tự động lưu vào máy User ngay lập tức
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Opus_Masterpiece_${Date.now()}.jpg`;
    link.click();

    setTimeout(() => {
        document.body.style.backgroundColor = "#020617"; // Trả về màu --bg
        window.stopAILens();
        
        // C. Mở chat và gửi cho Mentor phân tích
        if(document.getElementById('chat-window').style.display !== 'flex') {
            window.toggleChat();
        }
        window.sendMessage("Sếp vừa chụp tấm này, Mentor phân tích độ 'nghệ' giúp sếp nhé!");
    }, 150);
};

// 5. LOGIC GỬI TIN NHẮN & GIAO TIẾP VỚI BRAIN
window.sendMessage = async (overrideText = null) => {
    const input = document.getElementById('ai-input');
    const chatMessages = document.getElementById('chat-messages');
    if (!input || !chatMessages) return;
    
    const text = overrideText || input.value.trim();
    if (!text && !window.currentImage) return;

    // Render tin nhắn của Master
    addChatMessageUI(text, true, null, window.currentImage);
    if (!overrideText) input.value = "";

    // Trạng thái AI đang suy nghĩ
    const loadingId = "loading-" + Date.now();
    addChatMessageUI("Mentor is analyzing your frame...", false, loadingId);

    try {
        const currentCoords = (typeof userMarker !== 'undefined' && userMarker) ? userMarker.getLatLng() : null;
        
        // Gửi sang chatbot_brain.js
        const hasImage = !!window.currentImage;
        const reply = await chatbotBrain.processInput(text, currentCoords, hasImage);
        
        // Reset ảnh sau khi gửi
        window.currentImage = null;

        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) {
            loadingElement.classList.remove('animate-pulse', 'italic');
            loadingElement.innerHTML = `<div class="text-[10px] text-yellow-500 font-bold mb-1">MENTOR:</div><div class="text-[11px]">${reply}</div>`; 
        }
    } catch (error) {
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) {
            loadingElement.innerText = "Sóng yếu quá sếp ơi, em chưa đọc được khung hình!";
            loadingElement.classList.remove('animate-pulse');
        }
    }
};

// 6. GIAO DIỆN TIN NHẮN (BẢO LƯU CHẶN COPY/SCREENSHOT QUA CSS TRONG INDEX)
function addChatMessageUI(text, isUser, id = null, imgData = null) {
    const msgBox = document.getElementById('chat-messages');
    if(!msgBox) return;

    const wrapper = document.createElement('div');
    if (id) wrapper.id = id;

    if (isUser) {
        wrapper.className = "flex flex-col items-end space-y-1 ml-10 mb-4 self-end";
        wrapper.innerHTML = `
            <div class="glass p-3 rounded-[20px] rounded-tr-none border-yellow-500/30 text-white shadow-lg">
                ${imgData ? `<img src="${imgData}" class="w-full max-w-[180px] rounded-xl mb-2 border border-white/10">` : ''}
                <div class="text-[10px] leading-relaxed">${text}</div>
            </div>
            <span class="text-[7px] font-black uppercase tracking-[0.2em] text-yellow-500/50 mr-1">Master</span>
        `;
    } else {
        wrapper.className = "bg-white/5 p-3 rounded-[20px] rounded-tl-none border border-white/10 text-white/90 max-w-[90%] mb-4 self-start shadow-sm";
        if (id && id.startsWith('loading-')) wrapper.classList.add('animate-pulse', 'italic');
        wrapper.innerHTML = `<div class="text-[11px]">${text}</div>`;
    }
    
    msgBox.appendChild(wrapper);
    msgBox.scrollTop = msgBox.scrollHeight;
}