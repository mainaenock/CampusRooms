import API_BASE_URL from '../config/api';
// Utility function to get the correct image URL for GridFS images
export const getImageUrl = (imageId) => {
  if (!imageId) return null;
  
  // If it's already a full URL (for external images), return as is
  if (typeof imageId === 'string' && imageId.startsWith('http')) {
    return imageId;
  }
  
  // For GridFS images (ObjectIds), use the new API endpoint
  return `${API_BASE_URL}/api/listings/image/${imageId}`;
};

// Utility function to get multiple image URLs
export const getImageUrls = (images) => {
  if (!images || !Array.isArray(images)) return [];
  return images.map(imageId => getImageUrl(imageId)).filter(url => url !== null);
}; 