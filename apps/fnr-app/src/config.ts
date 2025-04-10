export const API_CONFIG = {
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? '/api' // In production, use relative URL
      : 'http://localhost:3333/api', // In development, use localhost
} as const;

// Helper to get full API URL
export const getApiUrl = (path: string) => {
  const basePath = API_CONFIG.baseUrl;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${basePath}/${cleanPath}`;
};
