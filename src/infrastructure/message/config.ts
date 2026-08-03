export const config = {
    brokers: (process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092']),
    clientId: process.env.KAFKA_CLIENT_ID ?? 'battle-client',
    groupId: process.env.KAFKA_GROUP_ID ?? 'battle-service',
};

export const messageProducersConfig = {
    battleStarted: process.env.MESSAGE_TOPIC_BATTLE_STARTED ?? 'battle.started',
};

export const messageConsumersConfig: Record<string, string> = {
    battleUpdated: process.env.MESSAGE_TOPIC_BATTLE_UPDATED ?? 'battle.updated',
};

export default config;
