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

        return BattleDbMapper.toEntity(battle);
    }

    async save(
        battle: BattleEntity,
    ): Promise<BattleEntity> {

        const battleDb = BattleDbMapper.toPersistence(battle);
        const {
            id,
            userId,
            // createdAt,
            // updatedAt,
            ...update
        } = battleDb;

        const result = await this.prisma.battle.upsert({
            where: {
                id: battleDb.id,
            },
            create: battleDb,
            update,
        });

        return BattleDbMapper.toEntity(result);
    }

    async findActiveByProfileId(
        profileId: Id,
    ): Promise<Set<BattleEntity> | null> {

        const battle = await this.prisma.battle.findUnique({
            where: {userId: userId.value},
        });


        if (!battle) {
            return null;
        }

        return BattleDbMapper.toEntity(battle);
    }


    async join(
        profileId: Id, battleId?: Id | null
    ): Promise<BattleEntity | null> {

        const battle = await this.prisma.battle.findUnique({
            where: {userId: userId.value},
        });


        if (!battle) {
            return null;
        }

        return BattleDbMapper.toEntity(battle);
    }

    findAvailableBattle(profileId: Id): Promise<Battle | null> {

        const battle = await this.prisma.battle.findUnique({
            where: {userId: userId.value},
        });


        if (!battle) {
            return null;
        }

        return BattleDbMapper.toEntity(battle);
    }

}

export default PrismaBattleRepository;






