/**
 * OPUS ELITE ENGINE 2027: DUAL-MODE HYBRID SYSTEM
 * [MENTOR]: Ưu tiên tốc độ ghi (WebM) + Đánh lừa hệ thống để iPhone/Android đều đọc được.
 * [FORMAT]: Photo -> JPG | Video -> Hybrid MP4-Compatible.
 */

let currentStyle = 'none'; 
let animationFrameId = null;
let isFlashOn = false;
let videoTrack = null;
let userCoords = null; 
let geoWatchId = null;

// MediaRecorder Logic
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;
let audioContext, audioDestination, bgMusic;

const OpusShaders = {
    cyber: (ctx, w, h) => {
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = 'rgba(255, 0, 255, 0.25)';
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = 'contrast(1.2) saturate(1.5) hue-rotate(-10deg)';
    },
    sketch: (ctx, w, h) => { ctx.filter = 'grayscale(1) contrast(1000%) invert(1)'; },
    ghost: (ctx, w, h) => { ctx.filter = 'hue-rotate(180deg) blur(1px) brightness(1.1) saturate(0.5)'; },
    none: (ctx) => { ctx.filter = 'none'; }
};

window.setStyle = (style) => {
    currentStyle = style;
    document.querySelectorAll('.filter-chip').forEach(btn => {
        const onClickAttr = btn.getAttribute('onclick') || "";
        btn.classList.toggle('active', onClickAttr.includes(`'${style}'`));
    });
};

window.activateAILens = async () => {
    const container = document.getElementById('opus-lens-container');
    const video = document.getElementById('camera-feed');
    const liveCanvas = document.getElementById('capture-canvas-live');
    const overlay = container?.querySelector('.lens-overlay');

    if (!container || !video || !liveCanvas || !overlay) return;
    container.style.display = 'block';

    if (navigator.geolocation) {
        geoWatchId = navigator.geolocation.watchPosition(
            (p) => { userCoords = `${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`; },
            (err) => { console.warn("GPS searching..."); },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }

    if (!bgMusic) {
        bgMusic = new Audio('audio/vibe.mp3'); 
        bgMusic.loop = true;
    }

    const existingControls = document.getElementById('opus-dynamic-controls');
    if (existingControls) existingControls.remove();

    const eliteUI = `
        <div id="opus-dynamic-controls" class="absolute inset-0 pointer-events-none z-[10000]">
            <div class="absolute top-10 right-10 opacity-0 transition-opacity" id="rec-indicator">
                <div class="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-red-500/50">
                    <div class="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span class="text-white font-mono text-[10px] tracking-widest uppercase">Recording</span>
                </div>
            </div>

            <div class="absolute bottom-10 left-0 right-0 flex justify-center items-end gap-6 px-6 pointer-events-auto">
                <button onclick="window.stopAILens()" class="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/10 active:scale-90 transition">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>

                <button id="btn-rating-main" onclick="window.capturePhoto()" class="w-16 h-16 rounded-full bg-yellow-500 border-[4px] border-black/30 shadow-lg flex items-center justify-center active:scale-95 transition">
                    <i data-lucide="aperture" class="text-black w-8 h-8"></i>
                </button>

                <button id="btn-video-main" onclick="window.toggleVideoRecording()" class="w-16 h-16 rounded-full bg-red-600 border-[4px] border-black/30 shadow-lg flex items-center justify-center active:scale-95 transition">
                    <i data-lucide="video" id="video-icon" class="text-white w-8 h-8"></i>
                </button>

                <button onclick="window.toggleFlash()" class="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/10 active:scale-90 transition">
                    <i data-lucide="zap" id="flash-icon" class="w-6 h-6"></i>
                </button>
            </div>
        </div>
    `;
    overlay.insertAdjacentHTML('beforeend', eliteUI);
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
        const micSource = audioContext.createMediaStreamSource(stream);
        micSource.connect(audioDestination);
        const musicSource = audioContext.createMediaElementSource(bgMusic);
        musicSource.connect(audioDestination);
        musicSource.connect(audioContext.destination); 
        
        video.onloadedmetadata = () => {
            video.play();
            renderLoop();
        };
    } catch (err) { alert("Opus System: Camera/Audio Access Denied."); }
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
    bgMusic.play();

    const canvasStream = canvas.captureStream(30);
    const mixedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks()
    ]);

    // HYBRID LOGIC: Kiểm tra codec tối ưu nhất cho thiết bị
    const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') 
                     ? 'video/mp4;codecs=avc1' 
                     : 'video/webm;codecs=vp9';

    mediaRecorder = new MediaRecorder(mixedStream, { 
        mimeType: mimeType,
        videoBitsPerSecond: 5000000 
    });

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
    bgMusic.pause();
    bgMusic.currentTime = 0;
    
    document.getElementById('rec-indicator').style.opacity = "0";
    document.getElementById('video-icon').setAttribute('data-lucide', 'video');
    if(window.lucide) lucide.createIcons();
    document.getElementById('btn-video-main').classList.remove('animate-pulse');
}

// CHIẾN THUẬT HYBRID: Tự động đổi đuôi file để đánh lừa hệ điều hành
function saveVideoFile() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const blobType = isIOS ? 'video/mp4' : 'video/webm';
    const extension = isIOS ? '.mp4' : '.webm';

    const blob = new Blob(recordedChunks, { type: blobType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OPUS_VIBE_${Date.now()}${extension}`;
    link.click();
}

function renderLoop() {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('capture-canvas-live'); 
    if (!video || !canvas || video.paused) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (OpusShaders[currentStyle]) OpusShaders[currentStyle](ctx, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
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

// CHỤP ẢNH ĐỊNH DẠNG JPG 100%
window.capturePhoto = async () => {
    const canvas = document.getElementById('capture-canvas-live');
    const photoData = canvas.toDataURL('image/jpeg', 0.9); // Ép về JPEG cho sếp
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
    if (video.srcObject) video.srcObject.getTracks().forEach(t => t.stop());
    if (bgMusic) { bgMusic.pause(); bgMusic.currentTime = 0; }
    cancelAnimationFrame(animationFrameId);
};