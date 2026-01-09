
import React, { useState, useEffect } from 'react';

interface MerchantLoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

export const MerchantLogin: React.FC<MerchantLoginProps> = ({ onLogin, onCancel }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Explicit trim and check for demo credentials
    const trimmedUser = user.trim();
    const trimmedPass = pass.trim();

    if (trimmedUser === 'admin' && trimmedPass === 'gizi2024') {
      onLogin();
    } else {
      setError('Username atau Password salah. Gunakan admin / gizi2024');
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={onCancel}></div>
      <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in duration-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-50">
            <i className="fas fa-user-shield text-2xl"></i>
          </div>
          <h2 className="text-2xl font-black text-slate-800">Merchant Access</h2>
          <p className="text-slate-500 text-sm mt-1">Gunakan kredensial admin Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Username</label>
            <input 
              type="text" 
              autoFocus
              value={user}
              onChange={(e) => { setUser(e.target.value); setError(''); }}
              className={`w-full px-5 py-4 bg-slate-50 border ${error ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-200'} rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium`}
              placeholder="Masukkan username"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
            <input 
              type="password" 
              value={pass}
              onChange={(e) => { setPass(e.target.value); setError(''); }}
              className={`w-full px-5 py-4 bg-slate-50 border ${error ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-200'} rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium`}
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-shake">
              <i className="fas fa-circle-exclamation"></i>
              {error}
            </div>
          )}
          
          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-[0.98] mt-4"
          >
            Login Sekarang
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="w-full py-2 text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors"
          >
            Batal & Tutup
          </button>
        </form>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};
