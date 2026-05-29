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

  // ---- About -> Journey timeline (5 milestones) -------------------------
  // The journey block on the AboutSection ("Our Journey Through Time")
  'about.journey.title':         'Our Journey',
  'about.journey.titleAccent':   'Through Time',
  'about.journey.subtitle':      'Four decades of excellence in legal publishing',
  'about.journey.m1.year':        '1980',
  'about.journey.m1.title':       'The Beginning',
  'about.journey.m1.description': 'Founded a small bookstore in Cuttack with just 50 law books and a vision to serve legal professionals',
  'about.journey.m2.year':        '1992',
  'about.journey.m2.title':       'First Publication',
  'about.journey.m2.description': 'Published our first legal commentary on Odisha laws, marking our entry into publishing',
  'about.journey.m3.year':        '2005',
  'about.journey.m3.title':       'Major Expansion',
  'about.journey.m3.description': 'Expanded to cover all major areas of Indian law with 500+ titles in our catalog',
  'about.journey.m4.year':        '2015',
  'about.journey.m4.title':       'Digital Revolution',
  'about.journey.m4.description': 'Launched online presence and digital catalog reaching customers across India',
  'about.journey.m5.year':        '2024',
  'about.journey.m5.title':       'Modern Era',
  'about.journey.m5.description': 'State-of-the-art e-commerce platform with 50,000+ satisfied customers nationwide',

  // ---- About -> Bento stats ---------------------------------------------
  'about.stat1.value':       '40+',
  'about.stat1.label':       'Years of Excellence',
  'about.stat1.description': 'Trusted since 1980',
  'about.stat2.value':       '500+',
  'about.stat2.label':       'Publications',
  'about.stat2.description': 'Legal literature',
  'about.stat3.value':       '50K+',
  'about.stat3.label':       'Happy Customers',
  'about.stat3.description': 'Across India',
  'about.stat4.value':       '100%',
  'about.stat4.label':       'Quality Assured',
  'about.stat4.description': 'Expert reviewed',

  // ---- About -> Visit-store strip --------------------------------------
  'about.visit.title':       'Visit Our',
  'about.visit.titleAccent': 'Store',
  'about.visit.subtitle':    'Experience our extensive collection of legal publications in person, or write to us anytime — we read every message.',
  'about.visit.cta':         'Browse Collection',
  'about.visit.contactBtn':  'Send us a message',
  'about.visit.hours':       'Mon–Sat · 10:00 AM – 8:00 PM',

  // ---- Founder Quote section (the home block) --------------------------
  'fq.eyebrow':         "Founder's Vision",
  'fq.quote':           'Our mission is to empower legal professionals with quality publications that stand the test of time and contribute to the advancement of justice.',
  'fq.author':          'Akshaya Kumar Mohanty',
  'fq.role':            'Founder & Chief Publisher',
  'fq.badge.years':     '40+ Years',
  'fq.badge.title':     'Founder & Publisher',
  'fq.cta':             'Read Full Story',
  'fq.stat1.value':     '500+',
  'fq.stat1.label':     'Publications',
  'fq.stat2.value':     '50K+',
  'fq.stat2.label':     'Readers',
  'fq.stat3.value':     '40+',
  'fq.stat3.label':     'Years',

  // ---- Founder PAGE (/founder) -----------------------------------------
  'founderPage.eyebrow':       'Our Legacy',
  'founderPage.title':         "Founder's",
  'founderPage.titleAccent':   'Vision',

  'founderPage.card.quote':    'My mission was never to sell books — it was to shape the legal future of Odisha and empower every legal mind with knowledge.',
  'founderPage.card.name':     'Akshaya Kumar Mohanty',
  'founderPage.card.role':     'Founder & Chairman',

  'founderPage.timeline.title':       'Our Journey',
  'founderPage.timeline.titleAccent': 'Through Time',
  'founderPage.timeline.subtitle':    'Four decades of excellence in legal publishing',

  'founderPage.m1.year':        '1985',
  'founderPage.m1.title':       'The Beginning',
  'founderPage.m1.description': 'Started with a small bookstore in Cuttack with just 50 law books and a dream to serve legal professionals',
  'founderPage.m2.year':        '1992',
  'founderPage.m2.title':       'First Publication',
  'founderPage.m2.description': 'Published our first legal commentary on Odisha Land Laws, marking our entry into legal publishing',
  'founderPage.m3.year':        '2000',
  'founderPage.m3.title':       'Major Expansion',
  'founderPage.m3.description': 'Expanded to cover all major areas of Indian law with 500+ titles in our growing catalog',
  'founderPage.m4.year':        '2010',
  'founderPage.m4.title':       'State Recognition',
  'founderPage.m4.description': 'Received prestigious state recognition for outstanding contribution to legal education',
  'founderPage.m5.year':        '2020',
  'founderPage.m5.title':       'Digital Revolution',
  'founderPage.m5.description': 'Launched online platform to serve legal professionals across India with modern e-commerce',
  'founderPage.m6.year':        '2024',
  'founderPage.m6.title':       'Legacy Continues',
  'founderPage.m6.description': 'Serving 50,000+ legal professionals across India with 500+ quality publications',

  'founderPage.stat1.value':    '40+',
  'founderPage.stat1.label':    'Years of Excellence',
  'founderPage.stat2.value':    '500+',
  'founderPage.stat2.label':    'Publications',
  'founderPage.stat3.value':    '50K+',
  'founderPage.stat3.label':    'Happy Customers',
  'founderPage.stat4.value':    '100%',
  'founderPage.stat4.label':    'Quality Assured',

  'founderPage.vision.title':   'Our Vision for the Future',
  'founderPage.vision.body':    'To continue being the cornerstone of legal education in Odisha and beyond, providing accessible, comprehensive, and up-to-date legal resources that empower the next generation of legal professionals to build a just society.',
};

/** Convenience: list of every editable key — used by the editor sidebar. */
export const LANDING_KEYS = Object.keys(LANDING_DEFAULTS);
