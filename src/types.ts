/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: "politique" | "economie" | "securite" | "regions" | "sport" | "culture";
  date: string; // ISO string or relative time
  imageUrl?: string;
  region?: string;
  isAlert?: boolean;
  alertLevel?: "info" | "warning" | "critical";
  source: string;
  readTime: string;
}

export interface NotificationSetting {
  enablePush: boolean;
  categories: {
    politique: boolean;
    economie: boolean;
    securite: boolean;
    regions: boolean;
    sport: boolean;
    culture: boolean;
  };
  minAlertLevel: "info" | "warning" | "critical";
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface UserSession {
  isLoggedIn: boolean;
  name: string;
  email: string;
  avatar: string;
}

export interface WidgetConfig {
  size: "small" | "medium" | "large";
  theme: "light" | "dark" | "patriotic";
  category: "all" | "securite" | "politique" | "regions";
}

export interface DeviceConfig {
  platform: "ios" | "android";
  simulatedInBurkina: boolean;
  dataSaver: boolean;
}
