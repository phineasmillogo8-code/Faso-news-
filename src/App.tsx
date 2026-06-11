/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Newspaper, 
  Bookmark, 
  Bell, 
  Sliders, 
  Search, 
  Wifi, 
  WifiOff, 
  Database, 
  Check, 
  Clock, 
  Sparkles, 
  Compass, 
  ChevronRight, 
  BookOpen, 
  Share2, 
  History, 
  Trash2, 
  User, 
  ArrowLeft,
  Volume2
} from "lucide-react";

import { NewsArticle, NotificationSetting, UserSession, WidgetConfig, DeviceConfig } from "./types";
import { DeviceSimulator } from "./components/DeviceSimulator";
import { GeofencingVerification } from "./components/GeofencingVerification";
import { GoogleAuthModule } from "./components/GoogleAuthModule";
import { NotificationCustomizer } from "./components/NotificationCustomizer";
import { HomeWidgetConfigurator } from "./components/HomeWidgetConfigurator";
import { ShareSheet } from "./components/ShareSheet";

export default function App() {
  // Device Configuration State
  const [deviceConfig, setDeviceConfig] = useState<DeviceConfig>({
    platform: "ios",
    simulatedInBurkina: true, // Default to true so it opens successfully
    dataSaver: true, // Default to true for extreme band compression
  });

  // Browser Network State
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // App Layout Active Tab State
  const [activeTab, setActiveTab] = useState<"news" | "offline" | "notifications" | "widget">("news");

  // News State
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  // Notification Preferences State
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting>({
    enablePush: true,
    categories: {
      politique: true,
      economie: true,
      securite: true,
      regions: true,
      sport: false,
      culture: true,
    },
    minAlertLevel: "warning",
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "06:00",
    },
  });

  // Home Screen Widget Config State
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    size: "medium",
    theme: "patriotic",
    category: "all",
  });

  // User Authentication State
  const [session, setSession] = useState<UserSession>({
    isLoggedIn: false,
    name: "",
    email: "",
    avatar: "",
  });

  // Offline Caching Storage State (Ids of saved articles)
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([]);
  const [offlineArticles, setOfflineArticles] = useState<NewsArticle[]>([]);

  // Simulation metrics
  const [dataSavedKb, setDataSavedKb] = useState<number>(312.4);
  const [ipAddressSimulated, setIpAddressSimulated] = useState<string>("154.72.162.45"); // Bobo-Dioulasso IP range
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [shareArticle, setShareArticle] = useState<NewsArticle | null>(null);
  const [voiceSynthesisActive, setVoiceSynthesisActive] = useState<boolean>(false);

  // Detect and update local system themes or automatic time-based Dark Mode
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Load cache states on initial client mount
  useEffect(() => {
    // Sync browser online listeners
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    // Initial cache fetch
    try {
      const storedIds = localStorage.getItem("faso_saved_ids");
      const storedArticles = localStorage.getItem("faso_saved_articles");
      if (storedIds) setSavedArticleIds(JSON.parse(storedIds));
      if (storedArticles) setOfflineArticles(JSON.parse(storedArticles));

      const storedSession = localStorage.getItem("faso_session");
      if (storedSession) setSession(JSON.parse(storedSession));
    } catch (e) {
      console.error("Local storage sync error:", e);
    }

    // Determine Automatic Dark Mode:
    // 1- checking prefers-color-scheme
    // 2- checking evening local time (20:51:23 is after sunset!)
    const currentHour = new Date().getHours();
    if (
      currentHour >= 18 || 
      currentHour < 6 || 
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setThemeMode("dark");
    }

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Sync document class based on themeMode
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [themeMode]);

  // Sync saved list to LocalStorage helper
  const saveSavedState = (newIds: string[], newArticles: NewsArticle[]) => {
    setSavedArticleIds(newIds);
    setOfflineArticles(newArticles);
    localStorage.setItem("faso_saved_ids", JSON.stringify(newIds));
    localStorage.setItem("faso_saved_articles", JSON.stringify(newArticles));
  };

  // Fetch news articles from Express backend API
  const fetchArticles = async (cat: string) => {
    setLoading(true);
    try {
      // Simulate slight Network throttle behavior if 'dataSaver' is enabled
      const delay = deviceConfig.dataSaver ? 800 : 250;
      await new Promise((resolve) => setTimeout(resolve, delay));

      const res = await fetch(`/api/news?category=${cat}`);
      const data = await res.json();
      
      if (data && data.articles) {
        setArticles(data.articles);
        if (data.error) {
          showToast("Réseau saturé : Affichage d'actualités de secours archivées.");
        }
        // Measure byte economy (Simulated saving calculation)
        if (deviceConfig.dataSaver) {
          setDataSavedKb((prev) => prev + (data.articles.length * 48));
        }
      }
    } catch (err) {
      console.error("Failed to fetch node news API:", err);
      // Fail proof fallback
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger article loading on tab or category alteration
  useEffect(() => {
    if (activeTab === "news") {
      fetchArticles(selectedCategory);
    }
  }, [selectedCategory, activeTab, deviceConfig.dataSaver]);

  // Display floating self-dismissing notifications
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Bookmark / Safe article cache handler
  const toggleSaveArticle = (article: NewsArticle) => {
    const isSaved = savedArticleIds.includes(article.id);
    let updatedIds: string[];
    let updatedArticles: NewsArticle[];

    if (isSaved) {
      updatedIds = savedArticleIds.filter((id) => id !== article.id);
      updatedArticles = offlineArticles.filter((item) => item.id !== article.id);
      showToast("Article retiré de vos archives hors-ligne.");
    } else {
      updatedIds = [...savedArticleIds, article.id];
      updatedArticles = [...offlineArticles, article];
      showToast("✓ Enregistré! Consultez-le même sans couverture réseau.");
      // Increment saved bytes metric
      setDataSavedKb((prev) => prev + 12.8);
    }

    saveSavedState(updatedIds, updatedArticles);
  };

  // Sound Synth Text-To-Speech news summary presenter (Faso Audio Service)
  const speakArticleSummary = (article: NewsArticle) => {
    if (voiceSynthesisActive) {
      window.speechSynthesis.cancel();
      setVoiceSynthesisActive(false);
      showToast("Lecture audio arrêtée.");
      return;
    }

    if ("speechSynthesis" in window) {
      const summaryText = `Dépêche de Faso Actu, catégorie ${article.category}. Titre : ${article.title}. Résumé : ${article.summary}. Source de l'information : ${article.source}.`;
      const utterance = new SpeechSynthesisUtterance(summaryText);
      utterance.lang = "fr-FR";
      utterance.rate = 1.0;
      
      utterance.onend = () => setVoiceSynthesisActive(false);
      utterance.onerror = () => setVoiceSynthesisActive(false);

      setVoiceSynthesisActive(true);
      window.speechSynthesis.speak(utterance);
      showToast("Génération de la synthèse vocale Faso Audio...");
    } else {
      showToast("Synthèse vocale non prise en charge sur cet iFrame.");
    }
  };

  // Simulated Google Auth actions
  const handleGoogleLogin = (newSession: UserSession) => {
    setSession(newSession);
    localStorage.setItem("faso_session", JSON.stringify(newSession));
    showToast(`Bienvenue ${newSession.name}! Connecté avec Google.`);
  };

  const handleGoogleLogout = () => {
    const updated = { isLoggedIn: false, name: "", email: "", avatar: "" };
    setSession(updated);
    localStorage.removeItem("faso_session");
    showToast("Déconnexion réussie.");
    // Close views requiring authentication if necessary
  };

  // Filtered source selection
  const filterNewsList = articles.filter((item) => {
    const matchQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchQuery;
  });

  return (
    <DeviceSimulator
      config={deviceConfig}
      onUpdateConfig={setDeviceConfig}
      dataSavedKb={dataSavedKb}
      ipAddressSimulated={ipAddressSimulated}
      savedArticleIdsCount={savedArticleIds.length}
      notificationSettings={notificationSettings}
      widgetConfig={widgetConfig}
      onNavigateToTab={setActiveTab}
    >
      <GeofencingVerification
        simulatedInBurkina={deviceConfig.simulatedInBurkina}
        onToggleSimulation={(val) => {
          setDeviceConfig({ ...deviceConfig, simulatedInBurkina: val });
          showToast("Position simulée à Ouagadougou avec succès.");
        }}
      >
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden font-sans">
          
          {/* Main Visual Header Screen */}
          <header className="px-4 py-3 bg-white dark:bg-slate-950/85 border-b border-slate-200/60 dark:border-slate-800/80 shrink-0 z-30 backdrop-blur-md">
            <div className="flex items-center justify-between">
              
              {/* Logo / Brand banner */}
              <div className="flex items-center gap-1.5 focus:outline-none">
                {/* Visual National Flag Ribbon */}
                <div className="w-1.5 h-6 rounded-xs flex flex-col overflow-hidden">
                  <div className="h-1/2 bg-red-650" />
                  <div className="h-1/2 bg-green-650" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-1">
                    Faso Actu
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  </h2>
                  <div className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-slate-400" />
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">TEMPS RÉEL (GMT)</span>
                  </div>
                </div>
              </div>

              {/* Toolbar Actions */}
              <div className="flex items-center gap-1">
                {/* Automatic Dark Mode state icon switcher */}
                <button
                  onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg transition"
                  title="Changer d'interface"
                >
                  {themeMode === "light" ? "🌙" : "☀️"}
                </button>

                {/* Online/Offline status pills */}
                {isOnline ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 text-[10px] font-bold">
                    <Wifi className="w-3 h-3" />
                    <span>Ligne</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 text-[10px] font-bold animate-pulse">
                    <WifiOff className="w-3 h-3" />
                    <span>Hors-Ligne</span>
                  </span>
                )}
              </div>

            </div>
          </header>

          {/* Core scrollable canvas space wrapper */}
          <main className="grow overflow-y-auto min-h-0 relative flex flex-col p-4 space-y-4">
            
            {/* Display active tab content */}
            {activeTab === "news" && (
              <div className="space-y-4 animate-fade-in flex flex-col grow">
                
                {/* Navigation Search & Filter Row */}
                <div className="space-y-2 shrink-0">
                  <div className="relative">
                    <Search className="absolute top-2.5 left-3 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher une actualité burkinabè..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  {/* Horizontal Scroll categories shelf */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar select-none">
                    {[
                      { id: "all", label: "📰 Tout" },
                      { id: "securite", label: "🛡️ Sécurité" },
                      { id: "economie", label: "📈 Économie" },
                      { id: "regions", label: "📍 Régions" },
                      { id: "sport", label: "⚽ Sport" },
                      { id: "culture", label: "🎭 Culture" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-nowrap font-semibold cursor-pointer shrink-0 transition ${
                          selectedCategory === cat.id
                            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
                            : "bg-white border border-slate-200 text-slate-650 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* News articles feed flow index */}
                <div className="space-y-3.5 grow">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                      <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-semibold animate-pulse">Chargement à basse consommation...</p>
                    </div>
                  ) : filterNewsList.length > 0 ? (
                    filterNewsList.map((story) => {
                      const isSaved = savedArticleIds.includes(story.id);
                      return (
                        <div
                          key={story.id}
                          className={`group relative bg-white dark:bg-slate-950 border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition duration-200 p-4.5 text-left ${
                            story.isAlert && story.alertLevel === "critical"
                              ? "border-red-500 bg-red-50/15 dark:bg-red-950/5"
                              : "border-slate-150 dark:border-slate-800/80"
                          }`}
                        >
                          {/* Top Tag descriptors */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              {story.isAlert ? (
                                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                                  story.alertLevel === "critical"
                                    ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                                }`}>
                                  Alerte {story.alertLevel === "critical" ? "Critique" : "Vigilance"}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 text-[9.5px] font-bold rounded-full uppercase bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-450">
                                  {story.category}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 font-mono font-medium">
                                {story.region}
                              </span>
                            </div>
                            <span className="text-[10.5px] font-mono text-slate-430">
                              {story.readTime}
                            </span>
                          </div>

                          {/* Heading Summary */}
                          <h3
                            onClick={() => setActiveArticle(story)}
                            className="font-bold text-sm text-slate-950 dark:text-slate-50 leading-snug tracking-tight mb-2 hover:text-red-650 cursor-pointer"
                          >
                            {story.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                            {story.summary}
                          </p>

                          {/* Quick Interactive Actions footer panel */}
                          <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 dark:border-slate-850">
                            <span className="text-[10px] text-slate-400 font-bold tracking-tight">
                              Source: <span className="text-slate-500 dark:text-slate-350">{story.source}</span>
                            </span>
                            <div className="flex items-center gap-2">
                              {/* Audio Speak click */}
                              <button
                                onClick={() => speakArticleSummary(story)}
                                className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-xl hover:text-indigo-650 dark:hover:text-indigo-400 cursor-pointer text-slate-500 dark:text-slate-400"
                                title="Lecture Vocale"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                              
                              {/* Bookmark Toggle */}
                              <button
                                onClick={() => toggleSaveArticle(story)}
                                className={`p-2 rounded-xl border cursor-pointer transition ${
                                  isSaved
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-800"
                                    : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-slate-900"
                                }`}
                                title="Sauvegarder Hors Ligne"
                              >
                                <Bookmark className="w-3.5 h-3.5" />
                              </button>

                              {/* Share Button trigger */}
                              <button
                                onClick={() => setShareArticle(story)}
                                className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-xl hover:text-blue-500 cursor-pointer text-slate-500 dark:text-slate-400"
                                title="Partager"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                      <Newspaper className="w-8 h-8 opacity-30 mb-2" />
                      <p className="text-xs">Aucun article ne correspond à vos filtres.</p>
                    </div>
                  )}
                </div>

                {/* Sub-footer detailing regional local compression metrics */}
                <div className="pt-2 shrink-0">
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl p-3 flex items-center justify-between font-mono text-[9px] text-slate-450 text-left">
                    <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-slate-400" /> Flux compressé à 1.4Ko/sec</span>
                    <span className="text-emerald-500 font-bold uppercase">Consommation Faible</span>
                  </div>
                </div>

              </div>
            )}

            {/* Offline reading room desk */}
            {activeTab === "offline" && (
              <div className="space-y-4 animate-fade-in flex flex-col grow">
                <div className="space-y-1.5 text-left border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 text-emerald-500" /> Archives Hors-Ligne
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ces articles de presse ont été pré-chargés et sont entièrement lisibles au marché ou en brousse en l'absence totale de réseau.
                  </p>
                </div>

                {offlineArticles.length > 0 ? (
                  <div className="space-y-4 grow">
                    {/* Clear all archives trigger */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          if (confirm("Videz toutes vos archives hors-ligne ?")) {
                            saveSavedState([], []);
                            showToast("Archives hors-ligne vidées.");
                          }
                        }}
                        className="text-[10.5px] text-red-500 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Tout Effacer
                      </button>
                    </div>

                    <div className="space-y-3">
                      {offlineArticles.map((story) => (
                        <div
                          key={story.id}
                          className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl p-4.5 text-left relative"
                        >
                          <div className="flex items-center justify-between mb-2 text-[10px] text-slate-400">
                            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-650 font-bold uppercase tracking-wide">
                              {story.category}
                            </span>
                            <span>{story.region}</span>
                          </div>
                          
                          <h4
                            onClick={() => setActiveArticle(story)}
                            className="font-bold text-xs text-slate-950 dark:text-slate-50 hover:underline cursor-pointer leading-snug mb-3.5"
                          >
                            {story.title}
                          </h4>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-850">
                            <span className="text-[10px] text-slate-400 font-mono">Archive Chargée ✓</span>
                            <div className="flex items-center gap-1.5">
                              {/* Delete bookmark only */}
                              <button
                                onClick={() => toggleSaveArticle(story)}
                                className="p-1 px-2.5 bg-red-50 text-red-650 text-[10px] font-bold rounded-lg hover:bg-red-100 transition"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-center space-y-2">
                    <Bookmark className="w-10 h-10 opacity-20 mb-1" />
                    <p className="text-xs font-semibold">Aucun article enregistré.</p>
                    <p className="text-[10.5px] text-slate-500 max-w-xs leading-normal">
                      Lorsque vous êtes connecté au réseau urbain, cliquez sur le signet des articles pour les enregistrer hors-ligne gratuitement.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Notification Subscription customizable configuration desk */}
            {activeTab === "notifications" && (
              <div className="space-y-4 animate-fade-in flex flex-col grow text-left">
                <div className="space-y-1 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-red-500" /> Notifications Personnalisées
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ajustez les fréquences d'alertes sécuritaires et sélectionnez vos thèmes favoris pour recevoir des push ciblés.
                  </p>
                </div>

                <NotificationCustomizer
                  settings={notificationSettings}
                  onUpdate={setNotificationSettings}
                  onSaveNotificationToast={() => showToast("✓ Préférences de notifications enregistrées locally.")}
                />
              </div>
            )}

            {/* Simulated Desktop Home launcher widget configurator */}
            {activeTab === "widget" && (
              <div className="space-y-4 animate-fade-in flex flex-col grow text-left">
                <div className="space-y-1 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Widget Écran d'Accueil
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Concevez et installez un widget Faso Actu personnalisable pour votre smartphone Android ou iPhone.
                  </p>
                </div>

                <HomeWidgetConfigurator
                  config={widgetConfig}
                  onChange={setWidgetConfig}
                  onWidgetToast={() => showToast("Widget Faso Actu simulé avec succès sur le Launcher matériel!")}
                />
              </div>
            )}

          </main>

          {/* User profile capsule widget inside drawer */}
          <div className="bg-white dark:bg-slate-950 px-4 py-3.5 border-t border-slate-100 dark:border-slate-850 shrink-0 z-30">
            <GoogleAuthModule
              session={session}
              onLogin={handleGoogleLogin}
              onLogout={handleGoogleLogout}
            />
          </div>

          {/* Navigation Tabbed bottom toolbar */}
          <nav className="h-14 bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800/80 shrink-0 flex items-center justify-around select-none z-30">
            {[
              { id: "news" as const, label: "Actus", icon: Newspaper },
              { id: "offline" as const, label: "Hors-ligne", icon: Bookmark },
              { id: "notifications" as const, label: "Alertes", icon: Bell },
              { id: "widget" as const, label: "Widget", icon: Sparkles },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center grow py-1 gap-1 cursor-pointer transition-colors ${
                    isSelected
                      ? "text-red-650 dark:text-yellow-500"
                      : "text-slate-400 hover:text-slate-650 dark:hover:text-slate-350"
                  }`}
                >
                  <IconComp className={`w-4.5 h-4.5 ${isSelected ? "stroke-[2.5px]" : "stroke-2"}`} />
                  <span className="text-[9.5px] font-bold tracking-tight">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* IMMERSIVE COMPACT FULL-SCREEN ARTICLE READER MODAL OVERLAY */}
          {activeArticle && (
            <div className="absolute inset-0 z-50 bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden animate-slide-up text-left">
              
              {/* Header inside story reader */}
              <header className="px-4 py-3 bg-white dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-850 flex items-center justify-between shrink-0">
                <button
                  onClick={() => {
                    if (voiceSynthesisActive) {
                      window.speechSynthesis.cancel();
                      setVoiceSynthesisActive(false);
                    }
                    setActiveArticle(null);
                  }}
                  className="p-1 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-xl hover:bg-slate-100 transition flex items-center gap-1 animate-pulse focus:outline-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => speakArticleSummary(activeArticle)}
                    className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-750 dark:bg-indigo-950/20 dark:border-indigo-900/40 rounded-xl text-xs flex items-center gap-1 focus:outline-none cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>En parler</span>
                  </button>
                  <button
                    onClick={() => toggleSaveArticle(activeArticle)}
                    className={`p-2 border rounded-xl cursor-pointer ${
                      savedArticleIds.includes(activeArticle.id)
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-995/20 text-emerald-350"
                        : "bg-slate-50 border-slate-150 text-slate-500 dark:bg-slate-900 dark:border-slate-800"
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </header>

              {/* Story Content Canvas */}
              <div className="grow overflow-y-auto p-5 space-y-4">
                {/* Meta header */}
                <div className="flex items-center gap-2 text-[10.5px] text-slate-400">
                  <span className="px-2 py-0.5 rounded-full bg-slate-250 dark:bg-slate-800 text-slate-650 dark:text-slate-300 font-bold uppercase">
                    {activeArticle.category}
                  </span>
                  <span>•</span>
                  <span>{activeArticle.region}</span>
                  <span>•</span>
                  <span>{activeArticle.date}</span>
                </div>

                {/* Article Headline */}
                <h1 className="text-lg font-black text-slate-950 dark:text-slate-50 tracking-tight leading-snug">
                  {activeArticle.title}
                </h1>

                {/* Simulated Data saving placeholder graphic (or real graphic if saver turned off) */}
                {deviceConfig.dataSaver ? (
                  <div className="bg-slate-100 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-850 p-4 rounded-2xl text-center space-y-1.5">
                    <p className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Mode Économique Actif</p>
                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-450">
                      L'image d'illustration (poids ~250Ko) a été volontairement supprimée pour optimiser et diviser par 15 votre utilisation de bande passante réseau mobile burkinabè.
                    </p>
                    <button
                      onClick={() => {
                        setDeviceConfig({ ...deviceConfig, dataSaver: false });
                        showToast("Téléchargement forcé de l'illustration (250Ko)...");
                      }}
                      className="text-[10px] text-indigo-500 hover:underline font-bold"
                    >
                      Forcer le téléchargement de l'image
                    </button>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden shadow-md max-h-48">
                    <img
                      src={`https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&w=350&q=80`}
                      alt={activeArticle.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                    <span className="absolute bottom-2.5 left-3 text-[9px] text-white/80 font-mono">Photo Presse Libre (250Ko)</span>
                  </div>
                )}

                {/* Article Summary Quote */}
                <div className="p-4 bg-red-50/10 border-l-3 border-red-650 dark:border-yellow-500 rounded-r-2xl font-sans italic text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  "{activeArticle.summary}"
                </div>

                {/* Story Body Paragraphs */}
                <div className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed space-y-3.5 antialiased font-sans">
                  {activeArticle.body.split("\n\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  <p>
                    Les correspondants locaux de Faso Actu signalent que les administrations locales ont dépêché des cellules de vigies pour accompagner la population. Suivez ce fil de dépêche pour toute directive administrative subséquente.
                  </p>
                </div>

                {/* Article sharing action line */}
                <div className="pt-4.5 border-t border-slate-200 dark:border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Presse du Burkina Faso</span>
                  <button
                    onClick={() => setShareArticle(activeArticle)}
                    className="py-2 px-3.5 bg-slate-900 text-slate-100 hover:bg-slate-850 border border-slate-800 dark:bg-slate-50 dark:text-slate-950 rounded-xl transition flex items-center gap-1.5 focus:outline-none"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Partager Maintenant</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* Social customized Share Modal Drawer */}
          {shareArticle && (
            <ShareSheet
              article={shareArticle}
              onClose={() => setShareArticle(null)}
              onShareToast={(msg) => showToast(msg)}
            />
          )}

          {/* Toast message system */}
          {toastMessage && (
            <div className="absolute top-[52px] left-1/2 transform -translate-x-1/2 z-55 w-80 max-w-sm px-4 select-none animate-slide-down pointer-events-none">
              <div className="py-2.5 px-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold rounded-xl shadow-lg border border-slate-850 flex items-center justify-center text-center">
                {toastMessage}
              </div>
            </div>
          )}

        </div>
      </GeofencingVerification>
    </DeviceSimulator>
  );
}
