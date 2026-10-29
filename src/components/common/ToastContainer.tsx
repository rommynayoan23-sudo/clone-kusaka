import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border text-xs font-medium transition-all transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white border-emerald-500/40 shadow-emerald-950/20'
              : toast.type === 'error'
              ? 'bg-red-950 text-red-100 border-red-500/40'
              : 'bg-slate-900 text-slate-100 border-blue-500/40'
          }`}
        >
          <div className="mt-0.5 flex-shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
          </div>
          <div className="flex-1 leading-relaxed">
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
