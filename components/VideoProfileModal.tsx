
import React from 'react';

interface VideoProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoProfileModal: React.FC<VideoProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500" 
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className="relative bg-slate-900 w-full max-w-5xl rounded-[2.5rem] shadow-[0_0_100px_rgba(34,197,94,0.2)] overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-white/10">
        
        {/* Close Button - High Z-index */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-6 right-6 z-[210] w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all group active:scale-90"
        >
          <i className="fas fa-times group-hover:rotate-90 transition-transform"></i>
        </button>

        {/* Video Player / Presentation Area */}
        <div className="flex-grow bg-black aspect-video md:aspect-auto flex items-center justify-center relative min-h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 pointer-events-none"></div>
          
          <div className="relative z-20 flex flex-col items-center justify-center text-white p-8 text-center">
            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(22,163,74,0.6)] group cursor-pointer hover:scale-110 transition-transform">
               <i className="fas fa-play text-3xl ml-1 text-white"></i>
            </div>
            <h3 className="text-3xl font-black mb-3 tracking-tight">Presentasi Bisnis</h3>
            <p className="text-slate-400 text-sm max-w-md font-medium leading-relaxed">
              Mengenal lebih dekat ekosistem gizi lokal untuk mendukung program <span className="text-green-500 font-bold">Makanan Bergizi Gratis (MBG)</span>.
            </p>
          </div>

          {/* Simulated Player Controls */}
          <div className="absolute bottom-8 left-8 right-8 z-30 space-y-4">
            <div className="flex items-center gap-4 text-white/50 text-[10px] font-black uppercase tracking-widest">
              <span>00:45</span>
              <div className="flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-1/3 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
              </div>
              <span>02:30</span>
            </div>
          </div>
        </div>

        {/* Narrative Side Panel */}
        <div className="w-full md:w-80 bg-slate-800/50 backdrop-blur-md p-10 flex flex-col gap-8 border-l border-white/5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-green-500/10 text-green-400 rounded-md">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black uppercase tracking-widest">Sekarang Diputar</span>
            </div>
            <h4 className="text-white text-xl font-black leading-tight">Membangun Kemandirian Gizi</h4>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-start opacity-100">
              <div className="w-8 h-8 rounded-lg bg-green-600/20 text-green-500 flex items-center justify-center flex-shrink-0 text-xs font-black">1</div>
              <div>
                <h5 className="text-white text-sm font-bold mb-1">Rantai Pasok Lokal</h5>
                <p className="text-slate-400 text-[11px] leading-relaxed">Agregasi hasil tani H-1 untuk menjaga kesegaran nutrisi.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start opacity-60">
              <div className="w-8 h-8 rounded-lg bg-slate-700 text-slate-400 flex items-center justify-center flex-shrink-0 text-xs font-black">2</div>
              <div>
                <h5 className="text-slate-300 text-sm font-bold mb-1">Standardisasi Dapur</h5>
                <p className="text-slate-500 text-[11px] leading-relaxed">Penerapan SLHS & Sertifikasi Halal di setiap lini produksi.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start opacity-60">
              <div className="w-8 h-8 rounded-lg bg-slate-700 text-slate-400 flex items-center justify-center flex-shrink-0 text-xs font-black">3</div>
              <div>
                <h5 className="text-slate-300 text-sm font-bold mb-1">Distribusi Terukur</h5>
                <p className="text-slate-500 text-[11px] leading-relaxed">Logistik tepat waktu untuk menjamin 100% ketersediaan stok.</p>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <button 
              onClick={onClose}
              className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-50 transition-all active:scale-95 shadow-xl"
            >
              Lanjut Belanja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
