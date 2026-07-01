import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, ShieldAlert, Cpu, Eye, Lock, RefreshCw } from 'lucide-react';

interface HackingSequenceProps {
  onSequenceComplete: () => void;
}

interface AlertPopup {
  id: number;
  x: number;
  y: number;
  title: string;
  text: string;
}

export default function HackingSequence({ onSequenceComplete }: HackingSequenceProps) {
  const [phase, setPhase] = useState<'text_typing' | 'popups_spawning' | 'webcam_hack' | 'ransomware_screen' | 'bsod' | 'monologue'>('text_typing');
  
  // Monologue (後悔の言葉) states
  const [monologueIndex, setMonologueIndex] = useState(0);
  const [monologueText, setMonologueText] = useState('');
  const monologueScript = [
    'どうして、こうなったんだ？',
    '自分の軽はずみな行動で、こんなことになってしまったのか…？',
    'もし、やりなおせるなら。',
    '……'
  ];

  // Text typing states
  const [typingMessages, setTypingMessages] = useState<string[]>([]);
  const [currentTypingText, setCurrentTypingText] = useState('');
  const typingScript = [
    'アカウント乗っ取り完了。パスワードありがとね。',
    '今、ゲームだと思って油断した？',
    'キーボードを叩くその手、止まってるよ……',
    '見ているぞ'
  ];
  const [scriptIndex, setScriptIndex] = useState(0);

  // Popups spawning states
  const [popups, setPopups] = useState<AlertPopup[]>([]);
  
  // Ransomware countdown
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59, ms: 99 });

  // Web camera Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Audio mock references: We can play subtle synthesize beeps using Web Audio API!
  // This is a premium game creator skill: using programmatic sound synthesis without needing static audio files!
  const playBeep = (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle' = 'sine', duration = 0.1) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = type;
      oscillator.frequency.value = freq;
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignored if browser blocks audio autoplay
    }
  };

  // Phase 1: Text Auto Typing Line by Line
  useEffect(() => {
    if (phase !== 'text_typing') return;

    if (scriptIndex < typingScript.length) {
      const fullText = typingScript[scriptIndex];
      let charIndex = 0;
      setCurrentTypingText('');

      const typeInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          charIndex++;
          const currentLength = charIndex;
          setCurrentTypingText(fullText.slice(0, currentLength));
          // Play tiny typing click sound
          if (charIndex % 2 === 0) playBeep(600, 'triangle', 0.03);
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            setTypingMessages((prev) => [...prev, fullText]);
            setScriptIndex((prev) => prev + 1);
          }, 1200);
        }
      }, 80);

      return () => clearInterval(typeInterval);
    } else {
      // Finished typing, proceed to popups phase
      setTimeout(() => {
        setPhase('popups_spawning');
        playBeep(220, 'sawtooth', 0.5);
      }, 1000);
    }
  }, [scriptIndex, phase]);

  // Phase 2: Popups Spawning
  useEffect(() => {
    if (phase !== 'popups_spawning') return;

    const popupTemplates = [
      { title: 'CRITICAL WARNING', text: 'WEB CAM INITIATED: REMOTE FEED ENABLED!' },
      { title: 'SECURITY SYSTEM FAILURE', text: 'Trojan.Win32.Generic has infected Kernel.dll' },
      { title: 'SYSTEM OUT OF CONTROL', text: 'All input devices redirected to dark-web proxy' },
      { title: 'ACCESS DENIED', text: 'Administrator password modified by remote host' },
      { title: 'VIRUS DETECTED!', text: 'Click here to download antivirus immediately' },
      { title: 'IP LEAKED', text: 'IP Address 192.168.1.45 streamed to public logs' },
    ];

    let count = 0;
    const spawnInterval = setInterval(() => {
      if (count < 12) {
        const template = popupTemplates[count % popupTemplates.length];
        const newPopup: AlertPopup = {
          id: count,
          x: 10 + Math.random() * 60, // percentage from left
          y: 10 + Math.random() * 50, // percentage from top
          title: template.title,
          text: template.text,
        };
        setPopups((prev) => [...prev, newPopup]);
        playBeep(880 + count * 50, 'sawtooth', 0.08);
        count++;
      } else {
        clearInterval(spawnInterval);
        setTimeout(() => {
          setPhase('webcam_hack');
          playBeep(120, 'sawtooth', 0.8);
        }, 1500);
      }
    }, 300);

    return () => clearInterval(spawnInterval);
  }, [phase]);

  // Phase 3: Webcam Hack Canvas Animation (Uncanny visual loop)
  useEffect(() => {
    if (phase !== 'webcam_hack') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let shadowX = 100;
    let shadowDir = 1;
    let blinkTimer = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Draw background - dark nightvision green
      ctx.fillStyle = '#021204';
      ctx.fillRect(0, 0, width, height);

      // Generate CCTV scanlines and noise
      for (let y = 0; y < height; y += 4) {
        ctx.fillStyle = 'rgba(0, 100, 0, 0.1)';
        ctx.fillRect(0, y, width, 2);
      }

      // Add dynamic noise pixels
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() > 0.95) {
          const noise = Math.random() * 40;
          data[i] = Math.max(0, data[i] - noise); // R
          data[i+1] = Math.min(255, data[i+1] + noise); // G
          data[i+2] = Math.max(0, data[i+2] - noise); // B
        }
      }
      ctx.putImageData(imageData, 0, 0);

      // Draw Room Silhouette (Mock webcam of player's room)
      ctx.strokeStyle = '#053008';
      ctx.lineWidth = 3;
      // Head and shoulder outline in background
      ctx.beginPath();
      ctx.arc(width / 2, height / 1.7, 35, 0, Math.PI * 2); // Head
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(width / 2, height, 75, 45, 0, Math.PI, 0); // Shoulders
      ctx.stroke();

      // Slidely moving ghost/hacker shadow in the background
      shadowX += 0.4 * shadowDir;
      if (shadowX > width - 50 || shadowX < 50) {
        shadowDir *= -1;
      }
      // draw unshaped shadowy creature silhouette behind the player
      ctx.fillStyle = 'rgba(1, 10, 1, 0.8)';
      ctx.beginPath();
      ctx.arc(shadowX, height / 2.2, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(shadowX, height / 1.6, 40, 25, 0, Math.PI, 0);
      ctx.fill();

      // Draw glowing white eyes for the background entity
      blinkTimer++;
      if (blinkTimer % 200 > 10) { // Keep them open, blink occasionally
        ctx.fillStyle = '#ff3333';
        ctx.beginPath();
        ctx.arc(shadowX - 6, height / 2.2, 2, 0, Math.PI * 2);
        ctx.arc(shadowX + 6, height / 2.2, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Camera interface text overlay
      ctx.font = '10px Courier New';
      ctx.fillStyle = '#00ff33';
      ctx.fillText('● REMOTE WEBCAM_FEED_01 [REC]', 15, 25);
      
      const now = new Date();
      const timeStr = now.toLocaleTimeString() + '.' + Math.floor(Math.random() * 100).toString().padStart(2, '0');
      ctx.fillText(`TIME: ${timeStr}`, 15, 40);
      ctx.fillText(`IP: 182.22.95.${Math.floor(Math.random() * 255)}`, 15, 55);
      ctx.fillText('SIGNAL: ENCRYPTED PROXY', 15, 70);

      // Horror Glitch overlay text
      if (Math.random() > 0.92) {
        ctx.font = 'bold 32px Courier New';
        ctx.fillStyle = '#ff1111';
        ctx.fillText('I SEE YOU', width / 2 - 80, height / 2);
        playBeep(100, 'sawtooth', 0.1);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    // Webcam sequence length before ransomware
    const webcamTimer = setTimeout(() => {
      cancelAnimationFrame(animationId);
      setPhase('ransomware_screen');
      playBeep(80, 'square', 1.0);
    }, 6000);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(webcamTimer);
    };
  }, [phase]);

  // Phase 4: Ransomware Countdown
  useEffect(() => {
    if (phase !== 'ransomware_screen') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s, ms } = prev;
        ms -= 13;
        if (ms <= 0) {
          ms = 99;
          s--;
          if (s <= 0) {
            s = 59;
            m--;
            if (m <= 0) {
              m = 59;
              h--;
            }
          }
        }
        return { h, m, s, ms };
      });
    }, 10);

    // Transition to BSOD after a short shock
    const bSodTimer = setTimeout(() => {
      clearInterval(timer);
      setPhase('bsod');
      playBeep(40, 'sine', 1.5);
    }, 6000);

    return () => {
      clearInterval(timer);
      clearTimeout(bSodTimer);
    };
  }, [phase]);

  // Phase 5: BSOD & Reboot
  useEffect(() => {
    if (phase !== 'bsod') return;

    // Transition to monologue before restarting loop
    const completeTimer = setTimeout(() => {
      setPhase('monologue');
    }, 5000);

    return () => clearTimeout(completeTimer);
  }, [phase]);

  // Phase 6: Monologue (後悔の言葉)
  useEffect(() => {
    if (phase !== 'monologue') return;

    if (monologueIndex < monologueScript.length) {
      const fullText = monologueScript[monologueIndex];
      let charIndex = 0;
      setMonologueText('');

      const typeInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          charIndex++;
          const currentLength = charIndex;
          setMonologueText(fullText.slice(0, currentLength));
          if (charIndex % 3 === 0) playBeep(180, 'sine', 0.04);
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            setMonologueIndex((prev) => prev + 1);
          }, 2500);
        }
      }, 120);

      return () => clearInterval(typeInterval);
    } else {
      const completeTimer = setTimeout(() => {
        onSequenceComplete();
      }, 2000);
      return () => clearTimeout(completeTimer);
    }
  }, [monologueIndex, phase, onSequenceComplete]);

  return (
    <div id="hacking-overlay" className="fixed inset-0 bg-black z-50 overflow-hidden font-mono text-white select-none">
      
      {/* 1. Chat Autotyping Phase */}
      {phase === 'text_typing' && (
        <div className="h-full flex items-center justify-center bg-zinc-950 p-6">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 text-red-500 font-bold">
              <Eye className="w-5 h-5 animate-pulse" />
              <span>ChatConnect [リモート制御侵入]</span>
            </div>
            
            <div className="h-64 overflow-y-auto space-y-3 p-3 bg-zinc-950 rounded-xl border border-zinc-850 flex flex-col justify-end">
              {typingMessages.map((msg, i) => (
                <div key={i} className="text-sm text-red-400 bg-red-950/20 border border-red-900/30 px-3 py-2 rounded-xl self-start max-w-[90%]">
                  {msg}
                </div>
              ))}
              {currentTypingText && (
                <div className="text-sm text-red-500 bg-red-950/30 border border-red-800 px-3 py-2 rounded-xl self-start max-w-[90%] animate-pulse">
                  {currentTypingText}
                  <span className="inline-block w-2 h-4 bg-red-500 ml-1 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Popups Spawning Phase */}
      {phase === 'popups_spawning' && (
        <div className="relative h-full w-full bg-red-950/20">
          <div className="absolute inset-0 flex items-center justify-center flex-col space-y-4">
            <AlertTriangle className="w-24 h-24 text-red-500 animate-bounce" />
            <h1 className="text-2xl font-bold text-red-500 tracking-widest animate-pulse">VIRUS INFILTRATION DETECTED</h1>
            <p className="text-xs text-zinc-400 animate-pulse">SYSTEM ROOT CONTROL REVOKED BY REMOTE HOST</p>
          </div>

          {/* Random floating popups */}
          {popups.map((popup) => (
            <div
              key={popup.id}
              className="absolute bg-zinc-900 border-2 border-red-600 rounded shadow-2xl w-80 p-4 animate-pulse"
              style={{ left: `${popup.x}%`, top: `${popup.y}%`, zIndex: 10 + popup.id }}
            >
              <div className="flex items-center gap-2 text-red-500 font-bold border-b border-red-900 pb-2 mb-2 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{popup.title}</span>
              </div>
              <p className="text-[11px] text-zinc-300">{popup.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* 3. Webcam Hack Phase */}
      {phase === 'webcam_hack' && (
        <div className="h-full flex items-center justify-center bg-zinc-950">
          <div className="w-full max-w-xl bg-zinc-900 border-2 border-red-600 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-red-900 text-white text-xs px-4 py-2 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5 animate-pulse">
                <Eye className="w-4 h-4" />
                <span>Webcam Feed [LIVE] - Hack Active</span>
              </span>
              <span className="text-red-300">WEBCAM_01_RECOVERY_MODE</span>
            </div>
            <div className="relative p-2 bg-black">
              <canvas
                id="webcam-canvas"
                ref={canvasRef}
                width={640}
                height={480}
                className="w-full aspect-[4/3] rounded bg-black"
              />
              <div className="absolute top-4 left-4 bg-red-600 text-white text-[9px] px-2 py-0.5 rounded animate-pulse font-bold tracking-widest">
                STREAMING TO DARK WEB
              </div>
              <div className="absolute bottom-4 right-4 bg-black/80 text-red-500 text-xs p-3 rounded border border-red-900 leading-relaxed font-semibold">
                <p>⚠️ WEBCAM HIJACKED</p>
                <p className="text-[10px] text-zinc-400 mt-1">「今、どんな顔して画面見てる？」</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Ransomware Screen */}
      {phase === 'ransomware_screen' && (
        <div className="h-full bg-red-950 text-white flex flex-col justify-between p-8 md:p-16">
          <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-4 text-red-500">
              <Lock className="w-16 h-16 shrink-0 animate-bounce" />
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-wider">🔒 RANSOMWARE LOCKED YOUR PC!</h1>
                <p className="text-xs text-red-300 tracking-widest mt-1">YOUR PERSONAL FILES HAVE BEEN ENCRYPTED WITH AES-256</p>
              </div>
            </div>

            <hr className="border-red-900" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-zinc-300">
              <div className="space-y-4 bg-black/40 p-5 rounded-lg border border-red-900">
                <p className="font-bold text-red-400 text-sm">💡 どうすれば復旧できるか？</p>
                <p>あなたのドキュメント、卒業写真、ログインパスワード、ブラウザ履歴をすべて暗号化し、本サーバーへ回収しました。</p>
                <p>ファイルを救い出す唯一の方法は、暗号解読キーの購入です。猶予期間内に身代金を支払わなければ、全データが完全消去され、SNSに全プライベートがばら撒かれます。</p>
              </div>

              <div className="space-y-4 bg-black/40 p-5 rounded-lg border border-red-900 flex flex-col justify-between">
                <div>
                  <p className="font-bold text-red-400 text-sm">💰 身代金要求額</p>
                  <p className="text-xl font-mono text-amber-500 mt-2">0.50 BTC (ビットコイン)</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Wallet Address: 1Lbcfr7sAHTY9CgdQ6D7P93S8Bf7Kk2xZ9</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-red-400 font-bold">⚠️ 暗号消去までのカウントダウン</p>
                  <div className="text-2xl md:text-3xl font-mono font-bold text-red-500 tracking-wider">
                    {timeLeft.h.toString().padStart(2, '0')}:{timeLeft.m.toString().padStart(2, '0')}:{timeLeft.s.toString().padStart(2, '0')}:{timeLeft.ms.toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-red-400 bg-black/60 border border-red-800 p-3 rounded animate-pulse font-bold">
              警告: PCの電源を落としたり、アンチウイルスで駆除を試みると、即座にファイルが抹消されます。
            </div>
          </div>
        </div>
      )}

      {/* 5. BSOD Phase */}
      {phase === 'bsod' && (
        <div id="bsod-screen" className="h-full bg-blue-900 text-white p-12 md:p-24 select-none font-sans flex flex-col justify-between">
          <div className="max-w-3xl space-y-8">
            <h1 className="text-6xl font-bold">:(</h1>
            <h2 className="text-xl md:text-2xl font-bold leading-relaxed">
              PCで問題が発生したため、再起動する必要があります。<br />
              エラー情報を収集しています。自動的に再起動します。
            </h2>
            
            <div className="space-y-2 text-xs md:text-sm font-mono text-blue-200">
              <p>50% 完了</p>
              <p className="mt-4 text-[11px] text-blue-300">
                詳細情報については、後でオンラインでこのエラーを検索してください:<br />
                <span className="font-bold text-white">FATAL_RANSOMWARE_EXPOSURE_LUMINAOS_CRASH</span>
              </p>
              <p className="text-[11px] text-blue-300">
                サポート担当者に連絡する場合は、この情報を伝えてください:<br />
                停止コード: <span className="font-bold text-white">PHISHING_ROOTKIT_TAKEOVER</span>
              </p>
            </div>
          </div>

          <div className="text-xs text-blue-300 flex items-center gap-2 font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
            <span>Lumina OS はセーフモードでの自動復旧再起動シーケンスをロードしています...</span>
          </div>
        </div>
      )}

      {/* 6. Monologue (後悔の言葉) */}
      {phase === 'monologue' && (
        <div className="h-full bg-black flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-2xl">
            <p className="text-lg md:text-xl font-medium tracking-widest text-zinc-400 leading-relaxed min-h-[3rem]">
              {monologueText}
              <span className="inline-block w-1 h-5 bg-zinc-650 ml-1 animate-pulse" />
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
