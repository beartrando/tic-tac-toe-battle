export const messageConsumersConfig: Record<string, string> = {
    battleUpdated: process.env.MESSAGE_TOPIC_BATTLE_UPDATED ?? 'battle.updated',
};

export default messageConsumersConfig;

