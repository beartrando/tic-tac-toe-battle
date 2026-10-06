export const timeoutConfig = {
    statusTimeoutSeconds: Number(process.env.BATTLE_STATUS_TIMEOUT_SECONDS ?? 180),
    sweepSeconds: Number(process.env.BATTLE_TIMEOUT_SWEEP_SECONDS ?? 10),
    sweepTimerKey: "battle-timeout-sweep",
};

export default timeoutConfig;
