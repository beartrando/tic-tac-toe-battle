import BattleEntity from "../entities/battle.entity";
import Id from "../value-objects/id.vo";

export interface ProfileRepository {
    findById(id: Id): Promise<BattleEntity | null>;

    save(user: BattleEntity): Promise<BattleEntity>;

    findByUserId(userId: Id): Promise<BattleEntity | null>;
}

export default ProfileRepository;
