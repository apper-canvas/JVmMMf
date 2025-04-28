import { useState } from 'react';
import Button from '../ui/Button';

function OutfitCard({ outfit, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const occasionIcons = {
    casual: '🏠',
    formal: '👔',
    work: '💼',
    athletic: '🏃',
    'special occasion': '🎉'
  };
  
  const occasionIcon = occasionIcons[outfit.occasion] || '👕';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{occasionIcon}</span>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{outfit.Name}</h3>
              <p className="text-sm text-gray-500 capitalize">
                {outfit.occasion} - {outfit.season}
              </p>
            </div>
          </div>
          {outfit.is_favorite && (
            <span className="text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          )}
        </div>
        
        <div className="mt-2 flex">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
            {outfit.season}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2">
            {outfit.weather_condition || 'Any weather'}
          </span>
          {outfit.date_worn && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Last worn: {new Date(outfit.date_worn).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {isExpanded && (
          <div className="mt-4 text-sm text-gray-700 space-y-2">
            {outfit.description && (
              <p className="italic">{outfit.description}</p>
            )}
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <span className="font-medium">Weather:</span> {outfit.weather_condition || 'Any'}
              </div>
              <div>
                <span className="font-medium">Rating:</span> {outfit.rating ? '⭐'.repeat(outfit.rating) : 'Not rated'}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Items:</span>
                {outfit.items ? (
                  <ul className="list-disc pl-5 mt-1">
                    {outfit.items.split(',').map((item, index) => (
                      <li key={index}>{item.trim()}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="ml-2 text-gray-500">No items specified</span>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-between">
          <Button 
            onClick={toggleExpand}
            variant="outline"
            size="sm"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </Button>
          
          <div className="space-x-2">
            <Button 
              onClick={() => onEdit(outfit)}
              variant="secondary"
              size="sm"
            >
              Edit
            </Button>
            <Button 
              onClick={() => onDelete(outfit)}
              variant="danger"
              size="sm"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutfitCard;