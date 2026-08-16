import { Env, mapHeroSlide, jsonResponse, errorResponse } from '../../../../shared/db';

export const onRequestPatch = async ({ request, env, params }: { request: Request; env: Env; params: { id: string } }) => {
  try {
    const existing: any = await env.DB.prepare('SELECT * FROM hero_slides WHERE id = ?').bind(params.id).first();
    if (!existing) return errorResponse('Hero slide not found', 404);

    const data: any = await request.json();
    const strFields = [
      'title_rw', 'title_en', 'title_fr',
      'subtitle_rw', 'subtitle_en', 'subtitle_fr',
      'cta_text_rw', 'cta_text_en', 'cta_text_fr',
      'image_url', 'category_slug', 'badge',
    ];
    const assignments: string[] = [];
    const bind: any[] = [];
    for (const f of strFields) {
      if (data[f] !== undefined) {
        assignments.push(`${f} = ?`);
        bind.push(data[f]);
      }
    }
    if (data.active !== undefined) {
      assignments.push('active = ?');
      bind.push(data.active ? 1 : 0);
    }
    if (assignments.length === 0) return errorResponse('No updateable fields provided');

    bind.push(params.id);
    await env.DB.prepare(`UPDATE hero_slides SET ${assignments.join(', ')} WHERE id = ?`).bind(...bind).run();
    const row = await env.DB.prepare('SELECT * FROM hero_slides WHERE id = ?').bind(params.id).first();
    return jsonResponse({ message: 'Hero slide updated', hero_slide: mapHeroSlide(row) });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to update hero slide', 500);
  }
};
