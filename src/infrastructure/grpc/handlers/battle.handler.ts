import * as grpc from '@grpc/grpc-js';
import * as authProto from '../../../contracts/proto/auth';
import * as profileProto from '../../../contracts/proto/profile';
import logger from "@shared/logger";
import GetUseCase from "../../../application/use-cases/profile/get";
import callbackError, {callbackError} from "./callback.error";
import AuthService from "../../auth/auth-service";
import AuthHelper from "../helpers/auth.helper";
import ProfileGrpcMapper from "../mappers/profile.mapper";
import Id from "../../../domain/value-objects/id.vo";
import {NotFoundError} from "@shared/errors";
import * as battleProto from '../generated/battle';
import * as profileProto from '../generated/profile';
import * as battleService from '../../services/battle.service';
import {battleToProto} from '../../lib/grpc-prisma-converters/battle';
import {BattleModel} from "../../models/battle.model";
import GetActiveByProfileUseCase from "../../../application/use-cases/battle/get-active-by-profile";
import StartUseCase from "../../../application/use-cases/battle/start";


export class BattleHandler {
    constructor(
        private readonly getUseCase: GetUseCase,
        private readonly getActiveByProfileUseCase: GetActiveByProfileUseCase,
        private readonly startUseCase: StartUseCase
    ) {
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


    async getActiveByProfile(
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

    async start(
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
}

export default BattleHandler;


