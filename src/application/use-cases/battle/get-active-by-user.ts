import ProfileRepository from "../../../domain/repositories/profile.repository";
import BattleEntity from "../../../domain/entities/battle.entity";
import Id from "../../../domain/value-objects/id.vo";

export class GetByUserUseCase {
    constructor(
        private readonly profileRepository: ProfileRepository,
    ) {
    }

    async execute(userId: Id): Promise<BattleEntity> {

        const user = await this.profileRepository.findByUserId(userId);

        if (!user) {
            throw new Error("Profile does not exist");
        }

        return user;
    }
}


export default GetByUserUseCase;

