import * as grpc from '@grpc/grpc-js';
import * as battleProto from '../../../contracts/proto/battle';
import logger from "@shared/logger";
import {extractTrackId, type MessageLogger} from "@shared/elastic";
import BattleGetUseCase from "../../../application/use-cases/battle/battle-get";
import callbackError from "./callback.error";
import BattleProtoMapper from "../mappers/battle.proto.mapper";
import BattleGetManyUseCase from "../../../application/use-cases/battle/battle-get-many";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";
import {BATTLE_GET_MANY_PATH, BATTLE_GET_PATH} from "../grpc.constants";


export class BattleHandler {
    constructor(
        private readonly getUseCase: BattleGetUseCase,
        private readonly getManyUseCase: BattleGetManyUseCase,
        private readonly messageLogger?: MessageLogger,
    ) {
    }

    async getMany(
        call: grpc.ServerUnaryCall<battleProto.BattleIdsRequest, battleProto.BattlesResponse>,
        callback: grpc.sendUnaryData<battleProto.BattlesResponse>
    ) {
        void this.messageLogger?.logIn(
            'grpc',
            BATTLE_GET_MANY_PATH,
            call.request,
            extractTrackId(call.request),
        );

        try {
            const {battleIds} = call.request;

            const battles = await this.getManyUseCase.execute(
                (battleIds ?? []).map((battleId) => new BattleId(battleId)),
            );

            const result = battleProto.BattlesResponse.create({
                battles: battleProto.BattleList.create({
                    items: battles.map((battle) => BattleProtoMapper.toProto(battle)),
                }),
            });

            callback(null, result);

            void this.messageLogger?.logOut(
                'grpc',
                BATTLE_GET_MANY_PATH,
                result,
                extractTrackId(result),
            );

        } catch (err: any) {
            logger.log(err);

            void this.messageLogger?.logOut('grpc', BATTLE_GET_MANY_PATH, {error: err?.message ?? String(err)});

            callbackError(callback, err);
        }
    }

    async get(
        call: grpc.ServerUnaryCall<battleProto.BattleIdRequest, battleProto.BattlesResponse>,
        callback: grpc.sendUnaryData<battleProto.BattlesResponse>
    ) {
        void this.messageLogger?.logIn(
            'grpc',
            BATTLE_GET_PATH,
            call.request,
            extractTrackId(call.request),
        );

        try {
            const {battleId} = call.request;
            // logger.log('getBattleById ' + battleId);

            const battle = await this.getUseCase.execute(new BattleId(battleId));

            // контракт метода — BattlesResponse (стримминг читает `battles.items`)
            const result = battleProto.BattlesResponse.create({
                battles: battleProto.BattleList.create({
                    items: [BattleProtoMapper.toProto(battle)],
                }),
            });

            callback(null, result);

            void this.messageLogger?.logOut(
                'grpc',
                BATTLE_GET_PATH,
                result,
                extractTrackId(result),
            );

        } catch (err: any) {
            logger.log(err);

            void this.messageLogger?.logOut('grpc', BATTLE_GET_PATH, {error: err?.message ?? String(err)});

            callbackError(callback, err);
        }
    }
}

export default BattleHandler;
