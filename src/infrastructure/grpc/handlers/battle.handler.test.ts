import * as grpc from "@grpc/grpc-js";
import BattleHandler from "./battle.handler";
import BattleEntity from "../../../domain/battle/battle.entity";
import BattleStatusEnum from "../../../domain/battle/enums/battle-status.enum";
import BattlePlayerIds from "../../../domain/battle/value-objects/battle-player-ids.vo";
import BattleStatus from "../../../domain/battle/value-objects/battle-status.vo";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";
import ProfileId from "../../../domain/profile/value-objects/profile-id.vo";
import type BattleGetUseCase from "../../../application/use-cases/battle/battle-get";
import type BattleGetManyUseCase from "../../../application/use-cases/battle/battle-get-many";
import type BattleInitUseCase from "../../../application/use-cases/battle/battle-init";
import * as battleProto from "../../../contracts/proto/battle";

function makeBattle(id: string, status: BattleStatusEnum): BattleEntity {
    return BattleEntity.create({
        id: new BattleId(id),
        playerIds: new BattlePlayerIds([new ProfileId("profile-1")]),
        status: BattleStatus.create(status),
    });
}

function buildHandler(battles: BattleEntity[]) {
    const getUseCase = {
        execute: jest.fn().mockResolvedValue(battles[0] ?? null),
    } as unknown as BattleGetUseCase;

    const getManyUseCase = {
        execute: jest.fn().mockResolvedValue(battles),
    } as unknown as BattleGetManyUseCase;

    const initUseCase = {} as BattleInitUseCase;

    return {
        handler: new BattleHandler(getUseCase, getManyUseCase, initUseCase),
        getUseCase,
        getManyUseCase,
    };
}

describe("BattleHandler.getMany", () => {
    test("возвращает BattlesResponse со списком баттлов", async () => {
        const started = makeBattle("battle-1", BattleStatusEnum.Started);
        const timedOut = makeBattle("battle-2", BattleStatusEnum.TimeOut);

        const {handler} = buildHandler([started, timedOut]);

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
        const {handler} = buildHandler([]);

        const callback = jest.fn();
        const call = {request: {battleIds: []}} as never;

        await handler.getMany(call, callback);

        expect(callback).toHaveBeenCalledTimes(1);

        const [err, response] = callback.mock.calls[0];

        expect(err).toBeNull();
        expect(response.battles.items).toEqual([]);
    });
});

describe("BattleHandler.get", () => {
    // контракт метода — BattlesResponse; раньше собирался BattleResponse
    // и клиент получал {}
    test("отвечает BattlesResponse с одним баттлом", async () => {
        const battle = makeBattle("battle-1", BattleStatusEnum.Started);
        const {handler, getUseCase} = buildHandler([battle]);

        const callback = jest.fn();
        const call = {request: {battleId: "battle-1"}} as never;

        await handler.get(call, callback);

        expect(getUseCase.execute).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledTimes(1);

        const [err, response] = callback.mock.calls[0];

        expect(err).toBeNull();
        expect(response.battles.items).toHaveLength(1);
        expect(response.battles.items[0].id).toBe("battle-1");
        expect(response.battles.items[0].status).toBe(battleProto.BattleStatus.STARTED);
        expect(response.battle).toBeUndefined();
    });

    test("ошибка поиска уходит клиенту как ошибкой вызова", async () => {
        const {handler, getUseCase} = buildHandler([]);

        (getUseCase.execute as jest.Mock).mockRejectedValueOnce(new Error("Battle does not exist"));

        const callback = jest.fn();
        const call = {request: {battleId: "missing"}} as never;

        await handler.get(call, callback);

        expect(callback).toHaveBeenCalledTimes(1);

        const [err, response] = callback.mock.calls[0];

        expect(err).toMatchObject({code: grpc.status.INTERNAL});
        expect(response).toBeNull();
    });
});
