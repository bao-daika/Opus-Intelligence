// --- OPUS DATA: URBAN LANDSCAPES (2026-2027 EDITION) ---
// Hệ thống dữ liệu dành riêng cho Master - Mentor Opus cập nhật

const urbanSpots = [
    {
        id: "urban-toronto-cntower",
        catId: "urban",
        category: "Urban Landscapes",
        name: "CN Tower Twilight",
        lat: 43.642566, 
        lng: -79.387054,
        imageUrl: "Urban/CNTower.jpg", // Khớp với folder sếp vừa tạo
        camera: "Sony A7R V | FE 16-35mm f/2.8 GM II",
        price: "$899",
        description: "Góc chụp từ Roundhouse Park vào khung giờ vàng (Golden Hour). Bức hình bắt trọn dải tương phản động cực cao và ánh đèn đô thị Toronto lung linh."
    },
    {
        id: "urban-paris-eiffel",
        catId: "urban",
        category: "Urban Landscapes",
        name: "Eiffel Tower Majesty",
        lat: 48.858370, 
        lng: 2.294481,
        imageUrl: "Urban/EiffelTower.jpg", // Khớp với folder sếp vừa tạo
        camera: "Fujifilm GFX 100 II | GF 32-64mm f/4",
        price: "$1,250",
        description: "Chụp từ Trocadéro Gardens. Độ phân giải 100MP cho phép nhìn rõ từng chi tiết kiến trúc thép của biểu tượng nước Pháp dưới ánh nắng hoàng hôn."
    }
];

// Thông báo hệ thống đã sẵn sàng cho sếp
console.log("Opus System: Urban Data Loaded. 2 Masterpieces Ready.");