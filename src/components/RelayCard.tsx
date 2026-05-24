import React from 'react';
import { Power } from 'lucide-react';
import { motion } from 'motion/react';

interface RelayCardProps {
  id: number;
  isOn: boolean;
  disabled: boolean;
  onToggle: (id: number, newState: boolean) => void;
}

export function RelayCard({ id, isOn, disabled, onToggle }: RelayCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white border border-zinc-200 shadow-sm rounded-2xl">
      <div className="text-sm font-medium text-zinc-500 mb-6 tracking-wide">LAMPU {id}</div>
      <button
        disabled={disabled}
        onClick={() => onToggle(id, !isOn)}
        className={`relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOn ? 'bg-brand text-zinc-950 shadow-[0_0_30px_rgba(112,245,94,0.3)]' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'}
        `}
      >
        <Power className={`w-8 h-8 ${isOn ? 'drop-shadow-sm' : ''}`} />
      </button>
      <div className={`mt-6 text-xs font-mono font-medium px-3 py-1 rounded-full ${isOn ? 'bg-brand/20 text-brand-dark' : 'bg-zinc-100 text-zinc-500'}`}>
        {isOn ? 'NYALA' : 'MATI'}
      </div>
    </div>
  );
}
