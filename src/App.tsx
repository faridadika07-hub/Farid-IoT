import { useState, useEffect, useCallback, useRef } from 'react';
import { Settings2, Wifi, WifiOff, Bell, BellOff } from 'lucide-react';
import { sendCommand, syncStatus, parseVoiceCommand, sendTelegramNotification } from './utils/api';
import { ActivityLogEntry, ESPStatus } from './types';
import { RelayCard } from './components/RelayCard';
import { VoiceControl } from './components/VoiceControl';
import { ActivityLog } from './components/ActivityLog';
import { SensorPanel } from './components/SensorPanel';
import { GlobalControls } from './components/GlobalControls';

export default function App() {
  const [ipAddress, setIpAddress] = useState(localStorage.getItem('esp_ip') || '');
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [enableTelegramNotif, setEnableTelegramNotif] = useState(true);
  
  const [status, setStatus] = useState<ESPStatus>({
    temperature: 0,
    humidity: 0,
    variasiMode: 0,
    r1: 1, // HIGH is off, LOW is on in Arduino code. But we'll map 1 as ON locally in UI for simplicity, wait.
    r2: 1,
    r3: 1,
    r4: 1
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addLog = useCallback((message: string, type: ActivityLogEntry['type'] = 'info') => {
    setLogs(prev => [{ id: generateId(), time: new Date(), message, type }, ...prev].slice(0, 50));
  }, []);

  const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIp = e.target.value;
    setIpAddress(newIp);
    localStorage.setItem('esp_ip', newIp);
    setIsConnected(false);
  };

  const handleCommand = async (path: string, logMessage: string, isVoice = false) => {
    if (!ipAddress) return addLog('IP Address belum diatur', 'error');
    
    try {
      addLog(`${isVoice ? '(Voice) ' : ''}${logMessage}`, 'info');
      await sendCommand(ipAddress, path);
      addLog(`Perintah berhasil dieksekusi`, 'success');
      
      if (enableTelegramNotif) {
        sendTelegramNotification(`🌐 Web Action:\n${logMessage}`);
      }

      fetchSync(); // Sync state immediately
    } catch (error) {
      addLog(`Gagal: ${error instanceof Error ? error.message : 'Koneksi error'}`, 'error');
      setIsConnected(false);
    }
  };

  const handleRelayToggle = (id: number, newState: boolean) => {
    const stateStr = newState ? 'on' : 'off';
    handleCommand(`/relay?id=${id}&state=${stateStr}`, `Lampu ${id} -> ${newState ? 'NYALA' : 'MATI'}`);
  };

  const handleVoiceCommand = (transcript: string) => {
    addLog(`🎤 Terdengar: "${transcript}"`, 'command');
    const { path, logText } = parseVoiceCommand(transcript);
    
    if (path) {
      handleCommand(path, logText, true);
    } else {
      addLog(`❌ Voice Command tidak dipahami`, 'error');
    }
  };

  const fetchSync = useCallback(async () => {
    if (!ipAddress) return;
    try {
      setIsSyncing(true);
      const data = await syncStatus(ipAddress);
      
      // Map API payload: LOW(1) means NYALA here as seen in ESP sync logic
      // json += "\"r1\":" + String(relay1State == LOW ? 1 : 0) + ",";
      setStatus({
        temperature: data.temperature || 0,
        humidity: data.humidity || 0,
        variasiMode: data.variasiMode || 0,
        r1: data.r1 || 0,
        r2: data.r2 || 0,
        r3: data.r3 || 0,
        r4: data.r4 || 0,
      });
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsSyncing(false);
    }
  }, [ipAddress]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (ipAddress) {
      fetchSync();
      interval = setInterval(fetchSync, 3000); // Poll every 3s
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [ipAddress, fetchSync]);

  return (
    <div className="min-h-screen">
      {/* Header & Config */}
      <header className="bg-zinc-950 px-4 md:px-8 lg:px-12 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border-b border-zinc-900">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Smart Control Hub</h1>
          <p className="text-zinc-400 font-mono text-sm">ESP32 IoT Dashboard with Voice Command</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setEnableTelegramNotif(!enableTelegramNotif)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors text-sm font-medium ${
              enableTelegramNotif 
                ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-400'
            }`}
          >
            {enableTelegramNotif ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            <span className="hidden md:inline">Notif</span>
          </button>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 flex items-center w-full md:w-80">
            <div className="pl-3 pr-2 shadow-sm">
              {isConnected ? <Wifi className="w-5 h-5 text-brand" /> : <WifiOff className="w-5 h-5 text-red-500" />}
            </div>
            <input
              type="text"
              placeholder="IP Address ESP (e.g. 192.168.1.100)"
              value={ipAddress}
              onChange={handleIpChange}
              className="bg-transparent border-none outline-none text-zinc-200 w-full placeholder-zinc-500 font-mono text-sm px-2 py-1"
            />
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Controls (Left Column) */}
        <div className="lg:col-span-8 space-y-8">
          <SensorPanel temperature={status.temperature} humidity={status.humidity} />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RelayCard id={1} isOn={status.r1 === 1} disabled={!isConnected} onToggle={handleRelayToggle} />
            <RelayCard id={2} isOn={status.r2 === 1} disabled={!isConnected} onToggle={handleRelayToggle} />
            <RelayCard id={3} isOn={status.r3 === 1} disabled={!isConnected} onToggle={handleRelayToggle} />
            <RelayCard id={4} isOn={status.r4 === 1} disabled={!isConnected} onToggle={handleRelayToggle} />
          </div>
          
          <GlobalControls disabled={!isConnected} variasiMode={status.variasiMode} onAction={handleCommand} />
        </div>

        {/* Sidebar (Right Column) */}
        <div className="lg:col-span-4 space-y-8 flex flex-col">
          <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <h3 className="font-mono text-xs font-semibold text-zinc-500 tracking-wider mb-6">VOICE COMMAND</h3>
            <VoiceControl disabled={!isConnected} onCommandReceived={handleVoiceCommand} />
            <p className="mt-6 text-sm text-zinc-500">
              Ucapkan <span className="text-zinc-700 font-medium tracking-wide">"Nyala Lampu 1"</span> atau <span className="text-zinc-700 font-medium tracking-wide">"Variasi Dua"</span>
            </p>
          </div>
          
          <div className="flex-1 min-h-0">
             <ActivityLog logs={logs} />
          </div>
        </div>

      </div>
    </div>
  );
}
