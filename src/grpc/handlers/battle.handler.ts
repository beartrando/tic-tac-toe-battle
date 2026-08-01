import * as grpc from '@grpc/grpc-js';
import * as battleProto from '../generated/battle';
import * as profileProto from '../generated/profile';
import * as battleService from '../../services/battle.service';
import {callbackError} from './callback.error';
import {battleToProto} from '../../lib/grpc-prisma-converters/battle';
import logger from "@shared/logger";
import {BattleModel} from "../../models/battle.model";


export async function upsert(
    call: grpc.ServerUnaryCall<profileProto.ProfileIdRequest, battleProto.BattleObject>,
    callback: grpc.sendUnaryData<battleProto.BattleObject>
) {
    const {profileId} = call.request;

    try {
        const battle = await battleService.upsert(profileId);

        logger.log(battle);
        if (!battle) {
            throw new Error("Battle not found");
        }

        callback(null, battleToProto(battle));

    } catch (err: any) {
        logger.log(err);
        callbackError(callback, err);
    }
}

export async function join(
    call: grpc.ServerUnaryCall<battleProto.BattleStartRequest, battleProto.BattleObject>,
    callback: grpc.sendUnaryData<battleProto.BattleObject>
) {
    const {profileId, battleId} = call.request;

    try {

        const battle = await battleService.join(profileId, battleId);

        if (!battle) {
            throw new Error(`Cannot join profile ${profileId} to battle ${battleId}.`);
        }

        callback(null, battleToProto(battle));

    } catch (err: any) {
        logger.log(err);
        callbackError(callback, err);
    }
}

export const get = async (
    call: grpc.ServerUnaryCall<battleProto.BattleIdRequest, battleProto.BattleObject>,
    callback: grpc.sendUnaryData<battleProto.BattleObject>
) => {
    const {battleId} = call.request;

    try {
        const result = await BattleModel.get(battleId);

        if (!result) {
            throw new Error("Battle not found");
        }

        callback(null, battleToProto(result));

    } catch (err: any) {
        logger.log(err);
        callbackError(callback, err);
    }
};


