
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { ImageEditorModal } from './components/ImageEditorModal';
import { MerchantLogin } from './components/MerchantLogin';
import { CompanyProfileModal } from './components/CompanyProfileModal';
import { VideoProfileModal } from './components/VideoProfileModal';
import { PRODUCTS as INITIAL_PRODUCTS } from './constants';
import { Category, Product, CartItem } from './types';

// GLOBAL CLOUD STORAGE CONFIG
const CLOUD_BIN_ID = '6971a5c343b1c97be940d142';
const API_KEY = '$2a$10$m2rFL4zrinoE9pLfg.n6puBwUXGyKBDU.x09qEXsONWPRRmD0oDby'; // Your JSONBin.io master key

// AUTO-REFRESH CONFIG
const SYNC_INTERVAL_MS = 30000; // Check for updates every 30 seconds

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const syncTimeoutRef = useRef<number | null>(null);
  const pollingRef = useRef<number | null>(null);
  const productsRef = useRef<Product[]>(products); // Track current products for comparison

  // Keep productsRef in sync
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  // FETCH DATA FROM CLOUD (reusable function)
  const fetchCloudData = useCallback(async (isBackground = false) => {
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${CLOUD_BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
      });
      if (!response.ok) throw new Error('Cloud Fetch Failed');
      const data = await response.json();

      if (data.record && Array.isArray(data.record.products)) {
        const cloudProducts = data.record.products;

        // Smart comparison: only update if data actually changed
        const currentHash = JSON.stringify(productsRef.current);
        const cloudHash = JSON.stringify(cloudProducts);

        if (currentHash !== cloudHash) {
          console.log('📡 Cloud data updated, syncing...');
          setProducts(cloudProducts);
          localStorage.setItem('mitra_gizi_cache', JSON.stringify(cloudProducts));
        }

        setLastSyncTime(new Date());
        if (!isBackground) setSyncStatus('synced');
        return true;
      }
      return false;
    } catch (err) {
      console.warn("Cloud sync failed:", err);
      if (!isBackground) {
        const cache = localStorage.getItem('mitra_gizi_cache');
        if (cache) setProducts(JSON.parse(cache));
      }
      return false;
    }
  }, []);

  // 1. LOAD DATA FROM CLOUD ON STARTUP
  useEffect(() => {
    const loadData = async () => {
      await fetchCloudData(false);
      setIsInitialLoading(false);
    };
    loadData();
  }, [fetchCloudData]);

  // 2. AUTO-REFRESH POLLING - Check cloud for updates periodically
  useEffect(() => {
    // Start polling for updates
    pollingRef.current = window.setInterval(() => {
      // Don't poll while actively saving to avoid conflicts
      if (syncStatus !== 'saving') {
        fetchCloudData(true);
      }
    }, SYNC_INTERVAL_MS);

    // Cleanup on unmount
    return () => {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
      }
    };
  }, [fetchCloudData, syncStatus]);

  // 2. SYNC TO CLOUD FUNCTION (DEBOUNCED)
  const performCloudSync = useCallback(async (dataToSync: Product[]) => {
    setSyncStatus('saving');
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${CLOUD_BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify({ products: dataToSync })
      });

      if (!response.ok) throw new Error('Upload Failed');

      localStorage.setItem('mitra_gizi_cache', JSON.stringify(dataToSync));
      setSyncStatus('synced');
    } catch (err) {
      console.error("Sync Error:", err);
      setSyncStatus('error');
    }
  }, []);

  const triggerSync = (updatedProducts: Product[]) => {
    if (syncTimeoutRef.current) window.clearTimeout(syncTimeoutRef.current);

    // Immediate local save
    localStorage.setItem('mitra_gizi_cache', JSON.stringify(updatedProducts));

    // Debounced cloud save (wait 1.5s after last change)
    syncTimeoutRef.current = window.setTimeout(() => {
      performCloudSync(updatedProducts);
    }, 1500);
  };

  // 3. PRODUCT MODIFICATION HANDLERS
  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(current => {
      const next = current.map(p => p.id === id ? { ...p, ...updates } : p);
      if (isAdminMode) triggerSync(next);
      return next;
    });
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `p_${Date.now()}`,
      name: 'Produk Baru',
      category: Category.FRESH,
      description: 'Deskripsi nutrisi baru...',
      price: 0,
      unit: 'kg',
      image: 'https://picsum.photos/seed/' + Math.random() + '/400/300'
    };
    const next = [newProduct, ...products];
    setProducts(next);
    triggerSync(next);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Hapus produk ini secara permanen dari Cloud?')) {
      const next = products.filter(p => p.id !== id);
      setProducts(next);
      triggerSync(next);
    }
  };

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Synchronizing Cloud Database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => setActiveCategory('All')}
        onVideoClick={() => setIsVideoModalOpen(true)}
      />

      {isAdminMode && (
        <div className="fixed top-24 right-6 z-[100] animate-in slide-in-from-right">
          <div className={`px-4 py-2 rounded-2xl shadow-xl border flex items-center gap-3 bg-white ${syncStatus === 'saving' ? 'border-blue-200' : syncStatus === 'error' ? 'border-red-200' : 'border-green-200'}`}>
            <div className={`w-2 h-2 rounded-full ${syncStatus === 'saving' ? 'bg-blue-500 animate-pulse' : syncStatus === 'error' ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
              {syncStatus === 'saving' ? 'Cloud: Menyimpan...' : syncStatus === 'error' ? 'Cloud: Error Sync' : 'Cloud: Data Aman'}
            </span>
          </div>
        </div>
      )}

      {/* SYNC STATUS INDICATOR FOR ALL USERS */}
      <div className="fixed bottom-6 left-6 z-[90] animate-in slide-in-from-left">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-3">
          <button
            onClick={() => fetchCloudData(false)}
            className="w-8 h-8 rounded-xl bg-green-50 hover:bg-green-100 flex items-center justify-center transition-colors"
            title="Refresh data dari cloud"
          >
            <i className="fas fa-sync-alt text-green-600 text-xs"></i>
          </button>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Auto-Sync Aktif</span>
            <span className="text-[10px] font-bold text-slate-600">
              {lastSyncTime ? `Terakhir: ${lastSyncTime.toLocaleTimeString('id-ID')}` : 'Menghubungkan...'}
            </span>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">
        <button
          onClick={() => isAdminMode ? setIsAdminMode(false) : setIsLoginModalOpen(true)}
          className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl transition-all border ${isAdminMode ? 'bg-slate-900 text-white border-slate-700' : 'bg-white text-slate-600 border-slate-200'}`}
        >
          <i className={`fas ${isAdminMode ? 'fa-save' : 'fa-lock'}`}></i>
          {isAdminMode ? 'Tutup & Simpan' : 'Login Merchant'}
        </button>
      </div>

      {!isAdminMode && (
        <header className="hero-gradient pt-24 pb-20 px-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] mb-6">
                Pangan Sehat <br /><span className="text-green-600">Terintegrasi.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">Pusat distribusi nutrisi lokal untuk program Makanan Bergizi Gratis. Kelola inventori secara real-time melalui cloud engine kami.</p>
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black uppercase text-sm shadow-2xl hover:scale-105 transition-all"
              >
                Mulai Belanja
              </button>
            </div>
            <div className="hidden md:block relative">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" className="rounded-[3rem] shadow-2xl rotate-2" alt="Healthy Food" />
            </div>
          </div>
        </header>
      )}

      <main className={`max-w-7xl mx-auto px-4 pb-32 ${isAdminMode ? 'pt-28' : '-mt-10'}`}>
        {isAdminMode && (
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">Master Database Editor</h2>
              <p className="text-slate-400 text-sm">Gunakan input di bawah untuk mengubah data. Sistem akan sinkron otomatis.</p>
            </div>
            <button
              onClick={handleAddProduct}
              className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl"
            >
              + Item Baru
            </button>
          </div>
        )}

        <section id="products">
          <div className="flex gap-2 justify-center mb-12 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setActiveCategory('All')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${activeCategory === 'All' ? 'bg-green-600 text-white' : 'bg-white text-slate-400'}`}>Semua</button>
            {Object.values(Category).map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${activeCategory === cat ? 'bg-green-600 text-white' : 'bg-white text-slate-400'}`}>{cat}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
                <ProductCard
                  product={product}
                  onAddToCart={(p) => {
                    setCart(prev => {
                      const existing = prev.find(i => i.id === p.id);
                      if (existing) return prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
                      return [...prev, { ...p, quantity: 1 }];
                    });
                    setIsCartOpen(true);
                  }}
                  isAdmin={isAdminMode}
                  onEditPhoto={setEditingProduct}
                />

                {isAdminMode && (
                  <div className="mt-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 flex flex-col">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Nama Produk</label>
                      <input
                        className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-3 outline-none focus:ring-1 focus:ring-green-500"
                        value={product.name}
                        onChange={(e) => handleUpdateProduct(product.id, { name: e.target.value })}
                      />
                    </div>

                    <div className="flex-grow">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Deskripsi Gizi</label>
                      <textarea
                        className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-3 outline-none focus:ring-1 focus:ring-green-500 min-h-[80px] resize-none"
                        value={product.description}
                        onChange={(e) => handleUpdateProduct(product.id, { description: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Harga (Rp)</label>
                        <input
                          type="number"
                          className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-3 outline-none focus:ring-1 focus:ring-green-500"
                          value={product.price}
                          onChange={(e) => handleUpdateProduct(product.id, { price: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Unit</label>
                        <input
                          className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-3 text-center outline-none focus:ring-1 focus:ring-green-500"
                          value={product.unit}
                          onChange={(e) => handleUpdateProduct(product.id, { unit: e.target.value })}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="w-full py-2 text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors pt-2 border-t border-slate-50"
                    >
                      Hapus Item
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQty={(id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))}
        onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))}
      />

      <ImageEditorModal
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={(id, url) => { handleUpdateProduct(id, { image: url }); setEditingProduct(null); }}
      />

      <CompanyProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <VideoProfileModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />

      {isLoginModalOpen && (
        <MerchantLogin
          onLogin={() => { setIsAdminMode(true); setIsLoginModalOpen(false); }}
          onCancel={() => setIsLoginModalOpen(false)}
        />
      )}
    </div>
  );
}
