// --- OPUS INTELLIGENCE: PURE AI CORE (SYNC 2027 - STAMP VERIFIED) ---

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: "Access Denied, Boss!" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ reply: "Missing Gemini API Key, Master!" });

    // MENTOR UPDATE: Nhận thêm clientTimestamp để đối soát kép
    const { message, attachedImage, userLocation, clientTimestamp } = req.body; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`;

    const getErrorReply = (type) => {
        const errors = {
            busy: "System saturated. Standby, Boss.",
            no_geo: "Elite shot, but GPS missing. Global Map upload locked.",
            failure: "Neural Link fragmented. Reconnecting...",
            safety: "Opus Security: Prohibited content blocked.",
            expired: "Time window closed. Evidence is no longer fresh."
        };
        return errors[type] || errors.failure;
    };

    // --- OPUS ELITE SYSTEM INSTRUCTION 2027 (FINAL SYSTEM - GLOBAL LOCK) ---
    // Mentor Note: CẤM XÓA, CẤM SỬA. 100% Sync with menuConfig & chatbot_brain.js
    const systemInstruction = `
    YOU ARE OPUS VISIONARY AI. ROLE: GLOBAL ELITE ANTI-FRAUD JUDGE & PARANORMAL ANALYST.

    STRICT AUTHENTICATION PROTOCOL (MATCHING CAMERA-AI.JS):
    1. MANDATORY STAMP CHECK: Detect "CAPTURED BY HUMAN", "VERIFIED BY OPUS-MAP AI", "LOC:", and "OPUS_VERIFIED_".
    2. 5-MINUTE ELITE WINDOW: Extract Unix ID (Line 5). Compare with Current Time: ${Date.now()}. 
       - IF (Current - ID) > 300,000ms: STATUS = EXPIRED (Disable Go Global). 
    3. TIME-SYNC VALIDATION: Extract Human-readable Time (Line 4) and Unix ID (Line 5). They MUST match mathematically.
    4. GPS EXTRACTION: Extract Latitude and Longitude from the "LOC:" stamp. 
       - IF NO COORDINATES DETECTED: STATUS = NO_LOCATION (Disable Go Global).
    5. ANTI-FRAUD: Reject Moiré patterns or missing 0.15 text stroke. 

    STRICT OPERATIONAL PROTOCOLS:
    - DATA FORMAT (MANDATORY FOR UI PARSING - MATCHING MENUCONFIG):
      CATEGORY: [Urban / Nature / Aliens / Haunted]
      SCORE: [X/10] (Always provide a score for user feedback)
      LOCATION: [Latitude, Longitude or "MISSING"]
      STATUS: [AUTHENTIC / EXPIRED / NO_LOCATION / FRAUD]

    - COMMUNICATION: 
      1. Use "Boss" to address the user.
      2. Critique/Comments: Max 35 words. Use the user's language.
      3. Explain clearly in English for warnings: You get a Score for your skills, but Go Global is LOCKED unless Status is AUTHENTIC.
      4. Keep the DATA FORMAT block above in English.

    TECHNICAL CRITIQUE & CATEGORY LOGIC:
    - CATEGORY [Aliens]: Analyze extraterrestrial entities and UFO crafts. Evaluate anti-gravity propulsion, trans-medium blur, and plasma glows.
    - CATEGORY [Haunted]: Detect spectral noise, shadow anomalies, ectoplasm, and eerie atmosphere.
    - CATEGORY [Urban]: Identify architecture, streets, and human infrastructure.
    - CATEGORY [Nature]: Identify vegetation, mountains, rivers, and natural landscapes.

    [FIXED RESPONSE PROTOCOL - THE OPUS CYCLE]
    If user asks about rules/requirements, explain these EXACT 4 steps in their language:
    - STEP 1 (CAPTURE): Use "Opus-Map Lens" to capture with mandatory stamps and save it.
    - STEP 2 (RATING): Upload to "Gallery Curator" (Chatbox). Everyone gets a Score to check their skills!
    - STEP 3 (GLOBAL REQUIREMENTS): To "Go Global", you need Score 6/10+, Valid GPS Stamps, and must be within the 5-minute window.
    - STEP 4 (DEPLOY): If Requirements aren't met, you only get the Score, but the Global Map will REJECT the entry.
    - Conclusion: "Only the fastest, the best, and the most precise go global, Boss!"
    `;

    try {
        const parts = [{ text: `${systemInstruction}\n\nUser Input: ${message || "Authenticate and analyze."}` }];

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

        // --- 3. BACKEND DATA SYNC & 5-MINUTE KILL SWITCH (OPTIMIZED BY MENTOR) ---
        const scoreMatch = aiReply.match(/SCORE:\s*(\d+(\.\d+)?)\/10/i);
        const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
        
        // MENTOR FIX: Ưu tiên clientTimestamp từ body để chống lỗi AI đọc thiếu mã số
        const timestampInAI = aiReply.match(/OPUS_VERIFIED_(\d+)/);
        const photoTimestamp = clientTimestamp ? parseInt(clientTimestamp) : (timestampInAI ? parseInt(timestampInAI[1]) : 0);
        
        const currentTime = Date.now();
        const fiveMinutesInMs = 300000;

        const aiTextUpper = aiReply.toUpperCase();
        
        let finalCategory = "Urban";
        if (aiTextUpper.includes("ALIENS")) finalCategory = "Aliens";
        else if (aiTextUpper.includes("HAUNTED")) finalCategory = "Haunted";
        else if (aiTextUpper.includes("NATURE")) finalCategory = "Nature";

        let finalReply = aiReply;
        let canUpload = false;

        const isAuthentic = aiTextUpper.includes("STATUS: AUTHENTIC");
        const hasLocation = aiTextUpper.includes("LOCATION:") && !aiTextUpper.includes("MISSING");

        if (isAuthentic && score >= 6 && hasLocation) {
            // Kiểm tra độ tươi dựa trên Timestamp đã được đồng bộ
            if (photoTimestamp > 0 && (currentTime - photoTimestamp > fiveMinutesInMs)) {
                canUpload = false;
                const delayMins = ((currentTime - photoTimestamp) / 60000).toFixed(1);
                finalReply += `\n\n[OPUS SECURITY]: EXPIRED. Captured ${delayMins}m ago. 5-minute window closed. Go Global disabled, Boss!`;
            } else {
                canUpload = true; 
            }
        } else if (score >= 6 && !hasLocation) {
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