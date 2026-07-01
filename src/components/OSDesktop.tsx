import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Globe, Shield, Phone, AlertTriangle, 
  Settings, RefreshCw, X, Square, Minus, Volume2, ShieldCheck, HelpCircle
} from 'lucide-react';
import { GameState, GameStage, LoopCount, Message, OSWindow } from '../types';

import ChatApp from './ChatApp';
import WebBrowser from './WebBrowser';
import SecureCore from './SecureCore';
import PhoneHelper from './PhoneHelper';

interface OSDesktopProps {
  loop: LoopCount;
  onNextStage: (stage: GameStage) => void;
  onTriggerHacking: () => void;
  onTriggerClear: () => void;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export default function OSDesktop({
  loop,
  onNextStage,
  onTriggerHacking,
  onTriggerClear,
  gameState,
  setGameState,
}: OSDesktopProps) {
  // Desktop windows list state
  const [windows, setWindows] = useState<OSWindow[]>([
    { id: 'chat', title: 'ChatConnect', isOpen: true, isMinimized: false, isMaximized: false, zIndex: 10, width: 440, height: 500, x: 50, y: 50 },
    { id: 'browser', title: 'Lumina Browser', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 5, width: 700, height: 520, x: 220, y: 80 },
    { id: 'securecore', title: 'SecureCore Security Center', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 5, width: 500, height: 460, x: 120, y: 120 },
    { id: 'phone', title: 'Lumina Phone Helper', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 5, width: 380, height: 480, x: 420, y: 150 },
  ]);

  const [notifications, setNotifications] = useState<{ id: string; title: string; text: string }[]>([]);
  const [browserUrl, setBrowserUrl] = useState('http://bbs-shachou-news.net/topic/view/');
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [currentTime, setCurrentTime] = useState('');
  
  // Dragging states
  const [draggedWindowId, setDraggedWindowId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Update Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Set up initial notification or tutorial popups
  useEffect(() => {
    // Initial notifications based on Loop
    const notifyTimer = setTimeout(() => {
      if (loop === 1) {
        addNotification(
          'ChatConnect',
          'タカシから新しいメッセージがあります。「ちょっとこれ見て！ネットの変な掲示板にお前の名前と写真……」'
        );
      } else {
        addNotification(
          'SecureCore システムスキャン',
          '警告：前回のハッキングログを分析しました。二段階認証（2FA）を有効にして、フィッシングサイトからの乗っ取りを防御してください。'
        );
        addNotification(
          '携帯電話 [PhoneHelper]',
          '別ルートによる確認：通話機能が復旧しました。犯人と疑わしいアカウントがチャットしている場合、直接電話で本人に確認しましょう。'
        );
      }
    }, 1500);

    return () => clearTimeout(notifyTimer);
  }, [loop]);

  const addNotification = (title: string, text: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setNotifications((prev) => [...prev, { id, title, text }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 6000);
  };

  // Focus a window (bring to front)
  const focusWindow = (id: string) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setWindows((prev) =>
      prev.map((win) => {
        if (win.id === id) {
          return { ...win, isMinimized: false, zIndex: nextZ };
        }
        return win;
      })
    );
  };

  // Toggle Window Open/Close
  const toggleWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((win) => {
        if (win.id === id) {
          const isOpen = !win.isOpen;
          if (isOpen) {
            focusWindow(id);
          }
          return { ...win, isOpen };
        }
        return win;
      })
    );
  };

  // Set Window Open explicitly
  const openWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((win) => {
        if (win.id === id) {
          return { ...win, isOpen: true, isMinimized: false };
        }
        return win;
      })
    );
    focusWindow(id);
  };

  // Minimize Window
  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, isMinimized: true } : win))
    );
  };

  // Maximize Window Toggle
  const maximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, isMaximized: !win.isMaximized } : win))
    );
  };

  // Handle Drag Start
  const handleDragStart = (id: string, e: React.MouseEvent) => {
    // Avoid dragging when clicking control buttons
    const target = e.target as HTMLElement;
    if (target.closest('.window-controls')) return;

    focusWindow(id);
    const win = windows.find((w) => w.id === id);
    if (win && !win.isMaximized) {
      setDraggedWindowId(id);
      setDragOffset({
        x: e.clientX - win.x,
        y: e.clientY - win.y,
      });
    }
  };

  // Handle Drag Movement
  const handleDragMove = (e: React.MouseEvent) => {
    if (!draggedWindowId) return;

    const newX = Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y));

    setWindows((prev) =>
      prev.map((win) =>
        win.id === draggedWindowId ? { ...win, x: newX, y: newY } : win
      )
    );
  };

  // Handle Drag End
  const handleDragEnd = () => {
    setDraggedWindowId(null);
  };

  // Chat Actions
  const handleSendMessage = (text: string) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'player',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setGameState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));
  };

  const handleSelectOption = (optionText: string, nextStep: number) => {
    handleSendMessage(optionText);

    // Friend replies after brief delay
    setTimeout(() => {
      let replyText = '';
      let isUrl = false;
      let url = '';

      if (loop === 1) {
        if (nextStep === 1) {
          replyText = 'マジで載ってるんだって。ほらこれ！ここから確認できる。早くしないとネット中に拡散されるぞ！';
          isUrl = true;
          url = 'http://bbs-shachou-news.net/topic/view/';
        } else if (nextStep === 2) {
          replyText = 'スパムじゃないって！本当に心配して教えてやってるのに信じないのかよ？これ見てマジでヤバいから！';
          isUrl = true;
          url = 'http://bbs-shachou-news.net/topic/view/';
        } else if (nextStep === 3) {
          replyText = '口調なんてどうでもいいだろ！とにかく掲示板に晒されてんのは本当なんだって！早く見ろよ！';
          isUrl = true;
          url = 'http://bbs-shachou-news.net/topic/view/';
        }
      }

      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'friend',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUrl,
        url,
      };

      setGameState((prev) => ({
        ...prev,
        chatStep: nextStep,
        messages: [...prev.messages, replyMsg],
      }));

      // Play message received sound
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(520, audioCtx.currentTime);
        osc.frequency.setValueAtTime(660, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } catch (e) {}

      addNotification('ChatConnect', `タカシから新しいメッセージ: "${replyText.substring(0, 20)}..."`);
    }, 1200);
  };

  const handleStartPhoneCall = () => {
    openWindow('phone');
    setGameState((prev) => ({
      ...prev,
      isPhoneCalling: true,
      phoneCallStatus: 'calling',
    }));
  };

  const handleReportPhishing = () => {
    // Flag reported in chat
    setGameState((prev) => ({
      ...prev,
      chatStep: 999, // solved
      isPhishingReported: true,
    }));

    addNotification('SecureCore', '脅威報告をプラットフォームへ送信しました。アカウント保護の手続きを開始します。');

    // Trigger clear after brief final delay
    setTimeout(() => {
      onTriggerClear();
    }, 3000);
  };

  const handleOpenBrowser = (url: string) => {
    setBrowserUrl(url);
    openWindow('browser');
  };

  // Phishing site submit login
  const handleLoginSubmitted = (password: string) => {
    setGameState((prev) => ({
      ...prev,
      hasInputPassword: true,
    }));
    // Trigger ransomware hack sequence
    onTriggerHacking();
  };

  const handleToggleTwoFactor = (enabled: boolean) => {
    setGameState((prev) => ({
      ...prev,
      isTwoFactorEnabled: enabled,
    }));
    addNotification(
      'SecureCore Security Update',
      enabled 
        ? '✅ 二段階認証（2FA）を有効化しました。不審なログイン要求は今後すべて完全に自動ブロックされます。' 
        : '⚠️ 二段階認証を無効にしました。アカウント保護レベルが低下しています。'
    );
  };

  return (
    <div 
      id="os-desktop" 
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      className={`fixed inset-0 select-none overflow-hidden flex flex-col justify-between ${
        loop === 1 
          ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" 
          : "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black"
      }`}
    >
      {/* 1. Desktop Wallpaper / Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(14,165,233,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(14,165,233,0.05)_1px,_transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Subtle loop indicator on background */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-50 z-0">
        <h1 className="text-xs font-display tracking-[0.4em] text-slate-500 font-bold uppercase">
          LUMINA OS v2.0 - {loop === 1 ? 'PROTOTYPE WORKSPACE' : 'SECURE SANDBOX ENVIRONMENT'}
        </h1>
        {loop === 2 && (
          <p className="text-[9px] text-sky-400 font-mono tracking-widest mt-1.5 animate-pulse">
            🛡️ THREAT COGNITIVE LEARNING SYSTEM IS RUNNING. RESOLVE SYSTEM INFILTRATIONS.
          </p>
        )}
      </div>

      {/* 2. Desktop Icons */}
      <div className="flex-1 p-8 grid grid-flow-col auto-cols-max grid-rows-6 gap-6 items-start justify-start z-0 relative">
        {/* Chat App Icon */}
        <button
          id="icon-chat"
          onClick={() => toggleWindow('chat')}
          className="flex flex-col items-center gap-2 p-2.5 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all duration-200 w-22 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-13 h-13 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center justify-center text-sky-400 shadow-[0_4px_12px_rgba(14,165,233,0.1)] group-hover:scale-105 group-hover:border-sky-400/40 group-hover:bg-sky-500/20 transition-all duration-300">
              <MessageSquare className="w-6 h-6" />
            </div>
            {loop === 1 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-bounce shadow-lg">
                1
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-300 font-medium tracking-wide truncate w-full text-center drop-shadow-md font-display">
            ChatConnect
          </span>
        </button>

        {/* Browser Icon */}
        <button
          id="icon-browser"
          onClick={() => toggleWindow('browser')}
          className="flex flex-col items-center gap-2 p-2.5 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all duration-200 w-22 cursor-pointer group"
        >
          <div className="w-13 h-13 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 shadow-[0_4px_12px_rgba(99,102,241,0.1)] group-hover:scale-105 group-hover:border-indigo-400/40 group-hover:bg-indigo-500/20 transition-all duration-300">
            <Globe className="w-6 h-6" />
          </div>
          <span className="text-[11px] text-slate-300 font-medium tracking-wide truncate w-full text-center drop-shadow-md font-display">
            WebBrowser
          </span>
        </button>

        {/* SecureCore Icon */}
        <button
          id="icon-securecore"
          onClick={() => toggleWindow('securecore')}
          className="flex flex-col items-center gap-2 p-2.5 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all duration-200 w-22 cursor-pointer group"
        >
          <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg border transition-all duration-300 group-hover:scale-105 ${
            gameState.isTwoFactorEnabled 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-400/40 shadow-[0_4px_12px_rgba(16,185,129,0.1)]' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse group-hover:bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
          }`}>
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-[11px] text-slate-300 font-medium tracking-wide truncate w-full text-center drop-shadow-md font-display">
            SecureCore
          </span>
        </button>

        {/* Phone Icon */}
        <button
          id="icon-phone"
          onClick={() => toggleWindow('phone')}
          className="flex flex-col items-center gap-2 p-2.5 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all duration-200 w-22 cursor-pointer group"
        >
          <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg border transition-all duration-300 group-hover:scale-105 ${
            loop === 2 
              ? 'bg-sky-500/10 border-sky-500/30 text-sky-400 animate-pulse group-hover:bg-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.25)]' 
              : 'bg-slate-800/40 border-slate-700/20 text-slate-500'
          }`}>
            <Phone className="w-6 h-6" />
          </div>
          <span className="text-[11px] text-slate-300 font-medium tracking-wide truncate w-full text-center drop-shadow-md font-display">
            PhoneHelper
          </span>
        </button>
      </div>

      {/* 3. Drag-and-Drop Active OS Windows */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {windows.map((win) => {
          if (!win.isOpen || win.isMinimized) return null;

          return (
            <div
              key={win.id}
              className={`absolute flex flex-col pointer-events-auto bg-slate-950/85 backdrop-blur-xl border border-slate-800/80 shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden transition-all duration-75 ${
                win.isMaximized ? 'inset-0 !w-full !h-full !transform-none !m-0 rounded-none border-none' : ''
              }`}
              style={{
                width: win.isMaximized ? '100%' : `${win.width}px`,
                height: win.isMaximized ? '100%' : `${win.height}px`,
                left: win.isMaximized ? 0 : `${win.x}px`,
                top: win.isMaximized ? 0 : `${win.y}px`,
                zIndex: win.zIndex,
              }}
              onClick={() => focusWindow(win.id)}
            >
              {/* Window Title Bar */}
              <div
                id={`window-titlebar-${win.id}`}
                onMouseDown={(e) => handleDragStart(win.id, e)}
                className={`px-4 py-3 flex items-center justify-between border-b border-slate-900/60 text-xs font-semibold tracking-wide cursor-move ${
                  win.id === 'securecore' ? 'bg-slate-950/90 text-slate-100' : 'bg-slate-950/80 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 font-display">
                  {win.id === 'chat' && <MessageSquare className="w-4 h-4 text-sky-400" />}
                  {win.id === 'browser' && <Globe className="w-4 h-4 text-indigo-400" />}
                  {win.id === 'securecore' && <Shield className="w-4 h-4 text-emerald-400" />}
                  {win.id === 'phone' && <Phone className="w-4 h-4 text-sky-400" />}
                  <span>{win.title}</span>
                </div>

                {/* Window System Buttons */}
                <div className="flex items-center gap-2 window-controls">
                  <button
                    onClick={() => minimizeWindow(win.id)}
                    className="p-1 hover:bg-white/5 rounded transition-colors text-slate-500 hover:text-slate-300"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => maximizeWindow(win.id)}
                    className="p-1 hover:bg-white/5 rounded transition-colors text-slate-500 hover:text-slate-300"
                  >
                    <Square className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => toggleWindow(win.id)}
                    className="p-1.5 hover:bg-rose-500/20 hover:text-rose-400 rounded-lg transition-colors text-slate-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Window Content Container */}
              <div className="flex-1 overflow-hidden relative">
                {win.id === 'chat' && (
                  <ChatApp
                    loop={loop}
                    chatStep={gameState.chatStep}
                    messages={gameState.messages}
                    isTwoFactorEnabled={gameState.isTwoFactorEnabled || false}
                    onSendMessage={handleSendMessage}
                    onSelectOption={handleSelectOption}
                    onStartPhoneCall={handleStartPhoneCall}
                    onReportPhishing={handleReportPhishing}
                    onOpenBrowser={handleOpenBrowser}
                  />
                )}
                {win.id === 'browser' && (
                  <WebBrowser
                    loop={loop}
                    initialUrl={browserUrl}
                    isTwoFactorEnabled={gameState.isTwoFactorEnabled || false}
                    onLoginSubmitted={handleLoginSubmitted}
                    onReportPhishing={handleReportPhishing}
                  />
                )}
                {win.id === 'securecore' && (
                  <SecureCore
                    loop={loop}
                    isTwoFactorEnabled={gameState.isTwoFactorEnabled || false}
                    onToggleTwoFactor={handleToggleTwoFactor}
                    alertCount={gameState.alertCount}
                    isPhishingReported={gameState.isPhishingReported || false}
                  />
                )}
                {win.id === 'phone' && (
                  <PhoneHelper
                    loop={loop}
                    phoneStatus={gameState.phoneCallStatus || 'idle'}
                    onCallStatusChange={(status) => {
                      setGameState((prev) => ({
                        ...prev,
                        phoneCallStatus: status,
                      }));
                    }}
                    onConfirmThreatSolved={() => {
                      setGameState((prev) => ({
                        ...prev,
                        chatStep: 999, // solved branch triggered!
                      }));
                      addNotification('ChatConnect', '通報可能：タカシ本人との安全が確認されました。チャットの「通報・ブロック」が利用可能です。');
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Desktop Notifications (Toasts) */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none max-w-sm">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border-l-2 border-sky-500 text-white rounded-r-xl p-4 shadow-2xl flex items-start gap-3 animate-slide-in leading-relaxed border border-slate-900"
          >
            <div className="p-1.5 bg-sky-950/40 rounded-lg text-sky-400 border border-sky-850 shrink-0">
              <ShieldCheck className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-white font-display">{notif.title}</p>
              <p className="text-[11px] text-slate-300">{notif.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Bottom OS Taskbar */}
      <div className="h-13 bg-slate-950/80 backdrop-blur-md border-t border-slate-900/50 px-4 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-3">
          {/* Start Menu Button (Info Box popup in real systems) */}
          <button 
            id="taskbar-start-btn"
            onClick={() => {
              addNotification(
                'Lumina OS ポータル',
                'このシステムは怪しいフィッシング詐欺から身を守るセキュリティ・トレーニングシミュレータです。怪しいと感じた段階で2FAを有効にしたり、別ルートで電話をかけて本人に確認するなどの防衛策を行いましょう。'
              );
            }}
            className="h-8 px-3.5 rounded-lg bg-sky-950/40 border border-sky-500/20 text-[10px] font-bold tracking-widest text-sky-400 hover:bg-sky-500 hover:text-white transition-all flex items-center gap-2 active:scale-95 cursor-pointer font-display"
          >
            <Settings className="w-3.5 h-3.5 animate-spin-slow text-sky-400" />
            <span>START</span>
          </button>

          {/* Quick taskbar icons */}
          <div className="h-5 w-px bg-slate-800" />

          {windows.map((win) => {
            const isWindowActive = win.isOpen && !win.isMinimized;
            return (
              <button
                key={win.id}
                onClick={() => {
                  if (win.isOpen && !win.isMinimized) {
                    minimizeWindow(win.id);
                  } else {
                    openWindow(win.id);
                  }
                }}
                className={`h-8 px-3 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isWindowActive 
                    ? 'bg-slate-800/80 text-white border border-slate-700/60 shadow-inner' 
                    : win.isOpen 
                    ? 'bg-slate-900/30 text-slate-400 border border-transparent hover:bg-slate-800/40' 
                    : 'hidden'
                }`}
              >
                {win.id === 'chat' && <MessageSquare className="w-3.5 h-3.5 text-sky-400" />}
                {win.id === 'browser' && <Globe className="w-3.5 h-3.5 text-indigo-400" />}
                {win.id === 'securecore' && <Shield className="w-3.5 h-3.5 text-emerald-400" />}
                {win.id === 'phone' && <Phone className="w-3.5 h-3.5 text-sky-400" />}
                <span className="hidden sm:inline text-[10px] font-display font-medium">{win.title}</span>
              </button>
            );
          })}
        </div>

        {/* Right Taskbar clock & system tray */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2 bg-slate-900/40 border border-slate-800/60 px-3 py-1 rounded-lg text-[10px]">
            <ShieldCheck className={`w-3.5 h-3.5 ${gameState.isTwoFactorEnabled ? 'text-emerald-400 animate-pulse' : 'text-rose-500'}`} />
            <span className="font-display font-semibold text-slate-400 tracking-wide">
              SYSTEM: {gameState.isTwoFactorEnabled ? 'SECURE' : 'VULNERABLE'}
            </span>
          </div>
          <span className="font-display text-slate-300 font-medium">{currentTime}</span>
        </div>
      </div>
    </div>
  );
}
