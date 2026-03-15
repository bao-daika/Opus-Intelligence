// --- OPUS INTELLIGENCE: PURE AI CORE (SYNC 2027) ---

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: "Access Denied, Boss!" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ reply: "Missing Gemini API Key, Master!" });

    // 1. NHẬN DATA TỪ FRONT-END
    const { message, allSpots, attachedImage, activeCategory, isLensMode } = req.body; 

    // 2. ENDPOINT GEMINI 3.1 FLASH LITE PREVIEW (Vibe 2027)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`;

    // XỬ LÝ ĐA NGÔN NGỮ CHO LỖI (ƯU TIÊN ENGLISH)
    const lang = req.headers['accept-language']?.toLowerCase() || 'en';
    const isVN = lang.includes('vi');
    const isZH = lang.includes('zh');
    const isFR = lang.includes('fr');
    const isJP = lang.includes('ja');

    const getErrorReply = (type) => {
        const errors = {
            busy: {
                vi: "Sếp ơi, bộ não AI đang bận xử lý bối cảnh khác. Sếp thử lại nhé!",
                en: "Boss, the AI core is currently processing another context. Please try again shortly.",
                zh: "Boss, AI 核心正在处理其他内容。请稍后再试。",
                fr: "Boss, le noyau IA traite un autre contexte. Veuillez réessayer bientôt.",
                jp: "Boss, AIコアは別のコンテキストを処理中です。しばらくしてからもう一度お試しください。"
            },
            failure: {
                vi: "Lỗi kết nối vệ tinh, thưa Sếp. Neural Link đã bị ngắt!",
                en: "Satellite connection error, Boss. Neural Link disconnected!",
                zh: "卫星连接错误，Boss。神经链路已断开！",
                fr: "Erreur de connexion satellite, Boss. Liaison neuronale déconnectée !",
                jp: "衛星接続エラー、Boss。ニューラルリンクが切断されました！"
            }
        };
        const current = errors[type];
        if (isVN) return current.vi;
        if (isZH) return current.zh;
        if (isFR) return current.fr;
        if (isJP) return current.jp;
        return current.en; // Mặc định là tiếng Anh nếu không biết User xài gì
    };

    const torontoTime = new Date().toLocaleString("en-US", {
        timeZone: "America/Toronto",
        hour12: true, hour: 'numeric', minute: 'numeric', weekday: 'long'
    });

    // 3. SYSTEM INSTRUCTION (Giữ nguyên 100% luật của Sếp)
    const systemInstruction = `
    YOU ARE OPUS VISIONARY AI (CORE ENGINE: GEMINI 3.1).
    ROLE: GLOBAL ELITE PHOTOGRAPHY & TRAVEL MENTOR.

    STRICT OPERATIONAL PROTOCOLS:
    - DIRECT RESPONSE: Zero introductions, zero outros. Provide immediate value.
    - BREVITY: Maximum 50 words per response. Every word must count.
    - FORMAT: Use concise bullet points. Strictly no essays or long paragraphs.
    - MULTILINGUAL: Automatically detect user language and reply in the same language (English, Chinese, Vietnamese, etc.).
    - ETIQUETTE: Professional, elite, and respectful. Use "Boss" (English) or "Sếp" (Vietnamese) as the primary honorific.
    - SOCIAL MIRRORING: Match the user's conversational energy for social interactions.
    - NO SYMBOLS: Absolutely FORBIDDEN to use characters like "////" or "*****". Keep text clean.

    EXPERT PHOTOGRAPHY CRITIQUE (HONEST & TECHNICAL):
    - VISION: If an image is provided, analyze it instantly.
    - TECHNICALS: Critique Composition (Rule of thirds, leading lines), Lighting (Exposure, dynamic range), and Gear Vibe (Depth of field, ISO noise).
    - SCORING: Mandatory rating out of 10 (e.g., 8.5/10).
    - INTEGRITY: Avoid excessive flattery. Provide sharp, constructive criticism on flaws and highlights.

   SAFETY & CONTENT FILTERING:
    - STRICT REJECTION: Nudity, violence, filth, vulgarity, dirty stuff, swearing, or any content irrelevant to Photography, Urban Landscape, Architecture, Nature, and Travel.
    - DYNAMIC REJECTION RULE: You must detect the language of the offensive input and respond with a rejection in that SAME language.
    - REJECTION CONTENT:
        * Politely state that the content is inappropriate for Opus Elite standards.
        * Maintain the "Boss" (or localized equivalent) honorific.
        * Core message: "This content is outside our artistic scope."
    - EXAMPLE TRANSLATIONS (For internal logic):
        * Chinese: "Boss, 此内容不符合 Opus 的艺术范围。"
        * Japanese: "Boss, このコンテンツは Opus の芸術的範囲外です。"
        * French: "Boss, ce contenu dépasse le cadre artistique d'Opus."

    KNOWLEDGE BASE:
    - Deep expertise in Global Landmarks, Luxury Travel, Photography skills , Arts , Architecture, and Professional Photography Gear.
    - Contextual awareness: Spots Data: ${JSON.stringify(allSpots)} | Category: ${activeCategory} | Lens: ${isLensMode ? 'ACTIVE' : 'OFF'}.
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

        // Xử lý lỗi từ Google API (Sử dụng Dictionary Đa ngôn ngữ)
        if (data.error) {
            console.error("Gemini Error:", data.error);
            return res.status(400).json({ reply: getErrorReply('busy') });
        }

        const aiReply = data.candidates[0].content.parts[0].text;

        // 4. TRẢ KẾT QUẢ NGAY
        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error("Opus Failure:", error);
        return res.status(500).json({ reply: getErrorReply('failure') });
    }
}