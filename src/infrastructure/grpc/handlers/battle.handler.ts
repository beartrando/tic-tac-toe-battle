import * as grpc from '@grpc/grpc-js';
import * as profileProto from '../../../contracts/proto/profile';
import * as battleProto from '../../../contracts/proto/battle';
import logger from "@shared/logger";
import BattleGetUseCase from "../../../application/use-cases/battle/battle-get";
import callbackError from "./callback.error";
import BattleProtoMapper from "../mappers/battle.proto.mapper";
import {NotFoundError} from "@shared/errors";
import BattleInitUseCase from "../../../application/use-cases/battle/battle-init";
import BattleGetUnfinishedByProfileUseCase from "../../../application/use-cases/battle/battle-get-unfinished-by-profile";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";
import ProfileId from "../../../domain/profile/value-objects/profile-id.vo";


export class BattleHandler {
    constructor(
        private readonly getUseCase: BattleGetUseCase,
        private readonly getUnfinishedByProfileUseCase: BattleGetUnfinishedByProfileUseCase,
        private readonly createUseCase: BattleInitUseCase
    ) {
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


    async getUnfinishedByProfile(
        call: grpc.ServerUnaryCall<profileProto.ProfileIdRequest, battleProto.BattlesResponse>,
        callback: grpc.sendUnaryData<battleProto.BattlesResponse>
    ) {
        try {
            const {profileId} = call.request;

            const battle = await this.getUnfinishedByProfileUseCase.execute(new ProfileId(profileId));

            const result = battleProto.BattlesResponse.create({battles: {items: [...battle].map(BattleProtoMapper.toProto)}});

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
            const battle = await this.createUseCase.execute(new ProfileId(profileId), battleId ? new BattleId(battleId) : null);

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


