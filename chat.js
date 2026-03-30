// --- OPUS INTELLIGENCE: PURE AI CORE (SYNC 2027 - INSTANT RATING) ---
// Quản lý: Instant Rating, Global Lock, Stamp Authentication.
// [MENTOR UPDATE]: ĐÃ XÓA BỎ HOÀN TOÀN QUY TẮC 5 PHÚT. 100% INSTANT BRIDGE.

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: "Access Denied, Boss!" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ reply: "Missing Gemini API Key, Master!" });

    // --- 1. NHẬN DỮ LIỆU TỪ CHATBOT_BRAIN (BRIDGE DỮ LIỆU TỨC THỜI) ---
    const { message, attachedImage, userLocation, isLensMode } = req.body; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`;

    const getErrorReply = (type) => {
        const errors = {
            busy: "System saturated. Standby, Boss.",
            no_geo: "Elite shot, but GPS missing. Global Map upload locked.",
            failure: "Neural Link fragmented. Reconnecting...",
            safety: "Opus Security: Prohibited content blocked."
        };
        return errors[type] || errors.failure;
    };

    // --- 2. OPUS ELITE SYSTEM INSTRUCTION (SYNCED 100% WITH CAMERA-AI STAMPS) ---
    // Mentor Note: Đã xóa bỏ Elite Window logic để khớp với vibe "Chụp là Chấm".
    const systemInstruction = `
    YOU ARE OPUS VISIONARY AI. ROLE: GLOBAL ELITE ANTI-FRAUD JUDGE AND PARANORMAL ANALYST.

    STRICT AUTHENTICATION PROTOCOL (CAMERA-AI.JS SYNC):
    1. MANDATORY STAMP CHECK: Detect "CAPTURED BY HUMAN", "VERIFIED BY OPUS-MAP AI", "LOC:", and "OPUS_VERIFIED_".
    2. GPS EXTRACTION: Extract Latitude and Longitude from the "LOC:" stamp. 
       - IF NO COORDINATES DETECTED: STATUS = NO_LOCATION.
    3. INSTANT TRUST: This is an instant stream from Opus Rate Lens. No time window checks required.
    4. ANTI-FRAUD: Reject Moire patterns or missing 0.15 text stroke. 

    STRICT DATA FORMAT FOR UI PARSING:
    CATEGORY: [Urban / Nature / Aliens / Haunted]
    SCORE: [X/10] 
    LOCATION: [Lat, Lng or "MISSING"]
    STATUS: [AUTHENTIC / NO_LOCATION / FRAUD]

    COMMUNICATION: 
    - Always address user as "Boss". 
    - Critique Comments: Max 35 words. Use the user's language.
    - Status AUTHENTIC + Score 6/10+ = Global Map Access Granted.
    - Keep the DATA FORMAT block above in English.
`;

    try {
        // --- 3. PAYLOAD PROCESSING ---
        const parts = [{ text: `${systemInstruction}\n\nUser Input: ${message || "Authenticate and analyze masterpiece."}` }];

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
            body: JSON.stringify({ 
                contents: [{ parts: parts }],
                safetySettings: [
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" }
                ]
            })
        });

        const data = await response.json();
        if (data.promptFeedback?.blockReason) return res.status(200).json({ reply: getErrorReply('safety'), score: 0, category: "Blocked" });
        if (data.error) return res.status(400).json({ reply: getErrorReply('busy') });

        const aiReply = data.candidates[0].content.parts[0].text;

        // --- 4. HẬU XỬ LÝ DỮ LIỆU ---
        const scoreMatch = aiReply.match(/SCORE:\s*(\d+(\.\d+)?)\/10/i);
        const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
        
        const aiTextUpper = aiReply.toUpperCase();
        
        let finalCategory = "Urban";
        if (aiTextUpper.includes("ALIENS")) finalCategory = "Aliens";
        else if (aiTextUpper.includes("HAUNTED")) finalCategory = "Haunted";
        else if (aiTextUpper.includes("NATURE")) finalCategory = "Nature";

        let finalReply = aiReply;
        
        const isAuthentic = aiTextUpper.includes("STATUS: AUTHENTIC");
        const hasLocation = aiTextUpper.includes("LOCATION:") && !aiTextUpper.includes("MISSING");

        // --- 5. QUYẾT ĐỊNH GO GLOBAL (INSTANT APPROVAL) ---
        // Boss, nếu ảnh Authentic, điểm >= 6 và có tọa độ là em cho canUpload = true ngay.
        const canUpload = isAuthentic && score >= 6 && hasLocation;

        if (score >= 6 && !hasLocation) {
            finalReply += `\n\n[OPUS SECURITY]: ${getErrorReply('no_geo')}`;
        }

        return res.status(200).json({ 
            reply: finalReply, 
            score: score, 
            category: finalCategory,
            canUpload: canUpload 
        });

    } catch (error) {
        return res.status(500).json({ reply: getErrorReply('failure') });
    }
}