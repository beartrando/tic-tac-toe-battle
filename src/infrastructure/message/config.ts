export const messageConfig = {
    brokers: (process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092']),
    clientId: process.env.KAFKA_CLIENT_ID ?? 'engine-client',
    groupId: process.env.KAFKA_GROUP_ID ?? 'engine-service',
};

export const messageProducersConfig: Record<string, string> = {
    battleStarted: process.env.MESSAGE_TOPIC_BATTLE_STARTED ?? 'engine.started',
};

export const messageConsumersConfig: Record<string, string> = {
    battleUpdated: process.env.MESSAGE_TOPIC_BATTLE_UPDATED ?? 'engine.updated',
};

export default messageConfig;
