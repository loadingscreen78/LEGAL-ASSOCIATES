import { LegalPage } from './LegalPage';

const PrivacyPolicy = () => (
  <LegalPage
    title="Privacy Policy"
    description="How Legal Associates collects, uses, stores and protects your personal data, in line with India's Digital Personal Data Protection Act 2023."
    path="/privacy"
    lastUpdated="2026-05-29"
    sections={[
      {
        heading: 'Introduction',
        paragraphs: [
          'Legal Associates ("we", "us", "our") respects your privacy and is committed to protecting your personal data. This policy explains what we collect, why we collect it, and your rights — consistent with the Digital Personal Data Protection Act, 2023 (DPDP Act).',
        ],
      },
      {
        heading: 'Information we collect',
        bullets: [
          'Identity & contact data: name, email address, phone number, and shipping/billing address you provide at signup and checkout.',
          'Order data: the items you purchase, order history, and transaction references.',
          'Account data: your login email and an encrypted authentication token (we never store your password in plain text).',
          'Technical data: basic device/browser information and anonymous, aggregated analytics about how the site is used.',
          'We do NOT store your full card number or banking credentials — these are handled directly by our payment provider.',
        ],
      },
      {
        heading: 'How we use your data',
        bullets: [
          'To process and deliver your orders and send order confirmations.',
          'To manage your account and provide customer support.',
          'To respond to your enquiries and grievances.',
          'To improve our website and catalog through aggregated, anonymous analytics.',
          'To comply with legal, tax and accounting obligations.',
        ],
      },
      {
        heading: 'Legal basis & consent',
        paragraphs: [
          'We process your personal data on the basis of the consent you provide when creating an account or placing an order, and to fulfil our contractual obligations to you. You may withdraw consent at any time (see "Your rights" below), though this may prevent us from fulfilling pending orders.',
        ],
      },
      {
        heading: 'Sharing your data',
        bullets: [
          'Logistics partners: to deliver your order (name, address, phone).',
          'Payment gateways: to process payments securely.',
          'Service providers: hosting (Vercel) and database/authentication (Supabase) under appropriate data-processing safeguards.',
          'Legal authorities: where required by law, court order, or to protect our rights.',
          'We do NOT sell your personal data to third parties.',
        ],
      },
      {
        heading: 'Data retention',
        paragraphs: [
          'We retain your personal data only for as long as necessary to fulfil the purposes described here, including legal, tax and accounting requirements. Order and invoice records may be retained for the period mandated by applicable law.',
        ],
      },
      {
        heading: 'Data security',
        paragraphs: [
          'We use industry-standard measures including encrypted connections (HTTPS), access controls, and row-level security on our database. While we take reasonable steps to protect your data, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.',
        ],
      },
      {
        heading: 'Your rights',
        bullets: [
          'Access: request a copy of the personal data we hold about you.',
          'Correction: ask us to correct inaccurate or incomplete data.',
          'Erasure: ask us to delete your data, subject to legal retention requirements.',
          'Withdraw consent: withdraw previously given consent at any time.',
          'Grievance redressal: raise a complaint with our grievance officer (see contact section below).',
        ],
        paragraphs: [
          'To exercise any of these rights, contact us using the details at the end of this page.',
        ],
      },
      {
        heading: "Children's privacy",
        paragraphs: [
          'Our services are intended for users aged 18 and above. We do not knowingly collect personal data from children. If you believe a child has provided us data, please contact us and we will delete it.',
        ],
      },
      {
        heading: 'Cookies & analytics',
        paragraphs: [
          'We use minimal, privacy-respecting analytics to understand aggregate site usage. We do not use intrusive advertising trackers. Your browser settings can be used to manage cookies.',
        ],
      },
      {
        heading: 'Changes to this policy',
        paragraphs: [
          'We may update this Privacy Policy periodically. The "Last updated" date reflects the latest revision. Material changes will be communicated through the website.',
        ],
      },
    ]}
  />
);

export default PrivacyPolicy;
