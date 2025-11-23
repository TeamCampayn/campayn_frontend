// Backend API configuration
// This file manages the backend URL for both development and production environments

const isDevelopment = import.meta.env.MODE === 'development';

// Backend URL configuration
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
  (isDevelopment ? 'http://localhost:4000' : 'https://campayn-backend.netlify.app/.netlify/functions/api');

// Socket URL configuration (for Socket.IO)
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  (isDevelopment ? 'http://localhost:4000' : 'https://campayn-backend.netlify.app');

/**
 * Constructs the full API URL
 * @param path - API endpoint path (e.g., '/api/campaigns')
 * @returns Full URL to the API endpoint
 */
export function getApiUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In production, we need to ensure proper path construction for Netlify Functions
  if (!isDevelopment) {
    // If path already includes /api, use it as is
    if (cleanPath.startsWith('api/')) {
      return `${BACKEND_URL}/${cleanPath}`;
    }
    // Otherwise prepend /api
    return `${BACKEND_URL}/api/${cleanPath}`;
  }
  
  // In development, just append the path
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
