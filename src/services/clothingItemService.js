import { fetchRecords, createRecord, updateRecord, deleteRecord, uploadFile } from './apperService';

const TABLE_NAME = 'clothing_item';

// Fields to retrieve from the clothing_item table
const FIELDS = [
  'Id', 'Name', 'color', 'description', 'category', 'subcategory', 
  'season', 'occasion', 'brand', 'size', 'purchase_date', 
  'purchase_price', 'store', 'current_status', 'rating', 
  'is_favorite', 'image', 'CreatedOn', 'ModifiedOn'
];

export const getClothingItems = async (filters = {}, page = 0, limit = 20) => {
  const params = {
    fields: FIELDS,
    pagingInfo: { offset: page * limit, limit },
    orderBy: [{ field: 'CreatedOn', direction: 'desc' }],
  };

  // Add filters if provided
  if (Object.keys(filters).length > 0) {
    params.filter = {
      logic: 'and',
      filters: Object.entries(filters).map(([field, value]) => ({
        field,
        operator: 'eq',
        value,
      })),
    };
  }

  const response = await fetchRecords(TABLE_NAME, params);
  return response.data;
};

export const getClothingItemById = async (id) => {
  const params = {
    fields: FIELDS,
    filter: {
      logic: 'and',
      filters: [{ field: 'Id', operator: 'eq', value: id }],
    },
  };

  const response = await fetchRecords(TABLE_NAME, params);
  return response.data && response.data.length > 0 ? response.data[0] : null;
};

export const createClothingItem = async (clothingItem) => {
  // Handle file upload if image is provided
  if (clothingItem.image && clothingItem.image instanceof File) {
    const uploadResponse = await uploadFile(clothingItem.image);
    clothingItem.image = uploadResponse.data.path;
  }

  return await createRecord(TABLE_NAME, clothingItem);
};

export const updateClothingItem = async (id, clothingItem) => {
  // Handle file upload if image is provided as a File
  if (clothingItem.image && clothingItem.image instanceof File) {
    const uploadResponse = await uploadFile(clothingItem.image);
    clothingItem.image = uploadResponse.data.path;
  }

  return await updateRecord(TABLE_NAME, id, clothingItem);
};

export const deleteClothingItem = async (id) => {
  return await deleteRecord(TABLE_NAME, id);
};

export const getClothingStats = async () => {
  // Get counts by category
  const params = {
    fields: ['category', 'Id'],
    aggregators: [
      {
        field: 'Id',
        function: 'count',
        alias: 'count'
      }
    ],
    groupBy: ['category']
  };

  const response = await fetchRecords(TABLE_NAME, params);
  return response.data;
};