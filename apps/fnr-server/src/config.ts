export const SERVER_CONFIG = {
  port:
    process.env.PORT || (process.env.NODE_ENV === 'production' ? 3000 : 3333),
  host: process.env.HOST || 'localhost',
} as const;

// Helper to build the base URL
export const getServerBaseUrl = () => {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  return `${protocol}://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`;
};
