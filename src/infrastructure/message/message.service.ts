import {createConsumer, createProducer, KafkaConfig, KafkaProducer} from "@shared/kafka-manager";
import logger from "@shared/logger";
import {kafkaConsumersConfig,} from './config';
import sleep from "../../utils/sleep";

export class MessageService {

    private producer?: KafkaProducer;

    constructor(private readonly config: KafkaConfig) {
    }

    async stop(): Promise<void> {
        await this.retryInit(() => this.createConsumers());
    }

    async stop(): Promise<void> {
        if (this.producer) {
            await this.producer.disconnect();
        }
    }

    async getProducer(): Promise<KafkaProducer> {
        if (!this.producer) {
            this.producer = await createProducer(this.config);
        }

        return this.producer;
    }

    async check(): Promise<boolean> {
        try {
            const producer = await this.getProducer();

            // await producer.send('healthcheck', [{value: 'ping'}]);
            await producer.send('healthcheck', 'ping');

            return true;
        } catch (err) {
            logger.error("Kafka health check failed", err);
            return false;
        }
    }

    private async createConsumers(): Promise<void> {
        const configs = Object.values(kafkaConsumersConfig);

        await Promise.all(
            configs.map(({topic, handler}) =>
                createConsumer(this.config, {
                    topic,
                    handler,
                }),
            ),
        );
    }

    private async retryInit(
        fn: () => Promise<void>,
    ): Promise<void> {
        while (true) {
            try {
                await fn();

                logger.info("✅ Kafka initialized");
                return;
            } catch (err) {
                logger.warn(
                    {err},
                    "⏳ Waiting for Kafka topics...",
                );

                await sleep(3000);
            }
        }
    }
}

export default MessageService;
