/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LogIn, LogOut, ShieldCheck, Mail, Sparkles } from "lucide-react";
import { UserSession } from "../types";

interface GoogleAuthModuleProps {
  session: UserSession;
  onLogin: (session: UserSession) => void;
  onLogout: () => void;
}

export const GoogleAuthModule: React.FC<GoogleAuthModuleProps> = ({
  session,
  onLogin,
  onLogout,
}) => {
  const [loading, setLoading] = useState(false);

  const triggerGoogleLogin = () => {
    setLoading(true);
    // Mimic the seamless high-speed native Google Sign-In SDK trigger
    setTimeout(() => {
      onLogin({
        isLoggedIn: true,
        name: "Phineas Millogo",
        email: "phineasmillogo8@gmail.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      });
      setLoading(false);
    }, 900);
  };

  if (session.isLoggedIn) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={session.avatar}
              alt={session.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                {session.name}
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/40 rounded-full">
                Google
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-[160px]">
              {session.email}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Se déconnecter"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 text-center">
      <div className="inline-flex p-3 bg-red-50 dark:bg-red-950/20 rounded-2xl text-red-500 mb-3 animate-pulse">
        <Sparkles className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
        Connexion Faso Actu
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-xs mx-auto">
        Accédez instantanément à votre fil personnalisé et sauvegardez vos articles favoris. Pas d'inscription requise, utilisez simplement votre compte Google actuel.
      </p>

      <button
        onClick={triggerGoogleLogin}
        disabled={loading}
        className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 rounded-xl shadow-xs flex items-center justify-center gap-2.5 transition relative overflow-hidden"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {/* Minimalist Flat Vector Google G Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12V14.5h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.33z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.43-.63-.77-1.36-.84-2.11z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="font-sans text-xs">Continuer avec Google</span>
          </>
        )}
      </button>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Authentification sécurisée par Google</span>
      </div>
    </div>
  );
};
