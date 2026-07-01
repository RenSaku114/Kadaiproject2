import React, { useEffect, useState } from 'react';
import { Terminal, Shield, AlertTriangle, Cpu } from 'lucide-react';

interface OSBootProps {
  loop: 1 | 2;
  onBootComplete: () => void;
}

export default function OSBoot({ loop, onBootComplete }: OSBootProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'welcome'>('loading');

  useEffect(() => {
    const bootLogs = loop === 1 
      ? [
          'LuminaBIOS v2.10.4590 - (C) 2026 Lumina Tech',
          'CPU: Intel Core i7-12700H @ 2.70GHz',
          'Memory Test: 16384MB OK',
          'Detecting storage devices...',
          'SATA Port 0: SSD 512GB (LUM_OS_SYS)',
          'SATA Port 1: HDD 1TB (LUM_DATA_01)',
          'Initializing Lumina Kernel...',
          'Loading system drivers...',
          'Network adapter [WLAN0] connected.',
          'Secure Boot: DISABLED (User override)',
          'Starting Graphic Environment...',
          'Launching Desktop Service...',
        ]
      : [
          'LuminaBIOS v2.10.4590 - (C) 2026 Lumina Tech',
          '⚠️ WARNING: PREVIOUS UNEXPECTED SHUTDOWN DETECTED!',
          '⚠️ CRITICAL: SYSTEM CORRUPTION FOUND IN MEMORY DUMP AT 0x0F4C',
          'Attempting automated system file recovery...',
          'Recovering system integrity... [100% OK]',
          'Note: High threat alert active from last session.',
          'Initializing Lumina Kernel (Safe-Sandbox Mode)...',
          'Secure Core Security Layer: INITIALIZING...',
          '⚠️ Threat Database: Stale. Update recommended.',
          'Sandbox isolated network adapter active.',
          'Launching Desktop Service with Anti-Phishing Monitor...',
        ];

    let currentLogIndex = 0;
    const logInterval = setInterval(() => {
      if (currentLogIndex < bootLogs.length) {
        setLogs((prev) => [...prev, bootLogs[currentLogIndex]]);
        currentLogIndex++;
        setProgress((currentLogIndex / bootLogs.length) * 100);
      } else {
        clearInterval(logInterval);
        setTimeout(() => {
          setPhase('welcome');
          setTimeout(() => {
            onBootComplete();
          }, 1500);
        }, 800);
      }
    }, loop === 1 ? 250 : 200);

    return () => clearInterval(logInterval);
  }, [loop, onBootComplete]);

  return (
    <div id="os-boot-screen" className="fixed inset-0 bg-black text-emerald-500 font-mono flex flex-col justify-between p-8 z-50 select-none">
      {phase === 'loading' ? (
        <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-900 pb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-6 h-6 animate-pulse" />
              <span className="text-lg font-bold tracking-wider">LuminaOS v2.0 - Boot Loader</span>
            </div>
            {loop === 2 && (
              <div className="flex items-center gap-2 bg-red-950/50 border border-red-700 px-3 py-1 rounded text-red-500 text-xs animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                <span>RECOVERY MODE ACTIVE</span>
              </div>
            )}
          </div>

          {/* Logs */}
          <div className="flex-1 overflow-y-auto my-6 space-y-1 text-sm scrollbar-thin scrollbar-thumb-emerald-900">
            {logs.map((log, index) => {
              const isWarning = log && (log.includes('WARNING') || log.includes('CRITICAL'));
              const isInfo = log && (log.includes('Note:') || log.includes('Secure Core'));
              return (
                <div 
                  key={index} 
                  className={`flex items-start gap-2 ${
                    isWarning ? 'text-red-500 font-bold' : isInfo ? 'text-cyan-400' : 'text-emerald-400'
                  }`}
                >
                  <span className="text-emerald-800">[{index.toString().padStart(2, '0')}]</span>
                  <span>{log}</span>
                </div>
              );
            })}
          </div>

          {/* Footer & Progress Bar */}
          <div className="border-t border-emerald-900 pt-4 space-y-4">
            <div className="flex justify-between text-xs text-emerald-600">
              <span>SYSTEM BOOTING...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-emerald-950 rounded-full overflow-hidden border border-emerald-900">
              <div 
                className={`h-full transition-all duration-200 ${
                  loop === 2 ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            {loop === 2 ? (
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-cyan-950/30 border border-cyan-500 animate-pulse">
                <Shield className="w-12 h-12 text-cyan-400" />
              </div>
            ) : (
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-emerald-950/30 border border-emerald-500 animate-pulse">
                <Cpu className="w-12 h-12 text-emerald-400" />
              </div>
            )}
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold tracking-widest text-white">
              LUMINA <span className={loop === 2 ? 'text-cyan-400' : 'text-emerald-400'}>OS</span>
            </h1>
            <p className="text-xs tracking-widest text-zinc-500">
              {loop === 2 ? 'SECURE SANDBOX ENVIRONMENT' : 'SIMPLE. SECURE. PERSONAL.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
