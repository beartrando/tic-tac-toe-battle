import * as battleProto from "../../../contracts/proto/battle";
import BattleEntity from "../../../domain/entities/battle.entity";
import BattleBoardProtoMapper from "./battle-board.proto.mapper";
import BattleStatusProtoMapper from "./battle-status.proto.mapper";

export class BattleProtoMapper {
    static toProto(battle: BattleEntity): battleProto.BattleObject {

        return battleProto.BattleObject.create({
            id: battle.id.value,
            playerIds: battle.playerIds.value.map(id => id.value),
            board: BattleBoardProtoMapper.toProto(battle.board),
            status: BattleStatusProtoMapper.toProto(battle.status),
            winnerId: battle.winnerId?.value,
            lastMoveAt: battle.lastMoveAt ?? undefined,
            createdAt: battle.createdAt,
            updatedAt: battle.updatedAt,
        });
    }

    // static toDomain(user: authProto.UserObject): BattleEntity {
    //
    // }
}

export default BattleProtoMapper;
