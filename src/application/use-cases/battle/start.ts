import BattleRepository from "../../../domain/battle/battle.repository";
import BattleEntity from "../../../domain/battle/battle.entity";
import JobService from "../../../infrastructure/job/service";
import {NotFoundError} from "@shared/errors";
import BattleProtoMapper from "../../../infrastructure/grpc/mappers/battle.proto.mapper";
import StatusEnum from "../../../domain/battle/enums/status.enum";
import ProfileId from "../../../domain/profile/value-objects/profile-id.vo";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";

export class StartUseCase {
    constructor(
        private readonly battleRepository: BattleRepository,
        private readonly jobService: JobService,
        private readonly battleStartedTopik: string,
    ) {
    }

    async execute(profileId: ProfileId, battleId?: BattleId | null): Promise<BattleEntity> {
        if (battleId) {
            let battle: BattleEntity | null;
            try {
                battle = await this.battleRepository.join(profileId, battleId);
            } catch (e) {
                throw new NotFoundError('engine ' + battleId.value);
            }

            if (!battle) {
                throw new NotFoundError('engine ' + battleId.value);
            }

            this.enqueue(battle);

            return battle;
        }

        const existingMyBattles = await this.battleRepository.findActiveByProfileId(profileId);

        const existingMyBattle = existingMyBattles?.values().next().value;

        if (existingMyBattle) {
            this.enqueue(existingMyBattle);
            return existingMyBattle;
        }

        for (let attempts = 0; attempts < 3; attempts++) {
            const existingSomebodiesBattle = await this.battleRepository.findNewForProfile(profileId);

            if (!existingSomebodiesBattle) {
                break;
            }

            try {
                const battle = await this.battleRepository.join(profileId, existingSomebodiesBattle.id);
                if (battle) {
                    this.enqueue(battle);
                    return battle;
                }
            } catch (e) {
                // logger.log(e);
            }
        }

        const newBattle = BattleEntity.createNew(profileId);
        const battle = await this.battleRepository.save(newBattle);

        // logger.log(battle);
        return battle;
    }

    private enqueue(battle: BattleEntity): void {
        if (battle.status.value == StatusEnum.Active) {
            this.jobService.enqueue(this.battleStartedTopik, BattleProtoMapper.toProto(battle));
        }
    }
}


export default StartUseCase;

