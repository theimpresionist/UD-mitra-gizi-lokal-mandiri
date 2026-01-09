
import React from 'react';
import { CartItem } from '../types';
import { BUSINESS_INFO } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQty, onRemove }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkoutMessage = () => {
    const list = items.map(i => `- ${i.name} (${i.quantity} ${i.unit})`).join('%0A');
    return `Halo UD Mitra Gizi Lokal Mandiri,%0A%0ASaya ingin memesan:%0A${list}%0A%0ATotal Estimasi: Rp ${total.toLocaleString('id-ID')}%0A%0AMohon konfirmasi pesanannya.`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-left">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <i className="fas fa-shopping-basket text-green-600 mr-2"></i>
            Keranjang Belanja
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <i className="fas fa-times text-slate-500"></i>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-basket-shopping text-slate-300 text-3xl"></i>
              </div>
              <p className="text-slate-500 font-medium">Keranjang Anda masih kosong</p>
              <button 
                onClick={onClose}
                className="mt-4 text-green-600 font-bold hover:underline"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-slate-800 leading-tight">{item.name}</h4>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <i className="fas fa-trash-can text-sm"></i>
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{item.unit}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button 
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-all"
                        >
                          <i className="fas fa-minus text-xs text-slate-600"></i>
                        </button>
                        <span className="w-8 text-center font-bold text-slate-700">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-all"
                        >
                          <i className="fas fa-plus text-xs text-slate-600"></i>
                        </button>
                      </div>
                      <span className="font-bold text-slate-900">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-500 font-medium">Total Estimasi</span>
              <span className="text-2xl font-black text-green-700">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
            <a 
              href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${checkoutMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-200 transition-all hover:scale-[1.02] active:scale-100"
            >
              Lanjutkan ke WhatsApp
            </a>
            <p className="text-[10px] text-slate-400 text-center mt-3">
              Pemesanan segar H-1. Harga dapat berubah sesuai pagu anggaran BGN.
            </p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slide-left {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left { animation: slide-left 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};
