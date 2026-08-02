import ProfileRepository from "../../../domain/repositories/profile.repository";
import BattleEntity from "../../../domain/entities/battle.entity";
import Id from "../../../domain/value-objects/id.vo";

export class GetUseCase {
    constructor(
        private readonly profileRepository: ProfileRepository,
    ) {
    }

    async execute(Id: Id): Promise<BattleEntity> {
        const profile = await this.profileRepository.findById(Id);

        if (!profile) {
            throw new Error("Profile does not exist");
        }

        return profile;
    }
}


export default GetUseCase;

