import { motion, AnimatePresence } from 'motion/react';
import { Box, Filter, Search, Zap } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

export default function MarketplaceView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categories = ['All', 'Digital', 'Physical', 'Service'];

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full flex flex-col">
      {/* Header section with 3D feel */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border border-white/10 p-8 md:p-12 relative overflow-hidden backdrop-blur-xl shrink-0">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-neon-cyan/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-neon-purple/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">Cyberspace Market</h1>
            <p className="text-gray-400 max-w-xl text-lg">Browse premium verified digital goods, scripts, assets, and physical hardware.</p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-black/60 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all shadow-[0_0_20px_rgba(0,243,255,0.1)] focus:shadow-[0_0_30px_rgba(0,243,255,0.2)]"
              placeholder="Search products, accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-grow">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
              <h3 className="font-mono text-neon-cyan mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">
                <Filter className="w-4 h-4" /> Categories
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left px-4 py-2.5 rounded-xl font-mono text-sm transition-all ${
                      activeCategory === cat 
                        ? 'bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                        : 'text-gray-400 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-neon-purple/20 to-black border border-neon-purple/30 p-6 rounded-2xl relative overflow-hidden group hover:border-neon-purple/60 transition-colors cursor-pointer">
              <div className="absolute top-0 right-0 p-4 opacity-20"><Zap className="w-12 h-12 text-neon-purple" /></div>
              <h4 className="font-bold text-white mb-2 relative z-10 text-lg">Premium Seller</h4>
              <p className="text-gray-400 text-xs font-mono mb-4 relative z-10 leading-relaxed">Upgrade to verified status to reduce escrow fees.</p>
              <button className="w-full py-2 bg-neon-purple/30 text-white rounded-lg text-sm font-bold relative z-10 group-hover:bg-neon-purple/50 transition-colors">Apply Now</button>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <main className="flex-1 w-full">
          {filteredProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="h-full"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center glass-panel rounded-2xl border-dashed border-white/20">
              <Box className="w-16 h-16 text-gray-600 mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
              <p className="text-gray-400">We couldn't find any items matching your search criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
