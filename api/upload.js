// --- OPUS GLOBAL SYNC: MASTERPIECE INJECTION (2027) ---
// Role: Chốt chặn cuối cùng để đưa hình Member lên Map toàn cầu.
// Logic: 1 Member = 1 Doc (Ghi đè dựa trên UID), Phân loại màu Đốm bằng AI.

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

        const cleanTitle = title.split(' ').slice(0, 5).join(' '); // Giới hạn 5 từ như sếp lệnh
        
        // 2. PHÂN LOẠI MÀU ĐỐM (LOGIC 2027)
        // Urban = Tím (Purple), Nature = Xanh dương (Blue)
        const dotColor = category.toLowerCase().includes('urban') ? '#A855F7' : '#3B82F6';

        // 3. MASTERPIECE DATA STRUCTURE
        const masterpieceData = {
            id: `opus_member_${uid}`,
            uid: uid,
            author: displayName || "Elite Member",
            email: email,
            authorImg: photoURL,
            name: cleanTitle,
            Description: description,
            camera: hardware,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            images: [imageData], // Base64 injection
            score: parseFloat(score),
            category: category, // AI đã phân tích từ chatbot_brain
            dotColor: dotColor,
            artistInfo: {
                instagram: artistLinks?.ig || "None",
                youtube: artistLinks?.yt || "None",
                facebook: artistLinks?.fb || "None",
                linkedin: artistLinks?.li || "None"
            },
            verified: "MEMBER_MASTERPIECE",
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        // 4. EXECUTE: 1 MEMBER = 1 DOC (Ghi đè tuyệt đối)
        // Dùng UID làm Document ID để tự động thay thế hình cũ
        await db.collection("global_masterpieces").doc(uid).set(masterpieceData);

        console.log(`Opus Sync: Masterpiece by ${email} injected to Global Map.`);
        
        return res.status(200).json({ 
            success: true, 
            message: "Boss, your Masterpiece is now Global!",
            dot: dotColor 
        });

    } catch (error) {
        console.error("Opus Upload Failure:", error);
        return res.status(500).json({ error: "Neural Link Fragmented. Database rejected entry." });
    }
}