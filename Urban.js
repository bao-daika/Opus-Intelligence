/**
 * OPUS DATA: URBAN (2027 LENS-SYNC & MINING EDITION)
 * [CONCEPT]: Lens-Specific Mining.
 * [LOGIC]: One location, multiple parallel dimensions (Gold/Silver/Void).
 * [VIBE]: Invisible boxes are always there; Lens reveals them.
 */

const urbanSpots = [
    {
        id: "admin-command-center",
        catId: "urban",
        category: "Admin",
        name: "Opus Command Center",
        lat: 43.65547, 
        lng: -79.40107,
        isAdmin: true,
        // --- MULTI-VAULT ---
        goldAmount: 999999,
        silverAmount: 888888,
        voidAmount: 777777,
        images: ["Urban/Admin_HQ.jpg"],
        audioUrl: "Audio/Admin.mp3",
        description: "TRUNG TÂM TỐI CAO: Toàn quyền truy xuất 3 loại tài nguyên."
    },
    {
        id: "urban-toronto-cntower",
        catId: "urban",
        category: "Urban",
        name: "CN Tower Twilight",
        lat: 43.642566, 
        lng: -79.387054,
        goldAmount: 5000,
        silverAmount: 15000,
        voidAmount: 0,
        images: ["Urban/CN_Tower1.jpg"],
        audioUrl: "Audio/Toronto.mp3",
        description: "Completed in 1976. **Secret:** Hidden 351m above ground is the 'Wine Cellar in the Sky.' This shot captures the 16-million-color LED system synchronizing with the Toronto twilight."
    },
    {
        id: "urban-paris-eiffel",
        catId: "urban",
        category: "Urban",
        name: "Eiffel Tower Majesty",
        lat: 48.858370, 
        lng: 2.294481,
        goldAmount: 8500,
        silverAmount: 25000,
        voidAmount: 0,
        images: ["Urban/EiffelTower.jpg"],
        audioUrl: "Audio/France.mp3",
        description: "Erected for the 1889 World's Fair. **Secret:** Gustave Eiffel maintained a private apartment at the peak. Bathed in the legendary 'Heure Bleue' of Paris."
    },
    {
        id: "urban-mexico-angel",
        catId: "urban",
        category: "Urban",
        name: "Guardian of Mexico",
        lat: 19.427021, 
        lng: -99.167665,
        goldAmount: 3200,
        silverAmount: 12000,
        voidAmount: 0,
        images: ["Urban/Mexico.jpg"],
        audioUrl: "Audio/Mexico.mp3",
        description: "The 'Angel of Independence' (1910). The 24k gold-plated bronze Nike stands atop a 45m column. **Secret:** The base serves as a mausoleum for revolutionary heroes."
    },
    {
        id: "urban-russia-basil",
        catId: "urban",
        category: "Urban",
        name: "St. Basil's Midnight",
        lat: 55.752523, 
        lng: 37.623088,
        goldAmount: 12000,
        silverAmount: 40000,
        voidAmount: 0,
        images: ["Urban/Russia.jpg"],
        audioUrl: "Audio/Russia.mp3",
        description: "Commissioned by Ivan the Terrible in 1555. Nine vibrant onion domes representing the flames of a bonfire. **Secret:** Legend states the architect was blinded so he could never recreate its beauty."
    },
    {
        id: "urban-china-shanghai",
        catId: "urban",
        category: "Urban",
        name: "Shanghai Pulse",
        lat: 31.235529, 
        lng: 121.501154, 
        goldAmount: 6700,
        silverAmount: 22000,
        voidAmount: 0,
        images: ["Urban/China.jpg"],
        audioUrl: "Audio/China.mp3",
        description: "Shanghai Tower (632m) features a unique 120-degree twist. **Secret:** This aerodynamic spiral saved $58 million in structural steel. Capturing the 'Neon Pulse' of the city."
    },
    {
        id: "urban-iran-mosque",
        catId: "urban",
        category: "Urban",
        name: "Kaleidoscope of Faith",
        lat: 29.608300, 
        lng: 52.548400,
        goldAmount: 4500,
        silverAmount: 18000,
        voidAmount: 0,
        images: ["Urban/Iran.jpg"],
        audioUrl: "Audio/Iran.mp3",
        description: "The Nasir al-Mulk Mosque (Pink Mosque). **Secret:** Morning sunlight transforms the prayer hall into a massive kaleidoscope. Captures the fleeting moment of peak illumination."
    }
];

/**
 * --- LENS-DRIVEN DETECTOR ---
 * Xác định mỏ tài nguyên khi người dùng di chuyển gần.
 */
window.getNearbyUrbanSpot = function(uLat, uLng) {
    const threshold = 0.0004; // ~40m
    return urbanSpots.find(s => 
        Math.abs(s.lat - uLat) < threshold && 
        Math.abs(s.lng - uLng) < threshold
    ) || null;
};

/**
 * --- BRIDGE LOGIC: SYNC WITH GLOBAL STATE ---
 * Đồng bộ hóa dữ liệu từ Map Layer sang Camera AI (Dựa trên Lens đang bật).
 */
function syncMapToCamera(userLat, userLng) {
    const spot = window.getNearbyUrbanSpot(userLat, userLng);
    if (spot) {
        window.isNearGift = true;
        window.currentSpot = spot; 
        const activeLens = window.currentStyle || 'none';
        let matched = false;

        // Ưu tiên tài nguyên khớp với Lens sếp đang chọn
        if (activeLens === 'golden' && spot.goldAmount > 0) { window.giftType = 'gold'; matched = true; } 
        else if (activeLens === 'silver' && spot.silverAmount > 0) { window.giftType = 'silver'; matched = true; } 
        else if (activeLens === 'void' && spot.voidAmount > 0) { window.giftType = 'void'; matched = true; }

        // Nếu không khớp Lens, dùng tài nguyên mặc định hiện có
        if (!matched) {
            if (spot.goldAmount > 0) window.giftType = 'gold';
            else if (spot.silverAmount > 0) window.giftType = 'silver';
            else if (spot.voidAmount > 0) window.giftType = 'void';
            else window.giftType = 'none';
        }
    } else {
        window.isNearGift = false;
        window.currentSpot = null;
        window.giftType = 'none';
    }
}

console.log("Opus System: Urban Data Cleaned & Mining Logic Synced.");