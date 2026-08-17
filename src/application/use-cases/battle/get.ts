import BattleRepository from "../../../domain/battle/battle.repository";
import BattleEntity from "../../../domain/battle/battle.entity";
import Id from "../../../domain/common/value-objects/id.vo";

export class GetUseCase {
    constructor(
        private readonly battleRepository: BattleRepository,
    ) {
    }

    async execute(id: Id): Promise<BattleEntity> {
        const battle = await this.battleRepository.findById(id);

        if (!battle) {
            throw new Error("Battle does not exist");
        }

        return battle;
    }
}


export default GetUseCase;

