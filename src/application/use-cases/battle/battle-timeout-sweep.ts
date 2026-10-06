import BattleRepository from "../../../domain/battle/battle.repository";
import BattleEntity from "../../../domain/battle/battle.entity";
import JobService from "../../../infrastructure/job/service";
import BattleProtoMapper from "../../../infrastructure/grpc/mappers/battle.proto.mapper";

export class BattleTimeoutSweepUseCase {
    constructor(
        private readonly battleRepository: BattleRepository,
        private readonly jobService: JobService,
        private readonly battleTimeoutTopic: string,
        private readonly timeoutSeconds: number,
    ) {
    }

    /**
     * Баттлы, статус которых не менялся дольше `timeoutSeconds`, переводятся в TimeOut
     * и публикуются в Kafka (`battle.timeout`).
     */
    async execute(): Promise<BattleEntity[]> {
        const since = new Date(Date.now() - this.timeoutSeconds * 1000);

        const staleBattles = await this.battleRepository.findStale(since);

        const timedOutBattles: BattleEntity[] = [];

        for (const battle of staleBattles) {
            battle.timeout();

            const savedBattle = await this.battleRepository.save(battle);

            await this.jobService.enqueue(
                this.battleTimeoutTopic,
                BattleProtoMapper.toProto(savedBattle),
            );

            timedOutBattles.push(savedBattle);
        }

        return timedOutBattles;
    }
}


export default BattleTimeoutSweepUseCase;
