import BattleRepository from "../../../domain/repositories/battle.repository";
import BattleEntity from "../../../domain/entities/battle.entity";
import Id from "../../../domain/value-objects/id.vo";
import JobService from "../../../infrastructure/job/job.service";
import logger from "@shared/logger";

export class StartUseCase {
    constructor(
        private readonly battleRepository: BattleRepository,
        private readonly jobService: JobService,
        private readonly battleStartedTopik: string,
    ) {
    }

    async execute(profileId: Id, battleId?: Id | null): Promise<BattleEntity> {

        const existingMyBattle = await BattleModel.findBattleByProfile(profileId);

        // logger.log('upsert battle for profile: ', profileId);

        if (existingMyBattle) {
            return existingMyBattle;
        }

        let attempts = 3;

        while (attempts > 0) {
            const existingSomebodiesBattle = await BattleModel.findAvailableBattle(profileId);

            if (existingSomebodiesBattle) {
                try {

                    return await BattleModel.joinBattle(existingSomebodiesBattle.id, profileId);
                } catch (e) {
                    logger.log(e);
                    // await pgBossManager.queue.enqueueTx(messageProducersConfig.battleStarted, battleToProto(battle), tx);

                    // export const makeMove = (move: engineProto.BattleMoveRequest): Promise<emptyProto.Empty | null> => {
                    //   return engineManager.call((client, cb) => client.battleMove(move, cb));
                    // };
                }
                attempts--;
                continue;
            }


            return BattleModel.createBattle(profileId);
        }

        return BattleModel.createBattle(profileId);
















        const battle = await BattleModel.get(battleId);

        if (!battle) {
            throw new Error(`Battle ${battleId} not found.`);
        }

        if (battle.playerIds.includes(profileId)) {
            return battle;
        }


        try {
            return await BattleModel.joinBattle(battleId, profileId);
        } catch (e) {
            logger.log(e);
        }

        return await BattleModel.get(battleId);















        const existing = await this.battleRepository.findActiveByProfileId(profileId);

        if (existing) {
            return existing;
        }

        const battle = BattleEntity.create({profileId});

        await this.battleRepository.save(battle);

        return battle;










        // const userId = this.authService.verifyAccessToken(accessToken)

        const battle = await this.battleRepository.findByUserId(profileId, battleId);

        if (!profile) {
            throw new Error("Profile does not exist");
        }

        this.jobService.enqueue(this.battleStartedTopik, battle);

        return profile;
    }
}


export default StartUseCase;

