export const messageConsumersConfig: Record<string, string> = {
    battleUpdated: process.env.MESSAGE_CONSUMER_TOPIC_BATTLE_UPDATED ?? 'engine.battle_updated',
};

export default messageConsumersConfig;

