export function prefixImagePath(src: string, baseURL: string): string {
  return `${baseURL}${src.replace(/^\/+/, "")}`;
}
