export const messageProducersConfig: Record<string, string> = {
    battleStarted: process.env.MESSAGE_TOPIC_BATTLE_STARTED ?? 'battle.started',
};
export default messageProducersConfig;
