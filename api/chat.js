import { aiKnowledge } from './Knowledge.js'; 
import admin from "firebase-admin";

// Khởi tạo Firebase Admin - Giữ nguyên logic bảo mật của sếp
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
        databaseURL: "https://gymfueltoronto-49bd2-default-rtdb.firebaseio.com/"
    });
}
const db = admin.database();

export default async function handler(req, res) {
    // 1. CHẶN TRUY CẬP TRÁI PHÉP
    if (req.method !== 'POST') return res.status(405).json({ reply: "Access Denied, Boss!" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.length < 20) {
        return res.status(500).json({ reply: "API Key Error. Contact Admin, Boss!" });
    }

    // 2. NHẬN DATA TỪ FRONT-END (Khớp 100% với chatbot_brain.js)
    const { message, allSpots, attachedImage, deviceId, activeCategory, isLensMode } = req.body; 

    // Đồng bộ thời gian thực tại Toronto để AI tư vấn ánh sáng
    const torontoTime = new Date().toLocaleString("en-US", {
        timeZone: "America/Toronto",
        hour12: true, hour: 'numeric', minute: 'numeric', weekday: 'long'
    });

    // 3. TRÍ NHỚ ĐẲNG CẤP (MEMORY RECALL)
    let chatHistoryContext = "A fresh luxury consultation, Master.";
    try {
        if (deviceId) {
            const snapshot = await db.ref('market_insights')
                .orderByChild('deviceId')
                .equalTo(deviceId)
                .limitToLast(5) // Lấy 5 hội thoại gần nhất để AI hiểu ý sếp
                .once('value');
            
            const history = snapshot.val();
            if (history) {
                chatHistoryContext = Object.values(history)
                    .map(h => `User: ${h.user_msg}\nConsultant: ${h.ai_reply}`)
                    .join("\n---\n");
            }
        }
    } catch (e) { console.error("Memory Recall Error:", e); }

    // Sử dụng Model Gemini 3.1 Flash (Bản cập nhật mới nhất sếp yêu cầu)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash:generateContent?key=${apiKey}`;

    // 4. SYSTEM INSTRUCTION: THE PHOTOGRAPHY MENTOR (Vibe 2027)
    const systemInstruction = `
    Your name is "Opus Visionary AI".
    Role: A World-class Photography Mentor & Visual Consultant for the Global Elite. 
    Vibe: High-end, technical yet poetic. You call the user "Sếp", "Boss", hoặc "Master".

    CORE CAPABILITIES (VIBE 2027):
    - **VISION MODE**: Currently ${isLensMode ? 'ACTIVE (Looking through Lens)' : 'STANDBY (Chatting)'}.
    - **TECHNICAL EXPERTISE**: Expert in Dynamic Range, Aperture, Composition (Rule of Thirds, Golden Spiral), and Film Simulations (Fuji/Leica).
    - **ENVIRONMENTAL SCAN**: Current Toronto Time: ${torontoTime}. Advise on Lighting based on this time.
    - **MAP CONTEXT**: Monitoring Opus Map Locations: ${JSON.stringify(allSpots)}. 
    - **ACTIVE CATEGORY**: Sếp đang xem mục: ${activeCategory}.

    PHOTOGRAPHY DIRECTIVES:
    1. If an image is provided: Analyze composition, lighting, and cinematic potential. Suggest specific tweaks (e.g., "Hạ ISO xuống", "Căn lại tỷ lệ vàng").
    2. If in LENS MODE: Give short, sharp, and elite commands to help the Boss capture the masterpiece immediately.
    3. Communication: Vietnamese (Tiếng Việt). Elite, sharp, sophisticated style. Keep it under 3 sentences unless asked for a deep review.

    "Make it Atmosphere. Make it Opus."
    `;

    try {
        // 5. GỬI DATA SANG GEMINI 3.1 FLASH
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [
                        { text: `${systemInstruction}\n\nChat History:\n${chatHistoryContext}\n\nUser Message: ${message}` },
                        // Xử lý ảnh base64 từ Vision AI gửi lên
                        ...(attachedImage ? [{ 
                            inlineData: { 
                                mimeType: "image/jpeg", 
                                data: attachedImage.split(',')[1] 
                            } 
                        }] : [])
                    ] 
                }]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        const aiReply = data.candidates[0].content.parts[0].text;

        // 6. LƯU TRỮ HÀNH TRÌNH TÁC NGHIỆP VÀO FIREBASE
        await db.ref('market_insights').push({
            user_msg: message,
            ai_reply: aiReply,
            deviceId: deviceId || "unknown", 
            category_context: activeCategory || "none",
            is_lens_capture: !!attachedImage,
            timestamp: admin.database.ServerValue.TIMESTAMP,
            toronto_time: torontoTime
        });

        // 7. TRẢ KẾT QUẢ VỀ CHO CHATBOT_BRAIN.JS
        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error("Opus AI Core Error:", error);
        return res.status(500).json({ 
            reply: "Sóng vệ tinh tại tọa độ này hơi yếu thưa Sếp. Em đang tái lập Neural Link, Sếp thử lại nhé!" 
        });
    }
}