import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Seo } from '@/components/Seo';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_OFFICE, CONTACT_ADDRESS_LINE_1 } from '@/lib/contactMail';

/**
 * LegalPage — shared layout for the policy pages (Terms, Privacy, Refund,
 * Shipping). Keeps every policy visually consistent and lets each page
 * focus only on its content sections.
 *
 * These templates are written for an Indian books/journals retailer and
 * reference the Consumer Protection (E-Commerce) Rules 2020 and the Digital
 * Personal Data Protection Act 2023. They are a sensible starting point and
 * should be reviewed by the business owner / a legal professional before
 * relying on them.
 */

export interface LegalSection {
  heading: string;
  /** Each entry is a paragraph. Use bullets[] for lists. */
  paragraphs?: string[];
  bullets?: string[];
}

interface LegalPageProps {
  title: string;
  /** Short SEO/meta description. */
  description: string;
  /** Path for canonical URL + mobile title. */
  path: string;
  /** ISO date string shown as "Last updated". */
  lastUpdated: string;
  sections: LegalSection[];
}

export const LegalPage = ({ title, description, path, lastUpdated, sections }: LegalPageProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title={title} description={description} path={path} noIndex={false} />
      <Navigation mobileTitle={title} mobileShowBack hideMobileSearchIcon />

      <main className="pt-20 md:pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <header className="mb-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
              style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)' }}
            >
              <span className="text-xs font-semibold tracking-wide" style={{ color: '#D4AF37' }}>
                Legal
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">{title}</h1>
            <p className="text-sm text-muted-foreground">
              Last updated:{' '}
              {new Date(lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </header>

          {/* Sections */}
          <article className="space-y-8">
            {sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-foreground">
                  {i + 1}. {section.heading}
                </h2>
                {section.paragraphs?.map((p, j) => (
                  <p key={j} className="text-[15px] leading-relaxed text-muted-foreground mb-3">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="list-disc pl-5 space-y-1.5 text-[15px] leading-relaxed text-muted-foreground">
                    {section.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* Contact block — every policy ends with how to reach the seller */}
            <section
              className="rounded-2xl p-5 mt-4"
              style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <h2 className="text-lg font-semibold mb-2">Contact &amp; grievance officer</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground mb-2">
                For any questions about this policy, or to raise a grievance under the Consumer
                Protection (E-Commerce) Rules 2020, please contact:
              </p>
              <ul className="text-[15px] leading-relaxed text-muted-foreground space-y-1">
                <li><strong className="text-foreground">Legal Associates</strong> (Law Book Sellers, Publishers &amp; Suppliers)</li>
                <li>{CONTACT_ADDRESS_LINE_1}</li>
                <li>
                  Email:{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: '#D4AF37' }}>
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>
                  Phone:{' '}
                  <a href={`tel:${CONTACT_PHONE_OFFICE.replace(/[^\d+]/g, '')}`} className="underline" style={{ color: '#D4AF37' }}>
                    {CONTACT_PHONE_OFFICE}
                  </a>{' '}
                  ·{' '}
                  <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="underline" style={{ color: '#D4AF37' }}>
                    {CONTACT_PHONE}
                  </a>
                </li>
                <li>Grievance response time: within 48 working hours; resolution within 30 days.</li>
              </ul>
            </section>

            <p className="text-xs text-muted-foreground pt-4 border-t border-border">
              This document is provided for general information about how Legal Associates operates
              its online store. It is not legal advice. Please review with a qualified professional
              before relying on it.
            </p>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
