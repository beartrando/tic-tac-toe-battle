export const messageProducersConfig: Record<string, string> = {
    battleMatched: process.env.MESSAGE_PRODUCER_TOPIC_BATTLE_MATCHED ?? 'battle.matched',
};
export default messageProducersConfig;
