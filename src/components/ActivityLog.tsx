import React from 'react';
import { ActivityLogEntry } from '../types';
import { Terminal, CheckCircle2, Info, Command, AlertCircle } from 'lucide-react';

export function ActivityLog({ logs }: { logs: ActivityLogEntry[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-brand" />;
      case 'command': return <Command className="w-4 h-4 text-zinc-300" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 shadow-md rounded-2xl overflow-hidden flex flex-col h-[300px]">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2 bg-zinc-900">
        <Terminal className="w-4 h-4 text-brand" />
        <h3 className="font-mono text-xs font-semibold text-brand tracking-wider">ACTIVITY LOG</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-zinc-500 italic h-full flex items-center justify-center">Menunggu aktivitas sistem...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3">
              <div className="mt-0.5 opacity-80">{getIcon(log.type)}</div>
              <div>
                <span className="text-zinc-500 mr-2">[{log.time.toLocaleTimeString()}]</span>
                <span className="text-brand drop-shadow-[0_0_8px_rgba(112,245,94,0.3)]">{log.message}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
