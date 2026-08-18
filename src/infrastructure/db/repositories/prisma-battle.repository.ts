import {BattleStatus, PrismaClient} from "@prisma/client";

import BattleRepository from "../../../domain/battle/battle.repository";
import BattleEntity from "../../../domain/battle/battle.entity";

import Id from "../../../domain/common/value-objects/id.vo";
import BattleDbMapper from "../mappers/battle.mapper";
import BattleId from "../../../domain/battle/value-objects/battle-id.vo";
import logger from "@shared/logger";

export class PrismaBattleRepository implements BattleRepository {

    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    async findById(
        id: BattleId,
    ): Promise<BattleEntity | null> {

        const battle = await this.prisma.battle.findUnique({
            where: {
                id: id.value,
            },
        });

        if (!battle) {
            return null;
        }

        return BattleDbMapper.toDomain(battle);
    }

    async save(
        battle: BattleEntity,
    ): Promise<BattleEntity> {

        const battleDb = BattleDbMapper.toPersistence(battle);
        const {
            id,
            ...update
        } = battleDb;

        // logger.log(battleDb);
        const result = await this.prisma.battle.upsert({
            where: {
                id: battleDb.id,
            },
            create: battleDb,
            update,
        });

        return BattleDbMapper.toDomain(result);
    }

    async findActiveByProfileId(
        profileId: Id,
    ): Promise<Set<BattleEntity> | null> {

        const battles = await this.prisma.battle.findMany({
            where: {
                playerIds: {
                    has: profileId.value,
                },
            },
        });

        if (battles.length === 0) {
            return null;
        }

        return new Set(
            battles.map(BattleDbMapper.toDomain),
        );
    }


    async join(profileId: Id, battleId: BattleId): Promise<BattleEntity | null> {

        const updated = await this.prisma.battle.updateMany({
            where: {
                id: battleId.value,
                status: BattleStatus.New,
            },
            data: {
                playerIds: {
                    push: profileId.value,
                },
                status: BattleStatus.Active,
            },
        });

        if (updated.count === 0) {
            return null;
        }

        const battle = await this.prisma.battle.findUnique({
            where: {
                id: battleId.value,
            },
        });

        if (!battle) {
            throw new Error("Battle disappeared after successful update.");
        }

        return BattleDbMapper.toDomain(battle);
    }

    async findAvailableForProfile(profileId: Id): Promise<BattleEntity | null> {

        const battle = await this.prisma.battle.findFirst({
            where: {
                status: BattleStatus.New,
                NOT: {
                    playerIds: {
                        has: profileId.value,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        if (!battle) {
            return null;
        }

        return BattleDbMapper.toDomain(battle);
    }
}

export default PrismaBattleRepository;






