import Id from "../value-objects/id.vo";
import Board from "../value-objects/battle/board.vo";
import PlayerIds from "../value-objects/battle/player-ids.vo";
import BattleStatus from "../value-objects/battle/status.vo";
import BattleStatusEnum from "../enums/battle/status.enum";

type BattleEntityProps = {
    id?: Id;
    playerIds: PlayerIds;
    board?: Board;
    status?: BattleStatus;
    winnerId?: Id | null;
    lastMoveAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export class BattleEntity {
    constructor(
        readonly id: Id,
        readonly playerIds: PlayerIds,
        readonly board: Board,
        readonly status: BattleStatus,
        readonly winnerId: Id | null,
        readonly lastMoveAt: Date | null,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {
    }

    static create(props: BattleEntityProps): BattleEntity {
        const now = new Date();

        return new BattleEntity(
            props.id ?? Id.create(),
            props.playerIds,
            props.board ?? Board.empty(),
            props.status ?? new BattleStatus(BattleStatusEnum.New),
            props.winnerId ?? null,
            props.lastMoveAt ?? null,
            props.createdAt ?? now,
            props.updatedAt ?? now,
        );
    }

    static createNew(profileId: Id): BattleEntity {
        return BattleEntity.create({playerIds: new PlayerIds([profileId])});
    }

}

export default BattleEntity;

