import BattleRepository from "../../../domain/repositories/battle.repository";
import BattleEntity from "../../../domain/entities/battle.entity";
import Id from "../../../domain/value-objects/id.vo";
import JobService from "../../../infrastructure/job/job.service";
import {NotFoundError} from "@shared/errors";

export class StartUseCase {
    constructor(
        private readonly battleRepository: BattleRepository,
        private readonly jobService: JobService,
        private readonly battleStartedTopik: string,
    ) {
    }

    async execute(profileId: Id, battleId?: Id | null): Promise<BattleEntity> {
        if (battleId) {
            let battle: BattleEntity | null;
            try {
                battle = await this.battleRepository.join(profileId, battleId);
            } catch (e) {
                throw new NotFoundError('battle ' + battleId.value);
            }

            if (!battle) {
                throw new NotFoundError('battle ' + battleId.value);
            }

            return battle;
        }

        const existingMyBattles = await this.battleRepository.findActiveByProfileId(profileId);

        const existingMyBattle = existingMyBattles?.values().next().value;

        if (existingMyBattle) {
            return existingMyBattle;
        }

        for (let attempts = 0; attempts < 3; attempts++) {
            const existingSomebodiesBattle = await this.battleRepository.findAvailableBattle(profileId);

            if (!existingSomebodiesBattle) {
                break;
            }

            try {
                const battle = await this.battleRepository.join(profileId, existingSomebodiesBattle.id);
                if (battle) {
                    return battle;
                }
            } catch (e) {
                // logger.log(e);
            }
        }

        const newBattle = BattleEntity.createNew(profileId);
        return await this.battleRepository.save(newBattle);
    }
}


export default StartUseCase;

