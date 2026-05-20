import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{role: 'bot', text: 'Initialize Secure Link... How can I assist you with SNC Market products today?'}]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userMsg })
      });
      const data = await res.json();
      if (data.error) {
        setMessages(prev => [...prev, {role: 'bot', text: "Error connection to mainframe: " + data.error}]);
      } else {
        setMessages(prev => [...prev, {role: 'bot', text: data.text}]);
      }
    } catch (e) {
      setMessages(prev => [...prev, {role: 'bot', text: "Systems offline. Please try again later."}]);
    }
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-black border border-neon-cyan text-neon-cyan rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.7)] hover:bg-neon-cyan/10 transition-all group"
      >
        <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] glass-panel bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 flex flex-center items-center justify-center text-neon-cyan">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-white font-mono font-bold text-sm">SNC Support AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></span>
                    <span className="text-[10px] text-gray-400 font-mono">ONLINE</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl p-3 text-sm font-sans ${
                    m.role === 'user' 
                      ? 'bg-neon-cyan text-black rounded-tr-sm shadow-[0_0_15px_rgba(0,243,255,0.3)]' 
                      : 'bg-white/10 text-white border border-white/10 rounded-tl-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                   <div className="bg-white/10 border border-white/10 rounded-xl rounded-tl-sm p-3 text-sm flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span>
                     <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></span>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-black">
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-cyan transition-colors font-mono"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="p-2 bg-neon-cyan text-black rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
