import {BattleStatus as PrismaBattleStatus,} from "@prisma/client";

import BattleStatus from "../../../../domain/battle/value-objects/status.vo";
import BattleStatusEnum from "../../../../domain/battle/enums/status.enum";

export class BattleStatusMapper {

    static toPersistence(
        status: BattleStatus,
    ): PrismaBattleStatus {
        switch (status.value) {
            case BattleStatusEnum.New:
                return PrismaBattleStatus.New;
            case BattleStatusEnum.Ready:
                return PrismaBattleStatus.Ready;
            case BattleStatusEnum.Active:
                return PrismaBattleStatus.Active;
            case BattleStatusEnum.Finished:
                return PrismaBattleStatus.Finished;
            default:
                throw new Error(`Unknown BattleStatus: ${status.value}`);
        }
    }

    static toDomain(
        status: PrismaBattleStatus,
    ): BattleStatus {
        switch (status) {
            case PrismaBattleStatus.New:
                return new BattleStatus(BattleStatusEnum.New);
            case PrismaBattleStatus.Ready:
                return new BattleStatus(BattleStatusEnum.Ready);
            case PrismaBattleStatus.Active:
                return new BattleStatus(BattleStatusEnum.Active);
            case PrismaBattleStatus.Finished:
                return new BattleStatus(BattleStatusEnum.Finished);
            default:
                throw new Error(`Unknown PrismaBattleStatus: ${status}`);
        }
    }
}

export default BattleStatusMapper;
