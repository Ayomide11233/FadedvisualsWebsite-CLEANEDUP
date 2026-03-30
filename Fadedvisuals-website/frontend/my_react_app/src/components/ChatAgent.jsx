import { useState, useEffect } from "react";
import { Mic, MicOff, MessageCircle, X, ShoppingBag, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_ROUTES } from "../config/api";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const suggestedQuestions = [
    "What products do you have?",
    "Tell me about your services",
    "What are your prices?",
    "Do you do custom work?"
  ];

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        setInput(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => setIsListening(false);
      setRecognition(recognitionInstance);
    }
  }, []);

  const handleSend = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = { sender: "user", text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_ROUTES.CHAT, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        sender: "bot",
        text: data.response || "No response received",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { 
        sender: "bot", 
        text: "Error connecting to server. Make sure the backend is running!" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognition) return alert("Speech recognition not supported.");

    if (isListening) {
      recognition.stop();
      if (input.trim()) setTimeout(() => handleSend(input), 300);
    } else {
      setInput("");
      recognition.start();
      setIsListening(true);
    }
  };

  const navigateTo = (page) => {
    window.location.href = `/${page}`;
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-[1000]"
        style={{
          background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
          boxShadow: '0 8px 32px rgba(147,51,234,0.4)',
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full opacity-60 animate-pulse pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
            filter: 'blur(12px)',
          }}
        />
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="relative z-10"
            >
              <X size={28} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative z-10"
            >
              <MessageCircle size={28} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[999]"
            style={{
              maxHeight: "600px",
              background: 'rgba(26,26,26,0.98)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(168,85,247,0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-4 border-b flex items-center gap-3"
              style={{
                borderColor: 'rgba(168,85,247,0.15)',
                background: 'linear-gradient(135deg, rgba(147,51,234,0.1) 0%, transparent 100%)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #9333ea, #7c3aed)' }}
              >
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <h3
                  className="text-sm font-semibold text-white"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  Faded Visuals AI
                </h3>
                <p
                  className="text-xs text-gray-500"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Powered by Ollama
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2 p-3 border-b" style={{ borderColor: 'rgba(168,85,247,0.15)' }}>
              <motion.button
                onClick={() => navigateTo('services')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  color: '#c084fc',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <Briefcase size={16} />
                Services
              </motion.button>
              <motion.button
                onClick={() => navigateTo('shop')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  color: '#c084fc',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <ShoppingBag size={16} />
                Shop
              </motion.button>
            </div>

            {/* Chat Messages */}
            <div
              className="flex-1 overflow-y-auto p-4"
              style={{ minHeight: "300px" }}
            >
              {messages.length === 0 && (
                <div className="text-center">
                  <p
                    className="mb-3 text-sm text-gray-500"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Try asking:
                  </p>
                  {suggestedQuestions.map((question, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleSend(question)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full text-left px-3 py-2 mb-2 rounded-xl text-sm transition-all"
                      style={{
                        background: 'rgba(168,85,247,0.1)',
                        border: '1px solid rgba(168,85,247,0.3)',
                        color: '#c084fc',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-3 ${m.sender === "user" ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block px-4 py-2.5 rounded-2xl text-sm ${
                      m.sender === "user" ? "rounded-br-sm" : "rounded-bl-sm"
                    }`}
                    style={{
                      background: m.sender === "user"
                        ? 'linear-gradient(135deg, #9333ea, #7c3aed)'
                        : 'rgba(255,255,255,0.05)',
                      color: 'white',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {m.text}
                  </span>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-sm"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-purple-500"
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t" style={{ borderColor: 'rgba(168,85,247,0.15)' }}>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about products or services..."
                  onKeyPress={(e) => e.key === "Enter" && !loading && handleSend()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <motion.button
                  onClick={toggleVoiceInput}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: isListening 
                      ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                      : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {isListening ? (
                    <MicOff size={18} className="text-white" />
                  ) : (
                    <Mic size={18} className="text-gray-400" />
                  )}
                </motion.button>
                <motion.button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                    color: 'white',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}