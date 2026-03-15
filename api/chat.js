// --- OPUS INTELLIGENCE: PURE AI CORE (SYNC 2027) ---

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: "Access Denied, Boss!" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ reply: "Missing Gemini API Key, Master!" });

    // 1. NHẬN DATA TỪ FRONT-END
    const { message, allSpots, attachedImage, activeCategory, isLensMode } = req.body; 

    // 2. ENDPOINT GEMINI 3.1 FLASH LITE PREVIEW (Vibe 2027)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`;

    const torontoTime = new Date().toLocaleString("en-US", {
        timeZone: "America/Toronto",
        hour12: true, hour: 'numeric', minute: 'numeric', weekday: 'long'
    });

    // 3. SYSTEM INSTRUCTION (Nạp luật chặn nội dung bẩn ngay tại đây)
    const systemInstruction = `
        YOU ARE OPUS VISIONARY AI. 
        Role: Luxury Photography Mentor (Urban & Nature Specialist).
        
        STRICT RULES:
        - ONLY analyze photos of Architecture (Urban) and Landscapes (Nature).
        - REJECT: Nudity, filth, waste, or meaningless/offensive images. If detected, say: "Sếp ơi, bức ảnh này không phù hợp với tiêu chuẩn nghệ thuật của Opus."
        - Style: High-end, elite, minimalistic. 
        - Language: Vietnamese (Tiếng Việt). Call the user "Sếp" or "Master".
        
        CONTEXT:
        - Time: ${torontoTime}
        - Current Category: ${activeCategory}
        - Spots Data: ${JSON.stringify(allSpots)}
        - Lens Mode: ${isLensMode ? 'ACTIVE' : 'OFF'}
    `;

    try {
        const parts = [{ text: `${systemInstruction}\n\nUser Message: ${message || "Analyzing visual..."}` }];

        // Xử lý ảnh gửi kèm
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

        // Xử lý lỗi từ Google API
        if (data.error) {
            console.error("Gemini Error:", data.error);
            return res.status(400).json({ reply: "Sếp ơi, bộ não AI đang bận xử lý bối cảnh khác. Sếp thử lại nhé!" });
        }

        const aiReply = data.candidates[0].content.parts[0].text;

        // 4. TRẢ KẾT QUẢ NGAY (Bỏ qua lưu trữ Firebase)
        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error("Opus Failure:", error);
        return res.status(500).json({ reply: "Lỗi kết nối vệ tinh, thưa Sếp. Neural Link đã bị ngắt!" });
    }
}