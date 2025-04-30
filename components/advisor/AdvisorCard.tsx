import Image from 'next/image';
import { Advisor } from '@/lib/types';
import StarRating from '../StarRating';
import { Button } from '../ui/button';

interface AdvisorCardProps {
  advisor: Advisor;
  onBook: () => void;
}

export default function AdvisorCard({ advisor, onBook }: AdvisorCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:shadow-xl transition-shadow duration-300">
      <div className="md:flex">
        {/* Image Section */}
        <div className="md:w-1/3 relative">
          <Image
            className="h-full w-full object-cover"
            src={advisor.imageUrl || '/default-advisor.jpg'}
            alt={advisor.name}
            width={200}
            height={200}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/20 to-transparent"></div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:w-2/3 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-navy-900">{advisor.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{advisor.credentials}</p>

            <div className="mt-3 flex items-center">
              <StarRating rating={advisor.rating} />
              <span className="ml-2 text-gray-600 text-sm">
                {advisor.rating.toFixed(1)} ({advisor.experience}+ years)
              </span>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-navy-900 text-sm">Specializations:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {advisor.specialization.map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 bg-gold-100 text-gold-800 text-sm font-medium rounded-full uppercase"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-navy-900 text-sm">Languages:</h4>
              <p className="text-gray-600 text-sm">{advisor.languages.join(', ')}</p>
            </div>

            <p className="mt-4 text-gray-700 text-sm line-clamp-3">{advisor.bio}</p>
          </div>

          {/* Button */}
          <Button
            onClick={onBook}
            className="mt-5"
          >
            Book Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}