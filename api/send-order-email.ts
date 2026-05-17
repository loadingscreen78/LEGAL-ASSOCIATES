/**
 * POST /api/send-order-email
 *
 * Sends the post-purchase order confirmation email through Resend.
 *
 * The browser is NEVER trusted with the Resend API key.
 *  • Client sends:    { orderId } + Authorization: Bearer <supabase JWT>
 *  • Server verifies the JWT against Supabase, reads the order/items/profile
 *    through RLS (so a user can only trigger their own email), renders the
 *    dark-themed HTML email and posts it to Resend.
 *
 * Required Vercel env vars (Project → Settings → Environment Variables):
 *   RESEND_API_KEY      – Resend API key (server-only secret)
 *   RESEND_FROM         – e.g. "Legal Associates <orders@legalassociatesodisha.com>"
 *                         Must be a Resend-verified sender. For testing you
 *                         can use "Legal Associates <onboarding@resend.dev>",
 *                         which only delivers to your own Resend account email.
 *   SITE_URL            – Public site URL e.g. https://www.legalassociatesodisha.com
 *   VITE_SUPABASE_URL   – Supabase project URL (already set)
 *   VITE_SUPABASE_ANON_KEY – Supabase anon key (already set)
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient } from '@supabase/supabase-js';
import { renderOrderEmail } from './_emailTemplate';

export const config = {
  runtime: 'nodejs',
};

// Minimal Vercel request/response shape — avoids depending on @vercel/node.
type VercelRequest = IncomingMessage & {
  body?: any;
  query?: Record<string, string | string[]>;
  headers: IncomingMessage['headers'];
  method?: string;
};
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: any) => VercelResponse;
  send: (body: any) => VercelResponse;
};

interface OrderItemRow {
  id: string;
  product_title: string;
  product_category: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface OrderRow {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  total_amount: number;
  shipping_address: any;
  payment_method: string | null;
  payment_status: string | null;
  estimated_days: number | null;
  estimated_delivery_date: string | null;
  created_at: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- 1. Validate env -----------------------------------------------------
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RESEND_FROM = process.env.RESEND_FROM || 'Legal Associates <onboarding@resend.dev>';
  const SITE_URL = (process.env.SITE_URL || 'https://www.legalassociatesodisha.com').replace(/\/+$/, '');
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('[send-order-email] missing env', {
      hasResend: !!RESEND_API_KEY,
      hasUrl: !!SUPABASE_URL,
      hasAnon: !!SUPABASE_ANON_KEY,
    });
    return res.status(500).json({ error: 'Email service is not configured' });
  }

  // --- 2. Parse body & auth ------------------------------------------------
  let body: any = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const orderId: string | undefined = body?.orderId;
  if (!orderId) return res.status(400).json({ error: 'orderId is required' });

  const authHeader = req.headers.authorization || '';
  const jwt = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!jwt) return res.status(401).json({ error: 'Missing Authorization bearer token' });

  // Supabase client scoped to the calling user → RLS ensures they can only
  // read their own order. No service role key needed.
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userErr } = await supabase.auth.getUser(jwt);
  if (userErr || !userData?.user) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
  const user = userData.user;
  const recipientEmail = user.email;
  if (!recipientEmail) return res.status(400).json({ error: 'User has no email' });

  // --- 3. Pull order + items + profile through RLS -------------------------
  const { data: orderRaw, error: orderErr } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (orderErr || !orderRaw) {
    console.error('[send-order-email] order lookup failed', orderErr);
    return res.status(404).json({ error: 'Order not found' });
  }
  const order = orderRaw as OrderRow;

  const { data: itemsRaw } = await supabase
    .from('order_items')
    .select('id, product_title, product_category, quantity, unit_price, total_price')
    .eq('order_id', order.id);

  const items: OrderItemRow[] = (itemsRaw as OrderItemRow[]) || [];

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, address, city, state, pincode')
    .eq('user_id', user.id)
    .maybeSingle();

  // --- 4. Render & send ----------------------------------------------------
  const html = renderOrderEmail({
    siteUrl: SITE_URL,
    orderNumber: order.order_number,
    placedAt: order.created_at,
    paymentMethod: order.payment_method || '—',
    totalAmount: order.total_amount,
    estimatedDays: order.estimated_days ?? 5,
    items,
    shippingAddress: order.shipping_address || profile || null,
    customerName: (profile as any)?.full_name || (order.shipping_address as any)?.full_name || recipientEmail.split('@')[0],
    currentStage: order.status || 'pending',
  });

  const resendResp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [recipientEmail],
      subject: `Order ${order.order_number} confirmed · Legal Associates`,
      html,
    }),
  });

  if (!resendResp.ok) {
    const text = await resendResp.text();
    console.error('[send-order-email] resend error', resendResp.status, text);
    return res.status(502).json({ error: 'Failed to dispatch email', detail: text });
  }

  const resendJson = await resendResp.json().catch(() => ({}));
  return res.status(200).json({ ok: true, id: (resendJson as any)?.id ?? null });
}
