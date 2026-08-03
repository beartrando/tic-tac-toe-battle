import {Battle} from "@prisma/client";

import BattleEntity from "../../../domain/entities/battle.entity";
import Board from "../../../domain/value-objects/board.vo";
import Id from "../../../domain/value-objects/id.vo";
import PlayerIds from "../../../domain/value-objects/player-ids.vo";
import BattleStatus from "../../../domain/value-objects/battle-status.vo";
import BattleCellValueMapper from "./battle-cell-value.mapper";
import BattleStatusMapper from "./battle-status.mapper";
import BattleBoardMapper from "./battle-board.mapper";

type BattleSaveData = Omit<
    Battle,
    "createdAt" | "updatedAt"
>;

export class BattleDbMapper {

    static toPersistence(battle: BattleEntity): BattleSaveData {
        return {
            id: battle.id.value,
            playerIds: battle.playerIds.value.map(id => id.value),
            board: BattleBoardMapper.toPersistence(battle.board),
            status: BattleStatusMapper.toPersistence(battle.status),
            winnerId: battle.winnerId?.value ?? null,
            lastMoveAt: battle.lastMoveAt,
        };
    }

    static toDomain(battle: Battle): BattleEntity {
        return BattleEntity.create({
            id: new Id(battle.id),
            playerIds: new PlayerIds(battle.playerIds.map(id => new Id(id))),
            board: BattleBoardMapper.toDomain(battle.board),
            status: BattleStatusMapper.toDomain(battle.status),
            winnerId: battle.winnerId ? new Id(battle.winnerId) : null,
            lastMoveAt: battle.lastMoveAt,
            createdAt: battle.createdAt,
            updatedAt: battle.updatedAt,
        });
    }
}

export default BattleDbMapper;
