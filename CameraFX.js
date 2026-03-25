/**
 * OPUS ELITE ENGINE 2027: ACTION FX LOGIC
 * Hybrid: Comic Vector (8-Point Star) + Multi-Format Assets (GIF/PNG/JPG)
 * FEATURE: Self-Shielding (Bảo vệ màu sắc gốc khỏi Shaders)
 */

// 1. KHAI BÁO THƯ VIỆN
window.actionLibrary = [
    { id: 'bam', name: 'Bam!', text: 'BAM!', color: '#ff3e3e', type: 'vector', speed: 0.025, icon: 'zap' },
    { id: 'doge', name: 'Doge', img: 'assets/DOGE.png', type: 'asset', speed: 0.012, size: 140, icon: 'dog' },
    { id: 'octopus', name: 'Octopus', img: 'assets/octopus.png', type: 'asset', speed: 0.018, size: 200, icon: 'cloud-snow' },
    { id: 'ghost', name: 'Ghost', img: 'assets/ghost.png', type: 'asset', speed: 0.018, size: 200, icon: 'cloud-snow' },
];

let activeFX = [];
let selectedAction = 'bam'; 
const loadedImages = {};

window.actionLibrary.forEach(a => {
    if(a.type === 'asset' && a.img) {
        const img = new Image();
        img.src = a.img;
        loadedImages[a.id] = img;
    }
});

const ActionAssets = {};
window.actionLibrary.forEach(a => { ActionAssets[a.id] = a; });

window.selectAction = (actionId) => {
    selectedAction = actionId;
    const nameEl = document.getElementById('current-action-name');
    if(nameEl) nameEl.innerText = actionId.toUpperCase();
    
    const actionBtn = document.querySelector('[onclick="window.toggleActionDropdown()"]');
    if(actionBtn) {
        const iconEl = actionBtn.querySelector('i');
        const data = ActionAssets[actionId];
        const newIcon = data.icon || 'zap';
        if(iconEl) {
            iconEl.setAttribute('data-lucide', newIcon);
            if(window.lucide) lucide.createIcons();
        }
    }
    window.toggleActionDropdown();
};

window.toggleActionDropdown = () => {
    const dd = document.getElementById('action-dropdown');
    if(!dd) return;
    if (dd.classList.contains('hidden')) {
        dd.innerHTML = window.actionLibrary.map(a => `
            <div onclick="window.selectAction('${a.id}')" 
                 class="px-5 py-4 text-[10px] text-white/70 active:bg-yellow-500 active:text-black hover:bg-yellow-500/20 transition-all uppercase font-black cursor-pointer border-b border-white/5 flex justify-between items-center">
                 ${a.name}
            </div>
        `).join('');
    }
    dd.classList.toggle('hidden');
};

window.spawnActionFX = (x, y) => {
    if (activeFX.length >= 6) activeFX.shift();
    const data = ActionAssets[selectedAction];
    activeFX.push({
        id: Date.now(),
        x, y,
        type: selectedAction,
        life: 1.0,
        speed: data.speed || 0.02,
        rotation: (Math.random() - 0.5) * 0.4,
        seed: Math.random()
    });
};

// --- HÀM DRAW TỰ BẢO VỆ MÀU SẮC (CƠ CHẾ GIỐNG STAMP) ---
window.drawActionFX = (ctx) => {
    if (activeFX.length === 0) return;

    const isMobile = window.innerWidth < 768;
    
    // BƯỚC THẦN THÁNH: Lưu filter cũ và ép về NONE để bảo vệ màu
    const originalFilter = ctx.filter;
    ctx.filter = 'none'; 

    for (let i = activeFX.length - 1; i >= 0; i--) {
        let fx = activeFX[i];
        fx.life -= fx.speed; 
        
        if (fx.life <= 0) {
            activeFX.splice(i, 1);
            continue;
        }

        const data = ActionAssets[fx.type];
        ctx.save();
        
        const responsiveScale = isMobile ? 0.8 : 1.0;
        ctx.translate(fx.x, fx.y);
        ctx.rotate(fx.rotation);
        ctx.globalAlpha = fx.life > 0.2 ? 1 : fx.life * 5;

        if (data.type === 'asset') {
            const img = loadedImages[fx.type];
            if(img && img.complete && img.naturalWidth !== 0) {
                const baseSize = data.size || 150;
                const size = baseSize * responsiveScale * (1.1 - fx.life * 0.1); 
                const yRise = (1 - fx.life) * -60; 
                ctx.drawImage(img, -size/2, -size/2 + yRise, size, size);
            }
        } else {
            // VẼ SAO 8 CÁNH (Màu đỏ tươi nguyên bản)
            const scale = (1.3 - fx.life) * responsiveScale;
            ctx.scale(scale, scale);
            ctx.fillStyle = data.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = data.color;

            ctx.beginPath();
            const points = 8;
            const outerRadius = 55;
            const innerRadius = 25;
            for (let j = 0; j < points * 2; j++) {
                let r = j % 2 === 0 ? outerRadius : innerRadius;
                let angle = (Math.PI / points) * j;
                ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            }
            ctx.closePath();
            ctx.fill();
            
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.fillStyle = 'black';
            ctx.font = 'bold 16px "Arial Black", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(data.text, 0, 0);
        }
        ctx.restore();
    }

    // Trả lại filter cho các layer sau (Stamps) nếu cần
    ctx.filter = originalFilter;
};