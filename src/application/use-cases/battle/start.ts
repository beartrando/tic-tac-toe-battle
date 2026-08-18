import BattleRepository from "../../../domain/battle/battle.repository";
import BattleEntity from "../../../domain/battle/battle.entity";
import Id from "../../../domain/common/value-objects/id.vo";
import JobService from "../../../infrastructure/job/service";
import {NotFoundError} from "@shared/errors";
import logger from "@shared/logger";

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
                throw new NotFoundError('engine ' + battleId.value);
            }

            if (!battle) {
                throw new NotFoundError('engine ' + battleId.value);
            }

            return battle;
        }

        const existingMyBattles = await this.battleRepository.findActiveByProfileId(profileId);

        const existingMyBattle = existingMyBattles?.values().next().value;

        if (existingMyBattle) {
            return existingMyBattle;
        }

        for (let attempts = 0; attempts < 3; attempts++) {
            const existingSomebodiesBattle = await this.battleRepository.findAvailableForProfile(profileId);

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
        // logger.log(newBattle);
        return await this.battleRepository.save(newBattle);
    }
}


export default StartUseCase;

