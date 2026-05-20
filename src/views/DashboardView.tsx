import { motion } from 'motion/react';
import { Bitcoin, Boxes, Clock, ExternalLink, IndianRupee, PieChart, Plus, UserCircle, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DashboardView() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sell'>('overview');
  const [myProducts, setMyProducts] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetch('/api/products')
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            // Display stats for Vendor_4X9 by default to show some data, as user enters it
            setMyProducts(data.filter(p => p.sellerUsername === 'Vendor_4X9'));
          }
        });
    }
  }, [activeTab]);

  const totalValue = myProducts.reduce((sum, p) => sum + p.priceUSDT, 0);
  const activeListings = myProducts.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="glass-panel p-6 rounded-2xl sticky top-24">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-neon-purple to-neon-cyan p-[2px]">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                <UserCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white leading-tight">Vendor_4X9</h3>
              <p className="text-gray-400 font-mono text-xs">Verified Tier 1</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2">
            {[
              { id: 'overview', icon: PieChart, label: 'Overview' },
              { id: 'sell', icon: Plus, label: 'Upload Product' },
              { id: 'orders', icon: Boxes, label: 'Manage Orders' },
              { id: 'wallet', icon: Wallet, label: 'Wallet & Payouts' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-mono text-sm ${
                  activeTab === item.id 
                    ? 'bg-white/10 text-neon-cyan border border-neon-cyan/30 shadow-[0_0_10px_rgba(0,243,255,0.1)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
             <h2 className="text-3xl font-display font-bold">Dashboard Overview</h2>
             
             {/* Stats Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-neon-cyan/10 rounded-full blur-xl group-hover:bg-neon-cyan/20 transition-all" />
                  <p className="text-gray-400 font-mono text-sm mb-2">Total Listed Value</p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-3xl font-bold text-white">${totalValue.toFixed(2)}</h3>
                    <span className="text-neon-cyan font-mono text-xs mb-1">Based on real data</span>
                  </div>
                </div>
                
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-neon-purple/10 rounded-full blur-xl group-hover:bg-neon-purple/20 transition-all" />
                  <p className="text-gray-400 font-mono text-sm mb-2">Active Listings</p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-3xl font-bold text-white">{activeListings}</h3>
                    <span className="text-gray-500 font-mono text-xs mb-1">Products live</span>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-all" />
                  <p className="text-gray-400 font-mono text-sm mb-2">Platform Status</p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-3xl font-bold text-white">Online</h3>
                    <span className="text-green-500 font-mono text-xs mb-1">Accepting buyers</span>
                  </div>
                </div>
             </div>

             <div className="glass-panel rounded-2xl p-6 mt-8">
               <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                 <Clock className="w-5 h-5 text-neon-cyan" /> Your Recent Uploads
               </h3>
               <div className="space-y-4">
                 {myProducts.length === 0 && (
                   <p className="text-gray-500 font-mono text-sm py-4">No recent uploads found.</p>
                 )}
                 {myProducts.slice(0, 5).map((product, i) => (
                   <div key={product.id || i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                         <Boxes className="w-5 h-5" />
                       </div>
                       <div>
                         <p className="text-white font-medium text-sm">Listed: {product.name}</p>
                         <p className="text-gray-500 font-mono text-xs mt-1">Category: {product.category} • {new Date(product.createdAt || Date.now()).toLocaleDateString()}</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-green-400 font-mono font-bold">${product.priceUSDT.toFixed(2)}</p>
                       <p className="text-gray-500 font-mono text-xs mt-1">Price listed</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'sell' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 max-w-3xl border border-white/10 glass-panel rounded-2xl p-6 md:p-10 relative neon-border"
          >
             <h2 className="text-3xl font-display font-bold mb-2">Upload New Product</h2>
             <p className="text-gray-400 mb-8 font-mono text-sm">List your digital or physical product on the marketplace instantly.</p>
             
             <form className="space-y-6" onSubmit={async (e) => {
               e.preventDefault();
               
               const formData = new FormData(e.currentTarget as HTMLFormElement);
               const imageFile = formData.get('imageFile') as File;
               
               let imageBase64 = '';
               if (imageFile && imageFile.size > 0) {
                 const reader = new FileReader();
                 const base64Promise = new Promise<string>((resolve) => {
                   reader.onload = () => resolve(reader.result as string);
                 });
                 reader.readAsDataURL(imageFile);
                 imageBase64 = await base64Promise;
               }

               const data = {
                 name: formData.get('name'),
                 priceUSDT: Number(formData.get('priceUSDT')),
                 priceINR: Number(formData.get('priceINR')),
                 description: formData.get('description'),
                 image: imageBase64 || 'https://via.placeholder.com/800x600?text=No+Image',
                 link: formData.get('link'),
                 category: formData.get('category') || 'Digital',
                 sellerUsername: formData.get('sellerUsername') || 'Vendor_4X9',
                 tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()) : []
               };

               fetch('/api/products', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(data)
               })
               .then(res => res.json())
               .then(resData => {
                 if(resData.error) alert(resData.error);
                 else {
                   alert("Product successfully listed!");
                   // @ts-ignore
                   e.target.reset();
                 }
               })
               .catch(err => alert("Error uploading product"));
             }}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-mono text-gray-300">Product Name</label>
                   <input required name="name" type="text" className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors" placeholder="e.g. Netflix 1 Month Premium" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-mono text-gray-300">Your Telegram Username (Without @)</label>
                   <input required name="sellerUsername" type="text" className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors" placeholder="e.g. Satoshi_Dev" />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-mono text-gray-300">Price (USDT)</label>
                   <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                       <Bitcoin className="h-4 w-4 text-gray-500" />
                     </div>
                     <input required name="priceUSDT" type="number" step="0.01" className="w-full bg-black/50 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors" placeholder="0.00" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-mono text-gray-300">Price (INR)</label>
                   <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                       <IndianRupee className="h-4 w-4 text-gray-500" />
                     </div>
                     <input required name="priceINR" type="number" className="w-full bg-black/50 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors" placeholder="0" />
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-mono text-gray-300">Category</label>
                   <select name="category" className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors">
                     <option value="Digital">Digital</option>
                     <option value="Physical">Physical</option>
                     <option value="Service">Service</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-mono text-gray-300">Tags (comma separated)</label>
                   <input name="tags" type="text" className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors" placeholder="gaming, software..." />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-mono text-gray-300">Description</label>
                 <textarea required name="description" rows={4} className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors" placeholder="Describe the item completely..."></textarea>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-mono text-gray-300">Product Link (Optional, shown after purchase)</label>
                 <input name="link" type="text" className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors" placeholder="https://..." />
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-mono text-gray-300">Product Image (Upload File)</label>
                 <div className="flex gap-2">
                   <input required name="imageFile" type="file" accept="image/*" className="flex-grow bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-neon-cyan file:text-black hover:file:bg-white" />
                 </div>
               </div>

               <div className="pt-6">
                 <button type="submit" className="w-full py-4 bg-neon-cyan text-black font-bold text-lg rounded-xl shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] hover:bg-white transition-all transform hover:-translate-y-1">
                   List Product for Sale
                 </button>
               </div>
             </form>
          </motion.div>
        )}
      </main>
    </div>
  );
}
