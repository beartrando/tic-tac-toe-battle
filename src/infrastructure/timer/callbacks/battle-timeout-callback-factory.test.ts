import BattleTimeoutCallbackFactory from "./battle-timeout-callback-factory";
import TimerCallbackFactoryHolder from "../callback-factory-holder";
import TimerService from "../service";
import type BattleTimeoutSweepUseCase from "../../../application/use-cases/battle/battle-timeout-sweep";

const SWEEP_INTERVAL_SECONDS = 10;
const TIMER_KEY = "battle-timeout-sweep";

/** Промисы внутри колбэка таймера не ждут макрозадач — сливаем микрозадачи. */
async function flush(): Promise<void> {
    for (let i = 0; i < 10; i++) {
        await Promise.resolve();
    }
}

function buildTimer(sweep: jest.Mock) {
    const holder = new TimerCallbackFactoryHolder<string>();

    const timerService = new TimerService<string, string>(
        holder,
        SWEEP_INTERVAL_SECONDS,
    );

    const factory = new BattleTimeoutCallbackFactory(
        {execute: sweep} as unknown as BattleTimeoutSweepUseCase,
        timerService,
    );

    holder.factory = factory;

    timerService.start(TIMER_KEY, TIMER_KEY);

    return {timerService, factory};
}

describe("BattleTimeoutCallbackFactory — sweep каждые 10 секунд", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test("sweep выполняется по интервалу и перевооружает таймер", async () => {
        const sweep = jest.fn().mockResolvedValue([]);

        buildTimer(sweep);

        jest.advanceTimersByTime(SWEEP_INTERVAL_SECONDS * 1000);
        await flush();
        expect(sweep).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(SWEEP_INTERVAL_SECONDS * 1000);
        await flush();
        expect(sweep).toHaveBeenCalledTimes(2);

        jest.advanceTimersByTime(SWEEP_INTERVAL_SECONDS * 1000);
        await flush();
        expect(sweep).toHaveBeenCalledTimes(3);
    });

    test("до интервала sweep не выполняется", async () => {
        const sweep = jest.fn().mockResolvedValue([]);

        buildTimer(sweep);

        jest.advanceTimersByTime((SWEEP_INTERVAL_SECONDS - 1) * 1000);
        await flush();

        expect(sweep).not.toHaveBeenCalled();
    });

    test("ошибка sweep не останавливает цикл", async () => {
        const sweep = jest.fn()
            .mockRejectedValueOnce(new Error("db is down"))
            .mockResolvedValue([]);

        buildTimer(sweep);

        jest.advanceTimersByTime(SWEEP_INTERVAL_SECONDS * 1000);
        await flush();
        expect(sweep).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(SWEEP_INTERVAL_SECONDS * 1000);
        await flush();
        expect(sweep).toHaveBeenCalledTimes(2);
    });

    test("stop отменяет следующий sweep", async () => {
        const sweep = jest.fn().mockResolvedValue([]);

        const {timerService} = buildTimer(sweep);

        jest.advanceTimersByTime(SWEEP_INTERVAL_SECONDS * 1000);
        await flush();
        expect(sweep).toHaveBeenCalledTimes(1);

        timerService.stop(TIMER_KEY);

        jest.advanceTimersByTime(SWEEP_INTERVAL_SECONDS * 1000 * 5);
        await flush();
        expect(sweep).toHaveBeenCalledTimes(1);
    });
});
