/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Share2, X, Link, Check, Send, Sparkles } from "lucide-react";
import { NewsArticle } from "../types";

interface ShareSheetProps {
  article: NewsArticle | null;
  onClose: () => void;
  onShareToast: (message: string) => void;
}

export const ShareSheet: React.FC<ShareSheetProps> = ({
  article,
  onClose,
  onShareToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const demoShareUrl = `https://fasoactu.bf/article/${article.id}`;
  const shareText = `🇧🇫 *Faso Actu - Temps Réel* \n\n🔥 *${article.title}*\n\n"${article.summary}"\n\n👉 Lire l'article complet ici : ${demoShareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(demoShareUrl);
    setCopied(true);
    onShareToast("Lien de l'article copié dans le presse-papiers!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialAction = (srv: string) => {
    onShareToast(`Ouverture de ${srv} pour partager la dépêche...`);
    // Simulate navigation/sharing cleanly
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs animate-fade-in">
      {/* Outer Click to Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Content Panel */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-[28px] p-6 shadow-2xl border-t border-slate-200/50 dark:border-slate-800/80 max-h-[85vh] overflow-y-auto animate-slide-up z-10 font-sans">
        {/* Decorative Top Pill Slide Handler */}
        <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
            <Share2 className="w-5 h-5 text-red-500" /> Partage Rapide
          </h4>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-650 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Article Summary Capsule inside the share card */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-2xl mb-5 text-left space-y-1">
          <span className="text-[9px] font-bold text-red-650 dark:text-yellow-500 uppercase tracking-widest">
            {article.category.toUpperCase()}
          </span>
          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
            {article.title}
          </h5>
          <p className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Social Channel buttons list */}
        <div className="space-y-2.5">
          {/* WhatsApp standard trigger */}
          <button
            onClick={() => handleSocialAction("WhatsApp")}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 hover:scale-101 text-white text-xs font-semibold rounded-2xl shadow-md transition flex items-center justify-between"
          >
            <span className="flex items-center gap-3">
              {/* Custom SVG icon for WhatsApp */}
              <svg className="w-4.5 h-4.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.805 1.453 5.323 0 9.66-4.33 9.663-9.65.002-2.577-1.003-5.001-2.831-6.832-1.829-1.83-4.254-2.831-6.828-2.831-5.301 0-9.636 4.33-9.64 9.648-.002 1.96.512 3.82 1.483 5.485L1.93 21.07l4.717-1.916z"/>
              </svg>
              <span>Partager sur WhatsApp (Recommandé BF)</span>
            </span>
            <span className="text-[10px] font-mono tracking-wider text-emerald-100 font-bold">95% actifs</span>
          </button>

          {/* Facebook standard trigger */}
          <button
            onClick={() => handleSocialAction("Facebook")}
            className="w-full py-3 px-4 bg-[#1877F2]/90 hover:bg-[#1877F2] hover:scale-101 text-white text-xs font-semibold rounded-2xl shadow-md transition flex items-center justify-between"
          >
            <span className="flex items-center gap-3">
              <svg className="w-4.5 h-4.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Partager sur Facebook</span>
            </span>
          </button>

          {/* Telegram standard trigger */}
          <button
            onClick={() => handleSocialAction("Telegram")}
            className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 hover:scale-101 text-white text-xs font-semibold rounded-2xl shadow-md transition flex items-center justify-between"
          >
            <span className="flex items-center gap-3">
              <Send className="w-4 h-4 shrink-0" />
              <span>Envoyer via Telegram</span>
            </span>
          </button>

          {/* Twitter / X trigger */}
          <button
            onClick={() => handleSocialAction("X (Twitter)")}
            className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-2xl shadow-md border border-slate-800 transition flex items-center justify-between"
          >
            <span className="flex items-center gap-3">
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0  0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>Poster sur X</span>
            </span>
          </button>

          <div className="relative py-2.5 flex items-center">
            <div className="grow border-t border-slate-200 dark:border-slate-800" />
            <span className="mx-3 text-[10px] text-slate-400 font-mono">OU LIEN EXTERNE</span>
            <div className="grow border-t border-slate-200 dark:border-slate-800" />
          </div>

          {/* Direct clipboard link copying */}
          <button
            onClick={handleCopyLink}
            className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 dark:hover:bg-slate-800/60 rounded-2xl text-slate-700 dark:text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4.5 h-4.5 text-emerald-500" />
                <span className="text-emerald-500">Lien copié !</span>
              </>
            ) : (
              <>
                <Link className="w-4 h-4 text-slate-400" />
                <span>Copier le Lien de l'Article</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[10.5px] text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Faso Actu compresse le partage pour économiser ~150Ko</span>
        </div>
      </div>
    </div>
  );
};
