/**
 * Order confirmation email template — dark themed to match the website.
 *
 * Why table-based + inline styles:
 *   Mail clients (Gmail in particular) strip <style> blocks aggressively
 *   and don't support flex/grid. Tables + inline CSS are the only way to
 *   make a layout render the same in Gmail, Apple Mail, Outlook and iOS.
 *
 * Animations are added inside a <style> block so clients that *do* support
 * them (Apple Mail, iOS Mail) get the polished motion. Gmail/Outlook simply
 * see the static state, which is also good-looking by design.
 */

interface EmailItem {
  product_title: string;
  product_category: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface EmailParams {
  siteUrl: string;
  orderNumber: string;
  placedAt: string;
  paymentMethod: string;
  totalAmount: number;
  estimatedDays: number;
  items: EmailItem[];
  shippingAddress: any;
  customerName: string;
  currentStage: string; // pending | confirmed | processing | shipped | delivered
}

const escape = (v: unknown): string =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatINR = (n: number) => `₹${Number(n || 0).toFixed(2)}`;

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
};

// Brand palette (matches site dark theme)
const C = {
  pageBg:    '#0B1220',
  cardBg:    '#101820',
  cardBg2:   '#1a2a3a',
  border:    'rgba(212,175,55,0.18)',
  borderSoft:'rgba(255,255,255,0.06)',
  gold:      '#D4AF37',
  goldSoft:  '#F4D47E',
  navy:      '#2D3E50',
  text:      '#F2F4F8',
  textMuted: 'rgba(242,244,248,0.65)',
  textDim:   'rgba(242,244,248,0.45)',
  success:   '#22C55E',
};

const TRACK_STAGES: Array<{ key: string; label: string; icon: string }> = [
  { key: 'confirmed',  label: 'Order confirmed', icon: '✓' },
  { key: 'processing', label: 'Preparing',       icon: '◷' },
  { key: 'shipped',    label: 'Shipped',         icon: '➤' },
  { key: 'delivered',  label: 'Delivered',       icon: '★' },
];

// Map current order status to the index of the timeline stage.
function stageIndex(status: string): number {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') return 3;
  if (s === 'shipped') return 2;
  if (s === 'processing') return 1;
  // 'confirmed' / 'pending' / anything else → first node lit, rest queued.
  return 0;
}

export function renderOrderEmail(p: EmailParams): string {
  const idx = stageIndex(p.currentStage);
  const itemsRowsHtml = (p.items.length
    ? p.items
    : [{ product_title: '—', product_category: '', quantity: 0, unit_price: 0, total_price: 0 }]
  ).map((it, i) => `
    <tr>
      <td style="padding:14px 16px;border-bottom:1px solid ${C.borderSoft};color:${C.text};font-size:14px;line-height:20px;font-family:Inter,Arial,sans-serif;">
        <div style="font-weight:600;color:${C.text};">${escape(it.product_title)}</div>
        <div style="font-size:11px;color:${C.textDim};text-transform:uppercase;letter-spacing:0.08em;margin-top:3px;">${escape(it.product_category)}</div>
      </td>
      <td align="center" style="padding:14px 8px;border-bottom:1px solid ${C.borderSoft};color:${C.textMuted};font-size:13px;font-family:Inter,Arial,sans-serif;">×${escape(it.quantity)}</td>
      <td align="right" style="padding:14px 16px;border-bottom:1px solid ${C.borderSoft};color:${C.goldSoft};font-size:14px;font-weight:600;font-family:Inter,Arial,sans-serif;">${formatINR(it.total_price)}</td>
    </tr>
  `).join('');

  // Timeline cells. Width is split evenly across 4 stages.
  const timelineNodes = TRACK_STAGES.map((st, i) => {
    const reached = i <= idx;
    const isCurrent = i === idx;
    return `
      <td align="center" valign="top" width="25%" style="vertical-align:top;font-family:Inter,Arial,sans-serif;">
        <div class="track-node ${isCurrent ? 'track-current' : ''}" style="
          width:38px;height:38px;line-height:38px;margin:0 auto;
          border-radius:999px;
          background:${reached ? C.gold : 'transparent'};
          border:2px solid ${reached ? C.gold : 'rgba(212,175,55,0.35)'};
          color:${reached ? C.navy : C.textMuted};
          font-size:16px;font-weight:700;text-align:center;
        ">${st.icon}</div>
        <div style="margin-top:8px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${reached ? C.goldSoft : C.textDim};">
          ${escape(st.label)}
        </div>
      </td>
    `;
  }).join('');

  // Connector segments (3 segments between 4 nodes).
  const connectorCells = [0, 1, 2].map((seg) => {
    const filled = seg < idx;
    return `<td height="2" style="line-height:2px;font-size:0;background:${filled ? C.gold : 'rgba(212,175,55,0.18)'};">&nbsp;</td>`;
  }).join('<td width="25%" style="line-height:2px;font-size:0;">&nbsp;</td>'.repeat(0));

  // Address block
  const addr = p.shippingAddress || {};
  const addrLines: string[] = [];
  if (addr.full_name) addrLines.push(escape(addr.full_name));
  if (addr.phone) addrLines.push(escape(addr.phone));
  if (addr.address) addrLines.push(escape(addr.address));
  const cityLine = [addr.city, addr.state, addr.pincode].filter(Boolean).map(escape).join(', ');
  if (cityLine) addrLines.push(cityLine);

  const addrHtml = addrLines.length
    ? addrLines.map((l) => `<div style="color:${C.textMuted};font-size:13px;line-height:20px;">${l}</div>`).join('')
    : `<div style="color:${C.textDim};font-size:13px;line-height:20px;">No shipping address on file.</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="dark light" />
<meta name="supported-color-schemes" content="dark light" />
<title>Order ${escape(p.orderNumber)} confirmed</title>
<style>
  /* Reset for clients that DO honor <style> */
  body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table, td { mso-table-lspace:0; mso-table-rspace:0; border-collapse:collapse; }
  img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; display:block; }
  body { margin:0 !important; padding:0 !important; width:100% !important; background:${C.pageBg}; }

  /* Animations — progressive enhancement; clients that ignore <style>
     simply see the static state, which is also fully styled. */
  @keyframes la-fade-up { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
  @keyframes la-pulse  { 0%,100% { box-shadow:0 0 0 0 rgba(212,175,55,0.55); } 50% { box-shadow:0 0 0 8px rgba(212,175,55,0); } }
  @keyframes la-shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }

  .anim-1 { animation: la-fade-up .6s ease-out both; }
  .anim-2 { animation: la-fade-up .6s ease-out .15s both; }
  .anim-3 { animation: la-fade-up .6s ease-out .3s both; }
  .anim-4 { animation: la-fade-up .6s ease-out .45s both; }
  .anim-5 { animation: la-fade-up .6s ease-out .6s both; }
  .track-current { animation: la-pulse 2s ease-in-out infinite; }
  .gold-shimmer {
    background-image: linear-gradient(90deg, ${C.gold} 0%, ${C.goldSoft} 50%, ${C.gold} 100%);
    background-size: 200% 100%;
    animation: la-shimmer 3s linear infinite;
    -webkit-background-clip:text; background-clip:text;
    color:transparent;
  }

  /* Mobile tuning */
  @media only screen and (max-width: 600px) {
    .container { width:100% !important; padding:0 12px !important; }
    .pad-lg { padding:24px !important; }
    .h1 { font-size:24px !important; line-height:32px !important; }
    .stage-label { font-size:10px !important; }
  }

  /* Honor reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .anim-1, .anim-2, .anim-3, .anim-4, .anim-5,
    .track-current, .gold-shimmer { animation: none !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.pageBg};">
  <!-- Preheader (hidden on most clients, shown in inbox preview) -->
  <div style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;">
    Your order ${escape(p.orderNumber)} is confirmed. Total ${formatINR(p.totalAmount)}. Estimated delivery in ${escape(p.estimatedDays)} days.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.pageBg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

          <!-- Brand header -->
          <tr>
            <td class="anim-1" align="center" style="padding:0 0 24px 0;font-family:'Merriweather',Georgia,serif;color:${C.gold};font-size:13px;letter-spacing:0.32em;text-transform:uppercase;">
              Legal Associates
            </td>
          </tr>

          <!-- Hero card -->
          <tr>
            <td class="anim-2 pad-lg" style="
              background:linear-gradient(180deg, ${C.cardBg2} 0%, ${C.cardBg} 100%);
              border:1px solid ${C.border};
              border-radius:18px;
              padding:36px;
              font-family:Inter,Arial,sans-serif;
              text-align:center;
            ">
              <div style="display:inline-block;width:56px;height:56px;line-height:56px;border-radius:999px;background:${C.gold};color:${C.navy};font-size:24px;font-weight:800;margin-bottom:18px;">✓</div>
              <h1 class="h1" style="margin:0;font-family:'Merriweather',Georgia,serif;font-size:28px;line-height:36px;color:${C.text};">
                Order <span class="gold-shimmer">${escape(p.orderNumber)}</span> confirmed
              </h1>
              <p style="margin:10px 0 0 0;font-size:14px;line-height:22px;color:${C.textMuted};">
                Thank you, ${escape(p.customerName)}. We're preparing your order and will email you again the moment it ships.
              </p>
              <div style="margin-top:18px;font-size:12px;color:${C.textDim};">
                Placed ${escape(formatDate(p.placedAt))}
              </div>
            </td>
          </tr>

          <tr><td style="height:20px;line-height:20px;font-size:0;">&nbsp;</td></tr>

          <!-- Tracking timeline -->
          <tr>
            <td class="anim-3" style="
              background:${C.cardBg};
              border:1px solid ${C.border};
              border-radius:18px;
              padding:28px 24px;
              font-family:Inter,Arial,sans-serif;
            ">
              <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${C.gold};margin-bottom:14px;text-align:center;">
                Tracking timeline
              </div>

              <!-- Nodes -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>${timelineNodes}</tr>
              </table>

              <!-- Connector line under nodes -->
              <table role="presentation" width="80%" cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top:-24px;margin-bottom:8px;">
                <tr>
                  <td height="2" style="line-height:2px;font-size:0;background:${idx >= 1 ? C.gold : 'rgba(212,175,55,0.18)'};">&nbsp;</td>
                  <td height="2" style="line-height:2px;font-size:0;background:${idx >= 2 ? C.gold : 'rgba(212,175,55,0.18)'};">&nbsp;</td>
                  <td height="2" style="line-height:2px;font-size:0;background:${idx >= 3 ? C.gold : 'rgba(212,175,55,0.18)'};">&nbsp;</td>
                </tr>
              </table>

              <p style="margin:14px 0 0 0;text-align:center;font-size:13px;color:${C.textMuted};">
                Estimated delivery in <span style="color:${C.goldSoft};font-weight:600;">${escape(p.estimatedDays)} business days</span>.
              </p>
            </td>
          </tr>

          <tr><td style="height:20px;line-height:20px;font-size:0;">&nbsp;</td></tr>

          <!-- Invoice card -->
          <tr>
            <td class="anim-4" style="
              background:${C.cardBg};
              border:1px solid ${C.border};
              border-radius:18px;
              padding:0;
              overflow:hidden;
              font-family:Inter,Arial,sans-serif;
            ">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:22px 24px 12px 24px;">
                    <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${C.gold};">Invoice</div>
                    <div style="margin-top:6px;font-family:'Merriweather',Georgia,serif;font-size:18px;color:${C.text};">
                      ${escape(p.orderNumber)}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <thead>
                        <tr>
                          <th align="left"   style="padding:10px 16px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${C.textDim};font-weight:600;border-bottom:1px solid ${C.borderSoft};">Item</th>
                          <th align="center" style="padding:10px 8px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${C.textDim};font-weight:600;border-bottom:1px solid ${C.borderSoft};">Qty</th>
                          <th align="right"  style="padding:10px 16px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${C.textDim};font-weight:600;border-bottom:1px solid ${C.borderSoft};">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsRowsHtml}
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 24px 24px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="left" style="font-size:12px;color:${C.textDim};">
                          Payment · ${escape(p.paymentMethod)}
                        </td>
                        <td align="right" style="font-family:'Merriweather',Georgia,serif;font-size:20px;color:${C.gold};font-weight:700;">
                          ${formatINR(p.totalAmount)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 24px 24px 24px;">
                    <div style="
                      border-top:1px dashed ${C.border};
                      padding-top:18px;
                    ">
                      <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${C.textDim};margin-bottom:8px;">Shipping to</div>
                      ${addrHtml}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr>

          <!-- CTAs -->
          <tr>
            <td class="anim-5" align="center" style="font-family:Inter,Arial,sans-serif;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Buy more (gold filled) -->
                  <td align="center" style="padding:0 8px;">
                    <a href="${escape(p.siteUrl)}/shop"
                       style="
                         display:inline-block;
                         padding:14px 28px;
                         background:${C.gold};
                         color:${C.navy};
                         text-decoration:none;
                         font-weight:700;
                         font-size:14px;
                         letter-spacing:0.04em;
                         border-radius:999px;
                         box-shadow:0 12px 28px rgba(212,175,55,0.28);
                       ">
                      Buy more
                    </a>
                  </td>
                  <!-- Visit website (outlined) -->
                  <td align="center" style="padding:0 8px;">
                    <a href="${escape(p.siteUrl)}"
                       style="
                         display:inline-block;
                         padding:13px 27px;
                         background:transparent;
                         color:${C.goldSoft};
                         text-decoration:none;
                         font-weight:700;
                         font-size:14px;
                         letter-spacing:0.04em;
                         border-radius:999px;
                         border:1.5px solid ${C.gold};
                       ">
                      Visit website
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="height:28px;line-height:28px;font-size:0;">&nbsp;</td></tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:8px 8px 0 8px;font-family:Inter,Arial,sans-serif;">
              <div style="font-size:11px;color:${C.textDim};line-height:18px;">
                Need help? Reply to this email or write to us at
                <a href="mailto:support@legalassociatesodisha.com" style="color:${C.goldSoft};text-decoration:none;">support@legalassociatesodisha.com</a>.
              </div>
              <div style="margin-top:8px;font-size:11px;color:${C.textDim};">
                © ${new Date().getFullYear()} Legal Associates · Bhubaneswar, Odisha
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
