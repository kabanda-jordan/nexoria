import { Env, mapCategory, jsonResponse, errorResponse } from '../../../../shared/db';

export const onRequestGet = async ({ env }: { env: Env }) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM categories ORDER BY id ASC').all();
    const categories = results.map(mapCategory);
    return jsonResponse({ total: categories.length, categories });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to load categories', 500);
  }
};

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const data: any = await request.json();
    if (!data.name_en || !data.name_rw || !data.name_fr || !data.slug) {
      return errorResponse('name_en, name_rw, name_fr and slug are required');
    }
    const id = data.id || `cat-${Date.now()}`;
    await env.DB.prepare(
      'INSERT INTO categories (id, name_rw, name_en, name_fr, parent_id, icon, slug, product_count) VALUES (?, ?, ?, ?, ?, ?, ?, 0)'
    )
      .bind(id, data.name_rw, data.name_en, data.name_fr, data.parent_id ?? null, data.icon ?? 'Tag', data.slug)
      .run();
    const row = await env.DB.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first();
    return jsonResponse({ message: 'Category created', category: mapCategory(row) }, 201);
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to create category', 500);
  }
};
