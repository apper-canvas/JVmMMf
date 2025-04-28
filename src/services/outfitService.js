import { fetchRecords, createRecord, updateRecord, deleteRecord, uploadFile } from './apperService';

const TABLE_NAME = 'outfit';

// Fields to retrieve from the outfit table
const FIELDS = [
  'Id', 'Name', 'description', 'season', 'occasion', 'items',
  'date_worn', 'rating', 'image', 'is_favorite', 'weather_condition',
  'CreatedOn', 'ModifiedOn'
];

export const getOutfits = async (filters = {}, page = 0, limit = 20) => {
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

export const getOutfitById = async (id) => {
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

export const createOutfit = async (outfit) => {
  // Handle file upload if image is provided
  if (outfit.image && outfit.image instanceof File) {
    const uploadResponse = await uploadFile(outfit.image);
    outfit.image = uploadResponse.data.path;
  }

  return await createRecord(TABLE_NAME, outfit);
};

export const updateOutfit = async (id, outfit) => {
  // Handle file upload if image is provided as a File
  if (outfit.image && outfit.image instanceof File) {
    const uploadResponse = await uploadFile(outfit.image);
    outfit.image = uploadResponse.data.path;
  }

  return await updateRecord(TABLE_NAME, id, outfit);
};

export const deleteOutfit = async (id) => {
  return await deleteRecord(TABLE_NAME, id);
};

export const getOutfitStats = async () => {
  // Get counts by occasion
  const params = {
    fields: ['occasion', 'Id'],
    aggregators: [
      {
        field: 'Id',
        function: 'count',
        alias: 'count'
      }
    ],
    groupBy: ['occasion']
  };

  const response = await fetchRecords(TABLE_NAME, params);
  return response.data;
};