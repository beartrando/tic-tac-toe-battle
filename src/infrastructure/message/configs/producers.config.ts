export const messageProducersConfig: Record<string, string> = {
    battleCreated: process.env.MESSAGE_PRODUCER_TOPIC_BATTLE_CREATED ?? 'battle.created',
};
export default messageProducersConfig;
