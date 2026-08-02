import {Profile} from "@prisma/client";
import ProfileEntity from "../../../domain/entities/profile.entity";
import Id from "../../../domain/value-objects/id.vo";
import Nickname from "../../../domain/value-objects/nickname.vo";
import Level from "../../../domain/value-objects/level.vo";
import Rating from "../../../domain/value-objects/rating.vo";
import Experience from "../../../domain/value-objects/experience.vo";

type ProfileSaveData = Omit<
    Profile,
    "createdAt" | "updatedAt"
>;

export class ProfileDbMapper {
    static toPersistence(profile: ProfileEntity): ProfileSaveData {
        return {
            id: profile.id.value,
            userId: profile.userId.value,
            nickname: profile.nickname.value,
            level: profile.level.value,
            rating: profile.rating.value,
            experience: profile.experience.value,
        };
    }

    static toEntity(profile: Profile): ProfileEntity {
        return new ProfileEntity(
            new Id(profile.id),
            new Id(profile.userId),
            new Nickname(profile.nickname),
            new Level(profile.level),
            new Rating(profile.rating),
            new Experience(profile.experience),
            profile.createdAt,
            profile.updatedAt,
        );
    }
}

export default ProfileDbMapper;
