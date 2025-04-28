import { useState } from 'react';
import Button from '../ui/Button';

function ClothingItemCard({ item, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const categoryIcons = {
    tops: '👕',
    bottoms: '👖',
    outerwear: '🧥',
    accessories: '👜',
    shoes: '👟',
    dresses: '👗'
  };
  
  const categoryIcon = categoryIcons[item.category] || '👕';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{categoryIcon}</span>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{item.Name}</h3>
              <p className="text-sm text-gray-500 capitalize">
                {item.category} - {item.subcategory}
              </p>
            </div>
          </div>
          {item.is_favorite && (
            <span className="text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          )}
        </div>
        
        <div className="mt-2 flex">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
            {item.color}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
            {item.season}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {item.occasion}
          </span>
        </div>
        
        {isExpanded && (
          <div className="mt-4 text-sm text-gray-700 space-y-2">
            {item.description && (
              <p className="italic">{item.description}</p>
            )}
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <span className="font-medium">Brand:</span> {item.brand || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Size:</span> {item.size || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Status:</span> {item.current_status || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Rating:</span> {item.rating ? '⭐'.repeat(item.rating) : 'Not rated'}
              </div>
              {item.purchase_date && (
                <div>
                  <span className="font-medium">Purchased:</span> {new Date(item.purchase_date).toLocaleDateString()}
                </div>
              )}
              {item.purchase_price && (
                <div>
                  <span className="font-medium">Price:</span> ${item.purchase_price}
                </div>
              )}
              {item.store && (
                <div>
                  <span className="font-medium">Store:</span> {item.store}
                </div>
              )}
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
              onClick={() => onEdit(item)}
              variant="secondary"
              size="sm"
            >
              Edit
            </Button>
            <Button 
              onClick={() => onDelete(item)}
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

export default ClothingItemCard;