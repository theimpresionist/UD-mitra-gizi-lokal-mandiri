
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  isAdmin?: boolean;
  onEditPhoto?: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isAdmin, onEditPhoto }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col h-full relative">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {isAdmin && (
          <button 
            onClick={() => onEditPhoto?.(product)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 z-20"
          >
            <i className="fas fa-camera text-2xl"></i>
            <span className="font-bold text-sm">Ganti Foto</span>
          </button>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
           <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-[10px] font-bold text-green-700 uppercase tracking-wider">
             {product.category}
           </span>
           {product.isPopular && (
             <span className="px-3 py-1 bg-orange-500 text-white shadow-sm rounded-full text-[10px] font-bold uppercase tracking-wider">
               Terlaris
             </span>
           )}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div>
            <span className="text-sm text-slate-400 font-medium">Rp</span>
            <span className="text-xl font-bold text-slate-900 ml-1">
              {product.price.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-500"> / {product.unit}</span>
          </div>
          
          {!isAdmin && (
            <button 
              onClick={() => onAddToCart(product)}
              className="w-10 h-10 bg-slate-100 hover:bg-green-600 hover:text-white rounded-xl flex items-center justify-center transition-all active:scale-95"
            >
              <i className="fas fa-plus"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
