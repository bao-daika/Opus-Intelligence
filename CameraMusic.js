/**
 * OPUS MUSIC ENGINE 2027: VIBE CONTROLLER
 */

window.vibeLibrary = [
    { id: 'France', name: 'France' },
    { id: 'China', name: 'China' },
    { id: 'Iran', name: 'Iran' },
    { id: 'Mexico', name: 'Mexico' },
    { id: 'Russia', name: 'Russia' },
    { id: 'Winning', name: 'Winning' },
    { id: 'WinterChill', name: 'WinterChill' },
];

// Khởi tạo các biến Global để CameraAI.js truy cập được
window.bgMusic = null;
window.isPlayingMusic = false;
window.musicSourceNode = null; 

window.initMusicEngine = () => {
    if (!window.bgMusic) {
        window.bgMusic = new Audio('audio/France.mp3');
        window.bgMusic.loop = true;
        window.bgMusic.crossOrigin = "anonymous"; 
    }
};

window.toggleVibeMusic = () => {
    window.initMusicEngine();
    const vibeBtn = document.getElementById('vibe-control-btn');
    const vibeIcon = document.getElementById('vibe-icon-main');
    
    if (!window.isPlayingMusic) {
        window.bgMusic.play().then(() => {
            window.isPlayingMusic = true;
            vibeBtn?.classList.add('bg-yellow-500/20', 'border-yellow-500/60');
            vibeIcon?.setAttribute('data-lucide', 'pause-circle');
            if(window.lucide) lucide.createIcons();
        }).catch(e => console.log("Opus: Interaction required"));
    } else {
        window.bgMusic.pause();
        window.isPlayingMusic = false;
        vibeBtn?.classList.remove('bg-yellow-500/20', 'border-yellow-500/60');
        vibeIcon?.setAttribute('data-lucide', 'music');
        if(window.lucide) lucide.createIcons();
    }
};

window.selectVibe = (country) => {
    window.initMusicEngine();
    
    // Ngắt kết nối node cũ nếu đang tồn tại
    if (window.musicSourceNode) {
        try { window.musicSourceNode.disconnect(); } catch(e) {}
    }

    window.bgMusic.src = `audio/${country}.mp3`;
    document.getElementById('current-vibe-name').innerText = country.toUpperCase();
    
    window.bgMusic.play().then(() => {
        window.isPlayingMusic = true;
        
        // Tái kết nối vào Audio Context của file AI để phục vụ Record
        if (window.audioContext && window.audioDestination) {
            window.musicSourceNode = window.audioContext.createMediaElementSource(window.bgMusic);
            window.musicSourceNode.connect(window.audioDestination);
            window.musicSourceNode.connect(window.audioContext.destination);
        }

        document.getElementById('vibe-control-btn')?.classList.add('bg-yellow-500/20', 'border-yellow-500/60');
        document.getElementById('vibe-icon-main')?.setAttribute('data-lucide', 'pause-circle');
        if(window.lucide) lucide.createIcons();
    }).catch(e => console.error("Audio Play Error:", e));

    document.getElementById('vibe-dropdown').classList.add('hidden');
};

window.toggleVibeDropdown = () => {
    document.getElementById('vibe-dropdown').classList.toggle('hidden');
};