import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, Box, Cpu, Shield, Zap, TrendingUp, Users, Activity, Star, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { ViewState, Product } from '../types';

interface Props {
  setView: (v: ViewState) => void;
}

function Floating3DShapes() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" style={{ perspective: 1200 }}>
       {/* 3D Cube 1 */}
       <motion.div 
         animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
         transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
         className="absolute top-[15%] left-[20%] w-32 h-32"
         style={{ transformStyle: 'preserve-3d' }}
       >
          <div className="absolute inset-0 bg-neon-cyan/10 border border-neon-cyan/40 backdrop-blur-sm shadow-[0_0_30px_rgba(0,243,255,0.2)]" style={{ transform: 'translateZ(64px)' }}></div>
          <div className="absolute inset-0 bg-neon-purple/10 border border-neon-purple/40 backdrop-blur-sm" style={{ transform: 'rotateY(180deg) translateZ(64px)' }}></div>
          <div className="absolute inset-0 bg-neon-cyan/10 border border-neon-cyan/40 backdrop-blur-sm" style={{ transform: 'rotateY(-90deg) translateZ(64px)' }}></div>
          <div className="absolute inset-0 bg-neon-purple/10 border border-neon-purple/40 backdrop-blur-sm" style={{ transform: 'rotateY(90deg) translateZ(64px)' }}></div>
          <div className="absolute inset-0 bg-white/5 border border-white/20 backdrop-blur-sm" style={{ transform: 'rotateX(90deg) translateZ(64px)' }}></div>
          <div className="absolute inset-0 bg-white/5 border border-white/20 backdrop-blur-sm" style={{ transform: 'rotateX(-90deg) translateZ(64px)' }}></div>
       </motion.div>

       {/* 3D Cube 2 - floating right */}
       <motion.div 
         animate={{ rotateX: [0, -360], rotateY: [0, 360] }}
         transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
         className="absolute top-[40%] right-[15%] w-24 h-24"
         style={{ transformStyle: 'preserve-3d' }}
       >
          <div className="absolute inset-0 bg-neon-magenta/10 border border-neon-magenta/50 backdrop-blur-sm shadow-[0_0_30px_rgba(255,0,234,0.3)]" style={{ transform: 'translateZ(48px)' }}></div>
          <div className="absolute inset-0 bg-neon-cyan/10 border border-neon-cyan/50 backdrop-blur-sm" style={{ transform: 'rotateY(180deg) translateZ(48px)' }}></div>
          <div className="absolute inset-0 bg-neon-magenta/10 border border-neon-magenta/50 backdrop-blur-sm" style={{ transform: 'rotateY(-90deg) translateZ(48px)' }}></div>
          <div className="absolute inset-0 bg-neon-cyan/10 border border-neon-cyan/50 backdrop-blur-sm" style={{ transform: 'rotateY(90deg) translateZ(48px)' }}></div>
          <div className="absolute inset-0 bg-white/10 border border-white/30 backdrop-blur-sm" style={{ transform: 'rotateX(90deg) translateZ(48px)' }}></div>
          <div className="absolute inset-0 bg-white/10 border border-white/30 backdrop-blur-sm" style={{ transform: 'rotateX(-90deg) translateZ(48px)' }}></div>
       </motion.div>

       {/* Giant glowing ring behind */}
       <motion.div
         animate={{ rotateZ: 360, rotateX: 60 }}
         transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
         className="absolute top-1/2 left-1/2 -ml-[400px] -mt-[400px] w-[800px] h-[800px] rounded-full border-[2px] border-dashed border-neon-cyan/20 opacity-50 shadow-[0_0_50px_rgba(0,243,255,0.1)]"
         style={{ transformStyle: 'preserve-3d' }}
       />
       <motion.div
         animate={{ rotateZ: -360, rotateX: 60, rotateY: 30 }}
         transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
         className="absolute top-1/2 left-1/2 -ml-[500px] -mt-[500px] w-[1000px] h-[1000px] rounded-full border-[1px] border-neon-purple/20 opacity-30 shadow-[0_0_50px_rgba(176,38,255,0.1)]"
         style={{ transformStyle: 'preserve-3d' }}
       />
    </div>
  );
}

export default function HomeView({ setView }: Props) {
  const [stats, setStats] = useState({ totalProducts: 0, totalVolumeUsdt: 0, uniqueSellers: 0 });
  const [latestFeed, setLatestFeed] = useState<string[]>(["System awaiting incoming product listings..."]);

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => setStats({
        totalProducts: d.totalProducts || 0,
        totalVolumeUsdt: d.totalVolumeUsdt || 0,
        uniqueSellers: d.uniqueSellers || 0
      }))
      .catch(console.error);

    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) {
          setLatestFeed(data.slice(0, 10).map((p: Product) => `@${p.sellerUsername} listed "${p.name}" for $${p.priceUSDT}`));
        }
      })
      .catch(console.error);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="flex flex-col relative w-full h-full overflow-hidden">
      {/* 3D Scene */}
      <Floating3DShapes />

      {/* Hero */}
      <section 
        className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1500 }}
      >
        <motion.div 
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="max-w-5xl mx-auto text-center w-full relative mb-16"
        >
          <motion.div
             initial={{ opacity: 0, scale: 0.8, z: -100 }}
             animate={{ opacity: 1, scale: 1, z: 0 }}
             transition={{ duration: 1, ease: "backOut" }}
             style={{ transformStyle: "preserve-3d", transform: "translateZ(80px)" }}
             className="relative z-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 shadow-[0_0_30px_rgba(0,243,255,0.2)] border border-neon-cyan/30 mb-8 font-mono text-xs tracking-widest uppercase text-neon-cyan backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
              </span>
              System Online v3.0 // 3D Rendered
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-extrabold mb-6 tracking-tighter leading-[1.1] drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]">
              The <span className="text-transparent bg-clip-text bg-gradient-to-br from-neon-cyan via-white to-neon-purple">Future Market</span>
              <br/> For Digital & Real Goods.
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-xl" style={{ transform: "translateZ(40px)" }}>
              Buy, sell, and trade directly using crypto in an absolutely secure ecosystem. Welcome to the premier 3D cyber-market.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6" style={{ transform: "translateZ(100px)" }}>
              <div className="relative group w-full sm:w-auto">
                <div className="absolute -inset-2 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                <button 
                  onClick={() => setView('marketplace')}
                  className="relative w-full sm:w-auto px-10 py-5 bg-black text-white font-bold text-lg rounded-xl flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/10"
                >
                  Buy Products <ArrowRight className="w-5 h-5 text-neon-cyan" />
                </button>
              </div>
              <button 
                onClick={() => setView('dashboard')}
                className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/40 transition-all font-display shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)] hover:-translate-y-1"
              >
                Start Selling <Box className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8 text-sm font-mono text-gray-500 drop-shadow-lg" style={{ transform: "translateZ(20px)" }}>
              <span className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-lg border border-white/5"><div className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(0,243,255,1)]"></div> INR / USDT Support</span>
              <span className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-lg border border-white/5"><div className="w-1.5 h-1.5 rounded-full bg-neon-purple shadow-[0_0_10px_rgba(176,38,255,1)]"></div> Verified Sellers</span>
              <span className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-lg border border-white/5"><div className="w-1.5 h-1.5 rounded-full bg-neon-magenta shadow-[0_0_10px_rgba(255,0,234,1)]"></div> 24/7 Automations</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Live Stats Bar */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1.2, duration: 0.8 }}
           className="w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4 relative z-20"
        >
           {[
             { label: "Platform Volume", value: `$${stats.totalVolumeUsdt.toFixed(2) || "0"}`, icon: Activity, color: "text-neon-cyan" },
             { label: "Active Sellers", value: `${stats.uniqueSellers}`, icon: Users, color: "text-neon-purple" },
             { label: "Products Listed", value: `${stats.totalProducts}`, icon: Box, color: "text-neon-magenta" },
             { label: "Status", value: "Live", icon: Zap, color: "text-yellow-400" },
           ].map((stat, i) => (
             <div key={i} className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-white/30 transition-colors">
               <stat.icon className={`w-5 h-5 ${stat.color}`} />
               <div className="text-2xl font-bold font-mono text-white">{stat.value}</div>
               <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
             </div>
           ))}
        </motion.div>
      </section>

      {/* Live Feed Banner */}
      <div className="w-full bg-neon-cyan/10 border-y border-neon-cyan/20 py-3 overflow-hidden relative z-20 flex">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          className="flex whitespace-nowrap gap-12 font-mono text-sm text-neon-cyan/80 items-center"
        >
          {[...latestFeed, ...latestFeed, ...latestFeed, ...latestFeed].slice(0, 15).map((feedText, i) => (
             <span key={i} className="flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               {feedText}
             </span>
          ))}
        </motion.div>
      </div>

      {/* Features Outline */}
      <section className="py-24 px-4 bg-black/80 relative z-20 backdrop-blur-3xl shadow-[0_-30px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight drop-shadow-md">100% Safe Escrow Protocol</h2>
             <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm leading-relaxed">All transactions go through our official Escrow partner (@takekiss) ensuring both buyers and sellers are fully protected. No scams, no direct risk.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ perspective: 1200 }}>
            {[
              { icon: Zap, title: "1. Buyer Sends Payment", desc: "Buyers send TON or INR directly to Escrow (@takekiss) and provide proof via DM.", color: "group-hover:text-neon-cyan", shadow: "hover:shadow-[0_20px_50px_rgba(0,243,255,0.15)]" },
              { icon: Box, title: "2. Escrow Holds & Alerts", desc: "Escrow secures the funds and instructs the seller to transfer the product/service.", color: "group-hover:text-neon-purple", shadow: "hover:shadow-[0_20px_50px_rgba(176,38,255,0.15)]" },
              { icon: Shield, title: "3. Safe Release", desc: "Once the buyer receives and verifies the product, they say 'RELEASE' and funds are sent to the seller.", color: "group-hover:text-green-400", shadow: "hover:shadow-[0_20px_50px_rgba(74,222,128,0.15)]" }
            ].map((feat, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 50, rotateX: 20 }}
                 whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                 whileHover={{ y: -15, rotateX: 10, rotateY: (i-1)*-5 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ delay: i * 0.15, duration: 0.6, type: "spring" }}
                 className={`relative group p-8 rounded-2xl bg-black border border-white/10 transition-all overflow-hidden ${feat.shadow} transform-gpu`}
                 style={{ transformStyle: 'preserve-3d' }}
               >
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500">
                   <feat.icon className={`w-40 h-40 ${feat.color.replace('group-hover:', '')}`} />
                 </div>
                 
                 <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner" style={{ transform: "translateZ(30px)" }}>
                   <feat.icon className={`w-8 h-8 text-gray-300 transition-colors duration-300 ${feat.color}`} />
                 </div>
                 <h3 className="text-xl font-bold font-display mb-4 text-white drop-shadow-md" style={{ transform: "translateZ(40px)" }}>{feat.title}</h3>
                 <p className="text-gray-400 leading-relaxed" style={{ transform: "translateZ(20px)" }}>{feat.desc}</p>
                 
                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials / Trust */}
      <section className="py-24 px-4 relative z-20 bg-gradient-to-b from-black/80 to-black/95">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12 flex flex-col items-center">
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />)}
            </div>
            <h2 className="text-3xl font-display font-bold font-white drop-shadow-md">Trusted by 50,000+ Cybershoppers</h2>
            <p className="text-gray-400 mt-4 max-w-xl text-sm leading-relaxed">Verified reviews from real buyers trading securely in the SNC ecosystem.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { author: "CrypticX", date: "2 Hours ago", text: "Fastest delivery I've ever experienced. Paid in USDT and got my credentials in seconds." },
              { author: "AnonBuyer99", date: "5 Hours ago", text: "Seller was super responsive. The Telegram bot integration makes the whole process feel futuristic." },
              { author: "NeonRider", date: "1 Day ago", text: "Zero escrow fees, direct trades, and clean UI. This is exactly what a Web3 marketplace should be." }
            ].map((review, i) => (
              <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-left hover:bg-white/[0.05] transition-colors">
                 <div className="flex justify-between items-center mb-4">
                   <div className="font-mono text-neon-cyan font-bold">@{review.author}</div>
                   <div className="text-xs text-gray-500">{review.date}</div>
                 </div>
                 <p className="text-gray-300 text-sm leading-relaxed">"{review.text}"</p>
                 <div className="mt-4 flex gap-1">
                   {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-yellow-500/50 fill-yellow-500/50" />)}
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
