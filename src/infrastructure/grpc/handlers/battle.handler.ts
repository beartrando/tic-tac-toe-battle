import * as grpc from '@grpc/grpc-js';
import * as authProto from '../../../contracts/proto/auth';
import * as profileProto from '../../../contracts/proto/profile';
import logger from "@shared/logger";
import GetMeUseCase from "../../../application/use-cases/profile/join";
import GetUseCase from "../../../application/use-cases/profile/get";
import callbackError from "./callback.error";
import AuthService from "../../auth/auth-service";
import AuthHelper from "../helpers/auth.helper";
import GetOrCreateUseCase from "../../../application/use-cases/profile/get-or-create";
import GetByUserUseCase from "../../../application/use-cases/profile/get-active-by-user";
import ProfileGrpcMapper from "../mappers/profile.mapper";
import Id from "../../../domain/value-objects/id.vo";
import {NotFoundError} from "@shared/errors";


export class BattleHandler {
    constructor(
        private readonly authService: AuthService,
        private readonly getOrCreateUseCase: GetOrCreateUseCase,
        private readonly getByUserUseCase: GetByUserUseCase,
        private readonly getMeUseCase: GetMeUseCase,
        private readonly getUseCase: GetUseCase
    ) {
    }

    async getOrCreate(
        call: grpc.ServerUnaryCall<authProto.UserIdRequest, profileProto.ProfileResponse>,
        callback: grpc.sendUnaryData<profileProto.ProfileResponse>
    ) {
        try {
            const accessToken = AuthHelper.getAccessToken(call);

            const userId = this.authService.verifyAccessToken(accessToken);

            const profile = await this.getOrCreateUseCase.execute(userId);

            const result = profileProto.ProfileResponse.create({profile: ProfileGrpcMapper.toGrpc(profile)});

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    }

    async get(
        call: grpc.ServerUnaryCall<profileProto.ProfileIdRequest, profileProto.ProfileResponse>,
        callback: grpc.sendUnaryData<profileProto.ProfileResponse>
    ) {
        try {
            const {profileId} = call.request;
            // logger.log('getProfileById ' + profileId);

            const profile = await this.getUseCase.execute(new Id(profileId));

            const result = profileProto.ProfileResponse.create({profile: ProfileGrpcMapper.toGrpc(profile)});

            if (!result) {
                throw new NotFoundError('Profile');
            }

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    }

    async getMe(
        call: grpc.ServerUnaryCall<profileProto.ProfileIdRequest, profileProto.ProfileResponse>,
        callback: grpc.sendUnaryData<profileProto.ProfileResponse>
    ) {

        try {
            const accessToken = AuthHelper.getAccessToken(call);

            const userId = this.authService.verifyAccessToken(accessToken);

            const profile = await this.getMeUseCase.execute(userId);

            const result = profileProto.ProfileResponse.create({profile: ProfileGrpcMapper.toGrpc(profile)});

            if (!result) {
                throw new NotFoundError('Profile');
            }

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    }


    async getByUser(
        call: grpc.ServerUnaryCall<authProto.UserIdRequest, profileProto.ProfileResponse>,
        callback: grpc.sendUnaryData<profileProto.ProfileResponse>
    ) {

        try {

            const {userId} = call.request;

            const profile = await this.getByUserUseCase.execute(new Id(userId));

            const result = profileProto.ProfileResponse.create({profile: ProfileGrpcMapper.toGrpc(profile)});

            if (!result) {
                throw new NotFoundError('Profile');
            }

            callback(null, result);

        } catch (err: any) {
            logger.log(err);
            callbackError(callback, err);
        }
    }
}

export default BattleHandler;




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


