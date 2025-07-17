import { NextRequest, NextResponse } from 'next/server';

// Mock company data - in a real app, this would come from a database
const companies = [
  {
    id: 1,
    name: "Google",
    description: "A multinational technology company that specializes in Internet-related services and products.",
    logoUrl: "https://logo.clearbit.com/google.com",
    aboutUs: "Google's mission is to organize the world's information and make it universally accessible and useful.",
    vision: "To provide access to the world's information in one click.",
    mission: "To organize the world's information and make it universally accessible and useful.",
    culture: "Google's culture is built on innovation, collaboration, and a commitment to making the world a better place through technology.",
    companySize: "100,000+ employees",
    headquarters: "Mountain View, CA",
    primaryIndustryId: 1,
    secondaryIndustries: "Artificial Intelligence, Cloud Computing, Mobile Technology",
    specialties: "Search, Advertising, Cloud Services, Android, Chrome",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    jobs: [
      {
        id: 1,
        title: "Senior Software Engineer",
        description: "Build scalable systems and applications that serve millions of users worldwide.",
        designation: "Senior Software Engineer",
        salary: 150000,
        currencyId: 1,
        company: "Google",
        cityId: 1,
        minExperience: 5,
        maxExperience: 8,
        openingCount: 10,
        createdAt: "2023-12-01T00:00:00Z"
      },
      {
        id: 2,
        title: "Product Manager",
        description: "Lead product strategy and development for Google's core products.",
        designation: "Product Manager",
        salary: 140000,
        currencyId: 1,
        company: "Google",
        cityId: 1,
        minExperience: 3,
        maxExperience: 6,
        openingCount: 5,
        createdAt: "2023-12-01T00:00:00Z"
      }
    ]
  },
  {
    id: 2,
    name: "Amazon",
    description: "An American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    logoUrl: "https://logo.clearbit.com/amazon.com",
    aboutUs: "Amazon is guided by four principles: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking.",
    vision: "To be Earth's most customer-centric company.",
    mission: "To be Earth's most customer-centric company, where customers can find and discover anything they might want to buy online.",
    culture: "Amazon's culture is built on leadership principles that guide decision-making and behavior.",
    companySize: "1,000,000+ employees",
    headquarters: "Seattle, WA",
    primaryIndustryId: 2,
    secondaryIndustries: "E-commerce, Cloud Computing, Artificial Intelligence",
    specialties: "E-commerce, AWS, Alexa, Prime, Logistics",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    jobs: [
      {
        id: 3,
        title: "AWS Solutions Architect",
        description: "Help customers design and build scalable, secure, and reliable cloud solutions.",
        designation: "Solutions Architect",
        salary: 160000,
        currencyId: 1,
        company: "Amazon",
        cityId: 2,
        minExperience: 7,
        maxExperience: 10,
        openingCount: 8,
        createdAt: "2023-12-01T00:00:00Z"
      }
    ]
  },
  {
    id: 3,
    name: "Apple",
    logoUrl: "https://logo.clearbit.com/apple.com",
    aboutUs: "Apple designs and manufactures consumer electronics, computer software, and online services.",
    vision: "To make the best products on earth, and to leave the world better than we found it.",
    mission: "To bring the best user experience to its customers through its innovative hardware, software, and services.",
    culture: "Apple's culture is built on innovation, design excellence, and attention to detail.",
    companySize: "150,000+ employees",
    headquarters: "Cupertino, CA",
    primaryIndustryId: 1,
    secondaryIndustries: "Consumer Electronics, Software, Services",
    specialties: "iPhone, iPad, Mac, Apple Watch, iOS, macOS",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    jobs: []
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const companyId = parseInt(id);

    const company = companies.find(c => c.id === companyId);

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}