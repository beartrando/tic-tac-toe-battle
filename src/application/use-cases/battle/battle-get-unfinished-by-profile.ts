import BattleRepository from "../../../domain/battle/battle.repository";
import BattleEntity from "../../../domain/battle/battle.entity";
import ProfileId from "../../../domain/profile/value-objects/profile-id.vo";

export class BattleGetUnfinishedByProfileUseCase {
    constructor(
        private readonly battleRepository: BattleRepository,
    ) {
    }

    async execute(profileId: ProfileId): Promise<Set<BattleEntity>> {
        const battles = await this.battleRepository.findUnfinishedByProfileId(profileId);

        if (!battles) {
            throw new Error("Battles don't not exist");
        }

        return battles;
    }
}


export default BattleGetUnfinishedByProfileUseCase;

