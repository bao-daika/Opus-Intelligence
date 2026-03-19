// --- OPUS AI UI: CENTRAL COMMAND (SECURE & ELITE 2027) ---

(function injectGeminiStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        #chat-window { 
            position: fixed !important; 
            bottom: 20px !important; 
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 92% !important; 
            max-width: 500px !important;
            height: auto !important;
            max-height: 75vh !important; 
            display: none; 
            flex-direction: column; 
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 9999 !important; 
            border-radius: 28px !important;
            padding: 16px !important;
            overflow: hidden;
        }

        @media (max-width: 640px) or (max-height: 670px) {
            #chat-window { bottom: 15px !important; max-height: 80vh !important; padding: 12px !important; }
        }

        #chat-messages { 
            flex: 1 1 auto !important; 
            overflow-y: auto !important; 
            display: flex; 
            flex-direction: column; 
            gap: 12px;
            padding-right: 5px;
            -webkit-overflow-scrolling: touch;
            min-height: 100px;
        }

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
        .locked-btn { opacity: 0.4; filter: grayscale(1); }

        /* OPUS FORM STYLE 2027 */
        .opus-form-input {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 8px;
            color: white;
            font-size: 10px;
            width: 100%;
            margin-bottom: 8px;
            outline: none;
        }
        .opus-form-input:focus { border-color: #fbbf24; }

        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);
})();

// Xóa window.currentImage vì không còn upload ảnh thủ công

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
    
    // --- LOGIC UPLOAD ẢNH THỦ CÔNG ĐÃ BỊ LOẠI BỎ THEO LỆNH SẾP ---

    if (input) {
        input.addEventListener('input', function() {
            this.style.height = 'auto';
            let newHeight = this.scrollHeight;
            this.style.height = (newHeight > 120 ? 120 : newHeight) + 'px';
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
    if (lensBtn) lensBtn.onclick = () => {
        window.toggleChat();
        if(window.activateAILens) window.activateAILens();
    };

    if (typeof lucide !== 'undefined') lucide.createIcons();
});

window.toggleChat = () => {
    const win = document.getElementById('chat-window');
    if (!win) return;
    const isHidden = win.style.display === 'none' || win.style.display === '';
    win.style.display = isHidden ? 'flex' : 'none';
};

window.sendMessage = async (overrideText = null) => {
    const input = document.getElementById('ai-input');
    const chatMessages = document.getElementById('chat-messages');
    if (!input || !chatMessages) return;

    const text = overrideText || input.value.trim();
    if (!text) return; // Chỉ gửi text, không còn xử lý ảnh upload thủ công

    addChatMessageUI(text, true);
    
    if (!overrideText) { input.value = ""; input.style.height = '40px'; }

    const loadingId = "loading-" + Date.now();
    addChatMessageUI("Opus Intelligence is processing...", false, loadingId);

    try {
        const currentCoords = (typeof userMarker !== 'undefined' && userMarker !== null) ? userMarker.getLatLng() : null;
        
        if (typeof chatbotBrain !== 'undefined') {
            // Chỉ gửi text và tọa độ sang bộ não xử lý
            const reply = await chatbotBrain.processInput(text, currentCoords);
            
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement) {
                loadingElement.classList.remove('animate-pulse', 'italic');
                loadingElement.querySelector('.msg-text').innerText = reply;
            }
        }
    } catch (error) {
        const el = document.getElementById(loadingId);
        if (el) el.querySelector('.msg-text').innerText = "Connection lost, Boss.";
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

function addChatMessageUI(text, isUser, id = null, imgData = null) {
    const msgBox = document.getElementById('chat-messages');
    if(!msgBox) return;
    const wrapper = document.createElement('div');
    if (id) wrapper.id = id;
    wrapper.className = isUser ? "flex flex-col items-end mb-4 w-full" : "flex flex-col items-start mb-4 w-full flex-shrink-0";
    
    wrapper.innerHTML = `
        <div class="${isUser ? 'glass border-yellow-500/30' : 'bg-white/5 border-white/10'} p-3 rounded-[20px] ${isUser?'rounded-tr-none':'rounded-tl-none'} border text-white shadow-xl max-w-[85%]">
            ${imgData ? `<img src="${imgData}" class="w-full rounded-lg mb-2 border border-white/10 object-contain max-h-48">` : ''}
            <div class="msg-text text-[11px] leading-relaxed break-words whitespace-pre-wrap">${text}</div>
        </div>
    `;
    msgBox.appendChild(wrapper);
    msgBox.scrollTop = msgBox.scrollHeight;
}

// --- MASTERPIECE FORM: KÍCH HOẠT KHI CÓ DATA TỪ OPUS RATE ---
window.injectUploadAction = (verifiedData) => {
    // verifiedData: { image, score, category, lat, lng } từ Opus Rate
    addChatMessageUI("OPUS RATE VERIFIED: Masterpiece detected! Ready to go global?", false);
    
    const chatMessages = document.getElementById('chat-messages');
    const formWrapper = document.createElement('div');
    formWrapper.id = "masterpiece-form-container";
    formWrapper.className = "flex flex-col gap-2 p-4 glass border border-yellow-500/30 rounded-2xl mt-2 w-[90%] self-start animate-fade-in";
    
    formWrapper.innerHTML = `
        <div class="relative w-full h-32 mb-2 rounded-lg overflow-hidden border border-white/10">
            <img src="${verifiedData.image}" class="w-full h-full object-cover">
            <div class="absolute bottom-0 right-0 bg-yellow-500 text-black px-2 py-1 text-[9px] font-black">SCORE: ${verifiedData.score}</div>
        </div>
        <input type="text" id="final-title" class="opus-form-input" placeholder="Title (Max 5 words)">
        <input type="text" id="final-hardware" class="opus-form-input" placeholder="Hardware (e.g. Sony A7R V)">
        <textarea id="final-desc" class="opus-form-input" placeholder="Description..." rows="2"></textarea>
        
        <div class="text-[9px] text-white/40 mb-1 uppercase tracking-tighter">Artist Social Links (Optional)</div>
        <div class="grid grid-cols-2 gap-2 mb-2">
            <input type="text" id="link-ig" class="opus-form-input !mb-0" placeholder="Instagram">
            <input type="text" id="link-yt" class="opus-form-input !mb-0" placeholder="YouTube">
            <input type="text" id="link-fb" class="opus-form-input !mb-0" placeholder="Facebook">
            <input type="text" id="link-li" class="opus-form-input !mb-0" placeholder="LinkedIn">
        </div>

        <div class="flex gap-2">
            <button id="final-upload-btn" class="flex-1 py-2 bg-yellow-500 text-black rounded-full font-black text-[10px] uppercase hover:scale-105 transition-all">
                Go Global
            </button>
            <button id="final-close-btn" class="flex-1 py-2 bg-white/10 text-white rounded-full font-black text-[10px] uppercase hover:bg-white/20 transition-all">
                Close
            </button>
        </div>
    `;
    
    chatMessages.appendChild(formWrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    document.getElementById('final-close-btn').onclick = () => {
        formWrapper.remove();
        addChatMessageUI("Neural link closed, Boss.", false);
    };

    document.getElementById('final-upload-btn').onclick = async () => {
        const metadata = {
            ...verifiedData, // Inject dữ liệu từ Opus Rate
            title: document.getElementById('final-title').value.trim(),
            hardware: document.getElementById('final-hardware').value.trim(),
            desc: document.getElementById('final-desc').value.trim(),
            artistLinks: {
                ig: document.getElementById('link-ig').value.trim() || "None",
                yt: document.getElementById('link-yt').value.trim() || "None",
                fb: document.getElementById('link-fb').value.trim() || "None",
                li: document.getElementById('link-li').value.trim() || "None"
            }
        };

        if (!metadata.title || !metadata.hardware) {
            alert("Opus Security: Title and Hardware are required, Boss.");
            return;
        }

        const btn = document.getElementById('final-upload-btn');
        btn.disabled = true;
        btn.innerText = "Verifying...";

        // Gửi toàn bộ metadata đã gồm data từ Opus Rate lên Map
        const success = await chatbotBrain.secureUpload(metadata);
        
        if (success) {
            formWrapper.innerHTML = "<p class='text-yellow-500 text-[10px] font-bold italic animate-pulse text-center'>Neural Link Complete. Pin added to Opus Map!</p>";
            setTimeout(() => formWrapper.remove(), 3000);
        } else {
            btn.disabled = false;
            btn.innerText = "Go Global";
            alert("Opus Error: Secure Upload Failed.");
        }
    };
};