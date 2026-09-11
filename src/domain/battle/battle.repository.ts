import BattleEntity from "../battle/battle.entity";
import BattleId from "./value-objects/battle-id.vo";
import ProfileId from "../profile/value-objects/profile-id.vo";

export interface BattleRepository {

    findById(id: BattleId): Promise<BattleEntity | null>;

    save(user: BattleEntity): Promise<BattleEntity>;

    findCreatedByProfileId(profileId: ProfileId): Promise<Set<BattleEntity> | null>;

    join(profileId: ProfileId, battleId: BattleId): Promise<BattleEntity | null>;

    findCreatedForProfile(profileId: ProfileId): Promise<BattleEntity | null>;

    findCreatedByProfile(battleId: BattleId, profileId: ProfileId): Promise<BattleEntity | null>;

}

export default BattleRepository;
