import ProfileRepository from "../../../domain/repositories/profile.repository";
import BattleEntity from "../../../domain/entities/battle.entity";
import Id from "../../../domain/value-objects/id.vo";

export class GetMeUseCase {
    constructor(
        private readonly profileRepository: ProfileRepository,
    ) {
    }

    async execute(userId: Id): Promise<BattleEntity> {

        // const userId = this.authService.verifyAccessToken(accessToken)

        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            throw new Error("Profile does not exist");
        }

        return profile;
    }
}


export default GetMeUseCase;

