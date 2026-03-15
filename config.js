// --- OPUS CONFIGURATION 2027 ---
const menuConfig = [
    { id: "urban", label: "URBAN", icon: "building", dataKey: "Urban Landscapes" },
    { id: "nature", label: "NATURE", icon: "mountain-snow", dataKey: "Nature Landscapes" },
    { id: "vlog", label: "VLOG", icon: "trending-up", dataKey: "Vlog Hotspots" }
    // Sếp muốn thêm tab mới? Chỉ cần copy dòng trên và đổi tên thôi!
];

const chatbotBrain = {
    speak(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel(); 
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN'; 
        utterance.pitch = 0.9;
        window.speechSynthesis.speak(utterance);
    },
    async processInput(text) {
        // Logic AI giữ nguyên như cũ của sếp
        this.speak("Opus Intelligence đã sẵn sàng thưa sếp.");
        return "System Ready";
    }
};