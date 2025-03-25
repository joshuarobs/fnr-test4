export const SERVER_CONFIG = {
  port:
    process.env.PORT || (process.env.NODE_ENV === 'production' ? 3000 : 3333),
  host: process.env.NODE_ENV === 'production' ? '127.0.0.1' : 'localhost',
} as const;

// Helper to build the base URL
export const getServerBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, return relative URL since we're behind Nginx
    return '';
  }
  // In development, return full URL
  return `http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`;
};
