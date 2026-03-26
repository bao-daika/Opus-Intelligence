/**
 * OPUS ELITE ENGINE 2027: REAL ESTATE GLOBAL EDITION
 * [CORE]: Professional Shaders, Original Stamp Logic, Compact Bottom Hub.
 * [UPGRADED]: Center Hub Music Control & Smart Filter UI.
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
    golden: (ctx, w, h) => {
        ctx.filter = 'sepia(1) hue-rotate(-15deg) saturate(4) contrast(1.1) brightness(1.1)';
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(255, 150, 0, 0.3)';
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'screen';
        const sahara = ctx.createRadialGradient(w, 0, 0, w, 0, w*1.2);
        sahara.addColorStop(0, 'rgba(255, 255, 100, 0.6)');
        sahara.addColorStop(0.4, 'rgba(255, 100, 0, 0.3)');
        sahara.addColorStop(1, 'transparent');
        ctx.fillStyle = sahara;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
    },
    heaven: (ctx, w, h) => {
        const time = Date.now() * 0.001; 
        ctx.filter = 'brightness(1.8) contrast(0.5) saturate(0.2) blur(1px)';
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
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
    modern: (ctx, w, h) => {
        ctx.filter = 'contrast(1.2) brightness(1.1) saturate(1.1)';
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = 'rgba(200, 230, 255, 0.1)';
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
    },
    cinema: (ctx, w, h) => {
        ctx.filter = 'contrast(1.1) brightness(0.9) sepia(0.1) saturate(0.8)';
        ctx.globalCompositeOperation = 'multiply';
        const vigne = ctx.createRadialGradient(w/2, h/2, w*0.4, w/2, h/2, w);
        vigne.addColorStop(0, 'transparent');
        vigne.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = vigne;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
    },
    none: (ctx) => { ctx.filter = 'none'; }
};

window.activateAILens = async () => {
    const container = document.getElementById('opus-lens-container');
    const video = document.getElementById('camera-feed');
    const liveCanvas = document.getElementById('capture-canvas-live');
    const overlay = container?.querySelector('.lens-overlay');

    if (!container || !video || !liveCanvas || !overlay) return;
    
    container.style.display = 'block';
    
    const existingControls = document.getElementById('opus-dynamic-controls');
    if (existingControls) existingControls.remove();

    const vibeItems = (window.vibeLibrary || []).map(v => `
        <div onclick="window.selectVibe('${v.id}')" class="px-4 py-3 text-[10px] text-white/80 hover:bg-yellow-500 hover:text-black transition uppercase font-bold cursor-pointer border-b border-white/5 pointer-events-auto">${v.name}</div>
    `).join('');

    const eliteUI = `
        <div id="opus-dynamic-controls" class="absolute inset-0 pointer-events-none z-[10000] flex flex-col justify-between p-6 pb-12">
            <div class="flex justify-start">
                <div id="rec-indicator" class="opacity-0 transition-opacity flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-red-500/50">
                    <div class="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span class="text-white font-mono text-[9px] tracking-widest uppercase">REC</span>
                </div>
            </div>

            <div class="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 pointer-events-auto">
                <button onclick="window.toggleMic()" class="w-10 h-10 flex items-center justify-center text-white active:scale-90 transition">
                    <i data-lucide="mic" id="mic-icon" class="w-5 h-5"></i>
                </button>
                <button onclick="window.toggleFlash()" class="w-10 h-10 flex items-center justify-center text-white active:scale-90 transition">
                    <i data-lucide="zap" id="flash-icon" class="w-5 h-5"></i>
                </button>
                <div class="h-24 flex flex-col items-center justify-center py-2">
                    <input type="range" min="0" max="1" step="0.01" value="0.5" oninput="window.setVibeVolume(this.value)" 
                           class="appearance-none w-20 h-[1.5px] bg-white/20 rounded-full outline-none -rotate-90 cursor-pointer accent-yellow-500">
                </div>
            </div>

            <div class="flex justify-center items-center w-full pointer-events-auto">
                <div class="flex items-center gap-3 bg-black/20 backdrop-blur-md p-3 px-5 rounded-full border border-white/5 shadow-2xl">
                    <button onclick="window.stopAILens()" class="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white transition">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>

                    <div class="relative flex items-center bg-white/5 rounded-full px-2 border border-white/10">
                        <button onclick="window.toggleVibeMusic()" class="w-8 h-8 flex items-center justify-center text-yellow-500 active:scale-90 transition">
                            <i data-lucide="music" id="vibe-icon-main" class="w-4 h-4"></i>
                        </button>
                        <button onclick="window.toggleVibeDropdown()" class="w-6 h-8 flex items-center justify-center text-white/40">
                            <i data-lucide="chevron-up" class="w-3 h-3"></i>
                        </button>
                        <div id="vibe-dropdown" class="hidden absolute bottom-full mb-4 left-0 w-32 bg-black/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 z-[10001] animate-in slide-in-from-bottom-2">
                            ${vibeItems}
                        </div>
                    </div>

                    <button id="btn-rating-main" onclick="window.capturePhoto()" class="w-14 h-14 rounded-full bg-yellow-500 border-[4px] border-black/20 shadow-lg flex items-center justify-center active:scale-90 transition">
                        <i data-lucide="aperture" class="text-black w-7 h-7"></i>
                    </button>

                    <button id="btn-video-main" onclick="window.toggleVideoRecording()" class="w-14 h-14 rounded-full bg-red-600 border-[4px] border-black/20 shadow-lg flex items-center justify-center active:scale-90 transition">
                        <i data-lucide="video" id="video-icon" class="text-white w-7 h-7"></i>
                    </button>

                    <div class="relative flex items-center">
                         <select onchange="window.setStyle(this.value)" class="w-10 h-10 bg-white/10 text-yellow-500 rounded-full border border-yellow-500/30 outline-none text-[8px] font-bold uppercase text-center appearance-none cursor-pointer">
                            <option value="none" class="bg-black text-white">OFF</option>
                            <option value="golden" class="bg-black text-white">GOLD</option>
                            <option value="heaven" class="bg-black text-white">HEAVEN</option>
                            <option value="modern" class="bg-black text-white">LUXE</option>
                            <option value="cinema" class="bg-black text-white">CINE</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `;
    overlay.innerHTML = eliteUI;
    if(window.lucide) lucide.createIcons();
    
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

        if (!bgMusic) {
            bgMusic = new Audio();
            bgMusic.loop = true;
            bgMusic.crossOrigin = "anonymous";
        }
        
        if (!musicSourceNode) {
            musicSourceNode = audioContext.createMediaElementSource(bgMusic);
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
                null, { enableHighAccuracy: true }
            );
        }
    } catch (err) { console.error("Camera/Audio Error:", err); }
};

window.selectVibe = async (id) => {
    const vibe = window.vibeLibrary.find(v => v.id === id);
    if (!vibe || !bgMusic) return;

    bgMusic.src = vibe.url || `audio/${id}.mp3`;
    if (audioContext.state === 'suspended') await audioContext.resume();

    bgMusic.play().then(() => {
        isPlayingMusic = true;
        document.getElementById('vibe-icon-main')?.classList.add('animate-spin-slow');
        document.getElementById('vibe-icon-main')?.setAttribute('data-lucide', 'pause');
        if(window.lucide) lucide.createIcons();
    }).catch(e => console.log("Play blocked:", e));

    window.toggleVibeDropdown();
};

window.toggleVibeMusic = async () => {
    if (!bgMusic) return window.toggleVibeDropdown();
    if (audioContext.state === 'suspended') await audioContext.resume();

    const vibeIcon = document.getElementById('vibe-icon-main');

    if (isPlayingMusic) {
        bgMusic.pause();
        isPlayingMusic = false;
        vibeIcon?.classList.remove('animate-spin-slow');
        vibeIcon?.setAttribute('data-lucide', 'music');
    } else {
        if (!bgMusic.src) return window.toggleVibeDropdown();
        bgMusic.play();
        isPlayingMusic = true;
        vibeIcon?.classList.add('animate-spin-slow');
        vibeIcon?.setAttribute('data-lucide', 'pause');
    }
    if(window.lucide) lucide.createIcons();
};

// LOGIC STAMP (GIỮ NGUYÊN 100%)
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

function renderLoop() {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('capture-canvas-live'); 
    if (!video || !canvas || video.paused) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (canvas.width !== window.innerWidth) {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (OpusShaders[currentStyle]) OpusShaders[currentStyle](ctx, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    renderEliteStamps(ctx, canvas);
    animationFrameId = requestAnimationFrame(renderLoop);
}

window.setStyle = (style) => { currentStyle = style; };
window.setVibeVolume = (val) => { if (musicGainNode) musicGainNode.gain.setTargetAtTime(val, audioContext.currentTime, 0.01); };

window.toggleVibeDropdown = () => {
    const dd = document.getElementById('vibe-dropdown');
    if (dd) dd.classList.toggle('hidden');
};

window.capturePhoto = async () => {
    const canvas = document.getElementById('capture-canvas-live');
    const link = document.createElement('a');
    link.download = `OPUS_SHOT_${Date.now()}.jpg`; 
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
};

window.toggleVideoRecording = () => { if (!isRecording) startVideo(); else stopVideo(); };

function startVideo() {
    const canvas = document.getElementById('capture-canvas-live');
    recordedChunks = [];
    isRecording = true;
    const canvasStream = canvas.captureStream(30);
    const mixedStream = new MediaStream([...canvasStream.getVideoTracks(), ...audioDestination.stream.getAudioTracks()]);
    const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') ? 'video/mp4;codecs=avc1' : 'video/webm;codecs=vp9';
    mediaRecorder = new MediaRecorder(mixedStream, { mimeType, videoBitsPerSecond: 8000000 });
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = saveVideoFile;
    mediaRecorder.start();
    document.getElementById('rec-indicator').style.opacity = "1";
    document.getElementById('video-icon').setAttribute('data-lucide', 'square');
    if(window.lucide) lucide.createIcons();
}

function stopVideo() {
    isRecording = false;
    mediaRecorder.stop();
    document.getElementById('rec-indicator').style.opacity = "0";
    document.getElementById('video-icon').setAttribute('data-lucide', 'video');
    if(window.lucide) lucide.createIcons();
}

function saveVideoFile() {
    const blob = new Blob(recordedChunks, { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OPUS_VIBE_${Date.now()}.mp4`;
    link.click();
}

window.toggleFlash = async () => {
    if (!videoTrack) return;
    try {
        isFlashOn = !isFlashOn;
        await videoTrack.applyConstraints({ advanced: [{ torch: isFlashOn }] });
        document.getElementById('flash-icon').style.color = isFlashOn ? '#fbbf24' : '#fff';
    } catch (e) { console.log("Flash Error."); }
}

window.toggleMic = () => {
    isMicOn = !isMicOn;
    if (micGainNode) micGainNode.gain.value = isMicOn ? 1 : 0; 
    const micIcon = document.getElementById('mic-icon');
    micIcon.style.color = isMicOn ? '#fff' : '#ef4444';
};

window.stopAILens = () => {
    const container = document.getElementById('opus-lens-container');
    const video = document.getElementById('camera-feed');
    container.style.display = 'none';
    if (geoWatchId) navigator.geolocation.clearWatch(geoWatchId);
    if (video.srcObject) video.srcObject.getTracks().forEach(t => t.stop());
    if (bgMusic) { bgMusic.pause(); bgMusic.currentTime = 0; }
    isPlayingMusic = false;
    cancelAnimationFrame(animationFrameId);
};