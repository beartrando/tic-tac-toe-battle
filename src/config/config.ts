export const config = {
    appName: process.env.APP_NAME || 'battle',
    appVersion: process.env.APP_VERSION || '0.0.0',
    appEnv: process.env.APP_ENV || 'prod',

    port: process.env.GRPC_PORT || 50051,
    serviceEngineUrl: process.env.SERVICE_ENGINE_URL || 'engine:50051',
};

export default config;