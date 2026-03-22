"use client";

import { useState, useEffect, useCallback } from "react";

// Credit cost table for each quality tier
export const UPSCALE_COSTS = {
  HD: 50,
  "2K": 300,
  "4K": 500,
} as const;

export type UpscaleQuality = keyof typeof UPSCALE_COSTS;

export interface UpscaleHistoryItem {
  id: string;
  url: string;
  platform: string;
  thumbnail?: string;
  quality: UpscaleQuality;
  creditsUsed: number;
  timestamp: number;
  duration: number; // in seconds
}

const CREDITS_KEY = "mtlabs_credits";
const HISTORY_KEY = "mtlabs_upscale_history";
const INITIAL_CREDITS = 1000;

function getStoredCredits(): number {
  if (typeof window === "undefined") return INITIAL_CREDITS;
  const stored = localStorage.getItem(CREDITS_KEY);
  // First time user — give 1000 free credits
  if (stored === null) {
    localStorage.setItem(CREDITS_KEY, String(INITIAL_CREDITS));
    return INITIAL_CREDITS;
  }
  return parseInt(stored, 10);
}

function storeCredits(amount: number) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CREDITS_KEY, String(amount));
  }
}

function getHistory(): UpscaleHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(history: UpscaleHistoryItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
}

export function useCredits() {
  const [credits, setCreditsState] = useState<number>(INITIAL_CREDITS);
  const [history, setHistoryState] = useState<UpscaleHistoryItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCreditsState(getStoredCredits());
    setHistoryState(getHistory());
    setHydrated(true);
  }, []);

  const addCredits = useCallback((amount: number) => {
    setCreditsState((prev) => {
      const next = prev + amount;
      storeCredits(next);
      return next;
    });
  }, []);

  const deductCredits = useCallback(
    (quality: UpscaleQuality): boolean => {
      const cost = UPSCALE_COSTS[quality];
      if (credits < cost) return false;
      const next = credits - cost;
      storeCredits(next);
      setCreditsState(next);
      return true;
    },
    [credits]
  );

  const addHistoryItem = useCallback(
    (item: Omit<UpscaleHistoryItem, "id" | "timestamp">) => {
      const newItem: UpscaleHistoryItem = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      setHistoryState((prev) => {
        const next = [newItem, ...prev].slice(0, 50); // Keep last 50
        saveHistory(next);
        return next;
      });
    },
    []
  );

  const clearHistory = useCallback(() => {
    saveHistory([]);
    setHistoryState([]);
  }, []);

  return { credits, history, hydrated, addCredits, deductCredits, addHistoryItem, clearHistory };
}
