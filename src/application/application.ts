import logger from "@shared/logger";
import GrpcService from "../infrastructure/grpc/service";
import DbService from "../infrastructure/db/service";
import JobService from "../infrastructure/job/service";
import MessageService from "../infrastructure/message/service";
import { TimerService } from "@shared/timer";

export class Application {
    constructor(
        private readonly grpcService: GrpcService,
        private readonly dbService: DbService,
        private readonly jobService: JobService,
        private readonly messageService: MessageService,
        private readonly battleTimeoutTimerService: TimerService<string, string>,
        private readonly battleTimeoutTimerKey: string,
    ) {
    }

    async start(): Promise<void> {
        const shutdown = async () => {
            logger.info("🛑 Shutting down...");

            await this.stop();

            process.exit(0);
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);

        try {
            await this.messageService.start();
            await this.jobService.start();
            await this.dbService.start();
            await this.grpcService.start();
            this.battleTimeoutTimerService.start(
                this.battleTimeoutTimerKey,
                this.battleTimeoutTimerKey,
            );
            logger.info(
                '🚀 Battle service started',
            );
        } catch (err) {
            logger.error(
                {err},
                '💥 Failed to start Battle service',
            );
            process.exit(1);
        }
    }

    async stop() {
        this.battleTimeoutTimerService.stop(this.battleTimeoutTimerKey);
        await this.grpcService.stop();
        await this.dbService.stop();
        await this.jobService.stop();
        await this.messageService.stop();
    }
}

export default Application;
