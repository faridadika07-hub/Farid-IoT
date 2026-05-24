import React from 'react';
import { Thermometer, Droplets } from 'lucide-react';

interface SensorProps {
  temperature: number;
  humidity: number;
}

export function SensorPanel({ temperature, humidity }: SensorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
          <Thermometer className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs font-medium text-zinc-500 mb-1">SUHU</div>
          <div className="font-mono text-2xl font-bold text-zinc-800">{temperature.toFixed(1)}°C</div>
        </div>
      </div>
      <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
          <Droplets className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs font-medium text-zinc-500 mb-1">KELEMBAPAN</div>
          <div className="font-mono text-2xl font-bold text-zinc-800">{humidity.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}
