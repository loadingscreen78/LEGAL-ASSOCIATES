import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Undo2, RotateCcw, Loader2, ExternalLink,
  Smartphone, Monitor, Eye, Edit3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSiteContent } from '@/contexts/SiteContentContext';
import { HeroSection } from '@/components/home/HeroSection';
import { TopJournalsCarousel } from '@/components/home/TopJournalsCarousel';
import { RecentlyPublished } from '@/components/home/RecentlyPublished';
import { AboutSection } from '@/components/home/AboutSection';
import { FounderQuote } from '@/components/home/FounderQuote';
import { BookCategoriesGrid } from '@/components/home/BookCategoriesGrid';
import { SearchFilterSection } from '@/components/home/SearchFilterSection';
import { StoreGallery } from '@/components/home/StoreGallery';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CallToActionFooter } from '@/components/home/CallToActionFooter';
import { MobileHome } from '@/components/mobile/MobileHome';

/**
 * LandingEditor — visual inline editor for the public landing page.
 *
 *  • Renders the actual HeroSection / RecentlyPublished / About / etc.
 *    components inside an iframe-like container so the admin sees what the
 *    visitor sees, pixel for pixel.
 *  • The SiteContentContext is shared, so flipping `setEditing(true)` here
 *    turns every <EditableText> in those public components into a click-to-
 *    edit field — no duplicate markup, no risk of drift.
 *  • A floating toolbar lets the admin save, discard the local draft, or
 *    reset every override back to the hard-coded defaults.
 *  • A device toggle previews mobile vs desktop layouts. Switching does
 *    NOT reload — it just hides one tree and shows the other.
 *  • Unload guard prompts before navigating away with unsaved changes.
 */

type Device = 'desktop' | 'mobile';

export const LandingEditor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isEditing, setEditing, hasUnsavedChanges, stagedDraft,
    saveDraft, discardDraft, resetAll, saving, loading,
  } = useSiteContent();

  const [device, setDevice] = useState<Device>('desktop');

  // Turn editing on while this page is mounted; turn it off on unmount so
  // visitors never accidentally see the editing chrome.
  useEffect(() => {
    setEditing(true);
    return () => setEditing(false);
  }, [setEditing]);

  // Browser-level guard against losing unsaved edits.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSave = async () => {
    const { error } = await saveDraft();
    if (error) {
      toast({
        title: 'Save failed',
        description: error.message || 'Could not save your edits. Please try again.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Saved',
      description: 'Your edits are now live on the public site.',
    });
  };

  const handleDiscard = () => {
    if (!hasUnsavedChanges) return;
    if (!confirm('Discard all unsaved edits on the landing page?')) return;
    discardDraft();
  };

  const handleResetAll = async () => {
    const ok = confirm(
      'Reset every landing-page text back to the original defaults? This cannot be undone.'
    );
    if (!ok) return;
    const { error } = await resetAll();
    if (error) {
      toast({ title: 'Reset failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Reset', description: 'All overrides have been cleared.' });
  };

  const handleExit = () => {
    if (
      hasUnsavedChanges &&
      !confirm('You have unsaved changes. Leave the editor anyway?')
    ) {
      return;
    }
    discardDraft();
    navigate('/admin-dashboard');
  };

  const stagedCount = Object.keys(stagedDraft).length;

  return (
    <div className="-mx-4 md:-mx-8 -mt-6">
      {/* Toolbar */}
      <div
        className="sticky top-0 z-50 border-b backdrop-blur"
        style={{ background: 'rgba(255,255,255,0.92)', borderColor: '#E2E8F0' }}
      >
        <div className="px-4 md:px-6 py-3 flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExit}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition"
            style={{ color: '#475569' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#F1F5F9' }}>
            <Edit3 className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span className="text-sm font-semibold" style={{ color: '#1E293B' }}>
              Landing page editor
            </span>
            <span className="text-xs" style={{ color: '#64748B' }}>
              · Click any text to edit
            </span>
          </div>

          {/* Device toggle */}
          <div className="ml-auto flex items-center gap-1 p-1 rounded-full" style={{ background: '#F1F5F9' }}>
            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition`}
              style={{
                background: device === 'desktop' ? '#FFFFFF' : 'transparent',
                color: device === 'desktop' ? '#1E293B' : '#64748B',
                boxShadow: device === 'desktop' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
              aria-pressed={device === 'desktop'}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition`}
              style={{
                background: device === 'mobile' ? '#FFFFFF' : 'transparent',
                color: device === 'mobile' ? '#1E293B' : '#64748B',
                boxShadow: device === 'mobile' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
              aria-pressed={device === 'mobile'}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
          </div>

          {/* Status pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
               style={{
                 background: hasUnsavedChanges ? '#FEF3C7' : '#DCFCE7',
                 color: hasUnsavedChanges ? '#92400E' : '#166534',
               }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: hasUnsavedChanges ? '#D97706' : '#16A34A' }} />
            {hasUnsavedChanges ? `${stagedCount} unsaved` : 'In sync'}
          </div>

          {/* Actions */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition"
            style={{ color: '#475569' }}
            title="Open the live homepage in a new tab"
          >
            <ExternalLink className="w-4 h-4" /> View live
          </a>

          <Button
            type="button"
            onClick={handleDiscard}
            variant="outline"
            disabled={!hasUnsavedChanges || saving}
            className="gap-1.5"
          >
            <Undo2 className="w-4 h-4" /> Discard
          </Button>

          <Button
            type="button"
            onClick={handleResetAll}
            variant="outline"
            disabled={saving}
            className="gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Reset all
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={!hasUnsavedChanges || saving}
            className="gap-1.5"
            style={{ background: '#D4AF37', color: '#101820' }}
          >
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              : <><Save className="w-4 h-4" /> Save changes</>}
          </Button>
        </div>

        {/* Hint banner under the toolbar */}
        <div className="px-4 md:px-6 pb-3 flex items-center gap-2 text-xs" style={{ color: '#64748B' }}>
          <Eye className="w-3 h-3" />
          <span>
            What you see below is exactly what visitors will see. Click any text element with the dotted gold outline to edit it inline.
          </span>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="py-24 text-center">
          <Loader2 className="w-10 h-10 mx-auto animate-spin" style={{ color: '#D4AF37' }} />
          <p className="mt-3 text-sm" style={{ color: '#64748B' }}>
            Loading current landing-page content…
          </p>
        </div>
      )}

      {/* Editor canvas */}
      {!loading && (
        <div className="bg-background pb-12">
          {device === 'desktop' ? (
            <div className="border-y" style={{ borderColor: '#E2E8F0' }}>
              <DesktopPreview />
            </div>
          ) : (
            <MobilePreview />
          )}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Preview wrappers                                                          */
/* -------------------------------------------------------------------------- */

const DesktopPreview = () => (
  <div className="bg-background text-foreground">
    <HeroSection />
    <RecentlyPublished />
    <TopJournalsCarousel />
    <AboutSection />
    <FounderQuote />
    <BookCategoriesGrid />
    <SearchFilterSection />
    <StoreGallery />
    <TestimonialsSection />
    <CallToActionFooter />
  </div>
);

const MobilePreview = () => (
  <div className="mx-auto" style={{ maxWidth: 420 }}>
    <div
      className="rounded-[36px] overflow-hidden mt-6 mb-12"
      style={{
        border: '10px solid #1F2937',
        boxShadow: '0 30px 80px rgba(15,23,42,0.25)',
        background: '#0B1017',
      }}
    >
      <div className="origin-top">
        {/* MobileHome includes its own md:hidden gate, but inside the editor
            we always want it visible regardless of the actual viewport, so
            we override that with a parent that forces display. */}
        <ForceMobileHome />
      </div>
    </div>
  </div>
);

/**
 * MobileHome internally uses `md:hidden` so it disappears on desktops. We
 * need it to render inside the desktop admin canvas, so we mount it inside
 * a wrapper that resets that media-query behavior using a CSS override.
 */
const ForceMobileHome = () => {
  return (
    <>
      <style>{`
        .force-mobile main.md\\:hidden { display: block !important; }
      `}</style>
      <div className="force-mobile">
        <MobileHome />
      </div>
    </>
  );
};

export default LandingEditor;
