import Id from "../common/value-objects/id.vo";
import Board from "../battle/value-objects/board.vo";
import PlayerIds from "../battle/value-objects/player-ids.vo";
import BattleStatus from "../battle/value-objects/status.vo";
import BattleStatusEnum from "../battle/enums/status.enum";
import BattleId from "./value-objects/battle-id.vo";
import ProfileId from "../profile/value-objects/profile-id.vo";

type BattleEntityProps = {
    id?: BattleId;
    playerIds: PlayerIds;
    board?: Board;
    status?: BattleStatus;
    winnerId?: ProfileId | null;
    lastMoveAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export class BattleEntity {
    constructor(
        readonly id: BattleId,
        readonly playerIds: PlayerIds,
        readonly board: Board,
        readonly status: BattleStatus,
        readonly winnerId: ProfileId | null,
        readonly lastMoveAt: Date | null,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {
    }

    static create(props: BattleEntityProps): BattleEntity {
        const now = new Date();

        return new BattleEntity(
            props.id ?? BattleId.create(),
            props.playerIds,
            props.board ?? Board.empty(),
            props.status ?? new BattleStatus(BattleStatusEnum.New),
            props.winnerId ?? null,
            props.lastMoveAt ?? null,
            props.createdAt ?? now,
            props.updatedAt ?? now,
        );
    }

    static createNew(profileId: ProfileId): BattleEntity {
        return BattleEntity.create({playerIds: new PlayerIds([profileId])});
    }

}

export default BattleEntity;

