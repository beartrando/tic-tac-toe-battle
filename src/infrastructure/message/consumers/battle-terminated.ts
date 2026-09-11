import UseCaseInterface from "../interfaces/use-case.interface";
import logger from "@shared/logger";
import BattleTerminateUseCase from "../../../application/use-cases/battle/battle-terminate";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";

export class BattleTerminatedConsumer implements UseCaseInterface<BattleId> {
    constructor(
        private readonly terminateUseCase: BattleTerminateUseCase,
    ) {
    }

    async execute(topic: string, partition: number, message: BattleId): Promise<void> {
        // logger.log(message);
        try {
            await this.terminateUseCase.execute(message);
        } catch (error) {
            logger.error(`[Kafka] Failed to process message`, {
                rawValue: message,
                error,
            });
        }
    }

}

export default BattleTerminatedConsumer;

