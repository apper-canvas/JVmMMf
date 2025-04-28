import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClothingStats } from '../services/clothingItemService';
import { getOutfitStats } from '../services/outfitService';
import Loader from '../components/ui/Loader';
import { getClothingItems } from '../services/clothingItemService';
import { getOutfits } from '../services/outfitService';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clothingStats, setClothingStats] = useState([]);
  const [outfitStats, setOutfitStats] = useState([]);
  const [recentClothingItems, setRecentClothingItems] = useState([]);
  const [recentOutfits, setRecentOutfits] = useState([]);
  const [totalClothingItems, setTotalClothingItems] = useState(0);
  const [totalOutfits, setTotalOutfits] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch clothing stats
        const clothingStatsData = await getClothingStats();
        setClothingStats(clothingStatsData);
        
        // Get total clothing items from the stats
        const totalItems = clothingStatsData.reduce((total, item) => total + item.count, 0);
        setTotalClothingItems(totalItems);
        
        // Fetch outfit stats
        const outfitStatsData = await getOutfitStats();
        setOutfitStats(outfitStatsData);
        
        // Get total outfits from the stats
        const totalOutfitCount = outfitStatsData.reduce((total, item) => total + item.count, 0);
        setTotalOutfits(totalOutfitCount);
        
        // Fetch recent clothing items
        const recentItems = await getClothingItems({}, 0, 5);
        setRecentClothingItems(recentItems);
        
        // Fetch recent outfits
        const recentOutfitItems = await getOutfits({}, 0, 5);
        setRecentOutfits(recentOutfitItems);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm">Total Clothing Items</div>
          <div className="text-3xl font-bold mt-2">{totalClothingItems}</div>
          <Link to="/clothing-items" className="text-blue-600 text-sm inline-block mt-4 hover:underline">
            View all items
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm">Total Outfits</div>
          <div className="text-3xl font-bold mt-2">{totalOutfits}</div>
          <Link to="/outfits" className="text-blue-600 text-sm inline-block mt-4 hover:underline">
            View all outfits
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm">Favorite Items</div>
          <div className="text-3xl font-bold mt-2">
            {recentClothingItems.filter(item => item.is_favorite).length}
          </div>
          <Link to="/clothing-items" className="text-blue-600 text-sm inline-block mt-4 hover:underline">
            View favorites
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm">Favorite Outfits</div>
          <div className="text-3xl font-bold mt-2">
            {recentOutfits.filter(outfit => outfit.is_favorite).length}
          </div>
          <Link to="/outfits" className="text-blue-600 text-sm inline-block mt-4 hover:underline">
            View favorites
          </Link>
        </div>
      </div>
      
      {/* Recent Items Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Recent Clothing Items</h2>
          </div>
          <div className="p-6">
            {recentClothingItems.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentClothingItems.map(item => (
                  <li key={item.Id} className="py-3 flex items-center">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {item.category?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.Name}</p>
                      <p className="text-sm text-gray-500">{item.category} - {item.subcategory}</p>
                    </div>
                    {item.is_favorite && (
                      <span className="text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No clothing items yet</p>
            )}
            
            <div className="mt-4 text-right">
              <Link to="/clothing-items" className="text-blue-600 text-sm hover:underline">
                View all clothing items
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Recent Outfits</h2>
          </div>
          <div className="p-6">
            {recentOutfits.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentOutfits.map(outfit => (
                  <li key={outfit.Id} className="py-3 flex items-center">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {outfit.occasion?.charAt(0)?.toUpperCase() || 'O'}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{outfit.Name}</p>
                      <p className="text-sm text-gray-500">
                        {outfit.occasion} - {outfit.season}
                        {outfit.date_worn && ` (Last worn: ${new Date(outfit.date_worn).toLocaleDateString()})`}
                      </p>
                    </div>
                    {outfit.is_favorite && (
                      <span className="text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No outfits yet</p>
            )}
            
            <div className="mt-4 text-right">
              <Link to="/outfits" className="text-blue-600 text-sm hover:underline">
                View all outfits
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category and Occasion Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Clothing by Category</h2>
          </div>
          <div className="p-6">
            {clothingStats.length > 0 ? (
              <div className="space-y-4">
                {clothingStats.map(stat => (
                  <div key={stat.category || 'uncategorized'} className="flex items-center">
                    <div className="w-32 text-sm text-gray-600">{stat.category || 'Uncategorized'}</div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${(stat.count / totalClothingItems) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm text-gray-600">{stat.count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No category data available</p>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Outfits by Occasion</h2>
          </div>
          <div className="p-6">
            {outfitStats.length > 0 ? (
              <div className="space-y-4">
                {outfitStats.map(stat => (
                  <div key={stat.occasion || 'unspecified'} className="flex items-center">
                    <div className="w-32 text-sm text-gray-600">{stat.occasion || 'Unspecified'}</div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-600 rounded-full" 
                          style={{ width: `${(stat.count / totalOutfits) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm text-gray-600">{stat.count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No occasion data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;