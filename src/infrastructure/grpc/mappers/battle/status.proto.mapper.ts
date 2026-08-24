import * as battleProto from "../../../../contracts/proto/battle";
import BattleStatus from "../../../../domain/battle/value-objects/status.vo";
import BattleStatusEnum from "../../../../domain/battle/enums/status.enum";

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
    // ): BattleStatus {
    //     switch (status) {
    //         case PrismaBattleStatus.New: return new BattleStatus(BattleStatusEnum.New);
    //         case PrismaBattleStatus.Active: return new BattleStatus(BattleStatusEnum.Active);
    //         case PrismaBattleStatus.Finished: return new BattleStatus(BattleStatusEnum.Finished);
    //         default: throw new Error(`Unknown PrismaBattleStatus: ${status}`);
    //     }
    // }
}

export default StatusProtoMapper;
