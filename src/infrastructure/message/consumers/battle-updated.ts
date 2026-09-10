import {BattleObject} from "../../../contracts/proto/battle";
import BattleUpdateUseCase from "../../../application/use-cases/battle/battle-update";
import UseCaseInterface from "../interfaces/use-case.interface";
import BattleProtoMapper from "../../grpc/mappers/battle.proto.mapper";
import logger from "@shared/logger";

export class BattleUpdatedConsumer implements UseCaseInterface<BattleObject> {
    constructor(
        private readonly updateUseCase: BattleUpdateUseCase,
    ) {
    }

    async execute(topic: string, partition: number, message: BattleObject): Promise<void> {
        try {
            // logger.log('battleUpdated');
            // logger.log(message);
            await this.updateUseCase.execute(BattleProtoMapper.toDomain(message));
        } catch (error) {
            logger.error(`[Kafka] Failed to process message`, {
                rawValue: message,
                error,
            });
        }
    }

}

export default BattleUpdatedConsumer;

