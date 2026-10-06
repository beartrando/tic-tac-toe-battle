import logger from "@shared/logger";
import BattleTimeoutSweepUseCase from "../../application/use-cases/battle/battle-timeout-sweep";

/**
 * Периодический sweep: баттлы с неизменившимся статусом дольше `timeoutSeconds`
 * переводятся в TimeOut (см. BattleTimeoutSweepUseCase).
 */
export class BattleTimeoutSweepService {
    private timer: NodeJS.Timeout | null = null;
    private running = false;

    constructor(
        private readonly sweepUseCase: BattleTimeoutSweepUseCase,
        private readonly sweepSeconds: number,
    ) {
    }

    start(): void {
        if (this.timer) {
            return;
        }

        this.timer = setInterval(
            () => void this.sweep(),
            1000 * this.sweepSeconds,
        );

        logger.info(`⏱ Battle status timeout sweep started: every ${this.sweepSeconds}s`);
    }

    async sweep(): Promise<void> {
        if (this.running) {
            return;
        }

        this.running = true;

        try {
            const timedOutBattles = await this.sweepUseCase.execute();

            if (timedOutBattles.length > 0) {
                logger.warn(
                    `⏱ Battles moved to TimeOut (${timedOutBattles.length}): `
                    + timedOutBattles.map((battle) => battle.id.value).join(", "),
                );
            }
        } catch (err) {
            logger.error({err}, "💥 Battle timeout sweep failed");
        } finally {
            this.running = false;
        }
    }

    stop(): void {
        if (!this.timer) {
            return;
        }

        clearInterval(this.timer);
        this.timer = null;
    }
}

export default BattleTimeoutSweepService;
