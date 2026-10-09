import logger from "@shared/logger";
import {TimerCallbackFactoryInterface, TimerCallbackInterface, TimerService} from "@shared/timer";
import BattleTimeoutSweepUseCase from "../../../application/use-cases/battle/battle-timeout-sweep";

/**
 * Баттлы в этом сервисе отслеживаются по БД, а не по ключу, поэтому ключ таймера
 * один (см. `timeoutConfig.sweepTimerKey`). Колбэк прогоняет sweep и
 * перезапускает сам себя — так таймер из engine даёт периодическую проверку
 * каждые `sweepSeconds`, как раньше `setInterval`.
 */
export class BattleTimeoutCallbackFactory implements TimerCallbackFactoryInterface<string> {

    constructor(
        private readonly sweepUseCase: BattleTimeoutSweepUseCase,
        private readonly timerService: TimerService<string, string>,
    ) {
    }

    create(key: string): TimerCallbackInterface {
        return async () => {
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
                this.timerService.start(key, key);
            }
        };
    }
}

export default BattleTimeoutCallbackFactory;
