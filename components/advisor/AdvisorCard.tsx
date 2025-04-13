import Image from 'next/image';
import { Advisor } from '@/lib/types';
import StarRating from '../StarRating';

interface AdvisorCardProps {
  advisor: Advisor;
  onBook: () => void;
}

export default function AdvisorCard({ advisor, onBook }: AdvisorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <Image 
            className="h-full w-full object-cover"
            src={advisor.imageUrl || '/default-advisor.jpg'} 
            alt={advisor.name}
            width={100}
            height={100}
          />
        </div>
        <div className="p-6 md:w-2/3">
          <h3 className="text-xl font-bold">{advisor.name}</h3>
          <p className="text-gray-600">{advisor.credentials}</p>
          
          <div className="mt-2 flex items-center">
            <StarRating rating={advisor.rating} />
            <span className="ml-2 text-gray-600">
              {advisor.rating.toFixed(1)} ({advisor.experience}+ years)
            </span>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium">Specializations:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {advisor.specialization.map((spec) => (
                <span key={spec} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {spec}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium">Languages:</h4>
            <p className="text-gray-600">{advisor.languages.join(', ')}</p>
          </div>
          
          <p className="mt-4 text-gray-700 line-clamp-3">{advisor.bio}</p>
          
          <button
            onClick={onBook}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Book Consultation
          </button>
        </div>
      </div>
    </div>
  );
}