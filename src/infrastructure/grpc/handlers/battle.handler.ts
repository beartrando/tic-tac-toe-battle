import * as grpc from '@grpc/grpc-js';
import * as battleProto from '../../../contracts/proto/battle';
import logger from "@shared/logger";
import BattleGetUseCase from "../../../application/use-cases/battle/battle-get";
import callbackError from "./callback.error";
import BattleProtoMapper from "../mappers/battle.proto.mapper";
import {NotFoundError} from "@shared/errors";
import BattleInitUseCase from "../../../application/use-cases/battle/battle-init";
import BattleGetManyUseCase from "../../../application/use-cases/battle/battle-get-many";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";
import ProfileId from "../../../domain/profile/value-objects/profile-id.vo";


export class BattleHandler {
    constructor(
        private readonly getUseCase: BattleGetUseCase,
        private readonly getManyUseCase: BattleGetManyUseCase,
        private readonly initUseCase: BattleInitUseCase
    ) {
    }

    async getMany(
        call: grpc.ServerUnaryCall<battleProto.BattleIdsRequest, battleProto.BattlesResponse>,
        callback: grpc.sendUnaryData<battleProto.BattlesResponse>
    ) {
        try {
            const {battleIds} = call.request;

            const battles = await this.getManyUseCase.execute(
                (battleIds ?? []).map((battleId) => new BattleId(battleId)),
            );

            const result = battleProto.BattlesResponse.create({
                battles: battleProto.BattleList.create({
                    items: battles.map(BattleProtoMapper.toProto),
                }),
            });

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    }

    async get(
        call: grpc.ServerUnaryCall<battleProto.BattleIdRequest, battleProto.BattleResponse>,
        callback: grpc.sendUnaryData<battleProto.BattleResponse>
    ) {
        try {
            const {battleId} = call.request;
            // logger.log('getBattleById ' + battleId);

            const battle = await this.getUseCase.execute(new BattleId(battleId));

            const result = battleProto.BattleResponse.create({battle: BattleProtoMapper.toProto(battle)});

            if (!result) {
                throw new NotFoundError('Battle');
            }

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    }

    async init(
        call: grpc.ServerUnaryCall<battleProto.BattleInitRequest, battleProto.BattleResponse>,
        callback: grpc.sendUnaryData<battleProto.BattleResponse>
    ) {

        try {
            const {profileId, battleId} = call.request;

            // logger.log(profileId);
            // logger.log(battleId);
            const battle = await this.initUseCase.execute(new ProfileId(profileId), battleId ? new BattleId(battleId) : null);

            const result = battleProto.BattleResponse.create({battle: BattleProtoMapper.toProto(battle)});

            logger.log(result);

            if (!result) {
                throw new NotFoundError('Battle');
            }

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    }
}

export default BattleHandler;
