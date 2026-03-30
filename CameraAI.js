/**
 * OPUS ELITE ENGINE 2027: CAMERA MODULE (LENS-PARALLEL EDITION)
 * [CORE]: CameraAI.js - "Proof of Brain" Mining Logic.
 * [UPDATE]: 2027 UI/UX - Adaptive Square Vertical QuizBox.
 * [VIBE]: Mentor Edition - No 1900s vibes allowed.
 */

window.currentStyle = 'none'; 
let animationFrameId = null;
let isFlashOn = false;
let isMicOn = true; 
let videoTrack = null;
let userCoords = null; 
let geoWatchId = null;

// --- TRẠNG THÁI GAME MINING ---
window.isNearGift = false; 
window.giftType = 'none'; 
window.currentSpot = null; 
window.isExploding = false;
let isMining = false; 
let wonAmount = 0;
let userLootHistory = JSON.parse(localStorage.getItem('opus_loot_log') || '{}');

// --- NEW QUIZ STATE 2027 ---
let mathGame = {
    currentSet: [], 
    target: 10,
    score: 0, 
    currentQuestionIndex: 0,
    correctSolved: false,
    lastResult: null 
};

// MediaRecorder & Audio Logic
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;
let audioContext, audioDestination, micStreamSource, micGainNode, musicGainNode;

// --- SHADER ENGINE ---
const OpusShaders = {
    silver: (ctx, w, h) => { 
        ctx.filter = 'grayscale(1) brightness(1.2) contrast(1.4)'; ctx.globalCompositeOperation = 'overlay'; 
        ctx.fillStyle = 'rgba(200, 200, 220, 0.3)'; ctx.fillRect(0, 0, w, h); ctx.globalCompositeOperation = 'source-over';
    },
    golden: (ctx, w, h) => {
        ctx.filter = 'sepia(1) hue-rotate(-15deg) saturate(4) contrast(1.1) brightness(1.1)'; ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(255, 150, 0, 0.3)'; ctx.fillRect(0, 0, w, h); ctx.globalCompositeOperation = 'screen';
        const sahara = ctx.createRadialGradient(w, 0, 0, w, 0, w*1.2); sahara.addColorStop(0, 'rgba(255, 255, 100, 0.6)'); sahara.addColorStop(0.4, 'rgba(255, 100, 0, 0.3)'); sahara.addColorStop(1, 'transparent'); ctx.fillStyle = sahara; ctx.fillRect(0, 0, w, h); ctx.globalCompositeOperation = 'source-over';
    },
    void: (ctx, w, h) => { 
        ctx.filter = 'invert(1) grayscale(1) contrast(500%) brightness(1.2)';
        ctx.globalCompositeOperation = 'difference';
    },
    none: (ctx) => { ctx.filter = 'none'; }
};

// --- CORE ENGINE INITIALIZATION ---
window.activateAILens = async () => {
    const container = document.getElementById('opus-lens-container');
    const video = document.getElementById('camera-feed');
    const liveCanvas = document.getElementById('capture-canvas-live');
    const overlay = container?.querySelector('.lens-overlay');

    if (!container || !video || !liveCanvas || !overlay) return;
    container.style.display = 'block';
    if (document.getElementById('opus-dynamic-controls')) document.getElementById('opus-dynamic-controls').remove();

    const vibeItems = (window.vibeLibrary || []).map(v => `
        <div onclick="window.selectVibe('${v.id}')" class="px-4 py-3 text-[10px] text-white/80 hover:bg-yellow-500 hover:text-black transition uppercase font-bold cursor-pointer border-b border-white/5 pointer-events-auto">${v.name}</div>
    `).join('');

    overlay.innerHTML = `
        <div id="opus-dynamic-controls" class="absolute inset-0 pointer-events-none z-[10000] flex flex-col justify-between p-6 pb-12">
            <div class="flex justify-start">
                <div id="rec-indicator" class="opacity-0 transition-opacity flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-red-500/50">
                    <div class="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span class="text-white font-mono text-[9px] tracking-widest uppercase">REC</span>
                </div>
            </div>
            
            <div class="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 pointer-events-auto">
                <button onclick="window.toggleMic()" class="w-10 h-10 flex items-center justify-center text-white active:scale-90 transition"><i data-lucide="mic" id="mic-icon" class="w-5 h-5"></i></button>
                <button onclick="window.toggleFlash()" class="w-10 h-10 flex items-center justify-center text-white active:scale-90 transition"><i data-lucide="zap" id="flash-icon" class="w-5 h-5"></i></button>
                <div class="h-24 flex flex-col items-center justify-center py-2"><input type="range" min="0" max="1" step="0.01" value="0.5" oninput="window.setVibeVolume(this.value)" class="appearance-none w-20 h-[1.5px] bg-white/20 rounded-full outline-none -rotate-90 cursor-pointer accent-yellow-500"></div>
            </div>

            <div class="flex justify-center items-center w-full pointer-events-auto">
                <div class="flex items-center gap-3 bg-black/20 backdrop-blur-md p-3 px-5 rounded-full border border-white/5 shadow-2xl">
                    <button onclick="window.stopAILens()" class="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white transition"><i data-lucide="x" class="w-4 h-4"></i></button>
                    <div class="relative flex items-center bg-white/5 rounded-full px-2 border border-white/10">
                        <button id="music-btn-main" onclick="window.handleMusicInit()" class="w-8 h-8 flex items-center justify-center text-yellow-500 active:scale-90 transition"><i data-lucide="music" class="w-4 h-4"></i></button>
                        <button onclick="window.toggleVibeDropdown()" class="w-6 h-8 flex items-center justify-center text-white/40"><i data-lucide="chevron-up" class="w-3 h-3"></i></button>
                        <div id="vibe-dropdown" class="hidden absolute bottom-full mb-4 left-0 w-32 bg-black/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 z-[10001] animate-in slide-in-from-bottom-2">${vibeItems}</div>
                    </div>
                    <button id="btn-rating-main" onclick="window.smartCapture()" class="w-14 h-14 rounded-full bg-yellow-500 border-[4px] border-black/20 shadow-lg flex items-center justify-center active:scale-90 transition"><i data-lucide="aperture" class="text-black w-7 h-7"></i></button>
                    <button id="btn-video-main" onclick="window.smartRecord()" class="w-14 h-14 rounded-full bg-red-600 border-[4px] border-black/20 shadow-lg flex items-center justify-center active:scale-90 transition"><i data-lucide="video" id="video-icon" class="text-white w-7 h-7"></i></button>
                    <div class="relative flex items-center">
                         <select onchange="window.setStyle(this.value)" class="w-10 h-10 bg-white/10 text-yellow-500 rounded-full border border-yellow-500/30 outline-none text-[8px] font-bold uppercase text-center appearance-none cursor-pointer">
                            <option value="none">RAW</option>
                            <option value="silver">SILVER</option>
                            <option value="golden">GOLD</option>
                            <option value="void">VOID</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `;

    // --- RE-ENGINEERED CLICK LOGIC (VERTICAL) ---
    liveCanvas.onclick = (e) => {
        if (!isMining || mathGame.correctSolved) return;
        const rect = liveCanvas.getBoundingClientRect();
        const scaleX = liveCanvas.width / rect.width;
        const scaleY = liveCanvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        const canvasW = liveCanvas.width;
        const canvasH = liveCanvas.height;
        const side = Math.min(canvasW * 0.9, canvasH * 0.6); // Square logic
        const startX = (canvasW - side) / 2;
        const startY = (canvasH / 2) - (side / 2) - 40;
        
        // Cấu trúc Answer dọc
        const btnH = side * 0.12;
        const gap = side * 0.03;
        const listStartY = startY + (side * 0.35);

        [0, 1, 2, 3].forEach(i => {
            const bx = startX + (side * 0.08);
            const by = listStartY + i * (btnH + gap);
            const bw = side * 0.84;
            if (x >= bx && x <= bx + bw && y >= by && y <= by + btnH) {
                window.submitAnswerIndex(i);
            }
        });
    };

    if(window.lucide) lucide.createIcons();
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: true });
        video.srcObject = stream; videoTrack = stream.getVideoTracks()[0];
        window.audioContext = new (window.AudioContext || window.webkitAudioContext)(); 
        window.audioDestination = window.audioContext.createMediaStreamDestination(); 
        micStreamSource = window.audioContext.createMediaStreamSource(stream); 
        micGainNode = window.audioContext.createGain(); 
        micStreamSource.connect(micGainNode); 
        micGainNode.connect(window.audioDestination);

        if (!window.bgMusic) {
            window.bgMusic = new Audio();
            window.bgMusic.loop = true;
            window.bgMusic.crossOrigin = "anonymous";
        }
        if (!window.musicSourceNode) {
            window.musicSourceNode = window.audioContext.createMediaElementSource(window.bgMusic);
            musicGainNode = window.audioContext.createGain();
            musicGainNode.gain.value = 0.5;
            window.musicSourceNode.connect(musicGainNode);
            musicGainNode.connect(window.audioDestination);
            musicGainNode.connect(window.audioContext.destination);
        }
        if (navigator.geolocation) {
            geoWatchId = navigator.geolocation.watchPosition((p) => { 
                userCoords = `${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`; 
                updateMiningRadar(p.coords.latitude, p.coords.longitude);
            }, null, { enableHighAccuracy: true });
        }
        video.onloadedmetadata = () => { video.play(); renderLoop(); };
    } catch (err) { console.error("Camera Error:", err); }
};

window.selectVibe = (vibeId) => {
    const vibe = (window.vibeLibrary || []).find(v => v.id === vibeId);
    if (!vibe || !window.bgMusic) return;
    window.bgMusic.src = vibe.url || vibe.src || `audio/${vibeId}.mp3`;
    if (window.audioContext?.state === 'suspended') window.audioContext.resume();
    window.bgMusic.play().then(() => {
        const btn = document.getElementById('music-btn-main');
        const icon = btn?.querySelector('i');
        if (btn) btn.style.color = '#fbbf24';
        if (icon) { icon.classList.add('animate-spin-slow'); icon.setAttribute('data-lucide', 'pause'); if(window.lucide) lucide.createIcons(); }
    }).catch(e => console.log("Opus: Playback blocked", e));
    window.toggleVibeDropdown(); 
};

window.handleMusicInit = () => {
    if (window.audioContext?.state === 'suspended') window.audioContext.resume();
    if (window.bgMusic) {
        const btn = document.getElementById('music-btn-main');
        const icon = btn?.querySelector('i');
        if (window.bgMusic.paused) {
            if (!window.bgMusic.src || window.bgMusic.src === window.location.href) {
                if (window.vibeLibrary?.length > 0) {
                    const firstVibe = window.vibeLibrary[0];
                    window.bgMusic.src = firstVibe.url || firstVibe.src || `audio/${firstVibe.id}.mp3`;
                }
            }
            window.bgMusic.play();
            if (btn) btn.style.color = '#fbbf24';
            if (icon) icon.classList.add('animate-spin-slow');
        } else {
            window.bgMusic.pause();
            if (btn) btn.style.color = '#fff';
            if (icon) icon.classList.remove('animate-spin-slow');
        }
        if (icon) { icon.setAttribute('data-lucide', window.bgMusic.paused ? 'music' : 'pause'); if(window.lucide) lucide.createIcons(); }
    }
};

window.setVibeVolume = (v) => { if (musicGainNode) musicGainNode.gain.setTargetAtTime(v, window.audioContext.currentTime, 0.01); };

function updateMiningRadar(lat, lng) {
    if (window.syncMapToCamera) { window.syncMapToCamera(lat, lng); return; }
    const spot = window.getNearbyUrbanSpot?.(lat, lng) || window.getNearbyNatureSpot?.(lat, lng) || window.getNearbyAliensSpot?.(lat, lng) || window.getNearbyHauntedSpot?.(lat, lng);
    if (spot) {
        const isCooldown = userLootHistory[spot.id] && (Date.now() - userLootHistory[spot.id] < 86400000);
        if (!isCooldown) {
            window.isNearGift = true; window.currentSpot = spot;
            if (window.currentStyle === 'golden' && spot.goldAmount > 0) window.giftType = 'gold';
            else if (window.currentStyle === 'silver' && spot.silverAmount > 0) window.giftType = 'silver';
            else if (window.currentStyle === 'void' && spot.voidAmount > 0) window.giftType = 'void';
            else {
                if (spot.goldAmount > 0) window.giftType = 'gold';
                else if (spot.silverAmount > 0) window.giftType = 'silver';
                else if (spot.voidAmount > 0) window.giftType = 'void';
                else window.giftType = 'none';
            }
        } else { window.isNearGift = false; window.currentSpot = null; window.giftType = 'none'; }
    } else { window.isNearGift = false; window.currentSpot = null; window.giftType = 'none'; }
}

window.smartRecord = () => {
    if (window.isNearGift && window.giftType === 'silver' && window.currentStyle === 'silver') {
        if (!isMining) { startVideo(); startMiningGame(); } 
        else { window.toggleVideoRecording(); }
    } else { window.toggleVideoRecording(); }
};

window.smartCapture = () => {
    if (window.isNearGift && window.giftType === 'gold' && window.currentStyle === 'golden') {
        if(isMining) return;
        window.location.href = `game.html?loc=${userCoords}&id=${window.currentSpot?.id}`;
    } else { window.capturePhoto(); }
};

// --- RENDER ENGINE 2027 (ADAPTIVE BOX COLORS & SQUARE LOGIC) ---
function renderEliteStamps(ctx, canvas) {
    const pad = canvas.width * 0.03; const fontSize = canvas.width * 0.022;
    const currentFilter = ctx.filter; ctx.filter = 'none';
    const drawText = (t, x, y, f, c, a = "left") => { 
        ctx.save(); ctx.textAlign = a; ctx.font = f; ctx.strokeStyle = "rgba(0,0,0,0.8)"; ctx.lineWidth = fontSize * 0.15; ctx.lineJoin = "round";
        ctx.strokeText(t, x, y); ctx.fillStyle = c; ctx.fillText(t, x, y); ctx.restore();
    };

    drawText("CAPTURED BY HUMAN", pad, canvas.height - (pad * 3.8), `300 ${fontSize}px sans-serif`, "white");
    drawText("VERIFIED BY OPUS-MAP AI", pad, canvas.height - (pad * 2.8), `bold ${fontSize * 0.9}px sans-serif`, "#fbbf24");
    drawText(`LOC: ${userCoords || "SIGNAL ENCRYPTED"}`, pad, canvas.height - (pad * 2.0), `500 ${fontSize * 0.6}px monospace`, "white");
    drawText(`TIME: ${new Date().toLocaleString().toUpperCase()}`, pad, canvas.height - (pad * 1.3), `500 ${fontSize * 0.6}px monospace`, "white");

    if (window.isNearGift && window.currentSpot) {
        const centerX = canvas.width / 2; const centerY = canvas.height / 2;
        const isMatchedLens = ((window.currentStyle === 'golden' && window.giftType === 'gold') || (window.currentStyle === 'silver' && window.giftType === 'silver') || (window.currentStyle === 'void' && window.giftType === 'void'));

        const theme = {
            gold: { color: "#fbbf24", glow: "#fbbf24", text: "black" },
            silver: { color: "#e2e8f0", glow: "#ffffff", text: "#1e293b" },
            void: { color: "#000000", glow: "#ffffff", text: "white", border: "white" }
        }[window.giftType] || { color: "#fbbf24", glow: "#fbbf24", text: "black" };

        if (isMatchedLens || isMining) {
            if (window.isExploding) {
                const coinSize = canvas.width * 0.12; 
                ctx.save(); ctx.shadowBlur = 30; ctx.shadowColor = theme.glow; ctx.fillStyle = theme.color; ctx.beginPath(); ctx.arc(centerX, centerY - 40, coinSize * 0.5, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = theme.border || theme.color; ctx.lineWidth = 4; ctx.stroke();
                ctx.fillStyle = theme.text; ctx.font = `bold ${coinSize * 0.4}px sans-serif`; ctx.textAlign = "center"; ctx.fillText(wonAmount, centerX, centerY - 25);
                drawText("STOP RECORDING TO CLAIM", centerX, centerY + 60, `bold ${fontSize}px sans-serif`, "#ef4444", "center"); ctx.restore();
            } 
            // --- NEW SQUARE VERTICAL QUIZ BOX ---
            else if (isMining && !mathGame.correctSolved) {
                const side = Math.min(canvas.width * 0.9, canvas.height * 0.6); // Luôn là hình vuông/chữ nhật ngắn
                const startX = centerX - side/2;
                const startY = centerY - side/2 - 40;

                ctx.save();
                // Glass box
                ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.shadowBlur = 40; ctx.shadowColor = "rgba(0,0,0,0.6)";
                ctx.beginPath(); ctx.roundRect(startX, startY, side, side, 30); ctx.fill();
                ctx.strokeStyle = theme.color + "80"; ctx.lineWidth = 2; ctx.stroke();

                // Status Header
                ctx.fillStyle = theme.color; ctx.font = `bold ${side * 0.04}px monospace`; ctx.textAlign = "left";
                ctx.fillText(`DECRYPTING... [SCORE: ${mathGame.score}/10]`, startX + (side * 0.08), startY + (side * 0.1));
                
                // Question Text
                const currentQ = mathGame.currentSet[mathGame.currentQuestionIndex];
                ctx.fillStyle = "#fff"; ctx.font = `italic ${side * 0.055}px sans-serif`; ctx.textAlign = "center";
                // Wrap text logic đơn giản bằng maxWidth
                ctx.fillText(currentQ.q, centerX, startY + (side * 0.22), side * 0.85);

                // Answer Vertical Buttons
                const btnH = side * 0.12;
                const gap = side * 0.03;
                const options = currentQ.o;
                const listStartY = startY + (side * 0.35);

                options.forEach((opt, i) => {
                    const bx = startX + (side * 0.08);
                    const by = listStartY + i * (btnH + gap);
                    const bw = side * 0.84;
                    
                    ctx.fillStyle = "rgba(255,255,255,0.1)";
                    ctx.beginPath(); ctx.roundRect(bx, by, bw, btnH, 12); ctx.fill();
                    ctx.strokeStyle = theme.color + "22"; ctx.stroke();
                    
                    ctx.fillStyle = theme.color; ctx.font = `bold ${side * 0.045}px monospace`; ctx.textAlign = "left";
                    ctx.fillText(`${String.fromCharCode(65+i)}: ${opt}`, bx + (side * 0.05), by + (btnH * 0.62), bw * 0.9);
                });
                ctx.restore();
            } else {
                const boxSize = canvas.width * 0.16;
                ctx.save();
                drawText(window.giftType === 'gold' ? "TAP CAPTURE" : "TAP RECORD", centerX, centerY - (boxSize * 0.8), `bold ${fontSize * 0.7}px sans-serif`, theme.color, "center");
                ctx.shadowBlur = 40; ctx.shadowColor = theme.glow;
                ctx.fillStyle = theme.color; ctx.beginPath(); ctx.roundRect(centerX - boxSize/2, centerY - boxSize/2, boxSize, boxSize, 15); ctx.fill();
                if(theme.border) { ctx.strokeStyle = theme.border; ctx.lineWidth = 2; ctx.stroke(); }
                ctx.fillStyle = theme.text; ctx.font = `bold ${boxSize * 0.45}px sans-serif`; ctx.textAlign = "center"; ctx.fillText(window.giftType[0].toUpperCase(), centerX, centerY + (boxSize * 0.16)); 
                ctx.restore();
            }
        } else {
            const boxSize = canvas.width * 0.16;
            ctx.save(); ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"; ctx.lineWidth = 1; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.roundRect(centerX - boxSize/2, centerY - boxSize/2, boxSize, boxSize, 15); ctx.stroke();
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)"; ctx.font = `bold ${fontSize * 0.5}px monospace`; ctx.textAlign = "center"; ctx.fillText("ENCRYPTED", centerX, centerY); ctx.restore();
        }
    }
    ctx.filter = currentFilter;
}

// --- SYSTEM HANDLERS ---
window.setStyle = (s) => { window.currentStyle = s; if (userCoords) { const coords = userCoords.split(', '); updateMiningRadar(parseFloat(coords[0]), parseFloat(coords[1])); } };

function startMiningGame() { 
    isMining = true; wonAmount = 0; mathGame.correctSolved = false; mathGame.currentQuestionIndex = 0; mathGame.score = 0;
    if (window.getOpusSession) mathGame.currentSet = window.getOpusSession(50); 
    else { alert("❌ OpusQuiz.js Missing."); stopVideo(); } 
}

window.submitAnswerIndex = (selectedIndex) => { 
    if (!isMining || mathGame.correctSolved) return; 
    const currentQ = mathGame.currentSet[mathGame.currentQuestionIndex]; 
    if (selectedIndex === currentQ.a) { 
        mathGame.score++; 
        if (mathGame.score >= 10) { triggerExplosionSequence(); }
        else { mathGame.currentQuestionIndex++; }
    } else { 
        mathGame.score = Math.max(0, mathGame.score - 1); 
        mathGame.currentQuestionIndex++; 
    } 
};

window.addEventListener('keydown', (e) => {
    if (!isMining || mathGame.correctSolved) return;
    const keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    if (keyMap[e.key] !== undefined) window.submitAnswerIndex(keyMap[e.key]);
});

function triggerExplosionSequence() { 
    mathGame.correctSolved = true; 
    // Thuật toán bốc số ngẫu nhiên nhưng chất lượng
    wonAmount = Math.ceil(Math.pow(Math.random(), 0.7) * 50); 
    setTimeout(() => { window.isExploding = true; }, 1000); 
}

function renderLoop() { const v = document.getElementById('camera-feed'); const c = document.getElementById('capture-canvas-live'); if (!v || !c || v.paused) return; const ctx = c.getContext('2d', { alpha: false }); if (c.width !== window.innerWidth) { c.width = window.innerWidth; c.height = window.innerHeight; } ctx.clearRect(0, 0, c.width, c.height); if (OpusShaders[window.currentStyle]) OpusShaders[window.currentStyle](ctx, c.width, c.height); ctx.drawImage(v, 0, 0, c.width, c.height); ctx.globalCompositeOperation = 'source-over'; renderEliteStamps(ctx, c); animationFrameId = requestAnimationFrame(renderLoop); }

function startVideo() { const c = document.getElementById('capture-canvas-live'); recordedChunks = []; isRecording = true; const mixedStream = new MediaStream([...c.captureStream(30).getVideoTracks(), ...window.audioDestination.stream.getAudioTracks()]); mediaRecorder = new MediaRecorder(mixedStream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 8000000 }); mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); }; mediaRecorder.onstop = saveVideoFile; mediaRecorder.start(); document.getElementById('rec-indicator').style.opacity = "1"; document.getElementById('video-icon').setAttribute('data-lucide', 'square'); if(window.lucide) lucide.createIcons(); }

function stopVideo() { isRecording = false; if(mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop(); document.getElementById('rec-indicator').style.opacity = "0"; document.getElementById('video-icon').setAttribute('data-lucide', 'video'); if(window.lucide) lucide.createIcons(); }

window.toggleVideoRecording = () => { if (!isRecording) startVideo(); else stopVideo(); };

window.capturePhoto = async () => { if (isMining) return; const c = document.getElementById('capture-canvas-live'); const link = document.createElement('a'); link.download = `OPUS_SHOT_${Date.now()}.jpg`; link.href = c.toDataURL('image/jpeg', 0.95); link.click(); };

window.toggleVibeDropdown = () => { const dd = document.getElementById('vibe-dropdown'); if (dd) dd.classList.toggle('hidden'); };

window.toggleFlash = async () => { if (!videoTrack) return; isFlashOn = !isFlashOn; await videoTrack.applyConstraints({ advanced: [{ torch: isFlashOn }] }); document.getElementById('flash-icon').style.color = isFlashOn ? '#fbbf24' : '#fff'; };

window.toggleMic = () => { isMicOn = !isMicOn; if (micGainNode) micGainNode.gain.setTargetAtTime(isMicOn ? 1 : 0, window.audioContext.currentTime, 0.01); if (document.getElementById('camera-feed').srcObject) document.getElementById('camera-feed').srcObject.getAudioTracks().forEach(t => t.enabled = isMicOn); const icon = document.getElementById('mic-icon'); if (icon) { icon.style.color = isMicOn ? '#fff' : '#ef4444'; icon.setAttribute('data-lucide', isMicOn ? 'mic' : 'mic-off'); if(window.lucide) lucide.createIcons(); } };

window.stopAILens = () => { const v = document.getElementById('camera-feed'); document.getElementById('opus-lens-container').style.display = 'none'; if (geoWatchId) navigator.geolocation.clearWatch(geoWatchId); if (v.srcObject) v.srcObject.getTracks().forEach(t => t.stop()); cancelAnimationFrame(animationFrameId); };

async function saveVideoFile() {
    const blob = new Blob(recordedChunks, { type: 'video/mp4' });
    
    if (mathGame.correctSolved && window.isExploding) {
        if (window.currentSpot) {
            // 1. Cập nhật logic cooldown cục bộ
            userLootHistory[window.currentSpot.id] = Date.now();
            localStorage.setItem('opus_loot_log', JSON.stringify(userLootHistory));

            // 2. LOGIC FIREBASE: Đẩy tiền lên mây
            // Giải nén các hàm từ global hoặc từ Firebase SDK import
            const { doc, updateDoc, increment, serverTimestamp } = window.FirebaseFirestore || {};

            if (window.db && window.auth?.currentUser && doc) {
                const userRef = doc(window.db, "users", window.auth.currentUser.uid);
                try {
                    await updateDoc(userRef, {
                        silver: increment(wonAmount),
                        lastLoot: serverTimestamp()
                    });
                    console.log("🔥 [FIREBASE]: Lord of Opus Map updated!");
                } catch (e) {
                    console.error("❌ Firebase Sync Failed:", e);
                }
            } else {
                // Backup nếu chưa login: Lưu tạm vào localStorage để index.html đọc
                let localBalance = parseInt(localStorage.getItem('user_silver') || 0);
                localStorage.setItem('user_silver', localBalance + wonAmount);
                console.warn("⚠️ Offline mode: Saved to LocalStorage.");
            }

            alert(`💾 EVIDENCE SAVED! +${wonAmount} Silver. Leaderboard updating...`);
            
            // Reset trạng thái mining
            window.isExploding = false;
            window.isNearGift = false;
            window.currentSpot = null;
            mathGame.correctSolved = false;
            isMining = false;
        }
    }

    // Tải video về máy như cũ
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OPUS_VIBE_${Date.now()}.mp4`;
    link.click();
}