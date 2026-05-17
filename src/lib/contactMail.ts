/**
 * Centralised contact-email helpers.
 *
 * Why this file exists:
 *  - We had two different addresses scattered around the codebase
 *    (`legalassociates.ocr@gmail.com` and a stale `info@legalassociates.com`).
 *    One source of truth fixes that.
 *  - When the user clicks a contact link we want their mail client to open
 *    with a meaningful subject + descriptive body already typed, so the
 *    customer just adds detail and hits send. This file builds that URL.
 */

export const CONTACT_EMAIL = 'legalassociates.ocr@gmail.com';
export const CONTACT_PHONE = '+91 94370 19131';
export const CONTACT_PHONE_OFFICE = '0671-2910130';
export const CONTACT_ADDRESS_LINE_1 = 'High Court Road, Cuttack – 753002, Odisha';

export type ContactReason =
  | 'general'
  | 'order'
  | 'subscription'
  | 'bulk'
  | 'partnership'
  | 'press';

const REASON_SUBJECTS: Record<ContactReason, string> = {
  general:      'General enquiry · Legal Associates',
  order:        'Order assistance · Legal Associates',
  subscription: 'Journal subscription enquiry · Legal Associates',
  bulk:         'Bulk / institutional order · Legal Associates',
  partnership:  'Partnership / authoring enquiry · Legal Associates',
  press:        'Press & media enquiry · Legal Associates',
};

const REASON_BODY_INTROS: Record<ContactReason, string> = {
  general:
    'Hello Legal Associates team,\n\nI would like to get in touch about',
  order:
    'Hello Legal Associates team,\n\nI need help with an existing order. Order number (if known):',
  subscription:
    'Hello Legal Associates team,\n\nI am interested in subscribing to a journal. Please share availability and pricing for',
  bulk:
    'Hello Legal Associates team,\n\nWe are looking to place a bulk / institutional order. Approximate quantity and titles needed:',
  partnership:
    'Hello Legal Associates team,\n\nI would like to discuss a partnership / authoring opportunity regarding',
  press:
    'Hello Legal Associates team,\n\nI am reaching out from a media organisation regarding',
};

/**
 * Build a `mailto:` URL with a descriptive subject + prefilled body so the
 * customer's mail client opens with a useful starting template instead of
 * a blank screen.
 */
export function buildContactMailto(
  reason: ContactReason = 'general',
  context?: { fromName?: string; fromEmail?: string; extra?: string }
): string {
  const subject = REASON_SUBJECTS[reason];
  const intro = REASON_BODY_INTROS[reason];

  const lines: string[] = [
    intro + ' [please describe here]',
    '',
    '— My details —',
    `Name : ${context?.fromName ?? '[your name]'}`,
    `Email: ${context?.fromEmail ?? '[your email]'}`,
    'Phone: [your phone, optional]',
  ];

  if (context?.extra) {
    lines.push('', context.extra);
  }

  lines.push(
    '',
    'Thank you,',
    '',
    '—',
    'Sent via legalassociatesodisha.com'
  );

  const body = lines.join('\n');
  const params = new URLSearchParams({ subject, body }).toString();
  // URLSearchParams encodes spaces as '+', but mail clients want '%20' for
  // both subject and body. Replace `+` once at the end so we stay accurate.
  return `mailto:${CONTACT_EMAIL}?${params.replace(/\+/g, '%20')}`;
}
