/**
 * LANDING_DEFAULTS — every editable string on the home / landing page.
 *
 * The admin landing-editor lets admins override any of these. If a key is
 * not overridden in the `site_content` table, we fall back to the value
 * here, so the page never looks broken even before any edits are saved.
 *
 * Adding a new editable string later is two steps:
 *   1. Add a key here with the default text.
 *   2. Wrap the rendered text with <EditableText keyName="that.key" />.
 */
export const LANDING_DEFAULTS: Record<string, string> = {
  // ---- Desktop hero ------------------------------------------------------
  'hero.badge':           'Established in Cuttack, Odisha',
  'hero.title':           'Empowering Legal Minds',
  'hero.titleHighlight':  'Since 1980',
  'hero.subtitle':        'Your trusted partner in legal publishing, journals, and law books.',
  'hero.ctaPrimary':      'Explore Books',
  'hero.ctaSecondary':    'Visit Our Store',
  'hero.stat1.value':     '40+',
  'hero.stat1.label':     'Years of Excellence',
  'hero.stat2.value':     '500+',
  'hero.stat2.label':     'Publications',
  'hero.stat3.value':     '10K+',
  'hero.stat3.label':     'Happy Customers',
  'hero.scroll':          'Scroll',

  // ---- Mobile hero -------------------------------------------------------
  'mobileHero.badge':       'Since 1980 · Cuttack, Odisha',
  'mobileHero.title':       'Empowering',
  'mobileHero.titleAccent': 'Legal Minds',
  'mobileHero.subtitle':    'Journals, bare acts, and legal publications trusted by professionals.',
  'mobileHero.search':      'Search books, journals…',
  'mobileHero.ctaExplore':  'Explore',
  'mobileHero.ctaVisit':    'Visit Store',
  'mobileHero.statYears':   '40+',
  'mobileHero.statTitles':  '500+',
  'mobileHero.statHappy':   '10K+',
  'mobileHero.statYearsLabel':  'Years',
  'mobileHero.statTitlesLabel': 'Titles',
  'mobileHero.statHappyLabel':  'Customers',
  'mobileHero.categoriesTitle': 'Browse categories',

  // ---- Top journals carousel --------------------------------------------
  'topJournals.eyebrow':  'Featured Publications',
  'topJournals.title':    'Top Legal',
  'topJournals.titleAccent': 'Journals',
  'topJournals.subtitle': 'Discover our latest legal journals trusted by professionals nationwide',
  'topJournals.cta':      'Browse All Journals',

  // ---- Recently published -----------------------------------------------
  'recentlyPublished.eyebrow':       'Just in',
  'recentlyPublished.title':         'Recently',
  'recentlyPublished.titleAccent':   'Published',
  'recentlyPublished.subtitle':      'The latest titles added to our catalog by the editorial team. Updated live.',
  'recentlyPublished.cta':           'Browse the catalog',
  'recentlyPublished.mobileTitle':   'Recently published',

  // ---- About -------------------------------------------------------------
  'about.eyebrow':       'About Us',
  'about.title':         'Legal',
  'about.titleAccent':   'Associates',
  'about.subtitle':      'A cornerstone of legal education and professional development in India since 1980',

  // ---- Categories grid (desktop section header) -------------------------
  'categories.title':    'Browse by Category',
  'categories.subtitle': 'Find the right publication for your area of practice',

  // ---- Testimonials ------------------------------------------------------
  'testimonials.eyebrow':  'Testimonials',
  'testimonials.title':    'What Our',
  'testimonials.titleAccent': 'Customers Say',

  // ---- Newsletter / footer CTA ------------------------------------------
  'newsletter.eyebrow':  'Newsletter',
  'newsletter.title':    'Stay Updated with',
  'newsletter.titleAccent': 'Legal Publications',
  'newsletter.subtitle': 'Subscribe to receive the latest releases, legal updates, and exclusive offers',
  'newsletter.placeholder': 'Enter your email address',
  'newsletter.cta':      'Subscribe',

  // ---- Founder quote -----------------------------------------------------
  'founderQuote.text':   'Justice delayed is justice denied, but knowledge delivered is wisdom gained.',
  'founderQuote.author': 'Akshaya Kumar Deo, Founder',
};

/** Convenience: list of every editable key — used by the editor sidebar. */
export const LANDING_KEYS = Object.keys(LANDING_DEFAULTS);
