import BattleHandler from "../../src/infrastructure/grpc/handlers/battle.handler";
import BattleEntity from "../../src/domain/battle/battle.entity";
import BattleStatusEnum from "../../src/domain/battle/enums/battle-status.enum";
import BattlePlayerIds from "../../src/domain/battle/value-objects/battle-player-ids.vo";
import BattleStatus from "../../src/domain/battle/value-objects/battle-status.vo";
import BattleId from "../../src/domain/battle/value-objects/battle-id.vo";
import ProfileId from "../../src/domain/profile/value-objects/profile-id.vo";
import type BattleGetUseCase from "../../src/application/use-cases/battle/battle-get";
import type BattleGetManyUseCase from "../../src/application/use-cases/battle/battle-get-many";
import type BattleInitUseCase from "../../src/application/use-cases/battle/battle-init";
import * as battleProto from "../../src/contracts/proto/battle";

function makeBattle(id: string, status: BattleStatusEnum): BattleEntity {
    return BattleEntity.create({
        id: new BattleId(id),
        playerIds: new BattlePlayerIds([new ProfileId("profile-1")]),
        status: BattleStatus.create(status),
    });
}

function buildHandler(battles: BattleEntity[]) {
    const getUseCase = {} as BattleGetUseCase;

    const getManyUseCase = {
        execute: jest.fn().mockResolvedValue(battles),
    } as unknown as BattleGetManyUseCase;

    const initUseCase = {} as BattleInitUseCase;

    return new BattleHandler(getUseCase, getManyUseCase, initUseCase);
}

describe("BattleHandler.getMany", () => {
    test("возвращает BattlesResponse со списком баттлов", async () => {
        const started = makeBattle("battle-1", BattleStatusEnum.Started);
        const timedOut = makeBattle("battle-2", BattleStatusEnum.TimeOut);

        const handler = buildHandler([started, timedOut]);

        const callback = jest.fn();
        const call = {request: {battleIds: ["battle-1", "battle-2"]}} as never;

        await handler.getMany(call, callback);

        expect(callback).toHaveBeenCalledTimes(1);

        const [err, response] = callback.mock.calls[0];

        expect(err).toBeNull();
        expect(response.battles.items).toHaveLength(2);
        expect(response.battles.items[0].id).toBe("battle-1");
        expect(response.battles.items[0].status).toBe(battleProto.BattleStatus.STARTED);
        expect(response.battles.items[1].id).toBe("battle-2");
        expect(response.battles.items[1].status).toBe(battleProto.BattleStatus.TIMEOUT);
    });

    test("пустой список id — пустой ответ", async () => {
        const handler = buildHandler([]);

        const callback = jest.fn();
        const call = {request: {battleIds: []}} as never;

        await handler.getMany(call, callback);

        expect(callback).toHaveBeenCalledTimes(1);

        const [err, response] = callback.mock.calls[0];

        expect(err).toBeNull();
        expect(response.battles.items).toEqual([]);
    });
});
