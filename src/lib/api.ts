// Backend API configuration
// This file manages the backend URL for both development and production environments

const isDevelopment = import.meta.env.MODE === 'development';

// Backend URL configuration
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
  (isDevelopment ? 'http://localhost:4000' : 'https://campayn-backend.netlify.app');

// Socket URL configuration (for Socket.IO)
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  (isDevelopment ? 'http://localhost:4000' : 'https://campayn-backend.netlify.app');

console.log('API Configuration:', {
  mode: import.meta.env.MODE,
  isDevelopment,
  BACKEND_URL,
  SOCKET_URL,
});

/**
 * Constructs the full API URL
 * @param path - API endpoint path (e.g., '/api/campaigns' or 'api/campaigns')
 * @returns Full URL to the API endpoint
 */
export function getApiUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  let cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Remove 'api/' prefix from path if present
  if (cleanPath.startsWith('api/')) {
    cleanPath = cleanPath.substring(4); // Remove 'api/'
  }
  
  // In development, backend URL is just http://localhost:4000, so add /api/
  if (isDevelopment) {
    return `${BACKEND_URL}/api/${cleanPath}`;
  }
  
  // In production, BACKEND_URL already includes /.netlify/functions/api
  // So just append the path without /api/
  return `${BACKEND_URL}/${cleanPath}`;
}

/**
 * Makes a fetch request to the backend API with proper headers
 * @param path - API endpoint path
 * @param options - Fetch options
 * @returns Fetch response
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = getApiUrl(path);
  
  // Add default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  return fetch(url, {
    ...options,
    headers,
  });
}

// Export for easy access
export default {
  BACKEND_URL,
  SOCKET_URL,
  getApiUrl,
  apiFetch,
};
