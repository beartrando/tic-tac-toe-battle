import * as battleProto from "../../../contracts/proto/battle";
import BattleUpdateUseCase from "../../../application/use-cases/battle/battle-update";
import UseCaseInterface from "../interfaces/use-case.interface";
import BattleProtoMapper from "../../grpc/mappers/battle.proto.mapper";
import logger from "@shared/logger";

export class BattleUpdatedConsumer implements UseCaseInterface<battleProto.TracedBattle> {
    constructor(
        private readonly updateUseCase: BattleUpdateUseCase,
    ) {
    }

    async execute(topic: string, partition: number, message: battleProto.TracedBattle): Promise<void> {
        try {
            // logger.log('battleUpdated');
            // logger.log(message);
            if (!message.battle) {
                return;
            }
            await this.updateUseCase.execute(BattleProtoMapper.toDomain(message.battle));
        } catch (error) {
            logger.error(`[Kafka] Failed to process message`, {
                rawValue: message.battle?.id,
                error,
            });
        }
    }

}

export default BattleUpdatedConsumer;
