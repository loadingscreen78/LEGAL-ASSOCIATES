import { LegalPage } from './LegalPage';

const TermsOfService = () => (
  <LegalPage
    title="Terms of Service"
    description="The terms and conditions governing the use of the Legal Associates online store and the purchase of legal books and journals."
    path="/terms"
    lastUpdated="2026-05-29"
    sections={[
      {
        heading: 'Acceptance of terms',
        paragraphs: [
          'These Terms of Service ("Terms") govern your access to and use of the Legal Associates website (legalassociatesodisha.com) and any purchases you make through it. By browsing the site, creating an account, or placing an order, you agree to these Terms.',
          'If you do not agree with any part of these Terms, please do not use the website.',
        ],
      },
      {
        heading: 'About us',
        paragraphs: [
          'Legal Associates is a law book seller, publisher and supplier based at High Court Road, Cuttack – 753002, Odisha, India. We sell legal books, journals, bare acts and related publications to legal professionals, students and institutions.',
        ],
      },
      {
        heading: 'Eligibility & accounts',
        bullets: [
          'You must be at least 18 years of age, or accessing the site under the supervision of a parent or guardian, to place an order.',
          'You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.',
          'You agree to provide accurate, current and complete information during registration and checkout.',
          'We may suspend or terminate accounts that we reasonably believe are being used fraudulently or in violation of these Terms.',
        ],
      },
      {
        heading: 'Products, pricing & availability',
        bullets: [
          'All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.',
          'We make every effort to display product details, editions and prices accurately. Errors may occasionally occur; where a product is listed at an incorrect price, we reserve the right to cancel the order and refund any amount paid.',
          'Availability is subject to stock. If an item becomes unavailable after you order, we will inform you and offer a replacement edition or a full refund.',
        ],
      },
      {
        heading: 'Orders & acceptance',
        paragraphs: [
          'Your order constitutes an offer to purchase. A contract is formed only when we confirm the order and dispatch it. We reserve the right to accept or decline any order at our discretion, including for reasons of stock availability, suspected fraud, or pricing errors.',
        ],
      },
      {
        heading: 'Payments',
        paragraphs: [
          'Payments are processed through third-party payment gateways. Legal Associates does not store your full card or banking details on its own servers. By making a payment you also agree to the terms of the relevant payment provider.',
        ],
      },
      {
        heading: 'Shipping, returns & refunds',
        paragraphs: [
          'Delivery timelines, return eligibility and refund processing are described in our Shipping Policy and Refund & Cancellation Policy, which form part of these Terms.',
        ],
      },
      {
        heading: 'Intellectual property',
        paragraphs: [
          'All content on this website — including text, logos, page design, and the publications we sell — is protected by copyright and other intellectual property rights owned by Legal Associates or its licensors. You may not reproduce, redistribute, or commercially exploit any content without prior written permission.',
        ],
      },
      {
        heading: 'Acceptable use',
        bullets: [
          'You agree not to use the website for any unlawful purpose or in a way that could damage, disable or impair the service.',
          'You agree not to attempt unauthorised access to any part of the website, other accounts, or connected systems.',
          'You agree not to scrape, copy or resell the catalog or content for commercial use without permission.',
        ],
      },
      {
        heading: 'Limitation of liability',
        paragraphs: [
          'To the maximum extent permitted by law, Legal Associates shall not be liable for any indirect, incidental or consequential loss arising from the use of the website or the purchase of products. Our total liability for any claim shall not exceed the amount actually paid by you for the product giving rise to the claim.',
          'Nothing in these Terms limits liability that cannot be excluded under the Consumer Protection Act 2019 or other applicable law.',
        ],
      },
      {
        heading: 'Governing law & jurisdiction',
        paragraphs: [
          'These Terms are governed by the laws of India. Subject to applicable consumer-protection provisions, the courts at Cuttack, Odisha shall have jurisdiction over any disputes.',
        ],
      },
      {
        heading: 'Changes to these terms',
        paragraphs: [
          'We may update these Terms from time to time. The "Last updated" date above reflects the latest revision. Continued use of the website after changes constitutes acceptance of the revised Terms.',
        ],
      },
    ]}
  />
);

export default TermsOfService;
