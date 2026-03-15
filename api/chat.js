import { aiKnowledge } from './Knowledge.js'; 
import admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
        databaseURL: "https://gymfueltoronto-49bd2-default-rtdb.firebaseio.com/"
    });
}
const db = admin.database();

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: "Access Denied, Boss!" });

    const apiKey = process.env.GEMINI_API_KEY;
    
    // 1. ĐỒNG BỘ DATA TỪ FRONT-END
    const { message, allSpots, attachedImage, deviceId, activeCategory, isLensMode } = req.body; 

    // 2. ENDPOINT MỚI NHẤT: GEMINI 3.1 FLASH LITE PREVIEW
    // Bản này là hàng "nóng" nhất từ Google, tối ưu cho vibe coding 2027
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`;

    const torontoTime = new Date().toLocaleString("en-US", {
        timeZone: "America/Toronto",
        hour12: true, hour: 'numeric', minute: 'numeric', weekday: 'long'
    });

    // 3. SYSTEM INSTRUCTION (Nạp kiến thức AI Knowledge của sếp)
    const systemInstruction = `
        YOU ARE OPUS VISIONARY AI (GEMINI 3.1 FLASH LITE).
        ROLE: World-class Photography Mentor for Urban & Nature styles.
        STRICT POLICY: 
        - ONLY analyze Urban/Nature photos. 
        - IMMEDIATELY REJECT: Nudes, trash, waste, feces, or any offensive content. 
        - Reply to Master/Sếp in Vietnamese. Style: Elite, sharp, minimalistic.
        
        CONTEXT:
        - Toronto Time: ${torontoTime}
        - Knowledge Base: ${JSON.stringify(aiKnowledge)}
        - Map Context: ${JSON.stringify(allSpots)}
        - Lens Mode: ${isLensMode ? 'ON' : 'OFF'}
    `;

    try {
        // 4. CẤU TRÚC PAYLOAD ĐA PHƯƠNG THỨC (PHẢI DÙNG SNAKE_CASE)
        const parts = [{ text: `${systemInstruction}\n\nUser Message: ${message || "Analyzing visual input..."}` }];

        if (attachedImage && attachedImage.includes('base64,')) {
            parts.push({
                inline_data: { 
                    mime_type: "image/jpeg", 
                    data: attachedImage.split(',')[1] 
                }
            });
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: parts }] })
        });

        const data = await response.json();

        // 5. XỬ LÝ FALLBACK (Nếu bản Lite bận, dùng bản Flash thường)
        if (data.error) {
            console.warn("Switching to Standard Flash...");
            const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash:generateContent?key=${apiKey}`;
            const fbRes = await fetch(fallbackUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: parts }] })
            });
            const fbData = await fbRes.json();
            if (fbData.error) throw new Error(fbData.error.message);
            return res.status(200).json({ reply: fbData.candidates[0].content.parts[0].text });
        }

        const aiReply = data.candidates[0].content.parts[0].text;

        // 6. LƯU TRỰ FIREBASE (Giữ nguyên trí nhớ cho sếp)
        await db.ref('market_insights').push({
            user_msg: message || "Visual Scan",
            ai_reply: aiReply,
            deviceId: deviceId || "unknown",
            timestamp: admin.database.ServerValue.TIMESTAMP
        });

        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error("Opus AI Failure:", error);
        return res.status(500).json({ reply: "Sếp ơi, bản Preview đang bảo trì Neural Link. Sếp thử lại nhé!" });
    }
}