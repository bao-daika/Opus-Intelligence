/**
 * OPUS ELITE ENGINE 2027: GLOBAL VIBE EDITION
 * [CORE]: Camera, AI Vision & Comic Action Integration.
 */

let currentStyle = 'none'; 
let animationFrameId = null;
let isFlashOn = false;
let isMicOn = true; 
let videoTrack = null;
let userCoords = null; 
let geoWatchId = null;

// MediaRecorder & Audio Mixing Logic
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;
let isPlayingMusic = false;
let audioContext, audioDestination, bgMusic, micStreamSource, musicSourceNode, micGainNode, musicGainNode;

const OpusShaders = {
    // 🤖 CYBER: Total Cyan Future (No Lag - GPU Optimized)
    cyber: (ctx, w, h) => {
        // Ép toàn bộ màu về tone xanh băng giá bằng sepia + hue-rotate
        ctx.filter = 'sepia(1) hue-rotate(150deg) saturate(3) brightness(1.1) contrast(1.2)';
        
        ctx.globalCompositeOperation = 'screen';
        // Lớp sương mù kỹ thuật số Cyan
        const cyberGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w);
        cyberGrad.addColorStop(0, 'rgba(0, 255, 255, 0.2)');
        cyberGrad.addColorStop(1, 'rgba(0, 100, 100, 0.4)');
        ctx.fillStyle = cyberGrad;
        ctx.fillRect(0, 0, w, h);
        
        // Viền tối công nghệ (Vignette)
        ctx.globalCompositeOperation = 'multiply';
        const vigne = ctx.createRadialGradient(w/2, h/2, w*0.3, w/2, h/2, w);
        vigne.addColorStop(0, 'transparent');
        vigne.addColorStop(1, 'rgba(0, 50, 50, 0.8)');
        ctx.fillStyle = vigne;
        ctx.fillRect(0, 0, w, h);
        
        ctx.globalCompositeOperation = 'source-over';
    },

    // 👻 SPIRIT: Classic Haunted
    spirit: (ctx, w, h) => { 
        ctx.filter = 'grayscale(1) contrast(1000%) invert(1)'; 
    },

    // 👁️ INFRARED: Cyclops X-Men (Tia hồng ngoại rực cháy)
    infrared: (ctx, w, h) => {
        ctx.filter = 'sepia(1) hue-rotate(-50deg) saturate(5) contrast(1.5) brightness(1.2)';
        
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.fillRect(0, 0, w, h);
        
        // Hiệu ứng tia nhìn tập trung
        const cyclops = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w);
        cyclops.addColorStop(0, 'rgba(255, 255, 0, 0.1)');
        cyclops.addColorStop(0.5, 'rgba(255, 0, 0, 0.2)');
        cyclops.addColorStop(1, 'rgba(50, 0, 0, 0.7)');
        ctx.fillStyle = cyclops;
        ctx.fillRect(0, 0, w, h);
        
        ctx.globalCompositeOperation = 'source-over';
    },
    
    // 🌅 GOLDEN: Ultra Mexico Sunset (Vàng cháy Sahara)
    golden: (ctx, w, h) => {
        // Nhuộm vàng toàn bộ thế giới, tăng bão hòa cực mạnh
        ctx.filter = 'sepia(1) hue-rotate(-15deg) saturate(4) contrast(1.1) brightness(1.1)';
        
        // Lớp phủ nắng cháy (Burnt Orange)
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(255, 150, 0, 0.3)';
        ctx.fillRect(0, 0, w, h);
        
        // Hiệu ứng mặt trời chói chang từ góc cao
        ctx.globalCompositeOperation = 'screen';
        const sahara = ctx.createRadialGradient(w, 0, 0, w, 0, w*1.2);
        sahara.addColorStop(0, 'rgba(255, 255, 100, 0.6)');
        sahara.addColorStop(0.4, 'rgba(255, 100, 0, 0.3)');
        sahara.addColorStop(1, 'transparent');
        ctx.fillStyle = sahara;
        ctx.fillRect(0, 0, w, h);
        
        ctx.globalCompositeOperation = 'source-over';
    },

    // 🕸️ THE VOID: Bí ẩn tối tăm (Đã bỏ vòng lặp for để mượt hơn)
    void: (ctx, w, h) => {
        ctx.filter = 'contrast(1.8) brightness(0.6) hue-rotate(130deg) saturate(0.2) blur(0.5px)';
        ctx.globalCompositeOperation = 'multiply';
        const voidGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w);
        voidGrad.addColorStop(0, 'transparent');
        voidGrad.addColorStop(1, 'black');
        ctx.fillStyle = voidGrad;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
    },

    // ☁️ HEAVEN: Trắng sáng & Sương mờ (Elite Edition)
    heaven: (ctx, w, h) => {
        const time = Date.now() * 0.001; 
        ctx.filter = 'brightness(1.8) contrast(0.5) saturate(0.2) blur(1px)';
        
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        // Hiệu ứng mây trôi dùng Gradient tuyến tính (nhẹ hơn Radial)
        const shift = Math.sin(time * 0.5) * 50;
        const fog = ctx.createLinearGradient(0, h, 0, 0);
        fog.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        fog.addColorStop(0.5 + (shift/100), 'rgba(255, 255, 255, 0.4)');
        fog.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        ctx.fillStyle = fog;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
    },

    // 🌈 ACID: Siêu màu sắc
    acid: (ctx, w, h) => {
        const speed = Date.now() / 40; 
        ctx.filter = `hue-rotate(${speed % 360}deg) saturate(3) contrast(1.4) brightness(1.2)`;
    },

    none: (ctx) => { ctx.filter = 'none'; }
};

window.setStyle = (style) => {
    currentStyle = style;
    document.querySelectorAll('.filter-chip').forEach(btn => {
        const onClickAttr = btn.getAttribute('onclick') || "";
        btn.classList.toggle('active', onClickAttr.includes(`'${style}'`));
    });
};

window.setVibeVolume = (val) => {
    if (musicGainNode) {
        musicGainNode.gain.setTargetAtTime(val, audioContext.currentTime, 0.01);
    }
};

window.activateAILens = async () => {
    const container = document.getElementById('opus-lens-container');
    const video = document.getElementById('camera-feed');
    const liveCanvas = document.getElementById('capture-canvas-live');
    const overlay = container?.querySelector('.lens-overlay');

    if (!container || !video || !liveCanvas || !overlay) return;
    container.style.display = 'block';

    if (window.initMusicEngine) window.initMusicEngine();

    const existingControls = document.getElementById('opus-dynamic-controls');
    if (existingControls) existingControls.remove();

    const vibeItems = window.vibeLibrary.map(v => `
        <div onclick="window.selectVibe('${v.id}')" class="px-4 py-3 text-[9px] text-white/70 hover:bg-yellow-500 hover:text-black transition uppercase font-black cursor-pointer border-b border-white/5">${v.name}</div>
    `).join('');

    const actionItems = window.actionLibrary.map(a => `
        <div onclick="window.selectAction('${a.id}')" class="px-4 py-3 text-[9px] text-white/70 hover:bg-red-500 hover:text-white transition uppercase font-black cursor-pointer border-b border-white/5">${a.name}</div>
    `).join('');

    const eliteUI = `
        <div id="opus-dynamic-controls" class="absolute inset-0 pointer-events-none z-[10000]">
            <div class="absolute top-10 right-10 opacity-0 transition-opacity" id="rec-indicator">
                <div class="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-red-500/50">
                    <div class="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span class="text-white font-mono text-[10px] tracking-widest uppercase">Recording</span>
                </div>
            </div>

            <div class="absolute top-24 right-10 flex flex-col items-center gap-4 pointer-events-auto">
                <button onclick="window.toggleMic()" class="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/10 active:scale-90 transition">
                    <i data-lucide="mic" id="mic-icon" class="w-5 h-5"></i>
                </button>
                <div class="flex flex-col items-center gap-2 bg-black/20 backdrop-blur-sm p-2 rounded-full border border-white/5">
                    <i data-lucide="volume-2" class="w-3 h-3 text-white/40"></i>
                    <input type="range" min="0" max="1" step="0.01" value="0.5" oninput="window.setVibeVolume(this.value)" class="appearance-none w-20 h-[2px] bg-white/20 rounded-full outline-none -rotate-90 my-10 cursor-pointer accent-yellow-500">
                    <i data-lucide="volume-x" class="w-3 h-3 text-white/40"></i>
                </div>
            </div>

            <div class="absolute bottom-10 left-0 right-0 flex justify-center items-end gap-4 px-6 pointer-events-auto">
                <button onclick="window.stopAILens()" class="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/10 active:scale-90 transition">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>

                <button id="btn-rating-main" onclick="window.capturePhoto()" class="w-16 h-16 rounded-full bg-yellow-500 border-[4px] border-black/30 shadow-lg flex items-center justify-center active:scale-95 transition">
                    <i data-lucide="aperture" class="text-black w-8 h-8"></i>
                </button>

                <button id="btn-video-main" onclick="window.toggleVideoRecording()" class="w-16 h-16 rounded-full bg-red-600 border-[4px] border-black/30 shadow-lg flex items-center justify-center active:scale-95 transition">
                    <i data-lucide="video" id="video-icon" class="text-white w-8 h-8"></i>
                </button>

                <div class="relative flex flex-col items-center">
                    <div id="vibe-dropdown" class="hidden absolute bottom-full mb-3 w-32 glass rounded-2xl overflow-hidden border border-white/10 z-[10001] animate-in slide-in-from-bottom-2">${vibeItems}</div>
                    <div class="flex items-center glass rounded-full border border-white/10 shadow-xl overflow-hidden">
                        <button onclick="window.toggleVibeMusic()" class="pl-4 pr-2 py-3 text-yellow-500 border-r border-white/5"><i id="vibe-icon-main" data-lucide="music" class="w-5 h-5"></i></button>
                        <button onclick="window.toggleVibeDropdown()" class="pl-2 pr-4 py-3 text-yellow-500 flex items-center gap-1"><span id="current-vibe-name" class="text-[8px] font-black uppercase">France</span><i data-lucide="chevron-up" class="w-3 h-3"></i></button>
                    </div>
                </div>

                <div class="relative flex flex-col items-center">
                    <div id="action-dropdown" class="hidden absolute bottom-full mb-3 w-32 glass rounded-2xl overflow-hidden border border-white/10 z-[10001] animate-in slide-in-from-bottom-2">${actionItems}</div>
                    <div class="flex items-center glass rounded-full border border-white/10 shadow-xl overflow-hidden">
                        <button class="pl-4 pr-2 py-3 text-red-500 border-r border-white/5"><i data-lucide="hand" class="w-5 h-5"></i></button>
                        <button onclick="window.toggleActionDropdown()" class="pl-2 pr-4 py-3 text-red-500 flex items-center gap-1"><span id="current-action-name" class="text-[8px] font-black uppercase">PUNCH</span><i data-lucide="chevron-up" class="w-3 h-3"></i></button>
                    </div>
                </div>

                <button onclick="window.toggleFlash()" class="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/10 active:scale-90 transition">
                    <i data-lucide="zap" id="flash-icon" class="w-6 h-6"></i>
                </button>
            </div>
        </div>
    `;
    overlay.insertAdjacentHTML('beforeend', eliteUI);
    if(window.lucide) lucide.createIcons();
    
    liveCanvas.onclick = (e) => {
        const rect = liveCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (liveCanvas.width / rect.width);
        const y = (e.clientY - rect.top) * (liveCanvas.height / rect.height);
        if (window.spawnActionFX) window.spawnActionFX(x, y);
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
            audio: true 
        });
        
        video.srcObject = stream;
        videoTrack = stream.getVideoTracks()[0];
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioDestination = audioContext.createMediaStreamDestination();
        micStreamSource = audioContext.createMediaStreamSource(stream);
        micGainNode = audioContext.createGain(); 
        micStreamSource.connect(micGainNode);
        micGainNode.connect(audioDestination);

        if (window.bgMusic) {
            musicSourceNode = audioContext.createMediaElementSource(window.bgMusic);
            musicGainNode = audioContext.createGain();
            musicGainNode.gain.value = 0.5;
            musicSourceNode.connect(musicGainNode);
            musicGainNode.connect(audioDestination);
            musicGainNode.connect(audioContext.destination);
        }
        
        video.onloadedmetadata = () => { video.play(); renderLoop(); };

        if (navigator.geolocation) {
            geoWatchId = navigator.geolocation.watchPosition(
                (p) => { userCoords = `${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`; },
                (err) => { console.warn("GPS searching..."); },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }
    } catch (err) { alert("Opus System: Camera/Audio Access Denied."); }
};

window.toggleMic = () => {
    isMicOn = !isMicOn;
    if (micGainNode) micGainNode.gain.value = isMicOn ? 1 : 0; 
    const video = document.getElementById('camera-feed');
    if (video) video.muted = !isMicOn;
    const micIcon = document.getElementById('mic-icon');
    micIcon.setAttribute('data-lucide', isMicOn ? 'mic' : 'mic-off');
    micIcon.style.color = isMicOn ? '#fff' : '#ef4444';
    if(window.lucide) lucide.createIcons();
};

window.toggleVideoRecording = () => {
    if (!isRecording) startVideo();
    else stopVideo();
};

function startVideo() {
    const canvas = document.getElementById('capture-canvas-live');
    const videoIcon = document.getElementById('video-icon');
    const indicator = document.getElementById('rec-indicator');
    recordedChunks = [];
    isRecording = true;
    if(!window.isPlayingMusic) window.toggleVibeMusic();
    const canvasStream = canvas.captureStream(30);
    const mixedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks() 
    ]);
    const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') ? 'video/mp4;codecs=avc1' : 'video/webm;codecs=vp9';
    mediaRecorder = new MediaRecorder(mixedStream, { mimeType, videoBitsPerSecond: 6000000 });
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = saveVideoFile;
    mediaRecorder.start();
    indicator.style.opacity = "1";
    videoIcon.setAttribute('data-lucide', 'square'); 
    if(window.lucide) lucide.createIcons();
    document.getElementById('btn-video-main').classList.add('animate-pulse');
}

function stopVideo() {
    isRecording = false;
    mediaRecorder.stop();
    document.getElementById('rec-indicator').style.opacity = "0";
    document.getElementById('video-icon').setAttribute('data-lucide', 'video');
    if(window.lucide) lucide.createIcons();
    document.getElementById('btn-video-main').classList.remove('animate-pulse');
}

function saveVideoFile() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const blob = new Blob(recordedChunks, { type: isIOS ? 'video/mp4' : 'video/webm' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OPUS_VIBE_${Date.now()}${isIOS ? '.mp4' : '.webm'}`;
    link.click();
}

function renderLoop() {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('capture-canvas-live'); 
    if (!video || !canvas || video.paused) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (OpusShaders[currentStyle]) OpusShaders[currentStyle](ctx, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (window.drawActionFX) window.drawActionFX(ctx);

    renderEliteStamps(ctx, canvas);
    if (document.getElementById('opus-lens-container').style.display === 'block') {
        animationFrameId = requestAnimationFrame(renderLoop);
    }
}

function renderEliteStamps(ctx, canvas) {
    const pad = canvas.width * 0.03;
    const fontSize = canvas.width * 0.022;
    const timeStr = new Date().toLocaleString('en-US', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' }).toUpperCase();
    const currentFilter = ctx.filter;
    ctx.filter = 'none';
    const drawEliteText = (text, x, y, font, color, align = "left") => {
        ctx.textAlign = align; ctx.font = font;
        ctx.strokeStyle = "black"; ctx.lineWidth = fontSize * 0.15; ctx.lineJoin = "round";
        ctx.strokeText(text, x, y); ctx.fillStyle = color; ctx.fillText(text, x, y);
    };
    drawEliteText("CAPTURED BY HUMAN", pad, canvas.height - (pad * 3.8), `300 ${fontSize}px sans-serif`, "white");
    drawEliteText("VERIFIED BY OPUS-MAP AI", pad, canvas.height - (pad * 2.8), `bold ${fontSize * 0.9}px sans-serif`, "#fbbf24");
    drawEliteText(userCoords ? "LOC: " + userCoords : "LOC: SIGNAL ENCRYPTED", pad, canvas.height - (pad * 2.0), `500 ${fontSize * 0.6}px monospace`, "white");
    drawEliteText("TIME: " + timeStr, pad, canvas.height - (pad * 1.3), `500 ${fontSize * 0.6}px monospace`, "white");
    drawEliteText("OPUS_VERIFIED_" + Date.now(), canvas.width - pad, canvas.height - pad, `${fontSize * 0.5}px monospace`, "rgba(255, 255, 255, 0.5)", "right");
    ctx.filter = currentFilter;
}

window.capturePhoto = async () => {
    const canvas = document.getElementById('capture-canvas-live');
    const photoData = canvas.toDataURL('image/jpeg', 0.9);
    const link = document.createElement('a');
    link.download = `OPUS_SHOT_${Date.now()}.jpg`; 
    link.href = photoData;
    link.click();
};

window.toggleFlash = async () => {
    if (!videoTrack) return;
    try {
        isFlashOn = !isFlashOn;
        await videoTrack.applyConstraints({ advanced: [{ torch: isFlashOn }] });
        document.getElementById('flash-icon').style.color = isFlashOn ? '#fbbf24' : '#fff';
    } catch (e) { console.log("Flash Error."); }
};

window.stopAILens = () => {
    const container = document.getElementById('opus-lens-container');
    const video = document.getElementById('camera-feed');
    container.style.display = 'none';
    if (geoWatchId) navigator.geolocation.clearWatch(geoWatchId);
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(t => t.stop());
        video.srcObject = null;
    }
    if (window.bgMusic) {
        window.bgMusic.pause();
        window.bgMusic.currentTime = 0;
    }
    window.isPlayingMusic = false;
    cancelAnimationFrame(animationFrameId);
    const vibeIcon = document.getElementById('vibe-icon-main');
    if (vibeIcon) {
        vibeIcon.setAttribute('data-lucide', 'music');
        if(window.lucide) lucide.createIcons();
    }
};