/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MapPin, ShieldAlert, Wifi, Globe, HeartHandshake } from "lucide-react";

interface GeofencingVerificationProps {
  simulatedInBurkina: boolean;
  onToggleSimulation: (val: boolean) => void;
  children: React.ReactNode;
}

export const GeofencingVerification: React.FC<GeofencingVerificationProps> = ({
  simulatedInBurkina,
  onToggleSimulation,
  children,
}) => {
  if (simulatedInBurkina) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-full max-w-sm mx-auto animate-fade-in my-auto">
      {/* Visual map pin and exclusion radar ring */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-100 dark:bg-red-950/30 rounded-full animate-ping opacity-60 scale-150" />
        <div className="relative p-5 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-3xl shadow-lg shadow-red-500/20">
          <MapPin className="w-8 h-8" />
        </div>
        <div className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 p-1.5 rounded-full border border-white dark:border-slate-950">
          <ShieldAlert className="w-3.5 h-3.5" />
        </div>
      </div>

      <h2 className="text-xl font-bold font-sans text-slate-950 dark:text-slate-50 tracking-tight leading-snug mb-2">
        Restriction Géographique
      </h2>
      
      {/* Burkibabè patriotic visual bar */}
      <div className="h-1 w-24 flex rounded-full overflow-hidden mb-4 mx-auto shadow-xs">
        <div className="h-full w-1/2 bg-red-600" />
        <div className="h-full w-1/2 bg-green-600" />
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        Conformément aux régulations d'alertes sécuritaires locales et pour optimiser la consommation de la bande passante nationale, l'application <span className="font-semibold text-slate-950 dark:text-slate-50">Faso Actu</span> est strictement certifiée pour être utilisée à l'intérieur des frontières du <span className="font-medium text-slate-800 dark:text-slate-200">Burkina Faso</span> (uniquement utilisable au Burkina Faso).
      </p>

      {/* Telemetry diagnostics cards */}
      <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl p-4 mb-6 text-left space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-500">
          <span className="flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5 text-slate-400" /> Signal IP</span>
          <span className="text-red-500 font-semibold uppercase">À l'étranger</span>
        </div>
        <div className="flex items-center justify-between text-slate-500">
          <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-slate-400" /> GPS Latitude</span>
          <span className="font-medium">Indéterminé (Hors BF)</span>
        </div>
        <div className="h-[1px] bg-slate-200 dark:bg-slate-800" />
        <div className="text-[10px] text-slate-400 leading-normal flex gap-2">
          <HeartHandshake className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Pour tester et évaluer Faso Actu d'un autre pays, simulez ci-dessous une position valide à Ouagadougou.</span>
        </div>
      </div>

      <button
        onClick={() => onToggleSimulation(true)}
        className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs dark:bg-slate-50 dark:hover:bg-slate-100 dark:text-slate-950 rounded-2xl shadow-md transition flex items-center justify-center gap-2"
        id="btn-simulate-gps"
      >
        <MapPin className="w-4 h-4 text-red-500" />
        <span>Simuler GPS : Ouagadougou (Faso)</span>
      </button>

      <span className="text-[10.5px] text-slate-400 mt-4 italic font-sans">
        * Activera le canal hertzien et compressera le flux à 24kbs/s
      </span>
    </div>
  );
};
