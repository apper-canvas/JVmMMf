import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { getClothingItems } from '../../services/clothingItemService';

function OutfitForm({ outfit, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    Name: '',
    description: '',
    season: '',
    occasion: '',
    items: '',
    date_worn: '',
    rating: 0,
    is_favorite: false,
    weather_condition: '',
    image: null
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableItems, setAvailableItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  
  // Available options from the database schema
  const seasonOptions = ['spring', 'summer', 'fall', 'winter', 'all seasons'];
  const occasionOptions = ['casual', 'formal', 'work', 'athletic', 'special occasion'];
  const weatherOptions = ['sunny', 'rainy', 'snowy', 'cloudy', 'windy', 'hot', 'cold', 'mild'];
  
  // Initialize form with outfit data if editing
  useEffect(() => {
    if (outfit) {
      setFormData({
        Name: outfit.Name || '',
        description: outfit.description || '',
        season: outfit.season || '',
        occasion: outfit.occasion || '',
        items: outfit.items || '',
        date_worn: outfit.date_worn ? new Date(outfit.date_worn).toISOString().split('T')[0] : '',
        rating: outfit.rating || 0,
        is_favorite: outfit.is_favorite || false,
        weather_condition: outfit.weather_condition || '',
        image: outfit.image || null
      });
      
      // If there are items, parse them into an array
      if (outfit.items) {
        setSelectedItems(outfit.items.split(',').map(item => item.trim()));
      }
    }
  }, [outfit]);
  
  // Fetch available clothing items
  useEffect(() => {
    const fetchClothingItems = async () => {
      setIsLoadingItems(true);
      try {
        const items = await getClothingItems();
        setAvailableItems(items.filter(item => item.current_status === 'in closet'));
      } catch (error) {
        console.error('Error fetching clothing items:', error);
      } finally {
        setIsLoadingItems(false);
      }
    };
    
    fetchClothingItems();
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleItemSelection = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setSelectedItems(prev => [...prev, value]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== value));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Update items field with selected items
    const updatedFormData = {
      ...formData,
      items: selectedItems.join(', ')
    };
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(updatedFormData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to save outfit. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.submit}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="col-span-2">
          <label htmlFor="Name" className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="Name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.Name ? 'border-red-300' : ''
            }`}
          />
          {errors.Name && <p className="mt-1 text-sm text-red-600">{errors.Name}</p>}
        </div>
        
        {/* Season and Occasion */}
        <div>
          <label htmlFor="season" className="block text-sm font-medium text-gray-700">
            Season
          </label>
          <select
            id="season"
            name="season"
            value={formData.season}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a season</option>
            {seasonOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="occasion" className="block text-sm font-medium text-gray-700">
            Occasion
          </label>
          <select
            id="occasion"
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select an occasion</option>
            {occasionOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        {/* Weather and Date Worn */}
        <div>
          <label htmlFor="weather_condition" className="block text-sm font-medium text-gray-700">
            Weather Condition
          </label>
          <select
            id="weather_condition"
            name="weather_condition"
            value={formData.weather_condition}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select weather condition</option>
            {weatherOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="date_worn" className="block text-sm font-medium text-gray-700">
            Date Worn
          </label>
          <input
            type="date"
            id="date_worn"
            name="date_worn"
            value={formData.date_worn}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        {/* Rating */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
            Rating
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="0">Not rated</option>
            <option value="1">⭐</option>
            <option value="2">⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
          </select>
        </div>
        
        {/* Favorite */}
        <div>
          <div className="h-full flex items-end">
            <div className="flex items-center">
              <input
                id="is_favorite"
                name="is_favorite"
                type="checkbox"
                checked={formData.is_favorite}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_favorite" className="ml-2 block text-sm text-gray-700">
                Mark as favorite
              </label>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          ></textarea>
        </div>
        
        {/* Clothing Item Selection */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Clothing Items
          </label>
          
          {isLoadingItems ? (
            <p className="text-gray-500">Loading clothing items...</p>
          ) : availableItems.length > 0 ? (
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {availableItems.map(item => (
                  <div key={item.Id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`item-${item.Id}`}
                      value={item.Name}
                      checked={selectedItems.includes(item.Name)}
                      onChange={handleItemSelection}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`item-${item.Id}`} className="ml-2 block text-sm text-gray-700">
                      {item.Name} <span className="text-xs text-gray-500">({item.category})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No available clothing items. Add some first!</p>
          )}
          
          {selectedItems.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {selectedItems.length} item(s) selected
            </p>
          )}
        </div>
        
        {/* Image Upload */}
        <div className="col-span-2">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {typeof formData.image === 'string' && formData.image && (
            <p className="mt-2 text-sm text-gray-500">Current image: {formData.image.split('/').pop()}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : outfit ? 'Update Outfit' : 'Add Outfit'}
        </Button>
      </div>
    </form>
  );
}

export default OutfitForm;