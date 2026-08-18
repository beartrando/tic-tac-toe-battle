import BattleEntity from "../battle/battle.entity";
import Id from "../common/value-objects/id.vo";

export interface BattleRepository {

    findById(id: Id): Promise<BattleEntity | null>;

    save(user: BattleEntity): Promise<BattleEntity>;

    findActiveByProfileId(profileId: Id): Promise<Set<BattleEntity> | null>;

    join(profileId: Id, battleId: Id): Promise<BattleEntity | null>;

    findAvailableForProfile(profileId: Id): Promise<BattleEntity | null>;
}

export default BattleRepository;
