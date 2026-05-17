/**
 * OTP email template — dark themed, matches the website palette.
 * Table-based with inline styles so Gmail / Outlook render it identically.
 */

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
};

const escape = (v: unknown): string =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export function renderOtpEmail(params: {
  otp: string;
  recipientName?: string;
  expiresInMinutes: number;
  siteUrl: string;
}): string {
  const otpDigits = String(params.otp).split('');
  const digitsHtml = otpDigits.map((d) => `
    <td align="center" valign="middle" style="
      width:48px;height:60px;
      font-family:'Merriweather',Georgia,serif;
      font-size:30px;font-weight:700;
      color:${C.gold};
      background:${C.cardBg2};
      border:1px solid ${C.border};
      border-radius:10px;
    ">${escape(d)}</td>
  `).join('<td width="8" style="line-height:1px;font-size:0;">&nbsp;</td>');

  const greeting = params.recipientName
    ? `Hi ${escape(params.recipientName)},`
    : 'Welcome to Legal Associates.';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="dark light" />
<title>Verify your email · Legal Associates</title>
<style>
  body { margin:0 !important; padding:0 !important; background:${C.pageBg}; }
  table, td { border-collapse:collapse; }
  @keyframes la-fade-up { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
  .anim-1 { animation: la-fade-up .6s ease-out both; }
  .anim-2 { animation: la-fade-up .6s ease-out .15s both; }
  .anim-3 { animation: la-fade-up .6s ease-out .3s both; }
  @media (prefers-reduced-motion: reduce) {
    .anim-1, .anim-2, .anim-3 { animation: none !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.pageBg};">
  <div style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;">
    Your Legal Associates verification code is ${escape(params.otp)}. Expires in ${escape(params.expiresInMinutes)} minutes.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.pageBg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

          <tr>
            <td class="anim-1" align="center" style="padding:0 0 24px 0;font-family:'Merriweather',Georgia,serif;color:${C.gold};font-size:13px;letter-spacing:0.32em;text-transform:uppercase;">
              Legal Associates
            </td>
          </tr>

          <tr>
            <td class="anim-2" style="
              background:linear-gradient(180deg, ${C.cardBg2} 0%, ${C.cardBg} 100%);
              border:1px solid ${C.border};
              border-radius:18px;
              padding:36px;
              font-family:Inter,Arial,sans-serif;
              text-align:center;
            ">
              <div style="display:inline-block;width:56px;height:56px;line-height:56px;border-radius:999px;background:${C.gold};color:${C.navy};font-size:24px;font-weight:800;margin-bottom:18px;">✦</div>
              <h1 style="margin:0;font-family:'Merriweather',Georgia,serif;font-size:26px;line-height:34px;color:${C.text};">
                Verify your email
              </h1>
              <p style="margin:10px 0 6px 0;font-size:14px;line-height:22px;color:${C.textMuted};">
                ${greeting}
              </p>
              <p style="margin:0 0 26px 0;font-size:14px;line-height:22px;color:${C.textMuted};">
                Enter the 6-digit code below to finish creating your account.
              </p>

              <!-- OTP digits -->
              <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>${digitsHtml}</tr>
              </table>

              <p style="margin:22px 0 0 0;font-size:12px;line-height:18px;color:${C.textDim};">
                This code expires in <span style="color:${C.goldSoft};font-weight:600;">${escape(params.expiresInMinutes)} minutes</span>.
              </p>
              <p style="margin:6px 0 0 0;font-size:12px;line-height:18px;color:${C.textDim};">
                If you didn't request this, you can safely ignore the email.
              </p>
            </td>
          </tr>

          <tr><td style="height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr>

          <tr>
            <td class="anim-3" align="center" style="font-family:Inter,Arial,sans-serif;font-size:11px;color:${C.textDim};line-height:18px;">
              <div>Need help? Reply to this email or write to
                <a href="mailto:legalassociates.ocr@gmail.com" style="color:${C.goldSoft};text-decoration:none;">legalassociates.ocr@gmail.com</a>.
              </div>
              <div style="margin-top:6px;">© ${new Date().getFullYear()} Legal Associates · Bhubaneswar, Odisha</div>
              <div style="margin-top:6px;">
                <a href="${escape(params.siteUrl)}" style="color:${C.goldSoft};text-decoration:none;">${escape(params.siteUrl.replace(/^https?:\/\//, ''))}</a>
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
