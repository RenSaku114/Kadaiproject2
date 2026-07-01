import React, { useState, useEffect } from 'react';
import { Shield, Play, HelpCircle, Terminal, Cpu } from 'lucide-react';
import { GameState, GameStage, LoopCount, Message } from './types';

import OSBoot from './components/OSBoot';
import OSDesktop from './components/OSDesktop';
import HackingSequence from './components/HackingSequence';
import GameClear from './components/GameClear';

const INITIAL_MESSAGES_LOOP_1: Message[] = [
  {
    id: 'init-1',
    sender: 'friend',
    text: 'ねえ、ちょっとこれ見て！ネットの変な掲示板にお前の名前と写真載ってるんだけど……マジで心配なんだけど、これ本物？',
    timestamp: '02:15',
  },
  {
    id: 'init-2',
    sender: 'friend',
    text: 'http://bbs-shachou-news.net/topic/view/',
    timestamp: '02:15',
    isUrl: true,
    url: 'http://bbs-shachou-news.net/topic/view/',
  }
];

const INITIAL_MESSAGES_LOOP_2: Message[] = [
  {
    id: 'init-1',
    sender: 'friend',
    text: 'ねえ、ちょっとこれ見て！ネットの変な掲示板にお前の名前と写真載ってるんだけど……マジで心配なんだけど、これ本物？',
    timestamp: '02:15',
  },
  {
    id: 'init-2',
    sender: 'friend',
    text: 'http://bbs-shachou-news.net/topic/view/',
    timestamp: '02:15',
    isUrl: true,
    url: 'http://bbs-shachou-news.net/topic/view/',
  }
];

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    loop: 1,
    stage: 'boot',
    glitchLevel: 0,
    activeWindows: ['chat'],
    messages: INITIAL_MESSAGES_LOOP_1,
    chatStep: 0,
    alertCount: 0,
    isTwoFactorEnabled: false,
    isPhishingReported: false,
  });

  const handleStartGame = () => {
    setIsPlaying(true);
    setGameState({
      loop: 1,
      stage: 'boot',
      glitchLevel: 0,
      activeWindows: ['chat'],
      messages: INITIAL_MESSAGES_LOOP_1,
      chatStep: 0,
      alertCount: 0,
      isTwoFactorEnabled: false,
      isPhishingReported: false,
    });
  };

  const handleBootComplete = () => {
    setGameState((prev) => ({ ...prev, stage: 'desktop' }));
  };

  const handleTriggerHacking = () => {
    setGameState((prev) => ({ ...prev, stage: 'hacking_sequence' }));
  };

  const handleHackingSequenceComplete = () => {
    // Increment to loop 2 and reboot
    setGameState({
      loop: 2,
      stage: 'boot',
      glitchLevel: 10,
      activeWindows: ['chat'],
      messages: INITIAL_MESSAGES_LOOP_2,
      chatStep: 0,
      alertCount: 1,
      isTwoFactorEnabled: false,
      isPhishingReported: false,
    });
  };

  const handleTriggerClear = () => {
    setGameState((prev) => ({ ...prev, stage: 'clear_screen' }));
  };

  const handleRestartGame = () => {
    setIsPlaying(false);
  };

  return (
    <main id="app-container" className="w-full h-screen bg-slate-950 text-slate-100 relative font-sans overflow-hidden">
      {!isPlaying ? (
        /* Title Launcher Screen */
        <div id="launcher-title-screen" className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black select-none">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(rgba(14,165,233,0.1)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(14,165,233,0.1)_1px,_transparent_1px)] bg-[size:32px_32px]" />
          
          <div className="max-w-xl w-full text-center space-y-10 z-10">
            {/* Logo Badge */}
            <div className="relative inline-flex items-center justify-center p-5 bg-sky-950/40 border border-sky-500/30 rounded-3xl text-sky-400 shadow-[0_0_25px_rgba(14,165,233,0.25)]">
              <Shield className="w-14 h-14 animate-pulse" />
            </div>

            {/* Game Title */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-display font-light tracking-[0.25em] text-white">
                SECURITY ESCAPE <span className="text-sky-400 font-mono font-medium">OS</span>
              </h1>
              <p className="text-[10px] tracking-[0.45em] text-slate-400 font-mono uppercase">
                Interactive Cyber Threat Simulation
              </p>
            </div>

            {/* Hook text Description */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl text-left space-y-3.5 text-xs text-slate-300 leading-relaxed shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
              <p className="font-semibold text-sky-400 flex items-center gap-2 tracking-wider font-display uppercase">
                <Terminal className="w-4 h-4 text-sky-400" />
                <span>[MISSION SYSTEM BRIEFING]</span>
              </p>
              <p>
                あなたは普段通りの一日を過ごしているPCユーザーです。ある深夜、仲の良い友人から不穏なURLとメッセージが届きます。
              </p>
              <p className="text-rose-400 font-bold bg-rose-950/30 border border-rose-900/50 p-2.5 rounded-lg font-mono">
                「ねえ、ネットの変な掲示板にお前の名前と写真が載ってるんだけど……これ本物？」
              </p>

            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                id="start-game-btn"
                onClick={handleStartGame}
                className="w-full sm:w-auto bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded-full shadow-[0_0_25px_rgba(14,165,233,0.35)] hover:shadow-[0_0_35px_rgba(14,165,233,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>シミュレータを起動する</span>
              </button>
            </div>

            {/* Literacy Badge */}
            <div className="flex items-center justify-center gap-6 pt-6 border-t border-slate-900/80 text-[10px] text-slate-500 font-mono tracking-wider">
              <span>🛡️ フィッシング詐欺対策</span>
              <span>🔑 二段階認証(2FA)</span>
              <span>📞 別ルートでの本人確認</span>
            </div>
          </div>
        </div>
      ) : (
        /* Active Game Stages switching */
        <>
          {gameState.stage === 'boot' && (
            <OSBoot 
              loop={gameState.loop} 
              onBootComplete={handleBootComplete} 
            />
          )}

          {gameState.stage === 'desktop' && (
            <OSDesktop
              loop={gameState.loop}
              gameState={gameState}
              setGameState={setGameState}
              onNextStage={(stg) => setGameState((prev) => ({ ...prev, stage: stg }))}
              onTriggerHacking={handleTriggerHacking}
              onTriggerClear={handleTriggerClear}
            />
          )}

          {gameState.stage === 'hacking_sequence' && (
            <HackingSequence 
              onSequenceComplete={handleHackingSequenceComplete} 
            />
          )}

          {gameState.stage === 'clear_screen' && (
            <GameClear 
              onRestartGame={handleRestartGame} 
            />
          )}
        </>
      )}
    </main>
  );
}
