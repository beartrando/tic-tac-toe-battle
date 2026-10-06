export const messageProducersConfig: Record<string, string> = {
    battleMatched: process.env.MESSAGE_PRODUCER_TOPIC_BATTLE_MATCHED ?? 'battle.matched',
    battleTimeout: process.env.MESSAGE_PRODUCER_TOPIC_BATTLE_TIMEOUT ?? 'battle.timeout',
};
export default messageProducersConfig;
