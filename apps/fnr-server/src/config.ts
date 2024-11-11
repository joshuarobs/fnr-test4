export const SERVER_CONFIG = {
  port: process.env.PORT || 3333,
  host: process.env.HOST || 'localhost',
} as const;

// Helper to build the base URL
export const getServerBaseUrl = () => {
  return `http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`;
};
