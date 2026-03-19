// --- OPUS GLOBAL SYNC: MASTERPIECE INJECTION (2027) ---
// Role: Chốt chặn cuối cùng + Double-Check AI Safety (Anti-Porn/Violence/Trash)
// Logic: 1 Member = 1 Doc, Khớp 100% UI, Bảo mật tuyệt đối.

import admin from 'firebase-admin';

// Khởi tạo Admin SDK
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
            uid, email, displayName, photoURL, 
            imageData, title, description, hardware, 
            lat, lng, score, category, artistLinks 
        } = req.body;

        // --- 1. KIỂM TRA ĐIỂM SỐ CƠ BẢN ---
        if (score < 6) {
            return res.status(403).json({ error: "Opus Error: Score below 6/10 cannot go Global yet." });
        }

        // --- 2. [MENTOR SECURITY UPGRADE]: DOUBLE-CHECK AI SAFETY ---
        // Gọi lại Gemini Vision để quét nội dung ảnh một lần cuối trên Server
        const apiKey = process.env.GEMINI_API_KEY;
        const safetyUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const safetyCheck = await fetch(safetyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: "DO NOT TALK. JUST RESPOND 'SAFE' OR 'VIOLATION'. Analyze this image for: Nudity, Pornography, Blood, Gore, Corpses, Human Waste, Trash, or Filth. If any detected, respond 'VIOLATION'." },
                        { inline_data: { mime_type: "image/jpeg", data: imageData.split(',')[1] } }
                    ]
                }],
                safetySettings: [
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" },
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" }
                ]
            })
        });

        const safetyData = await safetyCheck.json();
        const aiDecision = safetyData.candidates?.[0]?.content?.parts?.[0]?.text || "VIOLATION";

        if (aiDecision.includes("VIOLATION") || safetyData.promptFeedback?.blockReason) {
            console.warn(`SECURITY ALERT: User ${email} attempted to upload prohibited content.`);
            return res.status(400).json({ error: "Opus Security: Image contains prohibited or low-vibe content." });
        }

        // --- 3. GIỮ NGUYÊN LOGIC CŨ 100% ---
        const cleanTitle = title.split(' ').slice(0, 5).join(' '); 
        
        let finalCategory = category; 
        const validCategories = ["Urban", "Nature", "Aliens", "Haunted"];
        if (!validCategories.includes(finalCategory)) {
            finalCategory = "Urban";
        }

        const masterpieceData = {
            id: uid,
            uid: uid,
            author: displayName || "Elite Member",
            email: email,
            authorImg: photoURL,
            name: cleanTitle,
            Description: description, 
            camera: hardware,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            images: [imageData], 
            score: parseFloat(score),
            category: finalCategory, 
            verified: (finalCategory === "Aliens" || finalCategory === "Haunted") ? "ADMIN" : "USER", 
            artistInfo: {
                instagram: artistLinks?.ig || "None",
                youtube: artistLinks?.yt || "None",
                facebook: artistLinks?.fb || "None",
                linkedin: artistLinks?.li || "None"
            },
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        // --- 4. EXECUTE GHI ĐÈ ---
        await db.collection("global_masterpieces").doc(uid).set(masterpieceData);

        console.log(`Opus Sync: Masterpiece by ${email} injected to Global Map.`);
        
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