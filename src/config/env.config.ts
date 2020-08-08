const MONGODB_HOST = process.env.S2AP_DB_HOST || 'localhost';
const MONGODB_API_SERVER_URL = 'mongodb://' + MONGODB_HOST + '/ApiServer';
const MONGODB_SESSION_URL = 'mongodb://' + MONGODB_HOST + '/ApiServer';
const APP_PORT = Number(process.env.S2AP_BACKEND_PORT) || 9002;
const S2AP_SECRET = process.env.S2AP_SECRET || 'super-secret';

export function getEnvConfigs() {
  return {
    MONGODB_API_SERVER_URL,
    APP_PORT,
    MONGODB_HOST,
    MONGODB_SESSION_URL,
    MONGODB_PORT: 27017,
    ACCESS_SECRET: S2AP_SECRET,
    REFRESH_SECRET: 'refresh-super-secret',
    JAEGER_AGENT_HOST: process.env.JAEGER_AGENT_HOST,
  };
}

export function isProdEnv() {
  return !!process.env.S2AP_CORE_HOST;
}

export function isDevEnv() {
  return !isProdEnv();
}
