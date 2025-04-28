import { useState, useEffect } from 'react';
import Button from '../ui/Button';

function ClothingItemForm({ item, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    Name: '',
    color: '',
    description: '',
    category: '',
    subcategory: '',
    season: '',
    occasion: '',
    brand: '',
    size: '',
    purchase_date: '',
    purchase_price: '',
    store: '',
    current_status: 'in closet',
    rating: 0,
    is_favorite: false,
    image: null
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Available options from the database schema
  const colorOptions = ['lightgray', 'gray', 'black', 'red', 'green', 'blue', 'pink', 'beige', 'purple', 'teal'];
  const categoryOptions = ['tops', 'bottoms', 'outerwear', 'accessories', 'shoes', 'dresses'];
  const subcategoryOptions = [
    't-shirts', 'blouses', 'sweaters', 'cardigans', 'jeans', 'pants', 'skirts', 'shorts',
    'coats', 'jackets', 'hats', 'bags', 'boots', 'sandals', 'sneakers', 'casual dresses', 'formal dresses'
  ];
  const seasonOptions = ['spring', 'summer', 'fall', 'winter', 'all seasons'];
  const occasionOptions = ['casual', 'formal', 'work', 'athletic', 'special occasion'];
  const sizeOptions = [
    'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 
    '0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42'
  ];
  const statusOptions = ['in closet', 'donated', 'sold', 'lent out', 'in laundry', 'needs repair'];
  
  // Initialize form with item data if editing
  useEffect(() => {
    if (item) {
      setFormData({
        Name: item.Name || '',
        color: item.color || '',
        description: item.description || '',
        category: item.category || '',
        subcategory: item.subcategory || '',
        season: item.season || '',
        occasion: item.occasion || '',
        brand: item.brand || '',
        size: item.size || '',
        purchase_date: item.purchase_date ? new Date(item.purchase_date).toISOString().split('T')[0] : '',
        purchase_price: item.purchase_price || '',
        store: item.store || '',
        current_status: item.current_status || 'in closet',
        rating: item.rating || 0,
        is_favorite: item.is_favorite || false,
        image: item.image || null
      });
    }
  }, [item]);
  
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
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Name is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to save clothing item. Please try again.' }));
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
        
        {/* Category and Subcategory */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.category ? 'border-red-300' : ''
            }`}
          >
            <option value="">Select a category</option>
            {categoryOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>
        
        <div>
          <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
            Subcategory
          </label>
          <select
            id="subcategory"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a subcategory</option>
            {subcategoryOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        {/* Color and Size */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <select
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a color</option>
            {colorOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700">
            Size
          </label>
          <select
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a size</option>
            {sizeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
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
        
        {/* Brand and Store */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="store" className="block text-sm font-medium text-gray-700">
            Store
          </label>
          <input
            type="text"
            id="store"
            name="store"
            value={formData.store}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        {/* Purchase Date and Price */}
        <div>
          <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700">
            Purchase Date
          </label>
          <input
            type="date"
            id="purchase_date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="purchase_price" className="block text-sm font-medium text-gray-700">
            Purchase Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="purchase_price"
              name="purchase_price"
              min="0"
              step="0.01"
              value={formData.purchase_price}
              onChange={handleChange}
              className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="0.00"
            />
          </div>
        </div>
        
        {/* Status and Rating */}
        <div>
          <label htmlFor="current_status" className="block text-sm font-medium text-gray-700">
            Current Status
          </label>
          <select
            id="current_status"
            name="current_status"
            value={formData.current_status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
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
        
        {/* Favorite */}
        <div className="col-span-2">
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
          {isSubmitting ? 'Saving...' : item ? 'Update Item' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
}

export default ClothingItemForm;