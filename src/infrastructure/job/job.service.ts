import pgBossManager, {SqlExecutor} from '@shared/pg-boss-manager';
import config from "./config";
import logger from "@shared/logger";
import sleep from "../../utils/sleep";
import {KafkaConfig} from "@shared/kafka-manager";


export class JobService {

    constructor(
        private readonly messageConfig: KafkaConfig,
        private readonly messageProducersConfig: Record<string, string>,
    ) {
    }

    async start(): Promise<void> {

        void pgBossManager.start(config);

        await pgBossManager.waitUntilReady();

        await this.initKafkaBridge();
    }

    async initKafkaBridge(): Promise<void> {
        const topics = Object.values(this.messageProducersConfig);

        while (true) {
            try {
                await Promise.all(
                    topics.map(topic =>
                        pgBossManager.kafka.start(
                            this.messageConfig,
                            topic,
                        ),
                    ),
                );

                logger.info("✅ PgBoss Kafka bridge initialized");
                return;
            } catch (err) {
                logger.warn(
                    {err},
                    "⏳ Waiting for PgBoss/Kafka bridge initialization...",
                );

                await sleep(3000);
            }
        }
    }

    public async enqueue<T extends object>(
        topic: string,
        data: T,
    ): Promise<number> {
        const boss = await pgBossManager.waitUntilReady();

        return pgBossManager.queue.enqueue(topic, data)
    }

    public async enqueueTx<T extends object>(
        topic: string,
        data: T,
        tx: SqlExecutor,
    ): Promise<number> {
        const boss = await pgBossManager.waitUntilReady();

        return pgBossManager.queue.enqueueTx(topic, data, tx)
    }


    async stop() {
        return await pgBossManager.stop();
    }

    async check(): Promise<boolean> {
        return pgBossManager.check();
    }

}

export default JobService;
