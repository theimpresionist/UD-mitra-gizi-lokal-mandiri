
import React from 'react';
import { BUSINESS_INFO } from '../constants';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onHomeClick: () => void;
  onVideoClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick, onHomeClick, onVideoClick }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex flex-col">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={onHomeClick}
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-lg shadow-green-200">
                 <i className="fas fa-leaf text-xl"></i>
              </div>
              <div>
                <span className="text-xl font-bold text-slate-800 hidden sm:block">UD Mitra Gizi Lokal Mandiri</span>
                <span className="text-xs text-green-600 font-semibold block sm:hidden">Mitra Gizi</span>
              </div>
            </div>
            
            {/* NEW: Video Profile Button below company name */}
            <button 
              onClick={onVideoClick}
              className="flex items-center gap-2 mt-1 ml-[52px] group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25"></div>
                <div className="relative w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[8px] border border-green-200">
                  <i className="fas fa-play ml-0.5"></i>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-green-600 transition-colors">
                Video Profile
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={onCartClick}
              className="relative p-2 text-slate-600 hover:text-green-600 transition-colors"
            >
              <i className="fas fa-shopping-basket text-2xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="hidden md:block">
               <a 
                 href={`https://wa.me/${BUSINESS_INFO.whatsapp}`} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg flex items-center"
               >
                 <i className="fab fa-whatsapp mr-2"></i> Hubungi Kami
               </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
