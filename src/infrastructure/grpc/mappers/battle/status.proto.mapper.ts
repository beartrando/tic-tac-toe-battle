import * as battleProto from "../../../../contracts/proto/battle";
import BattleStatus from "../../../../domain/value-objects/battle/status.vo";
import BattleStatusEnum from "../../../../domain/enums/battle/status.enum";

export class StatusProtoMapper {

    static toProto(
        status: BattleStatus,
    ): battleProto.BattleStatus {
        switch (status.value) {
            case BattleStatusEnum.New:
                return battleProto.BattleStatus.NEW;
            case BattleStatusEnum.Active:
                return battleProto.BattleStatus.ACTIVE;
            case BattleStatusEnum.Finished:
                return battleProto.BattleStatus.FINISHED;
            default:
                return battleProto.BattleStatus.UNKNOWN;
        }
    }

    // static toDomain(
    //     status: PrismaBattleStatus,
    // ): Status {
    //     switch (status) {
    //         case PrismaBattleStatus.New: return new Status(StatusEnum.New);
    //         case PrismaBattleStatus.Active: return new Status(StatusEnum.Active);
    //         case PrismaBattleStatus.Finished: return new Status(StatusEnum.Finished);
    //         default: throw new Error(`Unknown PrismaBattleStatus: ${status}`);
    //     }
    // }
}

export default StatusProtoMapper;
