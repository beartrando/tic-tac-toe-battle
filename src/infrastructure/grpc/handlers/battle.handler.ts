import * as grpc from '@grpc/grpc-js';
import * as profileProto from '../../../contracts/proto/profile';
import * as battleProto from '../../../contracts/proto/battle';
import logger from "@shared/logger";
import GetUseCase from "../../../application/use-cases/battle/get";
import callbackError from "./callback.error";
import BattleProtoMapper from "../mappers/battle.proto.mapper";
import Id from "../../../domain/common/value-objects/id.vo";
import {NotFoundError} from "@shared/errors";
import StartUseCase from "../../../application/use-cases/battle/start";
import GetActiveByProfileUseCase from "../../../application/use-cases/battle/get-active-by-profile";


export class BattleHandler {
    constructor(
        private readonly getUseCase: GetUseCase,
        private readonly getActiveByProfileUseCase: GetActiveByProfileUseCase,
        private readonly startUseCase: StartUseCase
    ) {
    }

    async get(
        call: grpc.ServerUnaryCall<battleProto.BattleIdRequest, battleProto.BattleResponse>,
        callback: grpc.sendUnaryData<battleProto.BattleResponse>
    ) {
        try {
            const {battleId} = call.request;
            // logger.log('getBattleById ' + battleId);

            const battle = await this.getUseCase.execute(new Id(battleId));

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


    async getActiveByProfile(
        call: grpc.ServerUnaryCall<profileProto.ProfileIdRequest, battleProto.BattlesResponse>,
        callback: grpc.sendUnaryData<battleProto.BattlesResponse>
    ) {
        try {
            const {profileId} = call.request;

            const battle = await this.getActiveByProfileUseCase.execute(new Id(profileId));

            const result = battleProto.BattlesResponse.create({battles: {items: [...battle].map(BattleProtoMapper.toProto)}});

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    }

    async start(
        call: grpc.ServerUnaryCall<battleProto.BattleStartRequest, battleProto.BattleResponse>,
        callback: grpc.sendUnaryData<battleProto.BattleResponse>
    ) {

        try {
            const {profileId, battleId} = call.request;

            // logger.log(profileId);
            // logger.log(battleId);
            const battle = await this.startUseCase.execute(new Id(profileId), battleId ? new Id(battleId) : null);

            const result = battleProto.BattleResponse.create({battle: BattleProtoMapper.toProto(battle)});

            // logger.log(result);

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


