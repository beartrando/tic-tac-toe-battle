import BattleRepository from "../../../domain/battle/battle.repository";
import BattleEntity from "../../../domain/battle/battle.entity";

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

