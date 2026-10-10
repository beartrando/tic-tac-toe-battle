export const messageProducersConfig: Record<string, string> = {
    battleTimeout: process.env.MESSAGE_PRODUCER_TOPIC_BATTLE_TIMEOUT ?? 'battle.timeout',
};
export default messageProducersConfig;
