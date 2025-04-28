import { useState, useEffect } from 'react';
import { 
  getClothingItems, 
  createClothingItem, 
  updateClothingItem, 
  deleteClothingItem 
} from '../services/clothingItemService';
import ClothingItemCard from '../components/clothing/ClothingItemCard';
import ClothingItemForm from '../components/clothing/ClothingItemForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

function ClothingItems() {
  const [clothingItems, setClothingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTargetItem, setDeleteTargetItem] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    season: '',
    occasion: '',
    is_favorite: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Load clothing items
  useEffect(() => {
    fetchClothingItems();
  }, []);

  const fetchClothingItems = async () => {
    try {
      setLoading(true);
      const items = await getClothingItems();
      setClothingItems(items);
      setError(null);
    } catch (err) {
      console.error('Error fetching clothing items:', err);
      setError('Failed to load clothing items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleOpenDeleteConfirm = (item) => {
    setDeleteTargetItem(item);
    setIsDeleting(true);
  };

  const handleCloseDeleteConfirm = () => {
    setIsDeleting(false);
    setDeleteTargetItem(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await updateClothingItem(editingItem.Id, formData);
      } else {
        await createClothingItem(formData);
      }
      
      handleCloseModal();
      fetchClothingItems();
    } catch (error) {
      console.error('Error saving clothing item:', error);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetItem) return;
    
    try {
      await deleteClothingItem(deleteTargetItem.Id);
      handleCloseDeleteConfirm();
      fetchClothingItems();
    } catch (error) {
      console.error('Error deleting clothing item:', error);
      setError('Failed to delete clothing item. Please try again later.');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      season: '',
      occasion: '',
      is_favorite: '',
    });
    setSearchQuery('');
  };

  // Filter and search clothing items
  const filteredItems = clothingItems.filter(item => {
    // Apply search filter
    if (searchQuery && !item.Name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply category filter
    if (filters.category && item.category !== filters.category) {
      return false;
    }
    
    // Apply season filter
    if (filters.season && item.season !== filters.season) {
      return false;
    }
    
    // Apply occasion filter
    if (filters.occasion && item.occasion !== filters.occasion) {
      return false;
    }
    
    // Apply favorite filter
    if (filters.is_favorite === 'true' && !item.is_favorite) {
      return false;
    } else if (filters.is_favorite === 'false' && item.is_favorite) {
      return false;
    }
    
    return true;
  });

  // Get unique values for filter dropdowns
  const categories = [...new Set(clothingItems.map(item => item.category).filter(Boolean))];
  const seasons = [...new Set(clothingItems.map(item => item.season).filter(Boolean))];
  const occasions = [...new Set(clothingItems.map(item => item.occasion).filter(Boolean))];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
        <button 
          className="mt-4 btn btn-primary"
          onClick={fetchClothingItems}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Clothing Items</h1>
        <Button onClick={handleOpenAddModal}>Add Clothing Item</Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="searchQuery"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-1">
              Season
            </label>
            <select
              id="season"
              name="season"
              value={filters.season}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Seasons</option>
              {seasons.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="occasion" className="block text-sm font-medium text-gray-700 mb-1">
              Occasion
            </label>
            <select
              id="occasion"
              name="occasion"
              value={filters.occasion}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Occasions</option>
              {occasions.map(occasion => (
                <option key={occasion} value={occasion}>{occasion}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="is_favorite" className="block text-sm font-medium text-gray-700 mb-1">
              Favorites
            </label>
            <select
              id="is_favorite"
              name="is_favorite"
              value={filters.is_favorite}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Items</option>
              <option value="true">Favorites Only</option>
              <option value="false">Non-Favorites</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button
            onClick={clearFilters}
            variant="secondary"
            size="sm"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ClothingItemCard
              key={item.Id}
              item={item}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteConfirm}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clothing items found</h3>
          <p className="text-gray-500">
            {clothingItems.length > 0 
              ? 'Try adjusting your filters to see more items' 
              : 'Start by adding your first clothing item'}
          </p>
          {clothingItems.length === 0 && (
            <Button
              onClick={handleOpenAddModal}
              className="mt-4"
            >
              Add Clothing Item
            </Button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Clothing Item' : 'Add Clothing Item'}
        size="lg"
      >
        <ClothingItemForm
          item={editingItem}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleting}
        onClose={handleCloseDeleteConfirm}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete "{deleteTargetItem?.Name}"? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              onClick={handleCloseDeleteConfirm}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="danger"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ClothingItems;