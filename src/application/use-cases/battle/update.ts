import BattleRepository from "../../../domain/repositories/battle.repository";
import BattleEntity from "../../../domain/entities/battle.entity";
import Id from "../../../domain/value-objects/id.vo";
import JobService from "../../../infrastructure/job/job.service";
import logger from "@shared/logger";

export class UpdateUseCase {
    constructor(
        private readonly battleRepository: BattleRepository,
    ) {
    }

    async execute(battle: BattleEntity): Promise<BattleEntity> {
        return await this.battleRepository.save(battle);
    }
}


export default UpdateUseCase;

