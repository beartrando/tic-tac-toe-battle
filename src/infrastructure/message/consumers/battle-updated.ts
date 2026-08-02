import {BattleObject} from "../../../contracts/proto/battle";
import Id from "../../../domain/value-objects/id.vo";
import UpdateUseCase from "../../../application/use-cases/battle/update";
import logger from "@shared/logger";

export class battleUpdatedConsumer {
    constructor(
        private readonly updateUseCase: UpdateUseCase,
    ) {}

    async execute(topic: string, partition: number, message: BattleObject): Promise<void> {
        try {
            // logger.log('battleUpdated');
            // logger.log(message);
            await this.updateUseCase(message);
            await BattleModel.updateBattle(message as BattleObject);
        } catch (error) {
            logger.error(`[Kafka] Failed to process message`, {
                rawValue: message.userId,
                error,
            });
        }
    }

}

export default battleUpdatedConsumer;

