import * as grpc from '@grpc/grpc-js';
import * as authProto from '../../../contracts/proto/auth';
import * as profileProto from '../../../contracts/proto/profile';
import logger from "@shared/logger";
import GetMeUseCase from "../../../application/use-cases/profile/get-me";
import GetUseCase from "../../../application/use-cases/profile/get";
import callbackError from "./callback.error";
import AuthService from "../../auth/auth-service";
import AuthHelper from "../helpers/auth.helper";
import GetOrCreateUseCase from "../../../application/use-cases/profile/get-or-create";
import GetByUserUseCase from "../../../application/use-cases/profile/get-by-user";
import ProfileGrpcMapper from "../mappers/profile.mapper";
import Id from "../../../domain/value-objects/id.vo";
import {NotFoundError} from "@shared/errors";


export class ProfileHandler {
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

export default ProfileHandler;
