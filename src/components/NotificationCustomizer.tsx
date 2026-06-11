/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Bell, BellOff, ShieldAlert, Moon, Sliders, CheckCircle } from "lucide-react";
import { NotificationSetting } from "../types";

interface NotificationCustomizerProps {
  settings: NotificationSetting;
  onUpdate: (updated: NotificationSetting) => void;
  onSaveNotificationToast: () => void;
}

export const NotificationCustomizer: React.FC<NotificationCustomizerProps> = ({
  settings,
  onUpdate,
  onSaveNotificationToast,
}) => {
  const toggleGlobalPush = () => {
    onUpdate({
      ...settings,
      enablePush: !settings.enablePush,
    });
  };

  const toggleCategory = (cat: keyof NotificationSetting["categories"]) => {
    onUpdate({
      ...settings,
      categories: {
        ...settings.categories,
        [cat]: !settings.categories[cat],
      },
    });
  };

  const setMinAlertLevel = (level: NotificationSetting["minAlertLevel"]) => {
    onUpdate({
      ...settings,
      minAlertLevel: level,
    });
  };

  const toggleQuietHours = () => {
    onUpdate({
      ...settings,
      quietHours: {
        ...settings.quietHours,
        enabled: !settings.quietHours.enabled,
      },
    });
  };

  const updateQuietHoursTime = (key: "start" | "end", val: string) => {
    onUpdate({
      ...settings,
      quietHours: {
        ...settings.quietHours,
        [key]: val,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Global push toggle card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white p-5 shadow-md">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3" />
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="font-bold text-base tracking-tight flex items-center gap-1.5">
              <Bell className="w-5 h-5" /> Notifications push
            </h4>
            <p className="text-xs text-red-100 leading-normal max-w-[200px]">
              Activez pour recevoir les alertes vitales de sécurité du Burkina Faso en temps réel.
            </p>
          </div>
          <button
            onClick={toggleGlobalPush}
            className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-250 ease-in-out focus:outline-none ${
              settings.enablePush ? "bg-white" : "bg-red-700/60"
            }`}
            id="toggle-global-push"
          >
            <div
              className={`w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-250 ease-in-out ${
                settings.enablePush 
                  ? "translate-x-6 bg-red-600" 
                  : "translate-x-0 bg-slate-100"
              }`}
            />
          </button>
        </div>
      </div>

      {settings.enablePush ? (
        <div className="space-y-5 animate-fade-in">
          {/* Categories select checklist */}
          <div className="space-y-2">
            <h5 className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Thèmes d'Intérêt
            </h5>
            <div className="grid grid-cols-2 gap-2.5">
              {(Object.keys(settings.categories) as Array<keyof NotificationSetting["categories"]>).map((cat) => {
                const isSelected = settings.categories[cat];
                const labels: Record<string, string> = {
                  politique: "Politique",
                  economie: "Économie",
                  securite: "Sécurité / Secours",
                  regions: "Régionales",
                  sport: "Sport / Étalons",
                  culture: "Culture / FESPACO",
                };
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`py-3 px-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-950"
                        : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <span className="text-xs font-semibold capitalize">{labels[cat]}</span>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 ml-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minimun threat level dropdown slider */}
          <div className="space-y-2">
            <h5 className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Seuil de Gravité Sécuritaire
            </h5>
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Déterminez à partir de quel niveau de risque vous souhaitez réveiller votre appareil :
              </p>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/55 dark:bg-slate-800 rounded-xl">
                {(["info", "warning", "critical"] as const).map((level) => {
                  const isActive = settings.minAlertLevel === level;
                  const labels = { info: "Info", warning: "Moyen", critical: "Urgence" };
                  const bgs = {
                    info: "bg-blue-600 text-white",
                    warning: "bg-amber-600 text-white",
                    critical: "bg-red-600 text-white",
                  };
                  return (
                    <button
                      key={level}
                      onClick={() => setMinAlertLevel(level)}
                      className={`py-2 text-[11px] font-bold rounded-lg transition-all ${
                        isActive
                          ? bgs[level]
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                      }`}
                    >
                      {labels[level]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quiet Hours Picker (Heures Silencieuses) */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-500" />
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Mode Heures Silencieuses
                </h5>
              </div>
              <button
                onClick={toggleQuietHours}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${
                  settings.quietHours.enabled ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                    settings.quietHours.enabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 animate-slide-down">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-normal">
                    Début extinction
                  </label>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => updateQuietHoursTime("start", e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs font-mono font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-normal">
                    Fin silence
                  </label>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => updateQuietHoursTime("end", e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs font-mono font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
          <Moon className="w-8 h-8 opacity-30 mb-2" />
          <p className="text-xs font-sans">
            Sélectionnez les notifications push pour activer les filtres personnalisables.
          </p>
        </div>
      )}

      {/* Action confirmation button */}
      <button
        onClick={onSaveNotificationToast}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-4 h-4" />
        <span>Enregistrer mes Préférences</span>
      </button>
    </div>
  );
};
