import { LegalPage } from './LegalPage';

const ShippingPolicy = () => (
  <LegalPage
    title="Shipping Policy"
    description="Delivery areas, timelines, charges and tracking information for orders placed with Legal Associates."
    path="/shipping-policy"
    lastUpdated="2026-05-29"
    sections={[
      {
        heading: 'Delivery areas',
        paragraphs: [
          'We currently ship across India. For deliveries to remote or restricted areas, timelines may be longer and additional charges may apply. For international or institutional bulk orders, please contact us directly.',
        ],
      },
      {
        heading: 'Processing time',
        bullets: [
          'In-stock orders are typically processed and dispatched within 1–3 working days.',
          'Journal subscriptions are dispatched according to the publication schedule (for monthly journals, around the first week of each month).',
          'You will receive a confirmation once your order is dispatched.',
        ],
      },
      {
        heading: 'Delivery timelines',
        bullets: [
          'Within Odisha: usually 2–4 working days after dispatch.',
          'Rest of India: usually 4–8 working days after dispatch.',
          'Timelines are estimates and may vary due to courier delays, weather, or other factors beyond our control.',
        ],
      },
      {
        heading: 'Shipping charges',
        bullets: [
          'Shipping charges, if any, are shown at checkout before you pay.',
          'We may offer free shipping on orders above a stated value; any such offer will be displayed on the website.',
          'Charges for bulk or institutional orders are quoted separately.',
        ],
      },
      {
        heading: 'Order tracking',
        paragraphs: [
          'Once dispatched, you can track your order status from your account dashboard under "My Orders". Where a courier tracking number is available, it will be shared with you by email or phone.',
        ],
      },
      {
        heading: 'Delays & failed deliveries',
        bullets: [
          'If a delivery attempt fails because the address is incorrect or no one is available, the courier may reattempt or hold the parcel; repeated failures may result in the parcel being returned to us.',
          'If a parcel is returned to us due to an incorrect address provided by you, re-shipping charges may apply.',
          'If your order has not arrived within the expected timeline, contact us and we will investigate with the courier.',
        ],
      },
      {
        heading: 'Damaged or lost parcels',
        paragraphs: [
          'If your parcel arrives damaged, please refuse delivery where possible and notify us immediately with photographs. For parcels lost in transit, we will work with the courier to resolve the matter and arrange a replacement or refund as appropriate. See our Refund & Cancellation Policy for details.',
        ],
      },
    ]}
  />
);

export default ShippingPolicy;
