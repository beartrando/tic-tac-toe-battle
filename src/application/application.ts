import logger from "@shared/logger";
import GrpcService from "../infrastructure/grpc/grpc.service";
import DbService from "../infrastructure/db/db.service";
import JobService from "../infrastructure/job/job.service";
import MessageService from "../infrastructure/message/message.service";

export class Application {
    constructor(
        private readonly grpcService: GrpcService,
        private readonly dbService: DbService,
        private readonly jobService: JobService,
        private readonly messageService: MessageService,
    ) {
    }

    async start(): Promise<void> {

        try {
            await this.messageService.start();
            await this.jobService.start();
            await this.dbService.start();
            await this.grpcService.start();
            logger.info(
                '🚀 Auth service started',
            );
        } catch (err) {
            logger.error(
                {err},
                '💥 Failed to start Auth',
            );
            process.exit(1);
        }

        process.on(
            'SIGINT',
            async () => {
                logger.info(
                    '🛑 Shutting down...',
                );

                await this.stop();

                process.exit(0);
            },
        );
    }

    async stop() {
        await this.grpcService.stop();
        await this.dbService.stop();
        await this.jobService.stop();
        await this.messageService.stop();
    }
}

export default Application;
