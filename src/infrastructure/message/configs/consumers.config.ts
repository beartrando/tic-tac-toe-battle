export const messageConsumersConfig: Record<string, string> = {
    battleUpdated: process.env.MESSAGE_CONSUMER_TOPIC_BATTLE_UPDATED ?? 'engine.battle_updated',
    battleTerminated: process.env.MESSAGE_CONSUMER_TOPIC_BATTLE_TERMINATED ?? 'engine.battle_terminated',
};

export default messageConsumersConfig;
