import * as battleProto from "../../../contracts/proto/battle";
import UseCaseInterface from "../interfaces/use-case.interface";
import logger from "@shared/logger";
import BattleTerminateUseCase from "../../../application/use-cases/battle/battle-terminate";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";

export class BattleTerminatedConsumer implements UseCaseInterface<battleProto.TracedBattleId> {
    constructor(
        private readonly terminateUseCase: BattleTerminateUseCase,
    ) {
    }

    async execute(topic: string, partition: number, message: battleProto.TracedBattleId): Promise<void> {
        // logger.log(message);
        try {
            await this.terminateUseCase.execute(new BattleId(message.battleId));
        } catch (error) {
            logger.error(`[Kafka] Failed to process message`, {
                rawValue: message.battleId,
                error,
            });
        }
    }

}

export default BattleTerminatedConsumer;
