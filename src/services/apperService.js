// Base service for Apper SDK initialization and common operations
const CANVAS_ID = "10eb70bbf9af478ca7dde4a50a8cab8d";

export const initializeApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient(CANVAS_ID);
};

export const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient(CANVAS_ID);
};

export const fetchRecords = async (tableName, params = {}) => {
  try {
    const apperClient = getApperClient();
    return await apperClient.fetchRecords(tableName, params);
  } catch (error) {
    console.error(`Error fetching ${tableName} records:`, error);
    throw error;
  }
};

export const createRecord = async (tableName, record) => {
  try {
    const apperClient = getApperClient();
    return await apperClient.createRecord(tableName, { record });
  } catch (error) {
    console.error(`Error creating ${tableName} record:`, error);
    throw error;
  }
};

export const updateRecord = async (tableName, recordId, record) => {
  try {
    const apperClient = getApperClient();
    return await apperClient.updateRecord(tableName, recordId, { record });
  } catch (error) {
    console.error(`Error updating ${tableName} record:`, error);
    throw error;
  }
};

export const deleteRecord = async (tableName, recordId) => {
  try {
    const apperClient = getApperClient();
    return await apperClient.deleteRecord(tableName, recordId);
  } catch (error) {
    console.error(`Error deleting ${tableName} record:`, error);
    throw error;
  }
};

export const uploadFile = async (file) => {
  try {
    const apperClient = getApperClient();
    return await apperClient.uploadFile(file);
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};