import * as battleProto from "../../../../contracts/proto/battle";
import BattleStatus from "../../../../domain/battle/value-objects/battle-status.vo";
import BattleStatusEnum from "../../../../domain/battle/enums/battle-status.enum";

export class BattleStatusProtoMapper {

    static toProto(
        status: BattleStatus,
    ): battleProto.BattleStatus {
        switch (status.value) {
            case BattleStatusEnum.Created:
                return battleProto.BattleStatus.CREATED;
            case BattleStatusEnum.Ready:
                return battleProto.BattleStatus.READY;
            case BattleStatusEnum.Active:
                return battleProto.BattleStatus.ACTIVE;
            case BattleStatusEnum.Finished:
                return battleProto.BattleStatus.FINISHED;
            default:
                return battleProto.BattleStatus.UNKNOWN;
        }
    }

    static toDomain(
        status: battleProto.BattleStatus,
    ): BattleStatus {
        switch (status) {
            case battleProto.BattleStatus.CREATED:
                return new BattleStatus(BattleStatusEnum.Created);
            case battleProto.BattleStatus.READY:
                return new BattleStatus(BattleStatusEnum.Ready);
            case battleProto.BattleStatus.ACTIVE:
                return new BattleStatus(BattleStatusEnum.Active);
            case battleProto.BattleStatus.FINISHED:
                return new BattleStatus(BattleStatusEnum.Finished);
            default:
                return new BattleStatus(BattleStatusEnum.Unknown);
        }
    }
}

export default BattleStatusProtoMapper;
