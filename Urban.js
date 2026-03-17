// --- OPUS DATA: URBAN LANDSCAPES (2026-2027 GLOBAL EDITION) ---
// Mentor Opus: Cập nhật cấu trúc Mảng cho Multiple Photos

const urbanSpots = [
    {
        id: "urban-toronto-cntower",
        catId: "urban",
        category: "Urban Landscapes",
        name: "CN Tower Twilight",
        lat: 43.642566, 
        lng: -79.387054,
        // CHUYỂN THÀNH MẢNG: Sếp có thể thêm không giới hạn ảnh vào đây
        images: [
            "Urban/CN_Tower1.jpg",
            "Urban/CN_Tower2.jpg",
            "Urban/CN_Tower3.jpg",
        ],
        audioUrl: "Audio/Toronto.mp3",
        camera: "Sony A7R V | FE 16-35mm f/2.8 GM II",
        price: "$899",
        Description: "Captured from Roundhouse Park during the Golden Hour. This shot masterfully preserves an ultra-high dynamic range."
    },
    {
        id: "urban-paris-eiffel",
        catId: "urban",
        category: "Urban Landscapes",
        name: "Eiffel Tower Majesty",
        lat: 48.858370, 
        lng: 2.294481,
        images: [
            "Urban/EiffelTower.jpg",
            
        ],
        audioUrl: "Audio/France.mp3",
        camera: "Fujifilm GFX 100 II | GF 32-64mm f/4",
        price: "$1,250",
        Description: "Iron Majesty, Infinite Horizon. Captured during the ultimate Golden Hour radiance."
    },
    {
        id: "urban-mexico-angel",
        catId: "urban",
        category: "Urban Landscapes",
        name: "Guardian of Mexico",
        lat: 19.427021, 
        lng: -99.167665,
        images: [
            "Urban/Mexico.jpg",
        ],
        audioUrl: "Audio/Mexico.mp3",
        camera: "Sony A7R V | FE 24-70mm f/2.8 GM II",
        price: "$950",
        Description: "The Golden Guardian of Mexico City. An elite aerial perspective of 'El Ángel'."
    },
    {
        id: "urban-russia-basil",
        catId: "urban",
        category: "Urban Landscapes",
        name: "St. Basil's Midnight",
        lat: 55.752523, 
        lng: 37.623088,
        images: [
            "Urban/Russia.jpg"
        ],
        audioUrl: "Audio/Russia.mp3",
        camera: "Hasselblad X2D 100C | XCD 38mm f/2.5",
        price: "$1,800",
        Description: "A symphony of colors at the heart of the Red Square."
    },
    {
        id: "urban-china-shanghai",
        catId: "urban",
        category: "Urban Landscapes",
        name: "Shanghai Pulse",
        lat: 31.235529, 
        lng: 121.501154, 
        images: [
            "Urban/China.jpg",
    
        ],
        audioUrl: "Audio/China.mp3",
        camera: "Fujifilm GFX 100 II | GF 23mm f/4 R LM WR",
        price: "$1,500",
        Description: "The Neon Pulse of Shanghai. A futuristic masterwork."
    },
    {
        id: "urban-iran-mosque",
        catId: "urban",
        category: "Urban Landscapes",
        name: "Kaleidoscope of Faith",
        lat: 29.608300, 
        lng: 52.548400,
        images: [
            "Urban/Iran.jpg"
        ],
        audioUrl: "Audio/Iran.mp3",
        camera: "Leica SL3 | Vario-Elmarit-SL 24-70mm f/2.8",
        price: "$2,100",
        Description: "Inside the Pink Mosque. A masterpiece of color and geometry."
    }
];

console.log("Opus System: Multi-Photo Structure Ready.");