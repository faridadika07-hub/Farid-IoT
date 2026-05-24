import React from 'react';
import { Play, Square, Zap, ZapOff } from 'lucide-react';

interface GlobalControlsProps {
  onAction: (path: string, logMessage: string) => void;
  disabled: boolean;
  variasiMode: number;
}

export function GlobalControls({ onAction, disabled, variasiMode }: GlobalControlsProps) {
  return (
    <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-6">
      <h3 className="font-mono text-xs font-semibold text-zinc-500 tracking-wider mb-4">GLOBAL CONTROLS</h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          disabled={disabled}
          onClick={() => onAction('/all?state=on', 'Menyala semua lampu')}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4 text-brand-dark" /> Semua On
        </button>
        <button
          disabled={disabled}
          onClick={() => onAction('/all?state=off', 'Mematikan semua lampu')}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ZapOff className="w-4 h-4 text-zinc-500" /> Semua Off
        </button>
      </div>

      <h3 className="font-mono text-xs font-semibold text-zinc-500 tracking-wider mb-4 mt-8">VARIASI MODE</h3>
      <div className="grid grid-cols-3 gap-3">
        <button
          disabled={disabled}
          onClick={() => onAction('/variasi?mode=1', 'Variasi 1 Aktif')}
          className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-all ${
            variasiMode === 1 
              ? 'bg-brand/10 border-brand/50 text-brand-dark' 
              : 'bg-zinc-100 border-transparent text-zinc-600 hover:bg-zinc-200 disabled:opacity-50'
          }`}
        >
          <Play className="w-5 h-5" />
          <span className="text-xs font-medium">Mode 1</span>
        </button>
        <button
          disabled={disabled}
          onClick={() => onAction('/variasi?mode=2', 'Variasi 2 Aktif')}
          className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-all ${
            variasiMode === 2 
              ? 'bg-brand/10 border-brand/50 text-brand-dark' 
              : 'bg-zinc-100 border-transparent text-zinc-600 hover:bg-zinc-200 disabled:opacity-50'
          }`}
        >
          <Play className="w-5 h-5" />
          <span className="text-xs font-medium">Mode 2</span>
        </button>
        <button
          disabled={disabled}
          onClick={() => onAction('/stop', 'Variasi Dihentikan')}
          className="flex flex-col items-center gap-2 py-4 rounded-xl bg-zinc-100 border border-transparent text-zinc-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all disabled:opacity-50"
        >
          <Square className="w-5 h-5" />
          <span className="text-xs font-medium">Stop</span>
        </button>
      </div>
    </div>
  );
}
