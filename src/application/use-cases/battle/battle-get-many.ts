import BattleRepository from "../../../domain/battle/battle.repository";
import BattleEntity from "../../../domain/battle/battle.entity";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";

export class BattleGetManyUseCase {
    constructor(
        private readonly battleRepository: BattleRepository,
    ) {
    }

    async execute(ids: BattleId[]): Promise<BattleEntity[]> {
        if (ids.length === 0) {
            return [];
        }

        return await this.battleRepository.findByIds(ids);
    }
}


export default BattleGetManyUseCase;
