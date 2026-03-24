export function mergeContent<T = any>(raw: any): T | null {
  if (!raw) return null;
  return { ...(raw.meta ?? {}), ...raw };
}
