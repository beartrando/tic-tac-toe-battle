import {BattleObject} from "../../../contracts/proto/battle";
import UpdateUseCase from "../../../application/use-cases/battle/update";
import UseCaseInterface from "../interfaces/use-case.interface";
import BattleProtoMapper from "../../grpc/mappers/battle.proto.mapper";
import logger from "@shared/logger";

export class BattleUpdatedConsumer implements UseCaseInterface<BattleObject> {
    constructor(
        private readonly updateUseCase: UpdateUseCase,
    ) {
    }

    async execute(topic: string, partition: number, message: BattleObject): Promise<void> {
        try {
            // logger.log('battleStarted');
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

