import Link from 'next/link';
import { BASE_URL } from '../services/api';

// API Response Types
interface LocationCombination {
  seoText: string;
  location: string;
  jobCount: number;
}

interface LocationCombinationsResponse {
  locationCombinations: LocationCombination[];
  query: string;
  totalJobs: number;
  type: string;
}

interface SimilarContent {
  similarKeyword: string;
  seoText: string;
  jobCount: number;
}

interface SimilarContentResponse {
  similarContent: SimilarContent[];
  count: number;
  keywordType: string;
}

interface DesignationSkillLocation {
  designationName: string;
  seoText: string;
  location: string;
  jobCount: number;
}

interface DesignationSkillLocationResponse {
  totalSimilarCombinations: number;
  similarCombinations: DesignationSkillLocation[];
  query: string;
  location: string;
  type: string;
  jobCount: number;
}

// Helper function to create URL slug from text
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper function to convert text to title case
function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Fetch functions for each API
async function fetchLocationCombinations(query: string): Promise<LocationCombinationsResponse | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/seo/jobs/location-combinations?query=${encodeURIComponent(query)}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch location combinations:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching location combinations:', error);
    return null;
  }
}

async function fetchSimilarContent(query: string): Promise<SimilarContentResponse | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/seo/similarcontent?query=${encodeURIComponent(query)}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch similar content:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching similar content:', error);
    return null;
  }
}

async function fetchDesignationSkillLocation(query: string, location: string): Promise<DesignationSkillLocationResponse | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/seo/jobs/designation-skill-location?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch designation skill location:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching designation skill location:', error);
    return null;
  }
}

interface JobInterlinkingProps {
  keyword: string;
  location?: string;
}

export default async function JobInterlinking({ keyword, location }: JobInterlinkingProps) {
  // Don't render if no keyword is provided
  if (!keyword || keyword.trim() === '') {
    return null;
  }

  const trimmedKeyword = keyword.trim();
  const trimmedLocation = location?.trim();
  const hasLocation = trimmedLocation && trimmedLocation !== '';

  // Fetch data based on search type
  let locationCombinations: LocationCombinationsResponse | null = null;
  let similarContent: SimilarContentResponse | null = null;
  let designationSkillLocation: DesignationSkillLocationResponse | null = null;

  if (hasLocation) {
    // Keyword + Location scenario
    [designationSkillLocation, locationCombinations] = await Promise.all([
      fetchDesignationSkillLocation(trimmedKeyword, trimmedLocation),
      fetchLocationCombinations(trimmedKeyword)
    ]);
  } else {
    // Keyword only scenario
    [similarContent, locationCombinations] = await Promise.all([
      fetchSimilarContent(trimmedKeyword),
      fetchLocationCombinations(trimmedKeyword)
    ]);
  }

  // Don't render if no data is available
  const hasData = (
    (locationCombinations?.locationCombinations?.length ?? 0) > 0 ||
    (similarContent?.similarContent?.length ?? 0) > 0 ||
    (designationSkillLocation?.similarCombinations?.length ?? 0) > 0
  );

  if (!hasData) {
    return null;
  }

    return (
    <div className="mt-12 mb-8 flex justify-center">
      <div className="w-3/4 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          People looking for {toTitleCase(trimmedKeyword)} Jobs also search for
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* First Column */}
        <div>
          {hasLocation ? (
            // Keyword + Location: Different keyword in same location
            designationSkillLocation && designationSkillLocation.similarCombinations.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 pb-2">
                  Similar Jobs in {trimmedLocation}
                </h3>
                <div className="space-y-1">
                  {designationSkillLocation.similarCombinations.slice(0, 8).map((item, index) => (
                    <Link
                      key={index}
                      href={`/${createSlug(item.seoText)}`}
                      className="block py-1 hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-blue-600 group-hover:text-blue-700 font-medium text-sm">
                        {toTitleCase(item.seoText)}
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )
          ) : (
            // Keyword only: Jobs in similar skills
            similarContent && similarContent.similarContent.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 pb-2">
                  Relevant Searches
                </h3>
                <div className="space-y-1">
                  {similarContent.similarContent.slice(0, 8).map((item, index) => (
                    <Link
                      key={index}
                      href={`/${createSlug(item.seoText)}`}
                      className="block py-1 hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-blue-600 group-hover:text-blue-700 font-medium text-sm">
                        {toTitleCase(item.seoText)}
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )
          )}
        </div>

        {/* Second Column */}
        <div>
          {hasLocation ? (
            // Keyword + Location: Same keyword in different locations
            locationCombinations && locationCombinations.locationCombinations.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 pb-2">
                  {toTitleCase(trimmedKeyword)} Jobs in the Region
                </h3>
                <div className="space-y-1">
                  {locationCombinations.locationCombinations
                    .filter(item => item.location.toLowerCase() !== trimmedLocation.toLowerCase())
                    .slice(0, 8)
                    .map((item, index) => (
                    <Link
                      key={index}
                      href={`/${createSlug(item.seoText)}`}
                      className="block py-1 hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-blue-600 group-hover:text-blue-700 font-medium text-sm">
                        {toTitleCase(item.seoText)}
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )
          ) : (
            // Keyword only: Same skill in different locations
            locationCombinations && locationCombinations.locationCombinations.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 pb-2">
                  {toTitleCase(trimmedKeyword)} Jobs in the Region
                </h3>
                <div className="space-y-1">
                  {locationCombinations.locationCombinations.slice(0, 8).map((item, index) => (
                    <Link
                      key={index}
                      href={`/${createSlug(item.seoText)}`}
                      className="block py-1 hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-blue-600 group-hover:text-blue-700 font-medium text-sm">
                        {toTitleCase(item.seoText)}
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
