import * as profileProto from "../../../contracts/proto/profile";
import ProfileEntity from "../../../domain/entities/profile.entity";
import Id from "../../../domain/value-objects/id.vo";
import Nickname from "../../../domain/value-objects/nickname.vo";
import Level from "../../../domain/value-objects/level.vo";
import Rating from "../../../domain/value-objects/rating.vo";
import Experience from "../../../domain/value-objects/experience.vo";

export class ProfileGrpcMapper {
    static toGrpc(profile: ProfileEntity): profileProto.ProfileObject {

        return profileProto.ProfileObject.create({
            id: profile.id.value,
            userId: profile.userId.value,
            nickname: profile.nickname.value,
            level: profile.level.value,
            rating: profile.rating.value,
            experience: profile.experience.value,
            createdAt: profile.createdAt ?? undefined,
            updatedAt: profile.updatedAt ?? undefined,
        });
    }

    // static toEntity(user: authProto.UserObject): ProfileEntity {
    //
    //     return ProfileEntity.create({
    //         id: new Id(user.id),
    //         email: user.email ? new Email(user.email) : null,
    //         googleId: user.googleId,
    //         lastLoginAt: user.lastLoginAt,
    //         lastActiveAt: user.lastActiveAt,
    //         createdAt: user.createdAt,
    //         updatedAt: user.updatedAt,
    //     });
    // }

}

export default ProfileGrpcMapper;
