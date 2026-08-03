import {
    BattleStatus as PrismaBattleStatus,
} from "@prisma/client";

import BattleStatus from "../../../domain/value-objects/battle-status.vo";
import BattleStatusEnum from "../../../domain/enums/battle-status.enum";

export class BattleStatusMapper {

    static toPersistence(
        status: BattleStatus,
    ): PrismaBattleStatus {
        switch (status.value) {
            case BattleStatusEnum.New: return PrismaBattleStatus.New;
            case BattleStatusEnum.Active: return PrismaBattleStatus.Active;
            case BattleStatusEnum.Finished: return PrismaBattleStatus.Finished;
        }
    }

    static toDomain(
        status: PrismaBattleStatus,
    ): BattleStatus {
        switch (status) {
            case PrismaBattleStatus.New: return new BattleStatus(BattleStatusEnum.New);
            case PrismaBattleStatus.Active: return new BattleStatus(BattleStatusEnum.Active);
            case PrismaBattleStatus.Finished: return new BattleStatus(BattleStatusEnum.Finished);
        }
    }
}

export default BattleStatusMapper;
