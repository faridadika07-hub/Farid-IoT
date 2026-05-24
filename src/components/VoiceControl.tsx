import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceControlProps {
  onCommandReceived: (transcript: string) => void;
  disabled: boolean;
}

// Ensure TypeScript knows about webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceControl({ onCommandReceived, disabled }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = false;
        reco.lang = 'id-ID';

        reco.onstart = () => setIsListening(true);
        reco.onend = () => setIsListening(false);
        reco.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onCommandReceived(transcript);
        };
        reco.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
        setRecognition(reco);
      }
    }
  }, [onCommandReceived]);

  const toggleListening = () => {
    if (!recognition) return alert("Browser tidak mendukung Voice API.");
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <div className="relative group">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0.2 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute inset-0 bg-brand rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>
      <button
        onClick={toggleListening}
        disabled={disabled}
        className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all
          ${disabled ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 
            isListening ? 'bg-brand text-zinc-950 shadow-[0_0_20px_rgba(112,245,94,0.4)]' : 'bg-zinc-100 text-zinc-500 hover:text-brand-dark hover:bg-zinc-200'
          }`}
      >
        {isListening ? <Volume2 className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
      </button>
    </div>
  );
}
