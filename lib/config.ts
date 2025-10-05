export const API_BASE_URL = '/api';
export const SERVER_BASE_URL = 'http://103.103.20.23:8080';

export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${SERVER_BASE_URL}${imagePath}`;
};