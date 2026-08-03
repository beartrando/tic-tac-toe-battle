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

            case BattleStatusEnum.New:
                return PrismaBattleStatus.New;

            case BattleStatusEnum.Active:
                return PrismaBattleStatus.Active;

            case BattleStatusEnum.Finished:
                return PrismaBattleStatus.Finished;
        }
    }

    static toDomain(
        status: PrismaBattleStatus,
    ): BattleStatus {

        switch (status) {

            case PrismaBattleStatus.New:
                return BattleStatus.New;

            case PrismaBattleStatus.Active:
                return BattleStatus.Active;

            case PrismaBattleStatus.Finished:
                return BattleStatus.Finished;
        }
    }
}

export default BattleStatusMapper;
