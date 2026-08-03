import {Battle, PrismaClient} from "@prisma/client";

import BattleRepository from "../../../domain/repositories/battle.repository";
import BattleEntity from "../../../domain/entities/battle.entity";

import Id from "../../../domain/value-objects/id.vo";
import BattleDbMapper from "../mappers/battle.mapper";

export class PrismaBattleRepository implements BattleRepository {

    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    async findById(
        id: Id,
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


    async join(profileId: Id, battleId: Id): Promise<BattleEntity | null> {
        const battle = await this.prisma.battle.findUnique({
            where: {
                id: battleId.value,
            },
        });

        if (!battle) {
            return null;
        }

        if (battle.playerIds.length >= 2) {
            return null;
        }

        if (battle.playerIds.includes(profileId.value)) {
            return BattleDbMapper.toDomain(battle);
        }

        const updated = await this.prisma.battle.update({
            where: {
                id: battle.id,
                playerIds.length < 2
            },
            data: {
                playerIds: {
                    push: profileId.value,
                },
            },
        });

        return BattleDbMapper.toDomain(updated);
    }

    findAvailableBattle(profileId: Id): Promise<Battle | null> {

        const battle = await this.prisma.battle.findUnique({
            where: {profileId: profileId.value},
        });



        if (!battle) {
            return null;
        }

        return BattleDbMapper.toDomain(battle);
    }

}

export default PrismaBattleRepository;






