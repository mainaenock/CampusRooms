// API Configuration for CampusRooms
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  
  // Listing endpoints
  LISTINGS: `${API_BASE_URL}/api/listings`,
  FEATURED_LISTINGS: `${API_BASE_URL}/api/listings/featured`,
  LISTING_DETAILS: (id) => `${API_BASE_URL}/api/listings/${id}`,
  CREATE_LISTING: `${API_BASE_URL}/api/listings`,
  UPDATE_LISTING: (id) => `${API_BASE_URL}/api/listings/${id}`,
  DELETE_LISTING: (id) => `${API_BASE_URL}/api/listings/${id}`,
  TOGGLE_FEATURED: (id) => `${API_BASE_URL}/api/listings/${id}/toggle-featured`,
  
  // Flag endpoints
  FLAG_LISTING: (id) => `${API_BASE_URL}/api/flags/${id}`,
  CHECK_USER_FLAG: (id) => `${API_BASE_URL}/api/flags/${id}/check`,
  GET_FLAGS: (id) => `${API_BASE_URL}/api/flags/${id}/all`,
  UPDATE_FLAG_STATUS: (id) => `${API_BASE_URL}/api/flags/${id}/status`,
  
  // Chat endpoints
  CHAT_MESSAGES: `${API_BASE_URL}/api/chat/messages`,
  CHAT_HISTORY: `${API_BASE_URL}/api/chat/history`,
  DELETE_CONVERSATION: (id) => `${API_BASE_URL}/api/chat/conversation/${id}`,
  
  // Admin endpoints
  ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`,
  ADMIN_FLAGGED_LISTINGS: `${API_BASE_URL}/api/admin/flagged-listings`,
  ADMIN_WHATSAPP_NOTIFY: (id) => `${API_BASE_URL}/api/admin/whatsapp-notify/${id}`,
  ADMIN_BULK_WHATSAPP: `${API_BASE_URL}/api/admin/whatsapp-bulk-notify`,
  
  // Profile endpoints
  UPDATE_PROFILE: `${API_BASE_URL}/api/profile/update`,
  UPLOAD_AVATAR: `${API_BASE_URL}/api/profile/avatar`,
  
  // File upload
  UPLOAD_IMAGE: `${API_BASE_URL}/api/upload/image`,
};

export default API_BASE_URL; 