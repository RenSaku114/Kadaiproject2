import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, RefreshCw, Smartphone, Check, HelpCircle } from 'lucide-react';
import { LoopCount } from '../types';

interface SecureCoreProps {
  loop: LoopCount;
  isTwoFactorEnabled: boolean;
  onToggleTwoFactor: (enabled: boolean) => void;
  alertCount: number;
  isPhishingReported: boolean;
}

export default function SecureCore({
  loop,
  isTwoFactorEnabled,
  onToggleTwoFactor,
  alertCount,
  isPhishingReported,
}: SecureCoreProps) {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'idle' | 'scanning' | 'clean' | 'threat_found'>('idle');

  const startScan = () => {
    setScanning(true);
    setScanResult('scanning');
    setTimeout(() => {
      setScanning(false);
      if (loop === 1) {
        setScanResult('clean');
      } else {
        setScanResult('threat_found');
      }
    }, 2000);
  };

  return (
    <div id="secure-core-app" className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none p-5 space-y-4">
      {/* App Header */}
      <div className="flex items-center gap-3 border-b border-slate-900 pb-3.5">
        <div className="p-2 bg-sky-950/50 text-sky-400 rounded-xl border border-sky-800/30">
          <Shield className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight font-display text-white">SecureCore Security Center</h1>
          <p className="text-[10px] text-slate-400 font-mono">システム保護レベル: {isTwoFactorEnabled ? 'MAXIMUM PROTECTION' : 'VULNERABLE (RISK DETECTED)'}</p>
        </div>
      </div>

      {/* Main Status */}
      <div className={`p-4.5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
        isTwoFactorEnabled 
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
          : 'bg-rose-950/20 border-rose-500/30 text-rose-400'
      }`}>
        <div className="flex items-center gap-3.5">
          {isTwoFactorEnabled ? (
            <ShieldCheck className="w-9 h-9 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-9 h-9 text-rose-400 animate-bounce" />
          )}
          <div>
            <h2 className="text-xs font-bold font-display">{isTwoFactorEnabled ? 'システムは高度に保護されています' : 'システムセキュリティに重大な脆弱性'}</h2>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              {isTwoFactorEnabled 
                ? '二段階認証 (2FA) が有効です。他端末からのなりすましログイン試行はすべてブロックされます。' 
                : 'アカウント乗っ取り・不正アクセスのリスクが極めて高い状態です。2FAの有効化が必要です。'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Controls */}
      <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto">
        {/* Left Card: 2-Factor Authentication */}
        <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4.5 h-4.5 text-sky-400" />
              <h3 className="text-xs font-bold text-white font-display">二段階認証 (2FA)</h3>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              ログイン時にスマートフォンの専用認証アプリへワンタイムコードを要求し、パスワード漏洩時の不正ログインを防ぎます。
            </p>
          </div>

          <div className="mt-4">
            {loop === 1 ? (
              <div className="text-[9px] text-amber-500 bg-amber-950/25 border border-amber-900/40 px-3 py-2.5 rounded-xl font-mono leading-relaxed">
                ⚠️ 現在の環境（PROTOTYPE WORKSPACE）では設定変更できません。
              </div>
            ) : (
              <button
                id="securecore-2fa-toggle"
                onClick={() => onToggleTwoFactor(!isTwoFactorEnabled)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow ${
                  isTwoFactorEnabled
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-emerald-950'
                    : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white animate-pulse shadow-[0_0_15px_rgba(14,165,233,0.25)]'
                }`}
              >
                {isTwoFactorEnabled ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="font-display">2FA 有効化済み</span>
                  </>
                ) : (
                  <span className="font-display">二段階認証を有効にする</span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Card: System Scan */}
        <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-4.5 h-4.5 text-sky-400 ${scanning ? 'animate-spin' : ''}`} />
              <h3 className="text-xs font-bold text-white font-display">システムスキャン</h3>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              システム内のキャッシュ、不審なネットワークパケット、バックドアをバックグラウンドで走査・検知します。
            </p>
          </div>

          <div className="mt-4 space-y-2.5">
            {scanResult === 'scanning' && (
              <div className="text-[10px] text-sky-400 text-center py-1 font-mono animate-pulse">
                SCANNING IN PROGRESS...
              </div>
            )}
            {scanResult === 'clean' && (
              <div className="text-[10px] text-emerald-400 bg-emerald-950/25 border border-emerald-900/40 px-2.5 py-1.5 rounded-xl text-center font-mono">
                [OK] SYSTEM SECURE
              </div>
            )}
            {scanResult === 'threat_found' && (
              <div className="text-[10px] text-rose-400 bg-rose-950/25 border border-rose-900/40 px-2.5 py-1.5 rounded-xl text-center font-semibold font-mono animate-pulse">
                [!] DETECTED: SUSPICIOUS BACKDOOR (ChatConnect Session)
              </div>
            )}
            <button
              id="securecore-scan-btn"
              disabled={scanning}
              onClick={startScan}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs py-2.5 rounded-xl transition-colors border border-slate-800 cursor-pointer font-display"
            >
              {scanning ? 'スキャン中...' : '今すぐスキャン'}
            </button>
          </div>
        </div>
      </div>

      {/* Literacy tips */}
      <div className="bg-slate-950/60 border border-slate-900 p-4 rounded-2xl flex items-start gap-2.5 text-[10px] text-slate-400">
        <HelpCircle className="w-4.5 h-4.5 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-300 font-display uppercase tracking-wider">💡 SECURITY COMPLIANCE PRINCIPLES</p>
          <ul className="list-disc pl-3.5 space-y-1">
            <li>同じ認証情報を複数のサービスで使い回さない（パスワードリスト攻撃の防止）。</li>
            <li>「アカウントが凍結されました」「晒されています」など、不安や恐怖を煽るメッセージを盲信しない。</li>
            <li>URLバーのドメイン名（スペルミスや異変がないか）を常に目視確認する癖をつける。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
