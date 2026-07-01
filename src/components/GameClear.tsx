import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, Award } from 'lucide-react';

interface GameClearProps {
  onRestartGame: () => void;
}

export default function GameClear({ onRestartGame }: GameClearProps) {
  return (
    <div id="clear-screen" className="fixed inset-0 bg-slate-950 text-slate-100 flex items-center justify-center p-4 z-50 overflow-y-auto select-none font-sans">
      <div className="w-full max-w-2xl bg-slate-900 border border-emerald-800/60 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 my-8">
        
        {/* Header Ribbon */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-400 mb-2">
            <Award className="w-8 h-8 animate-bounce" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            <span>GAME CLEARED!</span>
          </h1>
          <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
            セキュリティ・リテラシーを完全に習得しました
          </p>
        </div>

        {/* Clear Summary Block */}
        <div className="bg-emerald-950/20 border border-emerald-800/40 p-4 rounded-xl text-xs leading-relaxed text-emerald-300">
          <p className="font-bold mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            2周目の正しい選択：
          </p>
          <p>
            あなたは「普段と違うタカシの口調」に気づき、チャットでそのまま怪しいURLを開くのではなく、
            <span className="text-white font-bold">「電話（別ルート確認）」</span>で本人に直接確認を取りました。
            さらに、あらかじめ<span className="text-white font-bold">「二段階認証 (2FA)」</span>を有効化し、犯人のフィッシング詐欺からアカウントとプライバシーを守ることに見事成功しました！
          </p>
        </div>

        {/* Core Literacy Learnings */}
        <div className="space-y-4">
          <h2 className="text-sm font-extrabold text-slate-300 tracking-wider uppercase border-b border-slate-800 pb-2">
            🛡️ このゲームから学ぶ、防犯リテラシー
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Slide 1 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>1. 人の焦りを突く手口</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                「晒されている」「写真が流出した」「ウイルス感染」など、人は恐怖や焦りを感じると、冷静な判断ができなくなります。急かされたときほど一度手を止め、画面を閉じることが大切です。
              </p>
            </div>

            {/* Slide 2 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <HelpCircle className="w-4 h-4" />
                <span>2. ドメインの極小な違い</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                犯人は正規の <code className="text-white bg-slate-900 px-1 rounded">instahub.com</code> に極めて類似した偽のアドレス（例: <code className="text-white bg-slate-900 px-1 rounded">instahub.security-check...</code>）を用意します。URLバーをよく観察しましょう。
              </p>
            </div>

            {/* Slide 3 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>3. 二段階認証 (2FA) の重要性</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                もしパスワードをうっかりフィッシングサイトに入力してしまっても、2FAがONなら、犯人はあなたのスマホに届く一時的なコードを持たないため、不正ログインを防げます。
              </p>
            </div>

            {/* Slide 4 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>4. 別ルートでの本人確認</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                「怪しいURL」が友人から届いた際、そのチャットアプリ上で本人と会話を続けても、すでに乗っ取られているため意味がありません。電話や別の手段で「本物？」と直接聞くのが鉄則です。
              </p>
            </div>

          </div>
        </div>

        {/* Footer / Call to action */}
        <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-800">
          <p className="text-[10px] text-slate-500">
            あなたの周りの大切な人がフィッシング詐欺に遭わないよう、この知識をぜひ共有してください。
          </p>
          <button
            id="clear-restart-btn"
            onClick={onRestartGame}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-full shadow-lg transition-all"
          >
            <span>もう一度プレイする（タイトルへ戻る）</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
