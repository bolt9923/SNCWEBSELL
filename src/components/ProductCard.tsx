import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Copy, IndianRupee, Send, ShoppingCart, Bitcoin, Check, X } from 'lucide-react';
import { Product } from '../types';
import React, { useState } from 'react';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const handleContact = () => {
    window.open(`https://t.me/${product.sellerUsername}`, '_blank');
  };

  return (
    <motion.div
      style={{ perspective: 1200 }}
      className="h-full relative group"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="glass-panel neon-border rounded-xl flex flex-col h-full bg-black/60 relative will-change-transform shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <div style={{ transform: "translateZ(40px)" }} className="relative h-56 m-4 rounded-xl overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-black">
          <motion.img 
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-neon-cyan/30 text-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)] uppercase tracking-wider">
            {product.category}
          </div>
        </div>
        
        <div style={{ transform: "translateZ(50px)" }} className="px-5 pb-5 flex flex-col flex-grow relative z-10">
          <h3 className="text-2xl font-display font-bold text-white mb-2 leading-tight group-hover:text-neon-cyan transition-colors drop-shadow-md">
            {product.name}
          </h3>
          <p style={{ transform: "translateZ(20px)" }} className="text-gray-400 text-sm mb-5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          
          <div className="mt-auto space-y-5">
            <div style={{ transform: "translateZ(30px)" }} className="flex items-center justify-between bg-gradient-to-r from-white/5 to-white/[0.02] p-3 rounded-xl border border-white/10 shadow-[inset_0_1px_10px_rgba(255,255,255,0.05)]">
              <div className="flex items-center text-neon-cyan font-mono font-bold text-lg">
                <IndianRupee className="w-4 h-4 mr-1" />
                {product.priceINR.toLocaleString()}
              </div>
              <div className="text-gray-400 font-mono text-sm flex items-center bg-black/50 px-2.5 py-1 rounded-lg border border-white/5 shadow-md group-hover:text-white transition-colors">
                ${product.priceUSDT.toFixed(2)} <span className="text-[10px] ml-1 text-gray-500">USDT</span>
              </div>
            </div>
            
            <div style={{ transform: "translateZ(60px)" }} className="flex flex-col gap-3">
              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full py-3 bg-gradient-to-r from-neon-cyan/20 via-neon-cyan/40 to-neon-purple/30 hover:from-neon-cyan/50 hover:to-neon-purple/50 text-white border border-neon-cyan/40 hover:border-neon-cyan/80 rounded-xl font-bold font-display transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] backdrop-blur-md">
                <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                <span>Buy Now</span>
              </button>
              <button 
                onClick={handleContact}
                className="w-full py-2.5 bg-black/50 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl font-mono text-sm transition-colors flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 backdrop-blur-sm"
              >
                <Send className="w-4 h-4 flex-shrink-0 text-neon-magenta/80" />
                DM @{product.sellerUsername}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-lg bg-black border border-white/20 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,243,255,0.2)] z-10 overflow-hidden"
            >
              <button onClick={() => setShowCheckout(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-3xl font-display font-bold text-white mb-2">Checkout</h2>
              <p className="text-gray-400 font-mono text-sm mb-6">Complete your payment below for <span className="text-neon-cyan">{product.name}</span></p>

              <div className="space-y-4 mb-8">
                {/* Crypto Payment */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl relative group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-sm font-mono text-gray-300"><Bitcoin className="w-4 h-4 text-neon-cyan" /> Pay USDT (TRC20)</span>
                    <span className="text-neon-cyan font-bold font-mono">${product.priceUSDT.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="text" readOnly value="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-gray-400 focus:outline-none" />
                    <button onClick={() => handleCopy("TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* INR Payment */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl relative group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-sm font-mono text-gray-300"><IndianRupee className="w-4 h-4 text-neon-purple" /> Pay UPI / INR</span>
                    <span className="text-neon-purple font-bold font-mono">₹{product.priceINR.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="text" readOnly value={`${product.sellerUsername}@upi`} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-gray-400 focus:outline-none" />
                    <button onClick={() => handleCopy(`${product.sellerUsername}@upi`)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-300">
                  <span className="text-neon-cyan font-bold">Important:</span> After completing your payment, click the button below to message the seller on Telegram with your payment screenshot.
                  {product.link && " The seller will provide instant access."}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleContact}
                  className="w-full py-4 bg-neon-cyan text-black font-bold text-lg rounded-xl shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5 flex-shrink-0" />
                  I've Paid! Message Seller
                </button>
                {product.link && (
                   <button 
                     onClick={() => window.open(product.link, '_blank')}
                     className="w-full py-3 bg-black hover:bg-white/10 text-white rounded-xl font-mono text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
                   >
                     Open Public Product Link
                   </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
