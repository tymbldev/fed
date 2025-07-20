import { NextRequest, NextResponse } from 'next/server';

// Mock company data - in a real app, this would come from a database
const companies = [
  {
    id: 1,
    name: "Google",
    description: "A multinational technology company that specializes in Internet-related services and products.",
    logoUrl: "https://logo.clearbit.com/google.com",
    website: "https://www.google.com",
    createdAt: null,
    updatedAt: "2025-07-17 16:00:00",
    aboutUs: "Google is a multinational technology company that specializes in Internet-related services and products.",
    vision: "To organize the world's information and make it universally accessible and useful.",
    mission: "To provide access to the world's information in one click.",
    culture: "Google fosters a culture of innovation, collaboration, and continuous learning.",
    jobs: [],
    careerPageUrl: "https://careers.google.com",
    linkedinUrl: "https://linkedin.com/company/google",
    headquarters: "Mountain View, CA",
    primaryIndustryId: 1,
    secondaryIndustries: "Cloud Computing,Artificial Intelligence,Mobile Technology",
    companySize: "100,000+ employees",
    specialties: "Search, Advertising, Cloud Services, Android, Chrome",
    activeJobCount: 1250
  },
  {
    id: 2,
    name: "Microsoft",
    description: "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software.",
    logoUrl: "https://logo.clearbit.com/microsoft.com",
    website: "https://www.microsoft.com",
    createdAt: null,
    updatedAt: "2025-07-17 16:00:00",
    aboutUs: "Microsoft is a multinational technology company that develops, manufactures, licenses, supports, and sells computer software.",
    vision: "To empower every person and every organization on the planet to achieve more.",
    mission: "To create technology that transforms the way people work, play, and communicate.",
    culture: "Microsoft promotes a growth mindset, diversity, and inclusion in its workplace culture.",
    jobs: [],
    careerPageUrl: "https://careers.microsoft.com",
    linkedinUrl: "https://linkedin.com/company/microsoft",
    headquarters: "Redmond, WA",
    primaryIndustryId: 1,
    secondaryIndustries: "Cloud Computing,Enterprise Software,Gaming",
    companySize: "200,000+ employees",
    specialties: "Windows, Office, Azure, Xbox, Surface",
    activeJobCount: 980
  },
  {
    id: 3,
    name: "Apple",
    description: "Apple designs and manufactures consumer electronics, computer software, and online services.",
    logoUrl: "https://logo.clearbit.com/apple.com",
    website: "https://www.apple.com",
    headquarters: "Cupertino, CA",
    companySize: "150,000+ employees",
    primaryIndustryId: 1,
    specialties: "iPhone, iPad, Mac, Apple Watch, iOS, macOS",
    activeJobCount: 750
  },
  {
    id: 4,
    name: "Amazon",
    description: "An American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    logoUrl: "https://logo.clearbit.com/amazon.com",
    website: "https://www.amazon.com",
    headquarters: "Seattle, WA",
    companySize: "1,000,000+ employees",
    primaryIndustryId: 2,
    specialties: "E-commerce, AWS, Alexa, Prime, Logistics",
    activeJobCount: 2100
  },
  {
    id: 15,
    name: "Target",
    description: "An American retail corporation that operates a chain of discount department stores and hypermarkets.",
    logoUrl: "https://logo.clearbit.com/target.com",
    website: "https://www.target.com",
    headquarters: "Minneapolis, MN",
    companySize: "350,000+ employees",
    primaryIndustryId: 2,
    specialties: "Retail, E-commerce, Supply Chain",
    activeJobCount: 450
  },
  {
    id: 5,
    name: "Tesla",
    description: "An American electric vehicle and clean energy company.",
    logoUrl: "https://logo.clearbit.com/tesla.com",
    website: "https://www.tesla.com",
    headquarters: "Austin, TX",
    companySize: "100,000+ employees",
    primaryIndustryId: 3,
    specialties: "Electric Vehicles, Energy Storage, Solar",
    activeJobCount: 320
  },
  {
    id: 6,
    name: "Spotify",
    description: "A Swedish audio streaming and media services provider.",
    logoUrl: "https://logo.clearbit.com/spotify.com",
    website: "https://www.spotify.com",
    headquarters: "Stockholm, Sweden",
    companySize: "9,000+ employees",
    primaryIndustryId: 4,
    specialties: "Music Streaming, Podcasts, Audio Content",
    activeJobCount: 280
  },
  {
    id: 7,
    name: "Disney",
    description: "An American multinational mass media and entertainment conglomerate.",
    logoUrl: "https://logo.clearbit.com/disney.com",
    website: "https://www.disney.com",
    headquarters: "Burbank, CA",
    companySize: "200,000+ employees",
    primaryIndustryId: 4,
    specialties: "Entertainment, Media, Theme Parks",
    activeJobCount: 420
  },
  {
    id: 20,
    name: "Goldman Sachs",
    description: "An American multinational investment bank and financial services company.",
    logoUrl: "https://logo.clearbit.com/gs.com",
    website: "https://www.goldmansachs.com",
    headquarters: "New York, NY",
    companySize: "40,000+ employees",
    primaryIndustryId: 5,
    specialties: "Investment Banking, Asset Management, Securities",
    activeJobCount: 650
  },
  {
    id: 21,
    name: "Morgan Stanley",
    description: "An American multinational investment bank and financial services company.",
    logoUrl: "https://logo.clearbit.com/morganstanley.com",
    website: "https://www.morganstanley.com",
    headquarters: "New York, NY",
    companySize: "80,000+ employees",
    primaryIndustryId: 5,
    specialties: "Investment Banking, Wealth Management, Institutional Securities",
    activeJobCount: 580
  },
  {
    id: 23,
    name: "Adobe",
    description: "An American multinational computer software company.",
    logoUrl: "https://logo.clearbit.com/adobe.com",
    website: "https://www.adobe.com",
    headquarters: "San Jose, CA",
    companySize: "25,000+ employees",
    primaryIndustryId: 6,
    specialties: "Creative Software, Digital Media, Marketing",
    activeJobCount: 380
  },
  {
    id: 24,
    name: "Salesforce",
    description: "An American cloud-based software company that provides customer relationship management service.",
    logoUrl: "https://logo.clearbit.com/salesforce.com",
    website: "https://www.salesforce.com",
    headquarters: "San Francisco, CA",
    companySize: "70,000+ employees",
    primaryIndustryId: 6,
    specialties: "CRM, Cloud Computing, Business Software",
    activeJobCount: 520
  },
  {
    id: 575,
    name: "Digantara",
    description: "Revolutionizing space situational awareness and debris removal through innovative technologies.",
    website: "https://digantaraspace.com/",
    logoUrl: "https://logo.clearbit.com/moneytap.com",
    createdAt: null,
    updatedAt: "2025-07-17 16:00:43",
    aboutUs: "- Digantara Space tackles space debris and enhances space situational awareness (SSA) using cutting-edge technologies and a skilled team.\n- Founded on the understanding of the growing space debris threat, Digantara developed proprietary space debris removal technologies.\n- The company offers data services providing comprehensive information on space debris location and risks, empowering informed decisions by clients.\n- Digantara also provides active debris removal services using advanced robotic systems to capture and de-orbit space debris.\n- Through a combination of technology, data analytics, and partnerships, Digantara aims for continuous innovation and a holistic solution to space debris, ensuring responsible space use.",
    vision: "To be a global leader in space sustainability, providing essential solutions for a cleaner and more accessible space environment.",
    mission: "To make space safer and more sustainable through innovative technologies and services.",
    culture: "- Digantara's culture prioritizes innovation, collaboration, and excellence within a diverse and inclusive workplace.\n- Employees are empowered to take initiative and contribute to the company's mission in a dynamic, challenging, and rewarding environment characterized by teamwork and mutual support.\n- Digantara strongly emphasizes professional development and learning opportunities in space technology.\n- The company is committed to ethical practices and sustainable solutions.",
    jobs: [],
    careerPageUrl: "https://moneytap.com/careers",
    linkedinUrl: "https://in.linkedin.com/company/digantara-space",
    headquarters: "Bengaluru, Karnataka, India",
    primaryIndustryId: 17,
    secondaryIndustries: "Robotics Systems,Data Analytics & Business Intelligence,Scientific & Research Services",
    companySize: "51-200 employees; experiencing rapid growth.",
    specialties: "Space Situational Awareness (SSA), Space Debris Removal, Robotic Systems, Satellite Technology, Data Analytics",
    activeJobCount: 15
  },
  {
    id: 597,
    name: "TSAW Drones",
    description: "Revolutionizing aerial data acquisition and analysis with cutting-edge drone technology.",
    website: "https://grofers.com",
    logoUrl: "https://logo.clearbit.com/grofers.com",
    createdAt: null,
    updatedAt: "2025-07-17 16:01:53",
    aboutUs: "- TSAW Drones is a leading provider of advanced drone technology and services, specializing in high-precision aerial data acquisition and analysis, driven by innovation and customer-centric solutions.\n- Founded with a team of experienced engineers, TSAW developed proprietary technologies to enhance drone capabilities and streamline data processing, achieving significant milestones including a patented autonomous navigation system and successful large-scale projects across various industries.\n- TSAW provides comprehensive drone solutions, from project planning and data acquisition to advanced data analysis and reporting, delivering tailored solutions that meet specific client needs.\n- The company utilizes a diverse portfolio of drone platforms, sensors, and software for applications like high-resolution mapping, 3D modeling, and precision agriculture, maintaining rigorous quality control and safety protocols.\n- TSAW Drones is committed to driving innovation, expanding service offerings, and exploring new applications for its technology while adhering to industry best practices.",
    vision: "To be the leading global provider of advanced drone technology and services, driving innovation and shaping the future of aerial data acquisition and analysis.",
    mission: "To provide innovative and reliable drone solutions that empower businesses and organizations to make informed decisions, improve efficiency, and achieve their goals.",
    culture: "- TSAW Drones cultivates a collaborative, innovative, and results-oriented workplace that values teamwork, open communication, and excellence.\n- Employees are empowered to share ideas, contribute to growth, and take ownership, fostering continuous learning and development with opportunities for advancement.\n- The company is committed to diversity and inclusion through inclusive hiring and a supportive environment.",
    jobs: [],
    careerPageUrl: "https://grofers.com/careers",
    linkedinUrl: "https://in.linkedin.com/company/tsaw-drones",
    headquarters: "[Insert City], [Insert State], [Insert Country]",
    primaryIndustryId: 17,
    secondaryIndustries: "Agriculture & AgTech,Construction & Infrastructure,Data Analytics & Business Intelligence",
    companySize: "[Insert Employee Count] employees, with [Insert Growth Percentage]% year-over-year growth.",
    specialties: "Aerial Data Acquisition, Drone Technology, Data Processing and Analysis, 3D Modeling, High-Resolution Mapping, Thermal Imaging, Precision Agriculture, Infrastructure Inspection, Autonomous Navigation Systems",
    activeJobCount: 8
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ primaryIndustryId: string }> }
) {
  try {
    const { primaryIndustryId } = await params;
    const industryId = parseInt(primaryIndustryId);

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Filter companies by industry
    const filteredCompanies = companies.filter(company => company.primaryIndustryId === industryId);

    // Apply pagination
    const paginatedCompanies = filteredCompanies.slice(offset, offset + limit);

    // Calculate pagination metadata
    const totalCompanies = filteredCompanies.length;
    const totalPages = Math.ceil(totalCompanies / limit);
    const hasNextPage = page < totalPages;

    // Spring Boot pagination format
    const response = {
      content: paginatedCompanies,
      pageable: {
        sort: {
          sorted: false,
          empty: true,
          unsorted: true
        },
        pageNumber: page - 1, // Spring Boot uses 0-based indexing
        pageSize: limit,
        offset: offset,
        paged: true,
        unpaged: false
      },
      last: !hasNextPage,
      totalPages: totalPages,
      totalElements: totalCompanies,
      first: page === 1,
      size: limit,
      number: page - 1, // Spring Boot uses 0-based indexing
      sort: {
        sorted: false,
        empty: true,
        unsorted: true
      },
      numberOfElements: paginatedCompanies.length,
      empty: paginatedCompanies.length === 0
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching companies by industry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}