import * as grpc from "@grpc/grpc-js";
import * as healthProto from '../../contracts/proto/common/health';
import * as battleProto from '../../contracts/proto/battle';
import logger from "@shared/logger";
import BattleHandler from "./handlers/battle.handler";
import HealthHandler from "./handlers/health.handler";

export class GrpcService {
    private readonly server: grpc.Server;

    constructor(
        private readonly port: number,
        private readonly battleHandler: BattleHandler,
        private readonly healthHandler: HealthHandler,
    ) {
        this.server = new grpc.Server();
    }

    async start(): Promise<void> {
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

    private registerBattleService() {
        this.server.addService(battleProto.BattleService, {
            get: this.battleHandler.get.bind(this.battleHandler),
            init: this.battleHandler.init.bind(this.battleHandler),
        });
    }

    private registerHealthService() {
        this.server.addService(healthProto.HealthService, {
            check: this.healthHandler.check.bind(this.healthHandler),
            status: this.healthHandler.status.bind(this.healthHandler),
            livez: this.healthHandler.livez.bind(this.healthHandler),
            readyz: this.healthHandler.readyz.bind(this.healthHandler),
        });
    }

    private addServices() {
        this.registerBattleService();
        this.registerHealthService();
    }
}

export default GrpcService;

