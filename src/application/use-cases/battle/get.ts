import BattleRepository from "../../../domain/repositories/battle.repository";
import BattleEntity from "../../../domain/entities/battle.entity";
import Id from "../../../domain/value-objects/id.vo";

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

