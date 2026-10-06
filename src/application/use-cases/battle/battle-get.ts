import BattleRepository from "../../../domain/battle/battle.repository";
import BattleEntity from "../../../domain/battle/battle.entity";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";

export class BattleGetUseCase {
    constructor(
        private readonly battleRepository: BattleRepository,
    ) {
    }

    async execute(id: BattleId): Promise<BattleEntity> {
        const battle = await this.battleRepository.findById(id);

        if (!battle) {
            throw new Error("Battle does not exist");
        }

        return battle;
    }
}


export default BattleGetUseCase;
