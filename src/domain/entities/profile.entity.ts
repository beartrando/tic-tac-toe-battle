import Id from "../value-objects/id.vo";
import Nickname from "../value-objects/nickname.vo";
import Level from "../value-objects/level.vo";
import Rating from "../value-objects/rating.vo";
import Experience from "../value-objects/experience.vo";

type ProfileEntityProps = {
    id?: Id;
    userId: Id;
    nickname?: Nickname;
    level?: Level;
    rating?: Rating;
    experience?: Experience;
    createdAt?: Date;
    updatedAt?: Date;
};

export class ProfileEntity {
    constructor(
        readonly id: Id,
        readonly userId: Id,
        readonly nickname: Nickname,
        readonly level: Level,
        readonly rating: Rating,
        readonly experience: Experience,
        readonly createdAt: Date | null,
        readonly updatedAt: Date | null,
    ) {
    }

    static create(
        props: ProfileEntityProps,
    ): ProfileEntity {
        const now = new Date();

        return new ProfileEntity(
            props.id ?? Id.create(),
            props.userId,
            props.nickname ?? ProfileEntity.generateGuestNickname(),
            props.level ?? new Level(1),
            props.rating ?? new Rating(0),
            props.experience ?? new Experience(0),
            props.createdAt ?? now,
            props.updatedAt ?? now,
        );
    }

    private static generateGuestNickname(): Nickname {
        const randomDigits = Math.floor(10000000 + Math.random() * 90000000);

        return new Nickname(`Guest${randomDigits}`);
    }


}

export default ProfileEntity;
