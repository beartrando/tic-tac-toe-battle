import BattleEntity from "../entities/battle.entity";
import Id from "../value-objects/id.vo";
import {Battle} from "@prisma/client";

export interface BattleRepository {

    findById(id: Id): Promise<BattleEntity | null>;

    save(user: BattleEntity): Promise<BattleEntity>;

    findActiveByProfileId(profileId: Id): Promise<Set<BattleEntity> | null>;

    join(profileId: Id, battleId?: Id | null): Promise<BattleEntity | null>;

    findAvailableBattle(profileId: Id): Promise<Battle | null>;
}

export default BattleRepository;
