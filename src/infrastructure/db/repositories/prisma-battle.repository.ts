import {PrismaClient} from "@prisma/client";

import ProfileRepository from "../../../domain/repositories/profile.repository";
import BattleEntity from "../../../domain/entities/battle.entity";

import Id from "../../../domain/value-objects/id.vo";
import BattleDbMapper from "../mappers/battle.mapper";

export class PrismaBattleRepository implements ProfileRepository {

    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    async findById(
        id: Id,
    ): Promise<BattleEntity | null> {

        const profile = await this.prisma.profile.findUnique({
            where: {
                id: id.value,
            },
        });

        if (!profile) {
            return null;
        }

        return BattleDbMapper.toEntity(profile);
    }

    async save(
        profile: BattleEntity,
    ): Promise<BattleEntity> {

        const profileDb = BattleDbMapper.toPersistence(profile);
        const {
            id,
            userId,
            // createdAt,
            // updatedAt,
            ...update
        } = profileDb;

        const result = await this.prisma.profile.upsert({
            where: {
                id: profileDb.id,
            },
            create: profileDb,
            update,
        });

        return BattleDbMapper.toEntity(result);
    }

    async findByUserId(
        userId: Id,
    ): Promise<BattleEntity | null> {

        const profile = await this.prisma.profile.findUnique({
            where: {userId: userId.value},
        });


        if (!profile) {
            return null;
        }

        return BattleDbMapper.toEntity(profile);
    }
}

export default PrismaBattleRepository;






