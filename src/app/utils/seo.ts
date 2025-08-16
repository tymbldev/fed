export type SearchFilters = {
  keyword: string;
  country: string;
  city: string;
  experience?: string;
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function deslugify(text: string): string {
  return decodeURIComponent(text.replace(/-/g, ' ')).trim();
}

export function buildSeoPath(filters: SearchFilters): string {
  const hasKeyword = !!filters.keyword?.trim();
  const hasLocation = !!(filters.city?.trim() || filters.country?.trim());
  const locationToken = slugify(filters.city?.trim() || filters.country?.trim() || '');
  const keywordToken = slugify(filters.keyword?.trim() || '');

  if (hasKeyword && hasLocation) return `/${keywordToken}-jobs-in-${locationToken}`;
  if (hasKeyword) return `/${keywordToken}-jobs`;
  if (hasLocation) return `/jobs-in-${locationToken}`;
  return '/referrals';
}

export function isSeoSlug(slug: string): boolean {
  const lower = slug.toLowerCase();
  if (lower.startsWith('jobs-in-')) return true;
  if (lower.endsWith('-jobs')) return true;
  if (lower.includes('-jobs-in-')) return true;
  return false;
}

export function splitSeoSlug(slug: string): { keyword: string; location: string | null } {
  const lower = slug.toLowerCase();
  if (lower.startsWith('jobs-in-')) {
    return { keyword: '', location: deslugify(lower.replace(/^jobs-in-/, '')) };
  }
  if (lower.includes('-jobs-in-')) {
    const [rawKeyword, rawLocation] = lower.split('-jobs-in-');
    return { keyword: deslugify(rawKeyword), location: deslugify(rawLocation) };
  }
  if (lower.endsWith('-jobs')) {
    return { keyword: deslugify(lower.slice(0, -('-jobs'.length))), location: null };
  }
  return { keyword: '', location: null };
}


