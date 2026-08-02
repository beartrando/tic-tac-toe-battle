import * as grpc from "@grpc/grpc-js";
import * as healthProto from '../../contracts/proto/common/health';
import * as profileProto from '../../contracts/proto/profile';
import logger from "@shared/logger";
import ProfileHandler from "./handlers/profile.handler";
import HealthHandler from "./handlers/health.handler";

export class GrpcService {
    private readonly server: grpc.Server;

    constructor(
        private readonly port: number,
        private readonly profileHandler: ProfileHandler,
        private readonly healthHandler: HealthHandler,
    ) {
        this.server = new grpc.Server();
    }

    async stop(): Promise<void> {
        return new Promise<void>(
            (resolve, reject) => {
                this.addServices();
                this.server.bindAsync(
                    `0.0.0.0:${this.port}`,
                    grpc.ServerCredentials.createInsecure(),
                    (err, port) => {
                        if (err) {
                            logger.error(
                                {err},
                                '❌ Failed to start gRPC',
                            );

                            return reject(err);
                        }

                        logger.info(
                            `🟢 gRPC server started on port ${port}`,
                        );
                        resolve();
                    },
                );
            },
        );
    }

    stop() {
        this.server.forceShutdown();
    }

    private registerProfileService() {
        this.server.addService(profileProto.ProfileService, {
            getOrCreate: this.profileHandler.getOrCreate,
            get: this.profileHandler.get,
            getByUser: this.profileHandler.getByUser,
            getMe: this.profileHandler.getMe,
        });
    }

    private registerHealthService() {
        this.server.addService(healthProto.HealthService, {
            check: this.healthHandler.check,
            status: this.healthHandler.status,
            livez: this.healthHandler.livez,
            readyz: this.healthHandler.readyz,
        });
    }

    private addServices() {
        this.registerProfileService();
        this.registerHealthService();
    }
}

export default GrpcService;

