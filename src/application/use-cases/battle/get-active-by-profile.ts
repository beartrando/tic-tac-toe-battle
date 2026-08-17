import BattleRepository from "../../../domain/battle/battle.repository";
import BattleEntity from "../../../domain/battle/battle.entity";
import Id from "../../../domain/common/value-objects/id.vo";

export class GetActiveByProfileUseCase {
    constructor(
        private readonly battleRepository: BattleRepository,
    ) {
    }

    async execute(profileId: Id): Promise<Set<BattleEntity>> {
        const battles = await this.battleRepository.findActiveByProfileId(profileId);

        if (!battles) {
            throw new Error("Battles don't not exist");
        }

        return battles;
    }
}


export default GetActiveByProfileUseCase;

