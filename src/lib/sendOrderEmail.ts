import { supabase } from '@/lib/supabaseClient';

/**
 * Fire-and-forget POST to /api/send-order-email.
 *
 * The serverless function holds the Resend secret; the browser only carries
 * the user's Supabase JWT. We swallow errors so a flaky email service can
 * never block the user from seeing the success page.
 */
export async function sendOrderEmail(orderId: string): Promise<void> {
  if (!orderId) return;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) {
      console.warn('[sendOrderEmail] no active session, skipping email');
      return;
    }

    const resp = await fetch('/api/send-order-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      console.warn('[sendOrderEmail] non-200 response', resp.status, text);
      return;
    }
    console.log('[sendOrderEmail] email dispatched');
  } catch (err) {
    console.warn('[sendOrderEmail] failed to dispatch', err);
  }
}
