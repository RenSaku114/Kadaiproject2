import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Shield, AlertTriangle, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { LoopCount } from '../types';

interface WebBrowserProps {
  loop: LoopCount;
  initialUrl: string;
  isTwoFactorEnabled: boolean;
  onLoginSubmitted: (password: string) => void;
  onReportPhishing: (url: string) => void;
}

export default function WebBrowser({
  loop,
  initialUrl,
  isTwoFactorEnabled,
  onLoginSubmitted,
  onReportPhishing,
}: WebBrowserProps) {
  const [url, setUrl] = useState(initialUrl || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [browserStep, setBrowserStep] = useState<'bbs_loading' | 'bbs_page' | 'phishing_login' | 'phishing_blocked' | 'phishing_success'>('bbs_page');
  const [isUrlSuspicious, setIsUrlSuspicious] = useState(false);
  const [isReported, setIsReported] = useState(false);

  useEffect(() => {
    const safeUrl = typeof initialUrl === 'string' ? initialUrl : '';
    setUrl(safeUrl);
    // Determine the step based on URL
    if (safeUrl && safeUrl.includes('bbs-shachou-news.net')) {
      setBrowserStep('bbs_page');
      setIsUrlSuspicious(true);
    } else if (safeUrl && safeUrl.includes('instahub.security-check-login.com')) {
      setBrowserStep('phishing_login');
      setIsUrlSuspicious(true);
    } else {
      setBrowserStep('bbs_page');
      setIsUrlSuspicious(false);
    }
  }, [initialUrl]);

  // Handle URL "Click" to enter login page
  const navigateToPhishingLogin = () => {
    setUrl('http://instahub.security-check-login.com/login?redirect=bbs-shachou-news');
    setBrowserStep('phishing_login');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    if (loop === 2 && isTwoFactorEnabled) {
      // 2周目で二段階認証が有効な場合：ブロック
      setBrowserStep('phishing_blocked');
    } else {
      // 1周目、または2周目で無防備に入力した場合：ハッキングシーケンスへ
      onLoginSubmitted(password);
    }
  };

  const handleReport = () => {
    setIsReported(true);
    onReportPhishing(url);
  };

  return (
    <div id="web-browser" className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* Browser Controls */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-900">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors cursor-pointer" />
        </div>

        <div className="flex items-center gap-1.5 ml-4 shrink-0">
          <button className="p-1 text-slate-600 hover:text-slate-300 transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="p-1 text-slate-600 hover:text-slate-300 transition-colors cursor-pointer">
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="p-1 text-slate-600 hover:text-slate-300 transition-colors cursor-pointer">
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* URL Bar */}
        <div className="flex-1 flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 border border-slate-850 rounded-xl text-xs text-slate-400 font-mono">
          {isUrlSuspicious ? (
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          ) : (
            <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
          )}
          <span className={`truncate ${isUrlSuspicious ? 'text-amber-400 font-medium' : 'text-slate-300'}`}>
            {url}
          </span>
        </div>

        {/* Report Button (Literacy Helper) */}
        {loop === 2 && isUrlSuspicious && !isReported && (
          <button
            id="browser-report-btn"
            onClick={handleReport}
            className="flex items-center gap-1.5 text-[10px] bg-rose-950/50 border border-rose-800/40 text-rose-300 hover:bg-rose-900 px-3 py-1.5 rounded-lg transition-all cursor-pointer animate-pulse shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="font-display font-medium">通報する</span>
          </button>
        )}
        {isReported && (
          <div className="flex items-center gap-1.5 text-[10px] bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 px-3 py-1.5 rounded-lg shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-display font-medium">通報済み</span>
          </div>
        )}
      </div>

      {/* Browser Body */}
      <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-300 relative">
        {/* Step 1: BBS Fake Article Page */}
        {browserStep === 'bbs_page' && (
          <div className="p-6 max-w-2xl mx-auto space-y-6">
            <div className="border-b border-slate-850 pb-4">
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-display">
                <span className="bg-rose-600 text-white px-2 py-0.5 text-[10px] font-mono rounded uppercase font-bold tracking-wider">速報</span>
                <span>ネット暴露・噂まとめ社長ニュース板</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-mono mt-1">投稿日時: 2026/06/24 02:15 | 閲覧数: 45,920</p>
            </div>

            {/* Suspicious content */}
            <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-850 space-y-4">
              <h2 className="text-base font-bold text-rose-400 leading-snug font-display">
                【画像あり】某有名SNSで大人気の配信者、プライベートのヤバい裏写真と個人情報が流出？
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                掲示板閲覧者からのリーク。某SNSアカウント（InstaHub）のユーザー情報と、実名、卒業アルバムなどのプライベート写真が完全に一致したとの噂。
              </p>

              {/* Photo blur panel */}
              <div className="relative border border-slate-850 rounded-2xl overflow-hidden h-48 bg-slate-950 flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-slate-950/70 filter blur-2xl opacity-90" />
                <div className="z-10 text-center space-y-3.5 p-5">
                  <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
                    プライバシー保護とスパム防止のため、画像を閲覧するにはSNSアカウントでのログイン認証が必要です。
                  </p>
                  <button
                    id="bbs-login-trigger"
                    onClick={navigateToPhishingLogin}
                    className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className="font-display">InstaHubでログインして画像を閲覧</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Comments block */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 font-display">コメント (3)</h3>
              <div className="space-y-2 text-[11px]">
                <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-900/60">
                  <p className="text-slate-500 font-mono text-[10px]">名無しさん@社長板 (2026/06/24 02:22)</p>
                  <p className="mt-1 text-slate-300">これマジ！？画像本物っぽいな...</p>
                </div>
                <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-900/60">
                  <p className="text-slate-500 font-mono text-[10px]">名無しさん@社長板 (2026/06/24 02:30)</p>
                  <p className="mt-1 text-slate-300">ログインしたら写真見れたわ。これやばすぎだろ</p>
                </div>
                <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-900/60">
                  <p className="text-slate-500 font-mono text-[10px]">名無しさん@社長板 (2026/06/24 02:41)</p>
                  <p className="mt-1 text-rose-400 font-medium">⚠️ 注意：このログイン誘導、詐欺サイトじゃないか？アドレスおかしいぞ</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Phishing Site - InstaHub Login */}
        {browserStep === 'phishing_login' && (
          <div className="min-h-[400px] flex items-center justify-center p-6">
            <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-6">
              {/* Fake Brand Logo */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent font-display">
                  InstaHub
                </h1>
                <p className="text-[11px] text-slate-400">アカウントのセキュリティ保護のためログインしてください</p>
              </div>

              {loop === 2 && (
                <div className="bg-amber-950/20 border border-amber-800/40 p-3 rounded-xl text-xs text-amber-300 flex items-start gap-2 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold font-display">不審なドメインを検出しました。</span>
                    <p className="text-[10px] text-slate-400 mt-1">本物のドメインは 「instahub.com」 ですが、現在は 「instahub.security-check-login.com」 になっています！</p>
                  </div>
                </div>
              )}

              {/* Fake Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-medium font-display uppercase tracking-wider">ユーザーネーム、またはメールアドレス</label>
                  <input
                    id="phishing-username"
                    type="text"
                    required
                    placeholder="Username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-medium font-display uppercase tracking-wider">パスワード</label>
                  <input
                    id="phishing-password"
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500/50"
                  />
                </div>

                <button
                  id="phishing-submit-btn"
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg hover:shadow-xl transition-all mt-2 cursor-pointer"
                >
                  ログイン
                </button>
              </form>

              <div className="text-center">
                <a href="#forgot" className="text-[10px] font-mono text-slate-500 hover:underline">パスワードを忘れた場合</a>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Phishing Blocked (Correct Literacy Case - Loop 2 with 2FA) */}
        {browserStep === 'phishing_blocked' && (
          <div className="p-8 max-w-md mx-auto mt-10 text-center space-y-6 bg-sky-950/20 border border-sky-850 rounded-2xl shadow-xl">
            <div className="mx-auto w-12 h-12 rounded-full bg-sky-900/40 flex items-center justify-center border border-sky-500">
              <ShieldCheck className="w-6 h-6 text-sky-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-base font-bold text-white font-display tracking-wide">🛡️ SecureCoreが脅威をブロックしました</h2>
              <p className="text-xs text-slate-400">
                このサイトは、正規のSNS「InstaHub」に偽装した<span className="text-rose-400 font-bold">フィッシング詐欺サイト</span>です。
              </p>
            </div>
            <div className="bg-slate-900/50 p-4.5 rounded-2xl text-left text-xs space-y-2.5 leading-relaxed border border-slate-850">
              <p className="font-semibold text-sky-400 font-display">何が起きたのか？</p>
              <p className="text-slate-400">
                1. 犯人はあなたを焦らせて、偽のログイン画面にパスワードを入力させようとしました。
              </p>
              <p className="text-slate-400">
                2. あなたは事前に<span className="text-sky-400 font-bold">二段階認証 (2FA)</span>を有効にしていたため、仮にパスワードを入力しても、犯人はあなたのスマートフォンに送られるワンタイムコードがなければログインできません。
              </p>
              <p className="text-slate-400">
                3. SecureCoreがこのサイトのドメインが偽物であると認識し、アカウント情報の漏洩を防ぐため接続を完全に遮断しました。
              </p>
            </div>
            <div className="text-xs text-emerald-400 bg-emerald-950/20 p-3 rounded-xl border border-emerald-800/40 font-semibold animate-pulse font-display">
              素晴らしいリテラシーです！このままブラウザを閉じて、チャットを通報してください。
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
