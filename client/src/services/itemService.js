import API from './api';

export const itemService = {
  // Fetch items with optional search & filter parameters
  getItems: async (params = {}) => {
    const res = await API.get('/items', { params });
    return res.data;
  },

  // Get item by ID
  getItemById: async (id) => {
    const res = await API.get(`/items/${id}`);
    return res.data;
  },

  // Report a new lost or found item
  createItem: async (itemData) => {
    const res = await API.post('/items', itemData);
    return res.data;
  },

  // Update item details
  updateItem: async (id, itemData) => {
    const res = await API.put(`/items/${id}`, itemData);
    return res.data;
  },

  // Delete an item
  deleteItem: async (id) => {
    const res = await API.delete(`/items/${id}`);
    return res.data;
  },

  // Update status (e.g. 'active', 'claimed', 'resolved')
  updateStatus: async (id, status) => {
    const res = await API.patch(`/items/${id}/status`, { status });
    return res.data;
  },

  // Submit a claim on an item
  claimItem: async (id, claimData) => {
    const res = await API.post(`/items/${id}/claim`, claimData);
    return res.data;
  },

  // Get items reported by current user
  getMyItems: async () => {
    const res = await API.get('/items/user/my-items');
    return res.data;
  },

  // Get dashboard statistics
  getStats: async () => {
    const res = await API.get('/items/stats');
    return res.data;
  }
};
