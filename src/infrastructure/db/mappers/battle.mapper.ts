import {Battle} from "@prisma/client";
import BattleEntity from "../../../domain/entities/battle.entity";
import Id from "../../../domain/value-objects/id.vo";

type BattleSaveData = Omit<
    Battle,
    "createdAt" | "updatedAt"
>;

export class BattleDbMapper {
    // static toPersistence(profile: BattleEntity): BattleSaveData {
    //     return {
    //         id: profile.id.value,
    //         userId: profile.userId.value,
    //         nickname: profile.nickname.value,
    //         level: profile.level.value,
    //         rating: profile.rating.value,
    //         experience: profile.experience.value,
    //     };
    // }
    //
    // static toEntity(profile: Profile): BattleEntity {
    //     return new BattleEntity(
    //         new Id(profile.id),
    //         new Id(profile.userId),
    //         new Nickname(profile.nickname),
    //         new Level(profile.level),
    //         new Rating(profile.rating),
    //         new Experience(profile.experience),
    //         profile.createdAt,
    //         profile.updatedAt,
    //     );
    // }
}

export default BattleDbMapper;
