import * as healthProto from "../../../contracts/proto/common/health";
import config from "../../../infrastructure/app/config";

const startedAt = Date.now();

export class StatusUseCase {
    async execute(): Promise<healthProto.ServiceStatus> {
        const uptimeMs = Date.now() - startedAt;

        return {
            name: config.appName,
            version: config.appVersion,
            env: config.appEnv,
            uptime: {
                seconds: Math.floor(uptimeMs / 1000),
                nanos: (uptimeMs % 1000) * 1_000_000,
            },
            timestamp: new Date(),
        };

    }
}


export default StatusUseCase;
