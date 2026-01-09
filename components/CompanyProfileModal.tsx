
import React from 'react';
import { BUSINESS_INFO } from '../constants';

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
              <i className="fas fa-building text-xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">Profil Perusahaan</h2>
              <p className="text-xs font-bold text-green-600 uppercase tracking-widest">UD Mitra Gizi Lokal Mandiri</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            <i className="fas fa-times text-slate-400"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 sm:p-12 space-y-12">
          {/* Section: Overview */}
          <section className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-3xl font-black text-slate-900 mb-6 leading-tight">
                Membangun Generasi dengan <span className="text-green-600">Pangan Lokal Terintegrasi.</span>
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Kami adalah mitra strategis dalam rantai pasok program <strong>Makanan Bergizi Gratis (MBG)</strong>, berfokus pada penguatan ekosistem pangan lokal yang mandiri dan berkelanjutan.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">NIB: {BUSINESS_INFO.nib}</span>
                <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold">SPPG Partner</span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
              <h4 className="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-4">Visi Kami</h4>
              <p className="italic text-slate-600 border-l-4 border-green-500 pl-4">
                "Menjadi katalisator utama dalam pemenuhan gizi nasional melalui integrasi sumber daya lokal menuju Indonesia Emas 2045."
              </p>
            </div>
          </section>

          {/* Section: 3 Pillars */}
          <section>
            <div className="text-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 mb-2">3 Pilar Bisnis Utama</h3>
              <p className="text-slate-500 text-sm">Model bisnis terintegrasi dari hulu ke hilir</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  icon: "fa-seedling",
                  title: "Fresh Aggregator",
                  desc: "Mengonsolidasi hasil tani dan ternak lokal (Ayam, Telur, Sayur) untuk kepastian stok SPPG."
                },
                {
                  icon: "fa-cookie-bite",
                  title: "Healthy Snacks",
                  desc: "Produksi cemilan non-UPF berbasis komunitas (Nagasari, Lemper) yang higienis."
                },
                {
                  icon: "fa-box-archive",
                  title: "Dry Fortified",
                  desc: "Inovasi pangan kering tahan lama dengan tambahan mikronutrisi esensial."
                }
              ].map((pillar, idx) => (
                <div key={idx} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow text-center">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i className={`fas ${pillar.icon} text-xl`}></i>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">{pillar.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Contact */}
          <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-6">Hubungi Kantor Pusat</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <i className="fas fa-location-dot mt-1 text-green-400"></i>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alamat</p>
                      <p className="text-sm text-slate-200">{BUSINESS_INFO.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <i className="fas fa-envelope mt-1 text-green-400"></i>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</p>
                      <p className="text-sm text-slate-200">{BUSINESS_INFO.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <i className="fab fa-whatsapp mt-1 text-green-400"></i>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">WhatsApp</p>
                      <p className="text-sm text-slate-200">{BUSINESS_INFO.whatsapp}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95"
          >
            Tutup Profil
          </button>
        </div>
      </div>
    </div>
  );
};
