
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { ImageEditorModal } from './components/ImageEditorModal';
import { MerchantLogin } from './components/MerchantLogin';
import { CompanyProfileModal } from './components/CompanyProfileModal';
import { VideoProfileModal } from './components/VideoProfileModal';
import { PRODUCTS as INITIAL_PRODUCTS, BUSINESS_INFO } from './constants';
import { Category, Product, CartItem } from './types';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mitra_gizi_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveInterval = useRef<number | null>(null);

  // Auto-save logic (every 3 minutes = 180000ms)
  useEffect(() => {
    if (isAdminMode && hasUnsavedChanges) {
      autoSaveInterval.current = window.setInterval(() => {
        saveToLocalStorage();
      }, 180000);
    } else {
      if (autoSaveInterval.current) clearInterval(autoSaveInterval.current);
    }
    return () => {
      if (autoSaveInterval.current) clearInterval(autoSaveInterval.current);
    };
  }, [isAdminMode, hasUnsavedChanges, products]);

  // Handle browser close/refresh warnings
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Anda memiliki perubahan yang belum disimpan!';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const saveToLocalStorage = () => {
    setIsSaving(true);
    localStorage.setItem('mitra_gizi_products', JSON.stringify(products));
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
    }, 1000);
  };

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    setHasUnsavedChanges(true);
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: 'Produk Baru',
      category: Category.FRESH,
      description: 'Masukkan deskripsi nutrisi produk...',
      price: 0,
      unit: 'kg',
      image: 'https://picsum.photos/seed/' + Math.random() + '/400/300'
    };
    setProducts([newProduct, ...products]);
    setHasUnsavedChanges(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('PERINGATAN: Hapus produk ini secara permanen dari inventori?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setHasUnsavedChanges(true);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleSavePhoto = (productId: string, newImageUrl: string) => {
    handleUpdateProduct(productId, { image: newImageUrl });
    setEditingProduct(null);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar 
        cartCount={totalItems} 
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => setActiveCategory('All')}
        onVideoClick={() => setIsVideoModalOpen(true)}
      />

      {/* Floating Company Profile Button - Top Middle */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[40] pointer-events-none">
        <button 
          onClick={() => setIsProfileModalOpen(true)}
          className="pointer-events-auto bg-white border border-green-100 px-5 py-2.5 rounded-full shadow-xl shadow-green-100 flex items-center gap-3 animate-bounce-soft transition-transform hover:scale-105"
        >
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] animate-pulse">
            <i className="fas fa-info"></i>
          </div>
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Profil Perusahaan</span>
        </button>
      </div>

      {/* Admin Interface Floating Status */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3 pointer-events-none">
        {hasUnsavedChanges && (
          <div className="pointer-events-auto flex items-center gap-3 bg-white border border-orange-200 p-2 pl-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Unsaved Changes</span>
              <span className="text-[9px] text-slate-400">Auto-save setiap 3 menit</span>
            </div>
            <button 
              onClick={saveToLocalStorage}
              disabled={isSaving}
              className={`px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <i className="fas fa-spinner animate-spin"></i> Saving
                </span>
              ) : 'Save Now'}
            </button>
          </div>
        )}
        
        <div className="pointer-events-auto flex flex-col gap-2 items-end">
          <button 
            onClick={() => {
              if (hasUnsavedChanges && isAdminMode) {
                if (window.confirm('Keluar dari Merchant Mode? Perubahan yang belum disimpan akan hilang kecuali Anda menyimpannya sekarang.')) {
                  setIsAdminMode(false);
                  setHasUnsavedChanges(false);
                }
              } else {
                isAdminMode ? setIsAdminMode(false) : setIsLoginModalOpen(true);
              }
            }}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl transition-all border ${isAdminMode ? 'bg-slate-900 text-white border-slate-700 hover:bg-black' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
          >
            <i className={`fas ${isAdminMode ? 'fa-door-open' : 'fa-lock'}`}></i>
            {isAdminMode ? 'Exit Management' : 'Merchant Login'}
          </button>
        </div>
      </div>

      {!isAdminMode && (
        <header className="hero-gradient pt-20 pb-24 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center text-center md:text-left">
            <div className="relative z-10 animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-[11px] font-black uppercase tracking-widest mb-6 mx-auto md:mx-0">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Official SPPG Partner
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-slate-900 leading-[0.95] mb-8">
                Pangan Sehat <br/>
                <span className="text-green-600">Lokal Mandiri.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                Penyedia rantai pasok terintegrasi untuk Program Makanan Bergizi Gratis (MBG). 100% Berbasis Komunitas Lokal.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button 
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  Katalog Produk
                </button>
                <button 
                  onClick={() => setIsProfileModalOpen(true)}
                  className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-slate-50 transition-all"
                >
                  Tentang Kami
                </button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" className="rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700" alt="Fresh Produce" />
            </div>
          </div>
        </header>
      )}

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 ${isAdminMode ? 'pt-20' : '-mt-16'}`}>
        
        {isAdminMode && (
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm mb-16 animate-in slide-in-from-top duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest mb-3">
                  <i className="fas fa-shield-halved"></i> Management Session Active
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-2 leading-none">Manajemen Inventori</h1>
                <p className="text-slate-400 text-sm font-medium">Klik pada input untuk mengubah data. Foto bisa diubah via AI atau Upload.</p>
              </div>
              <button 
                onClick={handleAddProduct}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-green-100 transition-all hover:translate-y-[-2px] active:translate-y-0"
              >
                <i className="fas fa-plus-circle text-lg"></i> Tambah Item Baru
              </button>
            </div>
          </div>
        )}

        <section id="products">
          <div className="flex flex-wrap items-center gap-3 justify-center mb-16">
            <button 
              onClick={() => setActiveCategory('All')} 
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeCategory === 'All' ? 'bg-green-600 text-white shadow-xl shadow-green-100' : 'bg-white text-slate-400 hover:text-slate-600'}`}
            >
              Semua Produk
            </button>
            {Object.values(Category).map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-green-600 text-white shadow-xl shadow-green-100' : 'bg-white text-slate-400 hover:text-slate-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredProducts.map(product => (
              <div key={product.id} className="relative flex flex-col">
                <div className="flex-grow">
                  <ProductCard 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    isAdmin={isAdminMode}
                    onEditPhoto={setEditingProduct}
                  />
                </div>
                
                {isAdminMode && (
                  <div className="mt-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-300">
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nama Item</label>
                      <input 
                        className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        value={product.name}
                        onChange={(e) => handleUpdateProduct(product.id, { name: e.target.value })}
                        placeholder="Nama Produk"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-grow">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Harga (Rp)</label>
                        <input 
                          type="number"
                          className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 transition-all"
                          value={product.price}
                          onChange={(e) => handleUpdateProduct(product.id, { price: Number(e.target.value) })}
                        />
                      </div>
                      <div className="w-24">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Satuan</label>
                        <input 
                          className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-center transition-all"
                          value={product.unit}
                          onChange={(e) => handleUpdateProduct(product.id, { unit: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nutrisi / Deskripsi</label>
                      <textarea 
                        className="w-full bg-slate-50 border-none rounded-xl text-xs font-medium px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 min-h-[80px] transition-all"
                        value={product.description}
                        onChange={(e) => handleUpdateProduct(product.id, { description: e.target.value })}
                      />
                    </div>

                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="w-full py-2 text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-[0.2em] transition-colors"
                    >
                      Hapus Item Permanen
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
        onUpdateQty={(id, delta) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + delta)} : i))}
        onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))}
      />

      <ImageEditorModal 
        product={editingProduct} 
        onClose={() => setEditingProduct(null)} 
        onSave={handleSavePhoto} 
      />

      <CompanyProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <VideoProfileModal 
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      {isLoginModalOpen && (
        <MerchantLogin 
          onLogin={() => {
            setIsAdminMode(true);
            setIsLoginModalOpen(false);
            setHasUnsavedChanges(false);
          }}
          onCancel={() => setIsLoginModalOpen(false)}
        />
      )}

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-soft {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -10px); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-bounce-soft { animation: bounce-soft 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
