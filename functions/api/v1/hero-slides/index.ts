import { Env, mapHeroSlide, jsonResponse, errorResponse } from '../../../../shared/db';

export const onRequestGet = async ({ env }: { env: Env }) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM hero_slides ORDER BY id ASC').all();
    const hero_slides = results.map(mapHeroSlide);
    return jsonResponse({ total: hero_slides.length, hero_slides });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to load hero slides', 500);
  }
};

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const data: any = await request.json();
    const id = data.id || `slide-${Date.now()}`;
    await env.DB.prepare(
      `INSERT INTO hero_slides (id, title_rw, title_en, title_fr, subtitle_rw, subtitle_en, subtitle_fr, cta_text_rw, cta_text_en, cta_text_fr, image_url, category_slug, badge, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        data.title_rw ?? '',
        data.title_en ?? '',
        data.title_fr ?? '',
        data.subtitle_rw ?? '',
        data.subtitle_en ?? '',
        data.subtitle_fr ?? '',
        data.cta_text_rw ?? '',
        data.cta_text_en ?? '',
        data.cta_text_fr ?? '',
        data.image_url ?? '',
        data.category_slug ?? null,
        data.badge ?? null,
        data.active ? 1 : 0
      )
      .run();
    const row = await env.DB.prepare('SELECT * FROM hero_slides WHERE id = ?').bind(id).first();
    return jsonResponse({ message: 'Hero slide created', hero_slide: mapHeroSlide(row) }, 201);
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to create hero slide', 500);
  }
};
