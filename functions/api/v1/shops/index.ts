import { Env, mapShop, jsonResponse, errorResponse } from '../../../../shared/db';
import { getSessionUser, newId, isoDate, slugify } from '../../../../shared/auth';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const ownerId = url.searchParams.get('owner_id');
    const slug = url.searchParams.get('slug');
    const mine = url.searchParams.get('mine');

    if (mine === '1') {
      const user = await getSessionUser(env, request);
      if (!user) return errorResponse('Authentication required. Please sign in.', 401);
      const { results } = await env.DB.prepare('SELECT * FROM shops WHERE owner_id = ? ORDER BY created_at DESC')
        .bind(user.id)
        .all();
      return jsonResponse({ total: results.length, shops: results.map(mapShop) });
    }

    if (slug) {
      const row = await env.DB.prepare('SELECT * FROM shops WHERE slug = ? LIMIT 1').bind(slug).first();
      if (!row) return errorResponse('Shop not found', 404);
      return jsonResponse({ shop: mapShop(row) });
    }

    if (ownerId) {
      const { results } = await env.DB.prepare('SELECT * FROM shops WHERE owner_id = ? ORDER BY created_at DESC')
        .bind(ownerId)
        .all();
      return jsonResponse({ total: results.length, shops: results.map(mapShop) });
    }

    const { results } = await env.DB.prepare('SELECT * FROM shops ORDER BY created_at DESC').all();
    return jsonResponse({ total: results.length, shops: results.map(mapShop) });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to load shops', 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const user = await getSessionUser(env, request);
  if (!user) return errorResponse('Authentication required. Please sign in.', 401);

  const body = await request.json().catch(() => null);
  if (!body) return errorResponse('Invalid JSON body', 400);

  const { name, bio, phone, whatsapp, tin_number, district, logo_url, banner_url } = body as Record<string, unknown>;

  if (!name || !phone) return errorResponse('Shop name and phone are required.', 400);
  if (typeof name !== 'string' || name.trim().length < 2) return errorResponse('Shop name must be at least 2 characters.', 400);

  const baseSlug = slugify(name);
  const { results } = await env.DB.prepare('SELECT slug FROM shops WHERE slug = ? OR slug LIKE ?').bind(baseSlug, `${baseSlug}-%`).all();
  const taken = new Set(results.map((r: any) => r.slug));
  let slug = baseSlug;
  let n = 2;
  while (taken.has(slug)) {
    slug = `${baseSlug}-${n++}`;
  }

  const id = newId('shop');
  const now = isoDate();
  await env.DB.prepare(
    'INSERT INTO shops (id, owner_id, name, slug, logo_url, banner_url, bio, phone, whatsapp, tin_number, status, rating_avg, review_count, district, verified, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
  )
    .bind(
      id,
      user.id,
      name.trim(),
      slug,
      logo_url || null,
      banner_url || null,
      bio || null,
      String(phone).trim(),
      whatsapp || null,
      tin_number || null,
      'pending',
      0,
      0,
      district || null,
      0,
      now
    )
    .run();

  const row = await env.DB.prepare('SELECT * FROM shops WHERE id = ?').bind(id).first();
  return jsonResponse(
    { message: 'Shop created and submitted for review. Our team will approve it shortly.', shop: mapShop(row) },
    201
  );
};
