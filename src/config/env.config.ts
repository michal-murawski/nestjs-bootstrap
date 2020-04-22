const MONGODB_HOST = process.env.S2AP_DB_HOST || 'localhost';
const MONGODB_API_SERVER_URL = 'mongodb://' + MONGODB_HOST + '/ApiServer';
const MONGODB_SESSION_URL = 'mongodb://' + MONGODB_HOST + '/ApiServer';
const APP_PORT = Number(process.env.S2AP_BACKEND_PORT) || 9002;

export function getEnvConfigs() {
  return {
    MONGODB_API_SERVER_URL,
    APP_PORT,
    MONGODB_HOST,
    MONGODB_SESSION_URL,
    ACCESS_SECRET: 'super-secret',
    REFRESH_SECRET: 'refresh-super-secret',
  };
}
