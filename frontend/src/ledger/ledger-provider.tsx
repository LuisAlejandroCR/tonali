// ledger-provider.tsx: React context that loads, appends to and saves the device-local origin log.
// Stands in for the Soroban contract; if storage fails the app keeps working in memory and says so.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { toLocalDate } from '@/domain/dates';
import { buildDemoLog } from '@/domain/demo-data';
import { appendEvent, deriveState, type Clock } from '@/domain/ledger';
import { parseStoredEvents, serializeEvents } from '@/domain/serialization';
import type { LedgerEvent, LedgerState, Result } from '@/domain/types';

const STORAGE_KEY = 'tonali.ledger.v1';
const HAPTICS_KEY = 'tonali.haptics.v1';

type Command = (events: readonly LedgerEvent[], clock: Clock) => Result<LedgerEvent>;

interface LedgerContextValue {
  ready: boolean;
  state: LedgerState;
  storageWarning: string | null;
  submit: (command: Command) => Promise<Result<LedgerEvent>>;
  resetDemo: () => Promise<void>;
  generation: number;
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
}

const LedgerContext = createContext<LedgerContextValue | null>(null);

const STORAGE_FAILED = 'No se pudo guardar en este dispositivo: los cambios se perderán al cerrar la app.';

async function save(events: readonly LedgerEvent[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, serializeEvents(events));
    return true;
  } catch {
    return false;
  }
}

async function load(): Promise<{ events: LedgerEvent[]; warning: string | null }> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw === null) return { events: buildDemoLog(), warning: null };
    const parsed = parseStoredEvents(raw);
    if (parsed) return { events: parsed, warning: null };
    return { events: buildDemoLog(), warning: 'Los datos guardados estaban dañados y se volvió a cargar la demostración.' };
  } catch {
    return { events: buildDemoLog(), warning: STORAGE_FAILED };
  }
}

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<LedgerEvent[]>([]);
  const [ready, setReady] = useState(false);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [hapticsEnabled, setHapticsState] = useState(true);
  const [generation, setGeneration] = useState(0);
  const latest = useRef<LedgerEvent[]>([]);

  useEffect(() => {
    let active = true;
    load().then(({ events: loaded, warning }) => {
      if (!active) return;
      latest.current = loaded;
      setEvents(loaded);
      setStorageWarning(warning);
      setReady(true);
    });
    AsyncStorage.getItem(HAPTICS_KEY)
      .then((raw) => {
        if (active && raw === 'off') setHapticsState(false);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const setHapticsEnabled = useCallback((enabled: boolean) => {
    setHapticsState(enabled);
    AsyncStorage.setItem(HAPTICS_KEY, enabled ? 'on' : 'off').catch(() => undefined);
  }, []);

  const commit = useCallback(async (next: LedgerEvent[]) => {
    latest.current = next;
    setEvents(next);
    const saved = await save(next);
    setStorageWarning(saved ? null : STORAGE_FAILED);
  }, []);

  const submit = useCallback(
    async (command: Command): Promise<Result<LedgerEvent>> => {
      const now = new Date();
      const result = command(latest.current, { now: now.toISOString(), today: toLocalDate(now) });
      if (!result.ok) return result;
      const appended = appendEvent(latest.current, result.value);
      if (!appended.ok) return appended;
      await commit(appended.value);
      return result;
    },
    [commit],
  );

  const resetDemo = useCallback(async () => {
    await commit(buildDemoLog());
    setGeneration((value) => value + 1);
  }, [commit]);

  const value = useMemo(
    () => ({
      ready,
      state: deriveState(events),
      storageWarning,
      submit,
      resetDemo,
      generation,
      hapticsEnabled,
      setHapticsEnabled,
    }),
    [ready, events, storageWarning, submit, resetDemo, generation, hapticsEnabled, setHapticsEnabled],
  );

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
}

export function useLedger(): LedgerContextValue {
  const context = useContext(LedgerContext);
  if (!context) throw new Error('useLedger must be used inside LedgerProvider');
  return context;
}
