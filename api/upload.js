// --- OPUS GLOBAL SYNC: MASTERPIECE INJECTION (2027) ---
// Role: Chốt chặn cuối cùng để đưa hình Member lên Map toàn cầu.
// Logic: 1 Member = 1 Doc (Ghi đè dựa trên UID), Khớp 100% với index.html & detail.html

import admin from 'firebase-admin';

// Khởi tạo Admin SDK (Chỉ khởi tạo 1 lần)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });
}

const db = admin.firestore();

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed, Boss!" });

    try {
        const { 
            uid, email, displayName, photoURL, // Từ Google Auth
            imageData, title, description, hardware, 
            lat, lng, score, category, artistLinks 
        } = req.body;

        // --- [MENTOR UPDATE 2027]: LOWER BAR TO ATTRACT USERS ---
        if (score < 6) {
            return res.status(403).json({ error: "Opus Error: Score below 6/10 cannot go Global yet." });
        }

        // Giới hạn 5 từ như sếp lệnh cho tiêu đề
        const cleanTitle = title.split(' ').slice(0, 5).join(' '); 
        
        // --- LOGIC PHÂN LOẠI MÀU ĐỐM (KHỚP 100% INDEX.HTML) ---
        // index.html dùng: spot.category === "Urban" ? 'marker-user-purple' : 'marker-user-blue'
        // Nhưng để chắc chắn Aliens & Haunted hiển thị đúng (không phân biệt user/admin), 
        // ta giữ nguyên Category gốc từ AI.
        let finalCategory = category; 
        
        // Đảm bảo category khớp với các file Nature.js, Urban.js, Aliens.js, Haunted.js
        const validCategories = ["Urban", "Nature", "Aliens", "Haunted"];
        if (!validCategories.includes(finalCategory)) {
            finalCategory = "Urban"; // Default nếu AI phân tích sai lệch
        }

        // --- MASTERPIECE DATA STRUCTURE ---
        const masterpieceData = {
            id: uid, // Dùng UID làm ID đồng nhất
            uid: uid,
            author: displayName || "Elite Member",
            email: email,
            authorImg: photoURL,
            name: cleanTitle,
            Description: description, // Viết hoa chữ D để khớp với detail.html
            camera: hardware,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            images: [imageData], // Array chứa Base64 để Carousel trong detail.html đọc được
            score: parseFloat(score),
            category: finalCategory, 
            // KHÓA CHÍNH: verified phải là "USER" để index.html vẽ đốm Tím/Blue nhỏ
            verified: (finalCategory === "Aliens" || finalCategory === "Haunted") ? "ADMIN" : "USER", 
            artistInfo: {
                instagram: artistLinks?.ig || "None",
                youtube: artistLinks?.yt || "None",
                facebook: artistLinks?.fb || "None",
                linkedin: artistLinks?.li || "None"
            },
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        // --- EXECUTE: 1 MEMBER = 1 DOC (Ghi đè tuyệt đối) ---
        await db.collection("global_masterpieces").doc(uid).set(masterpieceData);

        console.log(`Opus Sync: Masterpiece by ${email} injected to Global Map as ${finalCategory}.`);
        
        return res.status(200).json({ 
            success: true, 
            message: "Boss, your Masterpiece is now Global!",
            category: finalCategory
        });

    } catch (error) {
        console.error("Opus Upload Failure:", error);
        return res.status(500).json({ error: "Neural Link Fragmented. Database rejected entry." });
    }
}