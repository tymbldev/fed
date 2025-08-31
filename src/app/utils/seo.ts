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

  // First check if this is a job details URL (which should not be handled by listing routes)
  if (isJobDetailsSeoSlug(lower)) return false;

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

// New functions for job details SEO URLs
export function buildJobDetailsSeoPath(jobData: {
  title: string;
  cityName: string;
  countryName: string;
  companyName: string;
  minExperience: number;
  maxExperience: number;
  id: number;
}): string {
  const titleSlug = slugify(jobData.title);
  const locationSlug = slugify(jobData.cityName || jobData.countryName);
  const companySlug = slugify(jobData.companyName);

  // Use "for-fresher" for 0 to 0 experience, otherwise use the normal format
  const experienceRange = jobData.minExperience === 0 && jobData.maxExperience === 0
    ? 'for-fresher'
    : `${jobData.minExperience}-to-${jobData.maxExperience}-years`;

  return `/${titleSlug}-jobs-in-${locationSlug}-in-${companySlug}-${experienceRange}-jid-${jobData.id}`;
}

interface ParsedJobData {
  title?: string;
  location?: string;
  companyName?: string;
  minExperience?: number;
  maxExperience?: number;
}

export function parseJobDetailsSeoSlug(slug: string): { jobId: number | null; parsedData: ParsedJobData } {
  try {
    // Extract job ID from the end of the slug
    const jidMatch = slug.match(/-jid-(\d+)$/);
    if (!jidMatch) {
      return { jobId: null, parsedData: {} };
    }

    const jobId = parseInt(jidMatch[1]);
    const slugWithoutJid = slug.replace(/-jid-\d+$/, '');

    // Parse the rest of the slug to extract information
    // Pattern: [title]-jobs-in-[location]-in-[company]-[experience]-years
    const parts = slugWithoutJid.split('-');

    // Find the experience part (should end with "years" or be "for-fresher")
    const yearsIndex = parts.findIndex(part => part === 'years');
    const fresherIndex = parts.findIndex(part => part === 'for-fresher');

    let experienceEndIndex = -1;
    let minExperience: number | null = null;
    let maxExperience: number | null = null;

    if (fresherIndex !== -1) {
      // Handle "for-fresher" case
      experienceEndIndex = fresherIndex;
      minExperience = 0;
      maxExperience = 0;
    } else if (yearsIndex !== -1) {
      // Handle normal experience range case
      experienceEndIndex = yearsIndex;
      const experiencePart = parts[yearsIndex - 1]; // e.g., "1-to-5"
      const experienceMatch = experiencePart.match(/(\d+)-to-(\d+)/);
      minExperience = experienceMatch ? parseInt(experienceMatch[1]) : null;
      maxExperience = experienceMatch ? parseInt(experienceMatch[2]) : null;
    } else {
      return { jobId, parsedData: {} };
    }

    // Extract company name (between "in-" and experience)
    const inIndex = parts.lastIndexOf('in');
    if (inIndex === -1 || inIndex >= experienceEndIndex - 2) {
      return { jobId, parsedData: {} };
    }

    // If experience parsing failed, try to extract from the company name
    if (!minExperience || !maxExperience) {
      // The company name might include the experience part
      const companyParts = parts.slice(inIndex + 1, experienceEndIndex);
      const companyNameWithExperience = companyParts.join('-');
      const experienceMatch2 = companyNameWithExperience.match(/(\d+)-to-(\d+)/);
      if (experienceMatch2) {
        const minExp = parseInt(experienceMatch2[1]);
        const maxExp = parseInt(experienceMatch2[2]);
        // Remove the experience part from company name
        const companyName = companyNameWithExperience.replace(/\d+-to-\d+/, '').replace(/-+$/, '');
        return {
          jobId,
          parsedData: {
            companyName: deslugify(companyName),
            minExperience: minExp,
            maxExperience: maxExp
          }
        };
      }
    }

    // Find the experience part that comes before the experience end
    const experienceStartIndex = experienceEndIndex - 1;
    const companyParts = parts.slice(inIndex + 1, experienceStartIndex);
    const companyName = companyParts.join('-');

    // Extract location (between "jobs-in-" and "in-[company]")
    const jobsInIndex = parts.indexOf('jobs-in');
    if (jobsInIndex === -1 || jobsInIndex >= inIndex) {
      return { jobId, parsedData: { companyName, minExperience: minExperience ?? undefined, maxExperience: maxExperience ?? undefined } };
    }

    const locationParts = parts.slice(jobsInIndex + 2, inIndex);
    const location = locationParts.join('-');

    // Extract title (everything before "jobs-in")
    const titleParts = parts.slice(0, jobsInIndex);
    const title = titleParts.join('-');

    return {
      jobId,
      parsedData: {
        title: deslugify(title),
        location: deslugify(location),
        companyName: deslugify(companyName),
        minExperience: minExperience ?? undefined,
        maxExperience: maxExperience ?? undefined
      }
    };
  } catch (error) {
    console.error('Error parsing job details SEO slug:', error);
    return { jobId: null, parsedData: {} };
  }
}

export function isJobDetailsSeoSlug(slug: string): boolean {
  return slug.includes('-jid-') && /-jid-\d+$/.test(slug);
}

// Company SEO URL functions
export function buildCompanySeoPath(companyData: {
  name: string;
  id: number;
}): string {
  const companySlug = slugify(companyData.name);
  return `/${companySlug}-careers-cid-${companyData.id}`;
}

export function parseCompanySeoSlug(slug: string): { companyId: number | null; parsedData: { companyName?: string } } {
  try {
    // Extract company ID from the end of the slug
    const cidMatch = slug.match(/-cid-(\d+)$/);
    if (!cidMatch) {
      return { companyId: null, parsedData: {} };
    }

    const companyId = parseInt(cidMatch[1]);
    const slugWithoutCid = slug.replace(/-cid-\d+$/, '');

    // Remove "-careers" suffix to get company name
    const companySlug = slugWithoutCid.replace(/-careers$/, '');
    const companyName = deslugify(companySlug);

    return {
      companyId,
      parsedData: {
        companyName
      }
    };
  } catch (error) {
    console.error('Error parsing company SEO slug:', error);
    return { companyId: null, parsedData: {} };
  }
}

export function isCompanySeoSlug(slug: string): boolean {
  return slug.includes('-cid-') && /-cid-\d+$/.test(slug);
}


