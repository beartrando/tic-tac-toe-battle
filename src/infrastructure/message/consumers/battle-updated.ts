import {BattleObject} from "../../../contracts/proto/battle";
import UpdateUseCase from "../../../application/use-cases/battle/update";

export class BattleUpdatedConsumer {
    constructor(
        private readonly updateUseCase: UpdateUseCase,
    ) {
    }

    async execute(topic: string, partition: number, message: BattleObject): Promise<void> {
        // try {
        //     // logger.log('battleUpdated');
        //     // logger.log(message);
        //     await this.updateUseCase(message);
        //     await BattleModel.updateBattle(message as BattleObject);
        // } catch (error) {
        //     logger.error(`[Kafka] Failed to process message`, {
        //         rawValue: message.userId,
        //         error,
        //     });
        // }
    }

}

export default BattleUpdatedConsumer;

