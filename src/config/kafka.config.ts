import {battleUpdated} from "../lib/consumers";

export const kafkaConfig = {
    brokers: (process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092']),
    clientId: process.env.KAFKA_CLIENT_ID ?? 'battle-client',
    groupId: process.env.KAFKA_GROUP_ID ?? 'battle-service',
};

export const kafkaProducersConfig = {
    topicBattleStarted: process.env.KAFKA_TOPIC_BATTLE_STARTED ?? 'battle.started',
};

type ConsumerConfig = {
    topic: string;
    handler: (message: unknown) => Promise<void>;
};

export const kafkaConsumersConfig: Record<string, ConsumerConfig> = {
    battleUpdated: {
        topic: process.env.KAFKA_TOPIC_BATTLE_UPDATED ?? 'battle.updated',
        handler: battleUpdated
    },
};

export default kafkaConfig;