import {PrismaClient} from "@prisma/client";

import ProfileRepository from "../../../domain/repositories/profile.repository";
import ProfileEntity from "../../../domain/entities/profile.entity";

import Id from "../../../domain/value-objects/id.vo";
import ProfileDbMapper from "../mappers/profile.mapper";

export class PrismaProfileRepository implements ProfileRepository {

    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    async findById(
        id: Id,
    ): Promise<ProfileEntity | null> {

        const profile = await this.prisma.profile.findUnique({
            where: {
                id: id.value,
            },
        });

        if (!profile) {
            return null;
        }

        return ProfileDbMapper.toEntity(profile);
    }

    async save(
        profile: ProfileEntity,
    ): Promise<ProfileEntity> {

        const profileDb = ProfileDbMapper.toPersistence(profile);
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

        return ProfileDbMapper.toEntity(result);
    }

    async findByUserId(
        userId: Id,
    ): Promise<ProfileEntity | null> {

        const profile = await this.prisma.profile.findUnique({
            where: {userId: userId.value},
        });


        if (!profile) {
            return null;
        }

        return ProfileDbMapper.toEntity(profile);
    }
}

export default PrismaProfileRepository;






