import BattleTimeoutSweepUseCase from "../../src/application/use-cases/battle/battle-timeout-sweep";
import BattleEntity from "../../src/domain/battle/battle.entity";
import BattleStatusEnum from "../../src/domain/battle/enums/battle-status.enum";
import BattlePlayerIds from "../../src/domain/battle/value-objects/battle-player-ids.vo";
import BattleStatus from "../../src/domain/battle/value-objects/battle-status.vo";
import ProfileId from "../../src/domain/profile/value-objects/profile-id.vo";
import type BattleRepository from "../../src/domain/battle/battle.repository";
import type JobService from "../../src/infrastructure/job/service";
import * as battleProto from "../../src/contracts/proto/battle";

function makeBattle(status: BattleStatusEnum = BattleStatusEnum.Started): BattleEntity {
    return BattleEntity.create({
        playerIds: new BattlePlayerIds([new ProfileId("profile-1")]),
        status: BattleStatus.create(status),
    });
}

function build(staleBattles: BattleEntity[], timeoutSeconds = 180) {
    const saved: BattleEntity[] = [];
    const enqueued: Array<{ topic: string; data: battleProto.BattleObject }> = [];

    const repository = {
        findStale: jest.fn().mockResolvedValue(staleBattles),
        save: jest.fn().mockImplementation(async (battle: BattleEntity) => {
            saved.push(battle);
            return battle;
        }),
    } as unknown as BattleRepository;

    const jobService = {
        enqueue: jest.fn().mockImplementation(async (topic: string, data: battleProto.BattleObject) => {
            enqueued.push({topic, data});
            return 1;
        }),
    } as unknown as JobService;

    const useCase = new BattleTimeoutSweepUseCase(
        repository,
        jobService,
        "battle.timeout",
        timeoutSeconds,
    );

    return {useCase, repository, jobService, saved, enqueued};
}

describe("BattleTimeoutSweepUseCase", () => {
    test("ищет баттлы, не менявшие статус дольше timeoutSeconds", async () => {
        const before = Date.now();
        const {useCase, repository} = build([]);

        await useCase.execute();

        expect(repository.findStale).toHaveBeenCalledTimes(1);

        const since = (repository.findStale as jest.Mock).mock.calls[0][0] as Date;
        const expected = 180 * 1000;

        expect(Math.abs((before - since.getTime()) - expected)).toBeLessThan(5000);
    });

    test("нет устаревших баттлов — ничего не сохраняется и не публикуется", async () => {
        const {useCase, jobService, saved} = build([]);

        const result = await useCase.execute();

        expect(result).toEqual([]);
        expect(saved).toEqual([]);
        expect(jobService.enqueue).not.toHaveBeenCalled();
    });

    test("устаревший баттл переводится в TimeOut и публикуется в battle.timeout", async () => {
        const staleBattle = makeBattle(BattleStatusEnum.Started);
        const {useCase, jobService, saved, enqueued} = build([staleBattle]);

        const result = await useCase.execute();

        expect(result).toHaveLength(1);
        expect(result[0].status.value).toBe(BattleStatusEnum.TimeOut);
        expect(saved).toHaveLength(1);

        expect(jobService.enqueue).toHaveBeenCalledTimes(1);
        expect(enqueued[0].topic).toBe("battle.timeout");
        expect(enqueued[0].data.status).toBe(battleProto.BattleStatus.TIMEOUT);
        expect(enqueued[0].data.id).toBe(staleBattle.id.value);
    });

    test("обрабатывает несколько устаревших баттлов", async () => {
        const first = makeBattle(BattleStatusEnum.Created);
        const second = makeBattle(BattleStatusEnum.Matched);
        const {useCase, enqueued} = build([first, second]);

        const result = await useCase.execute();

        expect(result.map((battle) => battle.status.value)).toEqual([
            BattleStatusEnum.TimeOut,
            BattleStatusEnum.TimeOut,
        ]);
        expect(enqueued.map((entry) => entry.data.id)).toEqual([
            first.id.value,
            second.id.value,
        ]);
    });
});

describe("BattleEntity timeout", () => {
    test("timeout() переводит баттл в TimeOut", () => {
        const battle = makeBattle(BattleStatusEnum.Started);

        battle.timeout();

        expect(battle.status.value).toBe(BattleStatusEnum.TimeOut);
        expect(battle.final()).toBe(true);
    });

    test("final() истинно только для терминальных статусов", () => {
        const terminal = [
            BattleStatusEnum.Finished,
            BattleStatusEnum.Cancelled,
            BattleStatusEnum.TimeOut,
        ];

        for (const status of terminal) {
            expect(makeBattle(status).final()).toBe(true);
        }

        const notTerminal = [
            BattleStatusEnum.Created,
            BattleStatusEnum.Matched,
            BattleStatusEnum.Ready,
            BattleStatusEnum.Started,
        ];

        for (const status of notTerminal) {
            expect(makeBattle(status).final()).toBe(false);
        }
    });
});
