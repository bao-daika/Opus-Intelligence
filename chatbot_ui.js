// --- OPUS AI UI: CENTRAL COMMAND (SILENT & TEXT-ONLY 2027) ---

(function injectGeminiStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* ĐẢM BẢO VỊ TRÍ CHUẨN GIỮA MÀN HÌNH VÀ RESPONSIVE TỐI ƯU */
        #chat-window { 
            position: fixed !important; /* Đổi sang fixed để bám màn hình mobile chuẩn hơn */
            bottom: 20px !important; /* Hạ thấp để không chèn Header trên iPhone 6 */
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 92% !important; 
            max-width: 500px !important;
            height: auto !important;
            max-height: 75vh !important; 
            display: none; 
            flex-direction: column; 
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 9999 !important; /* Đảm bảo luôn nổi trên map */
            border-radius: 28px !important;
            padding: 16px !important;
            overflow: hidden;
        }

        /* TỐI ƯU CHO MOBILE NHỎ (IPHONE 6/7/8) */
        @media (max-width: 640px) or (max-height: 670px) {
            #chat-window {
                bottom: 15px !important;
                max-height: 80vh !important;
                padding: 12px !important;
            }
            .mb-4.p-4.bg-white/5 { padding: 8px !important; margin-bottom: 8px !important; }
        }

        /* FIX LỖI SCROLL: DỒN TIN NHẮN VÀ TẠO KHÔNG GIAN TRƯỢT */
        #chat-messages { 
            flex: 1 1 auto !important; 
            overflow-y: auto !important; 
            display: flex; 
            flex-direction: column; 
            gap: 12px;
            padding-right: 5px;
            -webkit-overflow-scrolling: touch; /* Giúp iPhone scroll mượt */
            min-height: 100px;
        }

        /* LOGIC TỰ XUỐNG DÒNG & CO GIÃN CỦA TEXTAREA */
        #ai-input {
            min-height: 40px;
            max-height: 120px; 
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 10px 12px;
            color: white;
            font-size: 12px;
            transition: height 0.1s ease;
            overflow-wrap: anywhere !important;
            word-break: break-word !important;
            white-space: pre-wrap !important;
            resize: none !important;
            line-height: 1.5;
            outline: none;
        }
        
        #ai-input:focus { border-color: rgba(251, 191, 36, 0.5); }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        #chat-messages::-webkit-scrollbar { width: 3px; }
        #chat-messages::-webkit-scrollbar-thumb { background: rgba(251, 191, 36, 0.3); border-radius: 10px; }

        /* Đảm bảo nội dung không bị tràn */
        .glass { overflow: hidden; }
    `;
    document.head.appendChild(style);
})();

window.currentImage = null;

// 1. KHỞI TẠO HỆ THỐNG & GÁN SỰ KIỆN
document.addEventListener('DOMContentLoaded', () => {
    const oldInput = document.getElementById('ai-input');
    
    if (oldInput && oldInput.tagName === 'INPUT') {
        const textarea = document.createElement('textarea');
        textarea.id = oldInput.id;
        textarea.className = oldInput.className;
        textarea.placeholder = oldInput.placeholder;
        textarea.rows = 1;
        oldInput.parentNode.replaceChild(textarea, oldInput);
    }

    const input = document.getElementById('ai-input');
    const sendBtn = document.getElementById('send-btn');
    const aiCore = document.getElementById('ai-core');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const lensBtn = document.getElementById('lens-btn');
    
    // A. NÚT UPLOAD ẢNH (GEMINI STYLE)
    const inputWrapper = input ? input.parentElement : null;
    if (inputWrapper) {
        if (!document.getElementById('chat-upload-btn')) {
            const uploadTrigger = document.createElement('button');
            uploadTrigger.id = "chat-upload-btn";
            uploadTrigger.className = "p-2 text-white/50 hover:text-yellow-500 transition-colors flex-shrink-0";
            uploadTrigger.innerHTML = `<i data-lucide="image-plus" class="w-5 h-5"></i>`;
            inputWrapper.insertBefore(uploadTrigger, input);
            
            const fileInput = document.createElement('input');
            fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            uploadTrigger.onclick = () => fileInput.click();
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        window.currentImage = event.target.result;
                        showImagePreview(event.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            };
        }
    }

    // B. XỬ LÝ TỰ ĐỘNG XUỐNG DÒNG
    if (input) {
        input.addEventListener('input', function() {
            this.style.height = 'auto';
            let newHeight = this.scrollHeight;
            this.style.height = (newHeight > 120 ? 120 : newHeight) + 'px';
            this.style.overflowY = newHeight > 120 ? 'scroll' : 'hidden';
            
            const msgBox = document.getElementById('chat-messages');
            if(msgBox) msgBox.scrollTop = msgBox.scrollHeight;
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.sendMessage();
            }
        });
    }

    if (sendBtn) sendBtn.onclick = () => window.sendMessage();
    if (aiCore) aiCore.onclick = () => window.toggleChat();
    if (closeChatBtn) closeChatBtn.onclick = () => window.toggleChat();
    if (lensBtn) lensBtn.onclick = () => window.activateAILens();

    const closeLensBtn = document.getElementById('close-lens-btn');
    const captureBtn = document.getElementById('capture-btn');
    if (closeLensBtn) closeLensBtn.onclick = () => window.stopAILens();
    if (captureBtn) captureBtn.onclick = () => window.capturePhoto();

    if (typeof lucide !== 'undefined') lucide.createIcons();
});

// 2. PREVIEW ẢNH
function showImagePreview(src) {
    let previewBox = document.getElementById('image-preview-container');
    const inputArea = document.querySelector('#chat-window > div:last-child');
    
    if (!previewBox && inputArea) {
        previewBox = document.createElement('div');
        previewBox.id = 'image-preview-container';
        previewBox.className = "flex p-3 gap-2 bg-white/5 border-t border-white/10 flex-shrink-0";
        inputArea.parentNode.insertBefore(previewBox, inputArea);
    }
    
    previewBox.innerHTML = `
        <div class="relative w-16 h-16 rounded-lg border border-yellow-500/50 overflow-hidden shadow-xl">
            <img src="${src}" class="w-full h-full object-cover">
            <button onclick="clearPreview()" class="absolute top-0 right-0 bg-black/70 text-white p-1 rounded-bl-lg">
                <i data-lucide="x" class="w-3 h-3"></i>
            </button>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

window.clearPreview = () => {
    window.currentImage = null;
    const previewBox = document.getElementById('image-preview-container');
    if (previewBox) previewBox.remove();
};

// 3. ĐIỀU KHIỂN CỬA SỔ
window.toggleChat = () => {
    const win = document.getElementById('chat-window');
    if (!win) return;
    const isHidden = win.style.display === 'none' || win.style.display === '';
    win.style.display = isHidden ? 'flex' : 'none';
    if (isHidden) {
        const input = document.getElementById('ai-input');
        if (input) setTimeout(() => input.focus(), 200);
        const msgBox = document.getElementById('chat-messages');
        if(msgBox) msgBox.scrollTop = msgBox.scrollHeight;
    }
};

// 4. VISION AI (LENS) - Giữ nguyên hoàn hảo cũ
window.activateAILens = async () => {
    const lensContainer = document.getElementById('opus-lens-container');
    if(lensContainer) lensContainer.style.display = 'block';
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        const video = document.getElementById('camera-feed');
        if(video) { video.srcObject = stream; video.play(); }
    } catch (err) {
        alert("Sếp ơi, hãy cấp quyền camera!");
        window.stopAILens();
    }
};

window.stopAILens = () => {
    const video = document.getElementById('camera-feed');
    if (video && video.srcObject) video.srcObject.getTracks().forEach(t => t.stop());
    const lensContainer = document.getElementById('opus-lens-container');
    if(lensContainer) lensContainer.style.display = 'none';
};

// 5. CHỤP ẢNH
window.capturePhoto = async () => {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('capture-canvas');
    if(!video || !canvas) return;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    window.currentImage = dataUrl;
    window.stopAILens();
    if(document.getElementById('chat-window').style.display !== 'flex') window.toggleChat();
    showImagePreview(dataUrl);
};

// 6. SEND MESSAGE (CHỈ DÙNG TEXT - ĐÃ FIX LỖI COORDINATES)
window.sendMessage = async (overrideText = null) => {
    const input = document.getElementById('ai-input');
    const chatMessages = document.getElementById('chat-messages');
    if (!input || !chatMessages) return;
    
    const text = overrideText || input.value.trim();
    const tempImg = window.currentImage;
    if (!text && !tempImg) return;

    addChatMessageUI(text, true, null, tempImg);
    if (!overrideText) {
        input.value = "";
        input.style.height = '40px';
    }
    window.clearPreview();

    const loadingId = "loading-" + Date.now();
    addChatMessageUI("Assistant is thinking...", false, loadingId);

    try {
        const currentCoords = (typeof userMarker !== 'undefined' && userMarker !== null) ? userMarker.getLatLng() : null;
        let reply = "Em đang học hỏi sếp ơi...";
        
        if (typeof chatbotBrain !== 'undefined') {
            reply = await chatbotBrain.processInput(text, currentCoords, !!tempImg);
        }
        
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) {
            loadingElement.classList.remove('animate-pulse', 'italic');
        }
    } catch (error) {
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.innerText = "Lỗi kết nối vệ tinh, thưa Sếp.";
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

// 7. MESSAGE UI (CHUẨN LUXURY VÀ RESPONSIVE)
function addChatMessageUI(text, isUser, id = null, imgData = null) {
    const msgBox = document.getElementById('chat-messages');
    if(!msgBox) return;
    const wrapper = document.createElement('div');
    if (id) wrapper.id = id;
    
    wrapper.className = isUser ? "flex flex-col items-end mb-4 w-full" : "flex flex-col items-start mb-4 w-full flex-shrink-0";

    if (isUser) {
        wrapper.innerHTML = `
            <div class="glass p-3 rounded-[20px] rounded-tr-none border-yellow-500/30 text-white shadow-xl max-w-[85%]">
                ${imgData ? `<img src="${imgData}" class="w-full rounded-lg mb-2 border border-white/10 object-contain max-h-48">` : ''}
                <div class="text-[11px] leading-relaxed break-words whitespace-pre-wrap">${text}</div>
            </div>
        `;
    } else {
        if (id && id.startsWith('loading-')) wrapper.classList.add('animate-pulse', 'italic');
        wrapper.innerHTML = `
            <div class="bg-white/5 p-3 rounded-[20px] rounded-tl-none border border-white/10 text-white/90 shadow-sm max-w-[85%]">
                <div class="text-[11px] leading-relaxed break-words whitespace-pre-wrap">${text}</div>
            </div>
        `;
    }
    
    msgBox.appendChild(wrapper);
    msgBox.scrollTop = msgBox.scrollHeight;
}