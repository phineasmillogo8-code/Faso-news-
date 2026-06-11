/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sliders, Maximize2, Palette, Layers, Star, Info, Check } from "lucide-react";
import { WidgetConfig } from "../types";

interface HomeWidgetConfiguratorProps {
  config: WidgetConfig;
  onChange: (updated: WidgetConfig) => void;
  onWidgetToast: () => void;
}

export const HomeWidgetConfigurator: React.FC<HomeWidgetConfiguratorProps> = ({
  config,
  onChange,
  onWidgetToast,
}) => {
  const setSize = (size: WidgetConfig["size"]) => onChange({ ...config, size });
  const setTheme = (theme: WidgetConfig["theme"]) => onChange({ ...config, theme });
  const setCategory = (category: WidgetConfig["category"]) => onChange({ ...config, category });

  // Simulate dummy top articles suited for the widget
  const dummyArticle = {
    title: "Centrale Solaire Zagtouli : L'extension de 30MW opérationnelle",
    date: "Il y a 12 min",
    category: "ÉCONOMIE",
    region: "Zagtouli (Ouaga)",
    alertTitle: "Vigilance Tempête : Banfora / Bobo",
    alertLevel: "CRITIQUE",
  };

  return (
    <div className="space-y-6">
      {/* Widget Live Simulator block */}
      <div className="p-1 border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-900/5 dark:bg-slate-950/40">
        <div className="bg-slate-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] rounded-[22px] p-4 flex flex-col justify-center min-h-[220px] relative overflow-hidden">
          {/* Springboard Header */}
          <div className="text-[10px] text-slate-500 font-mono mb-3 text-center w-full select-none">
            Aperçu de l'Écran d'Accueil Launcher
          </div>

          <div className="flex items-center justify-center">
            {/* Widget Itself */}
            <div
              className={`transition-all duration-300 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between p-4.5 text-left border ${
                config.theme === "light"
                  ? "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
                  : config.theme === "dark"
                  ? "bg-slate-950 border-slate-800 text-slate-50 shadow-slate-950/60"
                  : "bg-linear-to-b from-red-650 to-emerald-700 border-yellow-500/30 text-white shadow-emerald-950/40"
              } ${
                config.size === "small"
                  ? "w-[140px] h-[140px]"
                  : config.size === "medium"
                  ? "w-full max-w-[290px] h-[140px]"
                  : "w-full max-w-[290px] h-[220px]"
              }`}
            >
              {/* Patriotic Flag decoration background */}
              {config.theme === "patriotic" && (
                <div className="absolute inset-0 flex flex-col pointer-events-none select-none opacity-20">
                  <div className="h-1/2 bg-red-600" />
                  <div className="h-1/2 bg-green-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Star className="w-16 h-16 text-yellow-500 fill-yellow-500 opacity-30 animate-pulse" />
                  </div>
                </div>
              )}

              {/* Top Banner section */}
              <div className="flex items-center justify-between w-full relative z-10">
                <span
                  className={`text-[8.5px] font-bold tracking-widest px-1.5 py-0.5 rounded-full ${
                    config.theme === "light"
                      ? "bg-red-50 text-red-600"
                      : config.theme === "patriotic"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {config.category.toUpperCase() === "ALL" ? "FASO ACTU" : `ALERT : ${config.category.toUpperCase()}`}
                </span>
                <span className="text-[9px] font-mono opacity-60">DirecTV</span>
              </div>

              {/* News / Alert body section */}
              <div className="my-auto relative z-10">
                {config.category === "securite" ? (
                  <div>
                    <h5 className="font-bold text-[11px] leading-tight text-red-500 flex items-center gap-1">
                      ⚠️ {dummyArticle.alertTitle}
                    </h5>
                    <p className="text-[10px] opacity-75 mt-0.5 line-clamp-2">
                      Orage subit et fort coefficient de vent. Mettez le bétail à l'abri.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h5 className={`font-bold leading-snug line-clamp-2 ${
                      config.size === "small" ? "text-[10px]" : "text-[12px]"
                    }`}>
                      {dummyArticle.title}
                    </h5>
                    {config.size !== "small" && (
                      <p className="text-[10.5px] opacity-75 mt-1 line-clamp-2">
                        La SONABEL annonce que l'énergie propre raccordée au réseau gagne 15% d'autonomie ce trimestre.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Widget Footer section */}
              <div className="flex items-center justify-between w-full pt-1.5 mt-auto border-t border-slate-100/10 relative z-10 text-[9px] opacity-60">
                <span className="font-semibold">{dummyArticle.region}</span>
                <span>{dummyArticle.date}</span>
              </div>

              {/* Mini Golden star indicator for Burkina design */}
              {config.theme === "patriotic" && (
                <div className="absolute top-2.5 right-2.5 z-20">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                </div>
              )}
            </div>
          </div>

          {/* Simulated surrounding desktop icons for premium launch feel */}
          <div className="w-full flex justify-around mt-3 px-6 text-[9.5px] text-slate-600 font-sans">
            <span className="flex flex-col items-center gap-1 opacity-40">
              <span className="w-5.5 h-5.5 rounded-lg bg-orange-500 shadow-md block" />
              <span>Contacts</span>
            </span>
            <span className="flex flex-col items-center gap-1 opacity-40">
              <span className="w-5.5 h-5.5 rounded-lg bg-blue-500 shadow-md block" />
              <span>Mails</span>
            </span>
            <span className="flex flex-col items-center gap-1 opacity-40">
              <span className="w-5.5 h-5.5 rounded-lg bg-green-500 shadow-md block" />
              <span>WhatsApp</span>
            </span>
          </div>
        </div>
      </div>

      {/* Controller inputs */}
      <div className="space-y-5">
        {/* Size Selection */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5" /> Taille du Widget
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            {(["small", "medium", "large"] as const).map((sz) => (
              <button
                key={sz}
                onClick={() => setSize(sz)}
                className={`py-2 px-2.5 text-xs font-semibold capitalize rounded-lg transition-all ${
                  config.size === sz
                    ? "bg-slate-950 text-white dark:bg-slate-50 dark:text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                {sz === "small" ? "Carré 2x2" : sz === "medium" ? "Large 4x2" : "Grand 4x4"}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Selection */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" /> Apparence & Thème
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "light" as const, label: "Clair", bg: "bg-white border-slate-200 text-slate-900" },
              { id: "dark" as const, label: "Sombre", bg: "bg-slate-950 border-slate-800 text-slate-200" },
              { id: "patriotic" as const, label: "Faso 🇧🇫", bg: "bg-linear-to-b from-red-600 to-green-600 text-white font-bold" },
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => setTheme(th.id)}
                className={`p-3 border rounded-xl text-center text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-2xs ${th.bg} ${
                  config.theme === th.id
                    ? "ring-2 ring-red-500 dark:ring-yellow-500 scale-102"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <span>{th.label}</span>
                {config.theme === th.id && <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-yellow-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content Type Filter Selection */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Flux de Contenu
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "all" as const, label: "Actualités Générales" },
              { id: "securite" as const, label: "Alerte de Sécurité uniquement" },
              { id: "regions" as const, label: "Dossiers Régionaux de proximité" },
              { id: "politique" as const, label: "Décisions Institutionnelles" },
            ].map((feed) => (
              <button
                key={feed.id}
                onClick={() => setCategory(feed.id)}
                className={`py-2.5 px-3 border rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                  config.category === feed.id
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-950"
                    : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                }`}
              >
                <span className="font-semibold">{feed.label}</span>
                {config.category === feed.id && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 ml-1.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic help description info */}
        <div className="flex gap-2.5 items-start bg-slate-50 dark:bg-slate-900/40 p-3.5 border border-slate-100 dark:border-slate-800 rounded-2xl">
          <Info className="w-4.5 h-4.5 text-blue-500 shrink-0" />
          <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-normal">
            Le widget de Faso Actu utilise une synchronisation passive à basse fréquence hertzienne, ne consommant pratiquement pas de données mobiles. Très utile en brousse ou hors de Ouagadougou.
          </p>
        </div>

        {/* Widget trigger install simulator link */}
        <button
          onClick={onWidgetToast}
          className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          <span>Installer le Widget sur mon Écran d'Accueil</span>
        </button>
      </div>
    </div>
  );
};
