import ProfileRepository from "../../../domain/repositories/profile.repository";
import BattleEntity from "../../../domain/entities/battle.entity";
import JobService from "../../../infrastructure/job/job.service";
import Id from "../../../domain/value-objects/id.vo";

export class GetOrCreateUseCase {
    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly jobService: JobService,
        private readonly profileCreatedTopik: string,
    ) {
    }

    async execute(userId: Id): Promise<BattleEntity> {

        const existing = await this.profileRepository.findById(userId);

        if (existing) {
            return existing;
        }

        const profile = BattleEntity.create({userId});

        await this.profileRepository.save(profile);


        this.jobService.enqueue(this.profileCreatedTopik, profile);

        return profile;
    }
}


export default GetOrCreateUseCase;

