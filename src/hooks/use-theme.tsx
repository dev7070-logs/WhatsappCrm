"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  DEFAULT_MODE,
  DEFAULT_THEME,
  MODE_STORAGE_KEY,
  STORAGE_KEY,
  isMode,
  isThemeId,
  type Mode,
  type ThemeId,
} from "@/lib/themes";

/**
 * ThemeProvider — wraps the whole app, owns the two theming axes:
 *   • `theme` — the accent color (`data-theme` on <html>)
 *   • `mode`  — light / dark (`data-mode` on <html>)
 * The two are independent, so any accent renders in either mode.
 *
 * The boot script in `src/app/layout.tsx` has already applied both
 * `data-theme` and `data-mode` before React hydrates, so by the time
 * this Provider mounts the page is already painted correctly. We just
 * read what's there and keep it in sync going forward.
 *
 * Persistence is localStorage only (device-scoped). A future
 * follow-up could mirror to `profiles.preferences` for cross-device
 * sync, but a per-device choice is also defensible — your phone may
 * deserve a different theme than your laptop.
 */

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (next: ThemeId) => void;
  mode: Mode;
  setMode: (next: Mode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// The live values are the `data-theme` / `data-mode` attributes on
// <html> — the boot script in layout.tsx has already set them from
// localStorage (or the OS preference) before React hydrates. We read
// them through useSyncExternalStore so the server render and the first
// client render agree on the defaults (no hydration mismatch), then
// React immediately re-renders with the real attribute values.
const CHANGE_EVENT = "wacrm:theme-change";

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    // Sync from other tabs — change theme or mode in tab A, tab B
    // catches up without a refresh.
    if (e.key === STORAGE_KEY && isThemeId(e.newValue)) {
      document.documentElement.dataset.theme = e.newValue;
    } else if (e.key === MODE_STORAGE_KEY && isMode(e.newValue)) {
      document.documentElement.dataset.mode = e.newValue;
    } else {
      return;
    }
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getThemeSnapshot(): ThemeId {
  const fromAttr = document.documentElement.dataset.theme;
  return isThemeId(fromAttr) ? fromAttr : DEFAULT_THEME;
}

function getModeSnapshot(): Mode {
  const fromAttr = document.documentElement.dataset.mode;
  return isMode(fromAttr) ? fromAttr : DEFAULT_MODE;
}

function persist(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage can throw in private-browsing / sandboxed contexts;
    // the attribute still updates so the current tab works.
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    () => DEFAULT_THEME,
  );
  const mode = useSyncExternalStore(
    subscribe,
    getModeSnapshot,
    () => DEFAULT_MODE,
  );

  const setTheme = useCallback((next: ThemeId) => {
    document.documentElement.dataset.theme = next;
    persist(STORAGE_KEY, next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const setMode = useCallback((next: Mode) => {
    document.documentElement.dataset.mode = next;
    persist(MODE_STORAGE_KEY, next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const toggleMode = useCallback(() => {
    setMode(getModeSnapshot() === "dark" ? "light" : "dark");
  }, [setMode]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback for components rendered outside the provider — return
    // no-op setters so callers don't crash. The boot script still
    // applied the right CSS attributes, so visually the page is fine.
    return {
      theme: DEFAULT_THEME,
      setTheme: () => {},
      mode: DEFAULT_MODE,
      setMode: () => {},
      toggleMode: () => {},
    };
  }
  return ctx;
}
