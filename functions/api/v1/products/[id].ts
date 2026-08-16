import { Env, mapProduct, jsonResponse, errorResponse } from '../../../../shared/db';
import { getSessionUser } from '../../../../shared/auth';

async function canManageProduct(env: Env, request: Request, product: any): Promise<{ ok: boolean; user?: any; error?: Response }> {
  const user = await getSessionUser(env, request);
  if (!user) return { ok: false, error: errorResponse('Authentication required. Please sign in.', 401) };
  if (user.role === 'admin') return { ok: true, user };
  const shop: any = await env.DB.prepare('SELECT owner_id FROM shops WHERE id = ?').bind(product.shop_id).first();
  if (!shop || shop.owner_id !== user.id) {
    return { ok: false, error: errorResponse('You can only manage products in your own shop.', 403) };
  }
  return { ok: true, user };
}

export const onRequestGet = async ({ env, params }: { env: Env; params: { id: string } }) => {
  try {
    const row = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(params.id).first();
    if (!row) return errorResponse('Product not found', 404);
    return jsonResponse({ product: mapProduct(row) });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to load product', 500);
  }
};

export const onRequestPatch = async ({ request, env, params }: { request: Request; env: Env; params: { id: string } }) => {
  try {
    const existing: any = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(params.id).first();
    if (!existing) return errorResponse('Product not found', 404);

    const auth = await canManageProduct(env, request, existing);
    if (!auth.ok) return auth.error;

    const data: any = await request.json();
    const col = (c: string) => (data[c] !== undefined ? c : null);
    const setCols = ['title', 'description', 'price', 'stock', 'status', 'sku'].map(col).filter(Boolean);
    const jsonCols = ['images', 'variants', 'tags', 'wholesale_tiers'].map(col).filter(Boolean);
    const numCols = ['original_price', 'category_id', 'category_slug', 'shop_id', 'shop_name'].map(col).filter(Boolean);

    if (setCols.length === 0 && jsonCols.length === 0 && numCols.length === 0) {
      return errorResponse('No updateable fields provided');
    }

    const assignments: string[] = [];
    const bind: any[] = [];
    for (const c of setCols) {
      assignments.push(`${c} = ?`);
      bind.push(data[c]);
    }
    for (const c of jsonCols) {
      assignments.push(`${c} = ?`);
      bind.push(data[c] !== null ? JSON.stringify(data[c]) : null);
    }
    for (const c of numCols) {
      assignments.push(`${c} = ?`);
      bind.push(data[c]);
    }

    bind.push(params.id);
    await env.DB.prepare(`UPDATE products SET ${assignments.join(', ')} WHERE id = ?`).bind(...bind).run();
    const row = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(params.id).first();
    return jsonResponse({ message: 'Product updated successfully', product: mapProduct(row) });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to update product', 500);
  }
};

export const onRequestDelete = async ({ request, env, params }: { request: Request; env: Env; params: { id: string } }) => {
  try {
    const existing: any = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(params.id).first();
    if (!existing) return errorResponse('Product not found', 404);

    const auth = await canManageProduct(env, request, existing);
    if (!auth.ok) return auth.error;

    await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(params.id).run();
    return jsonResponse({ message: 'Product deleted successfully' });
  } catch (e: any) {
    return errorResponse(e.message || 'Failed to delete product', 500);
  }
};
