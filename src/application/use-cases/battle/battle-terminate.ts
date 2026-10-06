import BattleRepository from "../../../domain/battle/battle.repository";
import BattleEntity from "../../../domain/battle/battle.entity";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";

export class BattleTerminateUseCase {
    constructor(
        private readonly battleRepository: BattleRepository,
    ) {
    }

    async execute(battleId: BattleId): Promise<BattleEntity | null> {

        const battle = await this.battleRepository.findById(battleId);
        if (!battle) {
            return null;
        }

        if (battle.finished()) {
            return null;
        }
        battle.cancel();
        return await this.battleRepository.save(battle);
    }
}


export default BattleTerminateUseCase;
