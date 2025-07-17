import React from 'react';
import GenericCarousel from './common/GenericCarousel';
import IndustryCard from './IndustryCard';
import { Industry } from '../utils/serverData';

interface IndustriesCarouselProps {
  industries: Industry[];
}

const IndustriesCarousel: React.FC<IndustriesCarouselProps> = ({ industries }) => {
  if (!industries || industries.length === 0) {
    return <div className="w-full flex justify-center items-center py-12">No industries available</div>;
  }

  return (
    <GenericCarousel
      title="Active Jobs across Industries"
      viewAllLink={{ href: "/industries", text: "View All" }}
    >
      {industries.slice(0, 50).map((industry) => (
        <div key={industry.industryId} className="pb-4 bg-transparent">
          <IndustryCard industry={industry} />
        </div>
      ))}
    </GenericCarousel>
  );
};

export default IndustriesCarousel;