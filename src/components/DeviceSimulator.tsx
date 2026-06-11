/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Smartphone, 
  Landmark, 
  Wifi, 
  Battery, 
  RotateCcw, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Info, 
  Globe, 
  HardDrive, 
  Cloud, 
  Bell, 
  Sparkles, 
  Check, 
  Cpu,
  Layers,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { DeviceConfig, NotificationSetting, WidgetConfig } from "../types";

interface DeviceSimulatorProps {
  config: DeviceConfig;
  onUpdateConfig: (updated: DeviceConfig) => void;
  dataSavedKb: number;
  ipAddressSimulated: string;
  children: React.ReactNode;
  
  // Optional high-fidelity dynamic dashboard bindings
  savedArticleIdsCount?: number;
  notificationSettings?: NotificationSetting;
  widgetConfig?: WidgetConfig;
  onNavigateToTab?: (tab: "news" | "offline" | "notifications" | "widget") => void;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  config,
  onUpdateConfig,
  dataSavedKb,
  ipAddressSimulated,
  children,
  savedArticleIdsCount = 0,
  notificationSettings,
  widgetConfig,
  onNavigateToTab,
}) => {
  const switchPlatform = (platform: DeviceConfig["platform"]) => {
    onUpdateConfig({ ...config, platform });
  };

  const toggleGeofence = () => {
    onUpdateConfig({ ...config, simulatedInBurkina: !config.simulatedInBurkina });
  };

  const toggleDataSaver = () => {
    onUpdateConfig({ ...config, dataSaver: !config.dataSaver });
  };

  // Live premium widget text previews depending on selected config
  const getWidgetCategoryText = () => {
    const cat = widgetConfig?.category || "all";
    switch (cat) {
      case "securite":
        return "Climat & Sécurité : Fortes pluies attendues sur le Plateau Central cette semaine. Conseils de prudence.";
      case "economie":
        return "Filière Mangue : Vers une récolte record dans les vergers de l'Ouest (Bobo-Dioulasso). Export en hausse.";
      case "regions":
        return "Hydraulique : De nouvelles installations d'eau potable inaugurées dans les villages du Sahel.";
      case "sport":
        return "Étalons : Le sélectionneur national de football dévoile son onze de départ pour le match continental.";
      case "culture":
        return "Cinéma FESPACO : Les salles de Ouagadougou se préparent pour une semaine de projections mondiales.";
      default:
        return "Infrastructures : Le grand chantier de l'avenue Bassawarga progresse vite au centre-ville.";
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* LEFT COLUMN: Premium physical Device Shell Frame & Sandbox Hardware Controls */}
      <div className="w-full lg:w-[410px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center shrink-0 self-stretch relative shadow-2xl p-6 gap-6 overflow-y-auto">
        
        {/* Sidebar Brand/Status Mock badge */}
        <div className="w-full flex items-center justify-between mb-1 select-none">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-red-650 flex items-center justify-center text-white font-black text-lg shadow-sm">
              F
            </div>
            <div>
              <h1 className="text-md font-black tracking-tight text-slate-900 dark:text-slate-50">
                FasoNews<span className="text-green-600">226</span>
              </h1>
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                Portail National
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-mono font-bold text-slate-500">
            v2.4 Live
          </span>
        </div>

        {/* Main interactive smart device */}
        <div className="relative select-none shrink-0 w-full flex justify-center">
          {config.platform === "ios" ? (
            /* Apple iPhone high-fidelity mockup */
            <div className="w-[340px] h-[670px] bg-slate-950 rounded-[48px] p-3 shadow-2xl relative border-4 border-slate-800 ring-8 ring-slate-900 ring-inset flex flex-col overflow-hidden">
              {/* Camera Island */}
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-24 h-5.5 bg-black rounded-full z-45 flex items-center justify-between px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                <span className="w-6 h-0.5 bg-slate-900 rounded-full" />
                <span className="w-1 h-1 rounded-full bg-indigo-950" />
              </div>

              {/* Screen Glass */}
              <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-[38px] overflow-hidden relative flex flex-col z-10 select-text">
                {/* iOS Status Bar */}
                <div className="h-9 pt-2.5 px-6.5 flex justify-between items-center text-slate-900 dark:text-slate-100 text-[10px] font-bold tracking-wide select-none z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
                  <span>12:45</span>
                  <div className="flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-slate-800 dark:text-slate-200" />
                    <span className="text-[8.5px] font-mono tracking-tighter">LTE</span>
                    <div className="w-5 h-2.5 border border-current rounded-3xs p-0.5 flex items-center">
                      <div className="h-full w-3/4 bg-current rounded-3xs" />
                    </div>
                  </div>
                </div>

                {/* Inner Web Applet Content */}
                <div className="grow overflow-hidden flex flex-col relative">
                  {children}
                </div>

                {/* iOS Home Indicator */}
                <div className="h-3 bg-white dark:bg-slate-900 flex justify-center items-center pb-1.5 select-none z-40">
                  <div className="w-24 h-0.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
                </div>
              </div>
            </div>
          ) : (
            /* Premium Android Smartphone mockup */
            <div className="w-[340px] h-[670px] bg-zinc-950 rounded-[38px] p-2.5 shadow-2xl relative border-4 border-zinc-900 ring-6 ring-zinc-850 ring-inset flex flex-col overflow-hidden">
              {/* Hole punch */}
              <div className="absolute top-3.5 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-45 border border-zinc-900 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-indigo-950" />
              </div>

              {/* Screen Glass */}
              <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-[28px] overflow-hidden relative flex flex-col z-10 select-text">
                {/* Android Status Bar */}
                <div className="h-8.5 px-6 flex justify-between items-center text-slate-850 dark:text-slate-100 text-[9.5px] font-semibold select-none z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
                  <span className="flex items-center gap-1">
                    <span>12:45</span>
                    <span className="text-[8px] font-bold uppercase text-red-600 bg-red-50 dark:bg-slate-850 px-0.5 rounded-sm">BF</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] uppercase">H+</span>
                    <Wifi className="w-3 h-3" />
                    <Battery className="w-4 h-4" />
                  </div>
                </div>

                {/* Inner Web Applet Content */}
                <div className="grow overflow-hidden flex flex-col relative">
                  {children}
                </div>

                {/* Android virtual keys */}
                <div className="h-8 bg-white dark:bg-slate-900 flex justify-around items-center px-10 select-none z-40 border-t border-slate-100 dark:border-slate-800">
                  <span className="w-3 h-3 border border-slate-400 dark:border-slate-600 rotate-45 border-r-0 border-t-0 block transform -translate-x-1" />
                  <span className="w-3 h-3 rounded-full border border-slate-400 dark:border-slate-600 block" />
                  <span className="w-3 h-3 rounded-xs border border-slate-400 dark:border-slate-600 block" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sandbox Hardware Overrides / Simulator Controls Panel */}
        <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-4.5 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <Cpu className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-350 uppercase tracking-wider">
              Console de Simulation
            </h3>
          </div>

          <div className="space-y-3 text-left">
            {/* Platform toggler */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                Gabarit du Système (OS)
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <button
                  onClick={() => switchPlatform("ios")}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                    config.platform === "ios"
                      ? "bg-slate-900 text-white dark:bg-slate-850 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                  }`}
                >
                  <span>Mapple iOS</span>
                </button>
                <button
                  onClick={() => switchPlatform("android")}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                    config.platform === "android"
                      ? "bg-slate-900 text-white dark:bg-slate-850 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                  }`}
                >
                  <span>Droid OS</span>
                </button>
              </div>
            </div>

            {/* Simulated GPS Option */}
            <div className="flex items-center justify-between py-1 border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Simuler au Burkina 🇧🇫</span>
                <span className="text-[9.5px] text-slate-400 block max-w-[200px]">Active les actus restreintes géographiquement</span>
              </div>
              <button
                onClick={toggleGeofence}
                className={`w-10 h-5.5 rounded-full p-0.5 transition-colors focus:outline-none shrink-0 ${
                  config.simulatedInBurkina ? "bg-red-650" : "bg-slate-250 dark:bg-slate-800"
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transform transition-transform ${
                    config.simulatedInBurkina ? "translate-x-4.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Bandwidth compression switcher */}
            <div className="flex items-center justify-between py-1 border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Économiseur de bande passante</span>
                <span className="text-[9.5px] text-slate-400 block max-w-[200px]">Compresse les images et images d'en-tête</span>
              </div>
              <button
                onClick={toggleDataSaver}
                className={`w-10 h-5.5 rounded-full p-0.5 transition-colors focus:outline-none shrink-0 ${
                  config.dataSaver ? "bg-green-600" : "bg-slate-250 dark:bg-slate-800"
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transform transition-transform ${
                    config.dataSaver ? "translate-x-4.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Full feature live Dashboard designed strictly as "Sleek Interface" mockup */}
      <div className="flex-1 p-6 lg:p-12 flex flex-col gap-8 lg:gap-10 overflow-y-auto w-full text-left">
        
        {/* Sleek Dashboard Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start gap-4 shrink-0">
          <div className="space-y-2">
            <h2 className="text-3xl lg:text-4xl font-light text-slate-400 dark:text-slate-505 leading-none tracking-tight">
              Expérience <span className="font-black text-slate-900 dark:text-white uppercase italic">Mobile</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md text-sm leading-relaxed">
              Optimisé pour la connectivité du Burkina Faso : faible consommation de forfait, mode hors-ligne absolu et notifications instantanées.
            </p>
          </div>

          {/* Consumption Stats Card matched with real live dataSavedKb */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-950/40 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 font-black">
              <Battery className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Forfait Épargné</p>
              <p className="text-sm font-black text-slate-905 dark:text-slate-100 italic">
                {config.dataSaver ? `Mode Éco Actif (+${dataSavedKb.toFixed(0)}Ko)` : "Mode Standard"}
              </p>
              <p className="text-[10px] font-mono text-slate-400">
                IP: <span className="text-slate-500">{ipAddressSimulated}</span>
              </p>
            </div>
          </div>
        </header>

        {/* Feature widgets grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 flex-1">
          
          {/* Feature 1 Card: Notifications config & state viewer */}
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 lg:p-8 shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition gap-6">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-1 font-bold text-xl">
                <Bell className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Notifications Push</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Recevez uniquement ce qui compte pour vous. Alertes de sécurité, météo locale et flash infos prioritaires en temps réel.
              </p>
            </div>

            {/* Dynamic bindings representing notification preferences */}
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alerte Infos</span>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                  notificationSettings?.enablePush 
                    ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {notificationSettings?.enablePush ? "ACTIVES ✓" : "DÉSACTIVÉES"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 pt-1.5">
                {notificationSettings?.categories && Object.entries(notificationSettings.categories).map(([cat, val]) => (
                  <span 
                    key={cat}
                    onClick={() => {
                      if (onNavigateToTab) onNavigateToTab("notifications");
                    }}
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase cursor-pointer transition ${
                      val 
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200" 
                        : "bg-slate-50 dark:bg-slate-950 text-slate-300 dark:text-slate-600 line-through"
                    }`}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 2 Card: Dynamic Offline Synchronizer viewer */}
          <div className="bg-slate-900 dark:bg-slate-950 rounded-[32px] p-6 lg:p-8 shadow-lg flex flex-col justify-between text-white border border-slate-800/80 hover:shadow-xl transition gap-6">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-1 font-bold text-xl">
                <Cloud className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold tracking-tight">Mode Hors-Ligne</h4>
              <p className="text-sm text-slate-300 dark:text-slate-400 leading-relaxed">
                Consultez vos articles de presse favoris entièrement sans connexion. Idéal pour s'informer au marché, en voyage de brousse ou en zone reculée.
              </p>
            </div>

            {/* Dynamic statistics block synced with real length of savedArticleIds */}
            <div 
              onClick={() => onNavigateToTab?.("offline")}
              className="bg-white/5 rounded-2xl p-4 flex items-center justify-between gap-3 hover:bg-white/10 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">
                  ✔
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block">{savedArticleIdsCount} Articles synchronisés</span>
                  <span className="text-[9px] text-slate-400 block font-mono">Prêts pour lecture hors-réseau</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Feature 3: Smart Widget Customizer Showcase (Full width gradient) */}
          <div className="md:col-span-2 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-emerald-900 rounded-[32px] p-6 lg:p-8 text-white relative overflow-hidden shadow-lg hover:shadow-xl transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            <div className="max-w-md space-y-4 relative z-10 text-left">
              <div className="inline-flex items-center gap-1 bg-white/10 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3 fill-current" />
                <span>Simulateur Launcher</span>
              </div>
              <h4 className="text-2xl font-black tracking-tight">Widget Accueil</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                Accédez à l'actualité en continu directement depuis votre écran d'accueil Android ou iOS sans ouvrir l'application FasoNews.
              </p>
              <button 
                onClick={() => onNavigateToTab?.("widget")}
                className="px-6 py-3.5 bg-white text-green-700 font-black rounded-2xl text-xs hover:bg-slate-100 shadow-xl transition-all cursor-pointer"
              >
                Personnaliser le Widget
              </button>
            </div>

            {/* Dynamic Widget Screen mockup matched with live state config */}
            <div className="w-full md:w-72 bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/15 dark:border-white/5 rounded-3xl p-4.5 relative z-10 space-y-2.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">FasoNews Express</p>
                </div>
                <span className="text-[8px] bg-green-500 text-white px-1.5 rounded-full font-bold">WIDGET</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/20 uppercase font-mono font-bold">
                  {widgetConfig?.category.toUpperCase() || "ALL"}
                </span>
                <p className="text-xs font-bold leading-tight line-clamp-2">
                  {getWidgetCategoryText()}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center text-[9px] opacity-75">
                <span>Taille: {widgetConfig?.size || "medium"}</span>
                <span>Thème: {widgetConfig?.theme || "patriotic"}</span>
              </div>
            </div>

            {/* Decorative flag element representing Burkina Faso national layout slant */}
            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-yellow-400 rotate-45 opacity-20" />
          </div>

        </div>

        {/* Footer info showing standard partners and Burkina metadata */}
        <footer className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-6 grayscale opacity-35 dark:opacity-50">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Partenaires :</span>
            <span className="text-xs font-black italic text-slate-600 dark:text-slate-350 tracking-tighter">GOOGLE</span>
            <span className="text-xs font-black italic text-slate-600 dark:text-slate-350 tracking-tighter">AIRTEL</span>
            <span className="text-xs font-black italic text-slate-600 dark:text-slate-350 tracking-tighter">MOOV</span>
          </div>
          <p className="text-[9.5px] text-slate-400 dark:text-slate-505 font-bold uppercase tracking-wider italic">
            Conçu exclusivement pour le Burkina Faso • 2026
          </p>
        </footer>

      </div>

    </div>
  );
};
