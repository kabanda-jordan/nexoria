export function navigate(path: string) {
  if (typeof window === 'undefined') return;
  if (window.location.pathname === path) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function getPath(): string {
  return typeof window === 'undefined' ? '/' : window.location.pathname;
}
