import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { supabase } from '@/lib/supabaseClient';
import { LANDING_DEFAULTS } from '@/config/landingDefaults';

/**
 * SiteContentContext — single source of truth for editable landing-page copy.
 *
 *  • Loads `public.site_content[id='landing'].content` on mount.
 *  • Subscribes to realtime updates so visitors see admin edits within ~1s.
 *  • Exposes:
 *      t(key)             → string. Returns the saved override or the
 *                           hard-coded default from LANDING_DEFAULTS.
 *      isOverridden(key)  → boolean.
 *      isEditing          → boolean. True only inside the admin editor.
 *      stage(key, value)  → buffers a local edit (no DB write).
 *      stagedDraft        → the buffered draft so the editor can show it.
 *      saveDraft()        → flushes the staged draft to Supabase.
 *      discardDraft()     → throws away the staged draft.
 *      resetKey(key)      → drops the override for one key (back to default).
 *      resetAll()         → wipes every override.
 *      setEditing(b)      → toggle editor mode (only the editor route uses).
 */

export type LandingContent = Record<string, string>;

interface Ctx {
  /** Saved content currently rendered to visitors. */
  saved: LandingContent;
  /** Local draft used by the editor. Same shape as saved. */
  stagedDraft: LandingContent;
  /** Convenience getter: draft override → saved override → default. */
  t: (key: string) => string;
  isOverridden: (key: string) => boolean;
  hasUnsavedChanges: boolean;
  isEditing: boolean;
  setEditing: (b: boolean) => void;
  stage: (key: string, value: string) => void;
  saveDraft: () => Promise<{ error: Error | null }>;
  discardDraft: () => void;
  resetKey: (key: string) => void;
  resetAll: () => Promise<{ error: Error | null }>;
  saving: boolean;
  loading: boolean;
}

const SiteContentContext = createContext<Ctx | null>(null);

export const SiteContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [saved, setSaved] = useState<LandingContent>({});
  const [stagedDraft, setStagedDraft] = useState<LandingContent>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ---- Initial load + realtime subscription -------------------------------

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 'landing')
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.warn('[siteContent] load error', error.message);
      }
      const next = (data?.content as LandingContent) || {};
      setSaved(next);
      setLoading(false);
    };

    load();

    const channel = supabase
      .channel('site-content-landing')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_content', filter: 'id=eq.landing' },
        (payload) => {
          const row = (payload.new as any) ?? (payload.old as any);
          const next = (row?.content as LandingContent) || {};
          setSaved(next);
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      cancelled = true;
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    };
  }, []);

  // ---- Public API ---------------------------------------------------------

  const t = useCallback(
    (key: string) => {
      if (Object.prototype.hasOwnProperty.call(stagedDraft, key)) return stagedDraft[key];
      if (Object.prototype.hasOwnProperty.call(saved, key)) return saved[key];
      return LANDING_DEFAULTS[key] ?? '';
    },
    [saved, stagedDraft]
  );

  const isOverridden = useCallback(
    (key: string) =>
      Object.prototype.hasOwnProperty.call(stagedDraft, key) ||
      Object.prototype.hasOwnProperty.call(saved, key),
    [saved, stagedDraft]
  );

  const stage = useCallback((key: string, value: string) => {
    setStagedDraft((d) => {
      const next = { ...d };
      const def = LANDING_DEFAULTS[key] ?? '';
      const savedVal = saved[key];
      // If the new value matches the default and there is no saved override,
      // we don't need to keep an override at all — drop it.
      if (value === def && savedVal === undefined) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  }, [saved]);

  const discardDraft = useCallback(() => setStagedDraft({}), []);

  const resetKey = useCallback(
    (key: string) => {
      setStagedDraft((d) => {
        // Stage an empty string only if a saved override exists. If no saved
        // override exists, just drop the key from the draft so it reverts.
        const next = { ...d };
        if (Object.prototype.hasOwnProperty.call(saved, key)) {
          next[key] = LANDING_DEFAULTS[key] ?? '';
        } else {
          delete next[key];
        }
        return next;
      });
    },
    [saved]
  );

  const saveDraft = useCallback(async () => {
    setSaving(true);
    try {
      // Merge: start from saved, overlay draft. Drop any keys whose value
      // equals the default — keeps the JSONB row tidy.
      const merged: LandingContent = { ...saved, ...stagedDraft };
      for (const k of Object.keys(merged)) {
        const def = LANDING_DEFAULTS[k] ?? '';
        if (merged[k] === def) delete merged[k];
      }

      const { error } = await supabase
        .from('site_content')
        .upsert(
          { id: 'landing', content: merged, updated_at: new Date().toISOString() },
          { onConflict: 'id' }
        );

      if (error) throw error;

      setSaved(merged);
      setStagedDraft({});
      return { error: null };
    } catch (e: any) {
      return { error: e as Error };
    } finally {
      setSaving(false);
    }
  }, [saved, stagedDraft]);

  const resetAll = useCallback(async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert(
          { id: 'landing', content: {}, updated_at: new Date().toISOString() },
          { onConflict: 'id' }
        );
      if (error) throw error;
      setSaved({});
      setStagedDraft({});
      return { error: null };
    } catch (e: any) {
      return { error: e as Error };
    } finally {
      setSaving(false);
    }
  }, []);

  const hasUnsavedChanges = Object.keys(stagedDraft).length > 0;

  const value: Ctx = useMemo(
    () => ({
      saved,
      stagedDraft,
      t,
      isOverridden,
      hasUnsavedChanges,
      isEditing,
      setEditing: setIsEditing,
      stage,
      saveDraft,
      discardDraft,
      resetKey,
      resetAll,
      saving,
      loading,
    }),
    [saved, stagedDraft, t, isOverridden, hasUnsavedChanges, isEditing, stage, saveDraft, discardDraft, resetKey, resetAll, saving, loading]
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
};

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error('useSiteContent must be used within SiteContentProvider');
  }
  return ctx;
}
