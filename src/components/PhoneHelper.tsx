import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, PhoneCall, Volume2, User, HelpCircle } from 'lucide-react';
import { LoopCount } from '../types';

interface PhoneHelperProps {
  loop: LoopCount;
  phoneStatus: 'idle' | 'calling' | 'connected' | 'ended';
  onCallStatusChange: (status: 'idle' | 'calling' | 'connected' | 'ended') => void;
  onConfirmThreatSolved: () => void;
}

export default function PhoneHelper({
  loop,
  phoneStatus,
  onCallStatusChange,
  onConfirmThreatSolved,
}: PhoneHelperProps) {
  const [callTimer, setCallTimer] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const dialogue = [
    { sender: 'friend', text: '「もしもし！お前か！良かった、電話に出てくれて！」' },
    { sender: 'friend', text: '「いや実はさ、さっき送ったChatConnectのメッセージ、あれ俺じゃないんだ！」' },
    { sender: 'friend', text: '「数分前にアカウントが乗っ取られて、勝手に友達全員に『掲示板に晒されてる』って嘘のリンクをばら撒かれてるんだよ！」' },
    { sender: 'friend', text: '「そのリンク、絶対にクリックしちゃだめだぞ！偽のログイン画面（フィッシングサイト）になってて、パスワードを盗み取る罠なんだ！」' },
    { sender: 'friend', text: '「もしクリックしちゃっても、絶対にIDやパスワードを入力しないでブラウザを閉じてくれ！」' },
    { sender: 'friend', text: '「二段階認証（2FA）を設定していれば守られるけど、何より怪しいリンクは開かないのが一番だ。チャットアプリの通報ボタンから、俺の乗っ取られたアカウントを通報してくれ！」' },
    { sender: 'friend', text: '「サンキューな！本当に電話くれて助かったよ。気をつけて！」' },
  ];

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phoneStatus === 'connected') {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
      setDialogueIndex(0);
    }
    return () => clearInterval(interval);
  }, [phoneStatus]);

  // Calling flow sequence
  useEffect(() => {
    if (phoneStatus === 'calling') {
      const ringTimer = setTimeout(() => {
        if (loop === 1) {
          onCallStatusChange('ended'); // 1周目は繋がらない
        } else {
          onCallStatusChange('connected'); // 2周目は繋がる
        }
      }, 2500);
      return () => clearTimeout(ringTimer);
    }
  }, [phoneStatus, loop, onCallStatusChange]);

  const startCall = () => {
    onCallStatusChange('calling');
  };

  const endCall = () => {
    onCallStatusChange('ended');
    if (loop === 2 && dialogueIndex >= dialogue.length - 1) {
      // 全対話を聞き終えて電話を切った場合、脅威解決フラグ
      onConfirmThreatSolved();
    }
  };

  const handleNextDialogue = () => {
    if (dialogueIndex < dialogue.length - 1) {
      setDialogueIndex((prev) => prev + 1);
    } else {
      endCall();
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="phone-app" className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none p-5 justify-between">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-slate-900 pb-3.5">
        <Phone className="w-4.5 h-4.5 text-emerald-500" />
        <h1 className="text-sm font-bold tracking-tight font-display text-white">Lumina Phone Helper</h1>
      </div>

      {phoneStatus === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-slate-900/40 flex items-center justify-center border border-slate-800/60 shadow-inner">
            <User className="w-10 h-10 text-slate-500" />
          </div>
          <div className="text-center space-y-1.5">
            <h2 className="text-sm font-bold font-display text-white">タカシ (携帯回線)</h2>
            <p className="text-xs text-slate-400">別ルートで本人の直接通話を確認します</p>
          </div>
          <button
            id="phone-call-trigger"
            onClick={startCall}
            className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 hover:text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span className="font-display">タカシに電話をかける</span>
          </button>
        </div>
      )}

      {phoneStatus === 'calling' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-slate-900/40 flex items-center justify-center border border-slate-800/60 relative">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/50 animate-ping opacity-75" />
            <User className="w-10 h-10 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-center space-y-1.5">
            <h2 className="text-sm font-bold text-white font-display">タカシに発信中...</h2>
            <p className="text-xs text-slate-400 font-mono">CONNECTING TO SAFE LINE...</p>
          </div>
          <button
            id="phone-cancel-btn"
            onClick={endCall}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs px-6 py-3 rounded-full shadow-md transition-colors cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="font-display">キャンセル</span>
          </button>
        </div>
      )}

      {phoneStatus === 'connected' && (
        <div className="flex-1 flex flex-col items-center justify-between py-4">
          <div className="text-center space-y-1.5">
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-display">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span className="font-medium tracking-wide">通話中 - 暗号化安全回線</span>
            </div>
            <h2 className="text-sm font-bold text-white font-display">タカシ</h2>
            <p className="text-xs text-slate-400 font-mono tracking-widest">{formatTime(callTimer)}</p>
          </div>

          {/* Dialogue text */}
          <div className="w-full max-w-sm bg-slate-900/40 border border-slate-850 p-5 rounded-2xl text-center space-y-4 shadow-xl">
            <p className="text-xs text-slate-200 leading-relaxed min-h-[48px] font-sans">
              {dialogue[dialogueIndex].text}
            </p>
            <button
              id="phone-next-btn"
              onClick={handleNextDialogue}
              className="bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white text-[11px] font-semibold font-display px-4 py-2 rounded-xl border border-slate-850 transition-all cursor-pointer"
            >
              {dialogueIndex === dialogue.length - 1 ? '通話を切る' : '次へ'}
            </button>
          </div>

          <button
            id="phone-hangup-btn"
            onClick={endCall}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="font-display">通話を終了する</span>
          </button>
        </div>
      )}

      {phoneStatus === 'ended' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-slate-900/40 flex items-center justify-center border border-slate-800/60">
            <PhoneOff className="w-10 h-10 text-rose-500" />
          </div>
          <div className="text-center space-y-1.5">
            <h2 className="text-sm font-bold text-white font-display">通話終了</h2>
            <p className="text-xs text-slate-400 px-6 leading-relaxed">
              {loop === 1 
                ? 'おかけになった電話番号は、電波の届かない場所にあるか、電源が入っていないためかかりません。(1周目はタカシに直接確認できません。フィッシング詐欺リンクを踏まずに解決する手段をデスクトップ上で探しましょう。)'
                : 'タカシとの通話が終了しました。得られた情報（二段階認証の重要性、不審アカウントの通報）を元に、冷静に対処してください。'
              }
            </p>
          </div>
          <button
            id="phone-retry-btn"
            onClick={startCall}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-800 transition-colors cursor-pointer"
          >
            もう一度かける
          </button>
        </div>
      )}

      {/* Literacy Tip Footer */}
      <div className="bg-slate-950/60 border border-slate-900 p-4 rounded-2xl flex items-start gap-2.5 text-[10px] text-slate-400">
        <HelpCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-slate-300 font-display">💡 ACCOUNT COMPROMISE COUNTERMEASURES:</span>
          友人から不審なメッセージ（「今すぐログインして確認して」「緊急事態！」など）や、お金の無心、怪しいリンクが送られてきた場合、メッセージ上だけで解決しようとせず、電話や対面、他の信頼できる手段で直接本人に事実確認を行うことが、詐欺を未然に防ぐ極めて強力な対策です。
        </p>
      </div>
    </div>
  );
}
