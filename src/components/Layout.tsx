import { motion, AnimatePresence } from 'motion/react';
import { Menu, MessageSquare, Search, ShoppingBag, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { ViewState } from '../types';
import ChatWidget from './ChatWidget';

interface Props {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,243,255,0.05)_0%,rgba(0,0,0,0)_60%)]" />
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-neon-cyan/30 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            opacity: Math.random() * 0.5 + 0.1,
          }}
          animate={{
            y: [null, Math.random() * -300 - 100],
            x: [null, Math.random() * 100 - 50],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export default function Layout({ children, currentView, setView }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'dashboard', label: 'Dashboard' },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-neon-cyan/30">
      <FloatingParticles />
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-neon-purple to-neon-cyan text-black px-4 py-1.5 flex justify-center items-center relative z-50 text-xs md:text-sm font-bold font-mono tracking-widest text-center">
        <span><Zap className="inline-block w-4 h-4 mr-2 mb-0.5" /> SPECIAL OFFER: 0% ESCROW FEES FOR S-TIER SELLERS THIS WEEK</span>
      </div>

      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => setView('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center p-[1px] group-hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-shadow">
              <div className="w-full h-full bg-black/80 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <ShoppingBag className="w-5 h-5 text-white group-hover:text-neon-cyan transition-colors" />
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold tracking-widest text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-cyan group-hover:to-neon-purple transition-all duration-300 uppercase">
              SNC MARKET
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-sm font-mono tracking-widest uppercase">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`relative py-2 transition-colors hover:text-white ${currentView === item.id ? 'text-white' : 'text-gray-500'}`}
              >
                {item.label}
                {currentView === item.id && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-cyan to-neon-purple shadow-[0_0_10px_rgba(0,243,255,0.8)]" 
                  />
                )}
              </button>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center gap-6">
            <button className="text-gray-400 hover:text-neon-cyan transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => window.open('https://t.me/takekiss', '_blank')}
              className="px-5 py-2.5 bg-black text-white border border-white/20 rounded-lg hover:border-neon-cyan/80 hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all font-medium text-sm font-mono flex items-center gap-2 group"
            >
              <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-neon-cyan transition-colors" />
              Request Item
            </button>
          </div>
          
          <button 
            className="md:hidden p-2 text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-20 left-0 right-0 bg-black/95 backdrop-blur-xl z-40 border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`p-4 text-left font-mono uppercase tracking-widest text-sm rounded-lg ${currentView === item.id ? 'bg-white/10 text-neon-cyan border-l-2 border-neon-cyan' : 'text-gray-400'}`}
                  onClick={() => {
                    setView(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow flex flex-col relative w-full overflow-hidden">
        {children}
      </main>

      <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
          <div className="text-center md:text-left text-gray-400 text-sm">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <ShoppingBag className="w-5 h-5 text-neon-cyan" />
              <h2 className="text-2xl font-display font-bold text-white tracking-widest uppercase">SNC Market</h2>
            </div>
            <p className="mb-6 max-w-sm text-gray-500 leading-relaxed">The Future Marketplace for Digital & Real Products. Secure, fast, anonymous trades directly over Telegram channels.</p>
            <p className="font-mono text-xs text-gray-600">&copy; {new Date().getFullYear()} SNC Market. All rights reserved.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="flex flex-col gap-3">
              <h3 className="text-white font-mono uppercase tracking-widest mb-2 text-xs">Categories</h3>
              <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">Digital Products</a>
              <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">Physical Goods</a>
              <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">Creative Services</a>
              <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">Custom Scripts</a>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-white font-mono uppercase tracking-widest mb-2 text-xs">Support</h3>
              <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">FAQ</a>
              <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">Terms & Conditions</a>
              <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">Scam Report</a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-white font-mono uppercase tracking-widest mb-2 text-xs text-center md:text-left">Live Support</h3>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-xl hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
              <div className="flex flex-col">
                <span className="text-gray-500 font-mono text-[10px] uppercase">Market Owner</span>
                <a href="https://t.me/exlob" target="_blank" rel="noreferrer" className="text-white font-mono text-sm hover:text-neon-cyan transition-colors">@exlob</a>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-xl hover:border-neon-magenta/50 hover:bg-neon-magenta/5 transition-all">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
               <div className="flex flex-col">
                 <span className="text-gray-500 font-mono text-[10px] uppercase">Selling / Request Contact</span>
                 <a href="https://t.me/takekiss" target="_blank" rel="noreferrer" className="text-white font-mono text-sm hover:text-neon-magenta transition-colors">@takekiss</a>
               </div>
            </div>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
