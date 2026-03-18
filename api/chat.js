// --- OPUS INTELLIGENCE: PURE AI CORE (SYNC 2027 - STAMP VERIFIED) ---

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: "Access Denied, Boss!" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ reply: "Missing Gemini API Key, Master!" });

    const { message, attachedImage, userLocation } = req.body; 
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

    // --- 2. ELITE SYSTEM INSTRUCTION (CẬP NHẬT RULE SOI STAMP TỪ CAMERA-AI) ---
    const systemInstruction = `
    YOU ARE OPUS VISIONARY AI. ROLE: GLOBAL ELITE PHOTOGRAPHY JUDGE & TECHNICAL MENTOR.
    
    STRICT AUTHENTICATION PROTOCOL (MATCHING CAMERA-AI.JS):
    - MANDATORY STAMP CHECK: You MUST detect these exact strings on the image:
        1. "CAPTURED BY HUMAN" (Top layer watermark)
        2. "VERIFIED BY OPUS-MAP AI" (Elite golden stamp)
        3. "LOC:" (GPS metadata display)
        4. "OPUS_VERIFIED_" (Bottom-right encrypted ID)
    - IF STAMP IS MISSING OR INCOMPLETE: Assign Score: 0/10. State: "Opus Authentication Failed. Non-original source detected."
    
    STRICT OPERATIONAL PROTOCOLS:
    - BREVITY LOCKDOWN: Maximum 35 words. 
    - BLOCK SPAM: Only discuss Technical Photography (Lighting, ISO, Composition). 
    - COORDINATE ENFORCEMENT: Context GPS: ${userLocation ? JSON.stringify(userLocation) : "MISSING"}.
    - IF GPS MISSING: State "Missing GPS. Map upload blocked."
    
    CRITIQUE & ADVICE:
    - If user asks for improvement, provide 1-2 sharp technical tips.
    - CATEGORY: Detect "Nature" or "Urban".
    - SCORING: Mandatory format "Score: X/10".

    HONORIFIC: Use "Boss".
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

        // 3. BACKEND DATA SYNC
        const scoreMatch = aiReply.match(/Score:\s*(\d+(\.\d+)?)\/10/i);
        const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
        const finalCategory = aiReply.toUpperCase().includes("NATURE") ? "Nature" : "Urban";

        let finalReply = aiReply;
        let canUpload = !!userLocation && score >= 6; 

        if (!userLocation && score >= 6) {
            finalReply += `\n\n⚠️ ${getErrorReply('no_geo')}`;
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