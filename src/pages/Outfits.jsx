import { useState, useEffect } from 'react';
import { 
  getOutfits, 
  createOutfit, 
  updateOutfit, 
  deleteOutfit 
} from '../services/outfitService';
import OutfitCard from '../components/outfit/OutfitCard';
import OutfitForm from '../components/outfit/OutfitForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

function Outfits() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTargetOutfit, setDeleteTargetOutfit] = useState(null);
  const [filters, setFilters] = useState({
    season: '',
    occasion: '',
    weather_condition: '',
    is_favorite: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Load outfits
  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    try {
      setLoading(true);
      const items = await getOutfits();
      setOutfits(items);
      setError(null);
    } catch (err) {
      console.error('Error fetching outfits:', err);
      setError('Failed to load outfits. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingOutfit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (outfit) => {
    setEditingOutfit(outfit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOutfit(null);
  };

  const handleOpenDeleteConfirm = (outfit) => {
    setDeleteTargetOutfit(outfit);
    setIsDeleting(true);
  };

  const handleCloseDeleteConfirm = () => {
    setIsDeleting(false);
    setDeleteTargetOutfit(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingOutfit) {
        await updateOutfit(editingOutfit.Id, formData);
      } else {
        await createOutfit(formData);
      }
      
      handleCloseModal();
      fetchOutfits();
    } catch (error) {
      console.error('Error saving outfit:', error);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetOutfit) return;
    
    try {
      await deleteOutfit(deleteTargetOutfit.Id);
      handleCloseDeleteConfirm();
      fetchOutfits();
    } catch (error) {
      console.error('Error deleting outfit:', error);
      setError('Failed to delete outfit. Please try again later.');
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
      season: '',
      occasion: '',
      weather_condition: '',
      is_favorite: '',
    });
    setSearchQuery('');
  };

  // Filter and search outfits
  const filteredOutfits = outfits.filter(outfit => {
    // Apply search filter
    if (searchQuery && !outfit.Name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply season filter
    if (filters.season && outfit.season !== filters.season) {
      return false;
    }
    
    // Apply occasion filter
    if (filters.occasion && outfit.occasion !== filters.occasion) {
      return false;
    }
    
    // Apply weather filter
    if (filters.weather_condition && outfit.weather_condition !== filters.weather_condition) {
      return false;
    }
    
    // Apply favorite filter
    if (filters.is_favorite === 'true' && !outfit.is_favorite) {
      return false;
    } else if (filters.is_favorite === 'false' && outfit.is_favorite) {
      return false;
    }
    
    return true;
  });

  // Get unique values for filter dropdowns
  const seasons = [...new Set(outfits.map(outfit => outfit.season).filter(Boolean))];
  const occasions = [...new Set(outfits.map(outfit => outfit.occasion).filter(Boolean))];
  const weatherConditions = [...new Set(outfits.map(outfit => outfit.weather_condition).filter(Boolean))];

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
          onClick={fetchOutfits}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Outfits</h1>
        <Button onClick={handleOpenAddModal}>Add Outfit</Button>
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
            <label htmlFor="weather_condition" className="block text-sm font-medium text-gray-700 mb-1">
              Weather
            </label>
            <select
              id="weather_condition"
              name="weather_condition"
              value={filters.weather_condition}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Weather</option>
              {weatherConditions.map(weather => (
                <option key={weather} value={weather}>{weather}</option>
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
              <option value="">All Outfits</option>
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
      {filteredOutfits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOutfits.map(outfit => (
            <OutfitCard
              key={outfit.Id}
              outfit={outfit}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteConfirm}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No outfits found</h3>
          <p className="text-gray-500">
            {outfits.length > 0 
              ? 'Try adjusting your filters to see more outfits' 
              : 'Start by adding your first outfit'}
          </p>
          {outfits.length === 0 && (
            <Button
              onClick={handleOpenAddModal}
              className="mt-4"
            >
              Add Outfit
            </Button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingOutfit ? 'Edit Outfit' : 'Add Outfit'}
        size="lg"
      >
        <OutfitForm
          outfit={editingOutfit}
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
            Are you sure you want to delete "{deleteTargetOutfit?.Name}"? This action cannot be undone.
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

export default Outfits;