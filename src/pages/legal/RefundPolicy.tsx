import { LegalPage } from './LegalPage';

const RefundPolicy = () => (
  <LegalPage
    title="Refund & Cancellation Policy"
    description="Legal Associates' policy on order cancellations, returns, replacements and refunds for legal books and journal subscriptions."
    path="/refund-policy"
    lastUpdated="2026-05-29"
    sections={[
      {
        heading: 'Overview',
        paragraphs: [
          'We want you to be satisfied with your purchase. This policy explains when you can cancel an order, return an item, or request a refund. It is offered in line with the Consumer Protection (E-Commerce) Rules, 2020.',
        ],
      },
      {
        heading: 'Order cancellation',
        bullets: [
          'You may cancel an order free of charge any time before it is dispatched.',
          'To cancel, contact us by phone or email with your order number as soon as possible.',
          'Once an order has been dispatched it cannot be cancelled, but it may be eligible for return (see below).',
          'If we cancel an order due to stock unavailability or a pricing error, you will receive a full refund.',
        ],
      },
      {
        heading: 'Returns & replacements',
        paragraphs: [
          'Because our products are printed legal publications, returns are accepted only in the following circumstances:',
        ],
        bullets: [
          'The item delivered is damaged, defective, or has printing/binding faults.',
          'The wrong title or edition was delivered.',
          'The item is materially different from its description on the website.',
        ],
      },
      {
        heading: 'How to request a return',
        bullets: [
          'Notify us within 7 days of delivery, with your order number and photographs of the issue.',
          'The item must be unused and in its original condition and packaging.',
          'Once we verify the issue, we will arrange a replacement or a refund.',
          'We are unable to accept returns for reasons other than those listed above (for example, change of mind on a correctly delivered, undamaged book), as these are reading materials.',
        ],
      },
      {
        heading: 'Journal subscriptions',
        bullets: [
          'Subscription cancellations apply to future, undispatched issues only.',
          'Issues already dispatched or delivered are not refundable.',
          'Where a subscription is cancelled mid-term, any refund is calculated on a pro-rata basis for undispatched issues.',
        ],
      },
      {
        heading: 'Refund method & timeline',
        bullets: [
          'Approved refunds are issued to the original payment method.',
          'Refunds are typically processed within 7–10 working days of approval; the time for the amount to reflect in your account depends on your bank or card issuer.',
          'Shipping charges, where applicable, are non-refundable unless the return is due to our error.',
        ],
      },
      {
        heading: 'Non-returnable situations',
        bullets: [
          'Items damaged due to misuse or mishandling after delivery.',
          'Items returned without prior approval or beyond the 7-day notification window.',
          'Digital or downloadable items, once accessed.',
        ],
      },
    ]}
  />
);

export default RefundPolicy;
