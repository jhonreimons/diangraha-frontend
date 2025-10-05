export const API_BASE_URL = '/api';
export const SERVER_BASE_URL = 'http://103.103.20.23:8080';

export const getImageUrl = (imagePath?: string | null): string => {
  if (!imagePath) return "/placeholder.png";
  if (imagePath.startsWith("http")) return imagePath;
  return `${SERVER_BASE_URL}${imagePath}`;
};

export function safeImageUrl(path?: string | null): string {
  return getImageUrl(path); 
}
