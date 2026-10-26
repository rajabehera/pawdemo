import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, X, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Woof and Meow! ✨ I'm Paww, your Pawwcious luxury pet wellness coach. Ask me anything about our organic formulations, monsoon treatment rituals, or perfect botanical sizes for your pet!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    (window as any).showToast?.("AI Companion query dispatched! 💬", "success");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(1) // skip initial greeting
        })
      });
      const data = await response.json();
      if (data.error) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", text: data.text || `Service Alert: ${data.error}` }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: "assistant", text: data.text || "I apologize, my purr-fect response was cut short. How else can I assist your fur baby today?" }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "Oops, a small connection hairball! Please try that query again. 🐾" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-chatbot-root" className="fixed bottom-24 right-5 z-[80] font-sans">
      {/* Pulse button when closed */}
      {!isOpen && (
        <button
          id="chatbot-trigger-btn"
          onClick={() => setIsOpen(true)}
          className="relative bg-teal-800 hover:bg-teal-900 text-white rounded-full p-4.5 shadow-2xl hover:scale-105 transition-opacity duration-300 flex items-center justify-center animate-bounce group cursor-pointer border border-teal-700/40"
          title="Talk to Paww, our AI Care Specialist"
        >
          <Bot className="h-6 w-6 stroke-[2.25px]" />
          <span className="absolute -top-1 -right-1 bg-amber-400 rounded-full h-3.5 w-3.5 animate-pulse border-2 border-white"></span>
          <div className="absolute right-16 bg-stone-950 text-white text-[10px] font-mono tracking-widest uppercase font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-stone-850">
            Coach Paww AI 🐾
          </div>
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div
          id="chatbot-window-panel"
          className="bg-white border border-stone-200 rounded-2xl shadow-2xl w-[90vw] sm:w-[380px] h-[510px] flex flex-col overflow-hidden transition-opacity duration-300 transform scale-100 origin-bottom-right"
        >
          {/* Selective Dark Luxury Header Segment */}
          <div className="bg-[#111613] text-white px-5 py-4 flex items-center justify-between shadow-md relative">
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-teal-500 via-amber-400 to-emerald-500"></div>
            <div className="flex items-center gap-3">
              <div className="bg-[#1D2520] p-2 rounded-xl border border-stone-800 flex items-center justify-center">
                <Sparkles className="h-4.5 w-4.5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs tracking-widest uppercase font-display text-[#FAF9F5]">Paww AI Specialist</h3>
                <span className="text-[9px] text-[#A7F3D0] flex items-center gap-1 font-mono uppercase font-semibold tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  Active Vet Assistant
                </span>
              </div>
            </div>
            <button
              id="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-all"
            >
              <X className="h-4 w-4 stroke-[2.5px]" />
            </button>
          </div>

          {/* Messages Body */}
          <div
            id="chatbot-conversation-pane"
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F5]"
          >
            {messages.map((m, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="h-7 w-7 rounded-lg bg-teal-850 text-[#FAF9F5] flex items-center justify-center text-[11px] shrink-0 font-extrabold shadow-sm border border-teal-700/30">
                    🐾
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${m.role === "user"
                      ? "bg-teal-800 text-[#FAF9F5] rounded-br-none"
                      : "bg-white text-stone-900 border border-stone-200 rounded-bl-none font-medium"
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-[10px] text-stone-500 font-mono pl-9 font-bold">
                <span className="animate-bounce">🐾</span>
                <span>Paww is prescribing botanical answers...</span>
              </div>
            )}
          </div>

          {/* Input form footer */}
          <form
            id="chatbot-input-footer"
            onSubmit={handleSendMessage}
            className="border-t border-stone-150 p-3.5 bg-white flex gap-2 items-center shadow-md justify-between"
          >
            <input
              id="chatbot-query-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about organic shines, joint health, size..."
              className="flex-1 bg-stone-50 border border-stone-200 text-stone-950 text-xs rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-teal-800 focus:border-transparent transition-all"
            />
            <button
              id="chatbot-send-btn"
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white p-3 rounded-xl shadow-lg transition-all"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
