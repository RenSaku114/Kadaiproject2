import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, ShieldAlert, User, ShieldCheck } from 'lucide-react';
import { Message, LoopCount } from '../types';

interface ChatAppProps {
  loop: LoopCount;
  chatStep: number;
  messages: Message[];
  isTwoFactorEnabled: boolean;
  onSendMessage: (text: string) => void;
  onSelectOption: (optionText: string, nextStep: number) => void;
  onStartPhoneCall: () => void;
  onReportPhishing: () => void;
  onOpenBrowser: (url: string) => void;
}

export default function ChatApp({
  loop,
  chatStep,
  messages,
  isTwoFactorEnabled,
  onSendMessage,
  onSelectOption,
  onStartPhoneCall,
  onReportPhishing,
  onOpenBrowser,
}: ChatAppProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle standard option selection
  const handleOptionClick = (text: string, nextStep: number) => {
    onSelectOption(text, nextStep);
  };

  return (
    <div id="chat-app" className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700/50 shadow-md">
              {/* Profile Image - Mock */}
              <div className="w-full h-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white font-semibold font-display">
                T
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-1.5 font-display text-white">
              <span>タカシ</span>
              {loop === 2 && (
                <span className="text-[9px] font-mono tracking-wider bg-rose-950/80 text-rose-400 border border-rose-800/60 px-1.5 py-0.5 rounded animate-pulse">
                  乗っ取りの疑い
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">オンライン</div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          <button
            id="chat-call-btn"
            onClick={onStartPhoneCall}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              loop === 2
                ? 'bg-sky-950/50 text-sky-400 hover:bg-sky-900/60 border border-sky-800/40 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                : 'text-slate-400 hover:bg-slate-800/50 border border-transparent'
            }`}
            title="タカシに直接確認（通話）"
          >
            <Phone className="w-4 h-4" />
          </button>
          {loop === 2 && (
            <button
              id="chat-report-btn"
              onClick={onReportPhishing}
              className="p-2 rounded-xl bg-rose-950/50 text-rose-400 hover:bg-rose-900/60 border border-rose-900/40 transition-all cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.15)]"
              title="このアカウントをスパムとして通報"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-900">
        {messages.map((msg) => {
          const isFriend = msg.sender === 'friend';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="bg-slate-900 text-slate-500 text-[10px] font-mono px-3 py-1 rounded-lg border border-slate-800/40 tracking-wider">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${
                isFriend ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}
            >
              {isFriend && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex-shrink-0 flex items-center justify-center font-bold text-xs text-white font-display shadow-md">
                  T
                </div>
              )}
              <div className="space-y-1">
                <div
                  className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                    isFriend
                      ? 'bg-slate-900 text-slate-200 border border-slate-800/60'
                      : 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium'
                  }`}
                >
                  {msg.isUrl ? (
                    <div className="space-y-2.5">
                      {loop === 2 && (
                        <p className="font-semibold text-rose-400 flex items-center gap-1.5 font-display tracking-wide">
                          <ShieldAlert className="w-4 h-4" />
                          不審なリンク検出
                        </p>
                      )}
                      <button
                        id="chat-phishing-url"
                        onClick={() => onOpenBrowser(msg.url || '')}
                        className="text-sky-400 hover:underline block break-all text-left font-mono bg-slate-950/80 p-2.5 rounded-lg border border-slate-850 cursor-pointer transition-colors hover:text-sky-300"
                      >
                        {msg.url}
                      </button>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        {loop === 2 
                          ? '⚠️ ドメインを確認：正規の「instahub.com」と異なり、アドレスの語尾（サブドメイン構成）が偽装されています。' 
                          : '※ リンクをクリックして状況を確認します。'}
                      </p>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
                <div
                  className={`text-[9px] text-slate-500 font-mono ${
                    isFriend ? 'text-left' : 'text-right'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Option Selection (Dialogue choices instead of direct text input) */}
      <div className="p-4 bg-slate-900/60 backdrop-blur-md border-t border-slate-800/60 space-y-3">
        {/* Branching choices depending on loop & progress */}
        <div className="flex flex-col gap-2">
          {loop === 1 && chatStep === 0 && (
            <>
              <button
                id="chat-opt-1-1"
                onClick={() => handleOptionClick('えっ、マジで！？掲示板に晒されてるの？', 1)}
                className="w-full text-left bg-slate-950/60 hover:bg-slate-800 text-slate-200 hover:text-white text-xs px-4 py-3 rounded-xl border border-slate-800 hover:border-slate-700/60 transition-all cursor-pointer shadow-sm"
              >
                「えっ、マジで！？掲示板に晒されてるの？」
              </button>
              <button
                id="chat-opt-1-2"
                onClick={() => handleOptionClick('何これ、スパムメッセージ？怪しいURLだけど……', 2)}
                className="w-full text-left bg-slate-950/60 hover:bg-slate-800 text-slate-200 hover:text-white text-xs px-4 py-3 rounded-xl border border-slate-800 hover:border-slate-700/60 transition-all cursor-pointer shadow-sm"
              >
                「何これ、スパムメッセージ？怪しいURLだけど……」
              </button>
            </>
          )}

          {loop === 1 && chatStep === 1 && (
            <button
              id="chat-opt-1-3"
              onClick={() => onOpenBrowser('http://bbs-shachou-news.net/topic/view/')}
              className="w-full text-left bg-rose-950/30 text-rose-300 hover:bg-rose-900/30 text-xs px-4 py-3 rounded-xl border border-rose-900/40 hover:border-rose-800 transition-all cursor-pointer animate-pulse"
            >
              「本当に乗ってるじゃん！消さなきゃ……（URLをクリックする）」
            </button>
          )}

          {loop === 1 && chatStep === 2 && (
            <>
              <button
                id="chat-opt-1-4"
                onClick={() => onOpenBrowser('http://bbs-shachou-news.net/topic/view/')}
                className="w-full text-left bg-rose-950/30 text-rose-300 hover:bg-rose-900/30 text-xs px-4 py-3 rounded-xl border border-rose-900/40 hover:border-rose-800 transition-all cursor-pointer animate-pulse"
              >
                「本当だ、タカシが言うなら本物か……（URLをクリックする）」
              </button>
              <button
                id="chat-opt-1-5"
                onClick={() => handleOptionClick('なんか言い方が普段と違くない？', 3)}
                className="w-full text-left bg-slate-950/60 hover:bg-slate-800 text-slate-200 hover:text-white text-xs px-4 py-3 rounded-xl border border-slate-800 hover:border-slate-700/60 transition-all cursor-pointer shadow-sm"
              >
                「なんか言い方が普段と違くない？」
              </button>
            </>
          )}

          {loop === 1 && chatStep === 3 && (
            <div className="space-y-2.5">
              <p className="text-[10px] text-slate-500 font-mono">タカシがしきりにURLへのクリックを促しています。これ以外の手段はありません...</p>
              <button
                id="chat-opt-1-6"
                onClick={() => onOpenBrowser('http://bbs-shachou-news.net/topic/view/')}
                className="w-full text-left bg-rose-950/30 text-rose-300 hover:bg-rose-900/30 text-xs px-4 py-3 rounded-xl border border-rose-900/40 hover:border-rose-800 transition-all cursor-pointer animate-pulse"
              >
                「諦めて確認する（URLをクリックする）」
              </button>
            </div>
          )}

          {/* Loop 2 - Awareness & Literacy */}
          {loop === 2 && chatStep === 0 && (
            <>
              <button
                id="chat-opt-2-1"
                onClick={() => {
                  // Direct warning to the user
                  onSendMessage('これ、タカシ本人じゃないよね？アカウント乗っ取られてるでしょ。');
                  setTimeout(() => {
                    onSendMessage('直接電話して確認する。');
                    onStartPhoneCall();
                  }, 1200);
                }}
                className="w-full text-left bg-sky-950/40 text-sky-200 hover:bg-sky-900/40 text-xs px-4 py-3 rounded-xl border border-sky-800/60 hover:border-sky-700 transition-all cursor-pointer font-medium flex items-center justify-between shadow-[0_0_15px_rgba(14,165,233,0.1)]"
              >
                <span className="font-display">💡 普段のタカシと違う！別ルート（電話）で本人に直接確認する</span>
                <Phone className="w-4 h-4 animate-bounce text-sky-400 shrink-0" />
              </button>

              <button
                id="chat-opt-2-2"
                onClick={() => onOpenBrowser('http://bbs-shachou-news.net/topic/view/')}
                className="w-full text-left bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs px-4 py-3 rounded-xl border border-slate-800 hover:border-slate-700/60 transition-all cursor-pointer shadow-sm"
              >
                「念のためURLをクリックして確認する（1周目と同じ危険な行動）」
              </button>
            </>
          )}

          {loop === 2 && chatStep === 999 && (
            <div className="flex items-center gap-2.5 text-xs text-emerald-400 bg-emerald-950/20 p-3 rounded-xl border border-emerald-800/40">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-display font-medium">アカウントの乗っ取りを通報完了。タカシの安全を確保しました。</span>
            </div>
          )}
        </div>

        {/* Disabled Input text field for realistic style */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            disabled
            placeholder="選択肢からメッセージを選んでください..."
            className="flex-1 bg-slate-950 border border-slate-800/60 rounded-xl px-3 py-2 text-xs text-slate-500 focus:outline-none font-sans"
          />
          <button
            disabled
            className="p-2 bg-slate-900 text-slate-600 rounded-xl cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
