import {
    BattleCellValue as PrismaBattleCellValue,
} from "@prisma/client";

import BattleCellValueEnum from "../../../domain/enums/battle-cell-value.enum";

export class BattleCellValueMapper {

    static toPersistence(
        cells: readonly BattleCellValueEnum[],
    ): PrismaBattleCellValue[] {

        return cells.map(cell => {

            switch (cell) {

                case BattleCellValueEnum.EMPTY:
                    return PrismaBattleCellValue.EMPTY;

                case BattleCellValueEnum.X:
                    return PrismaBattleCellValue.X;

                case BattleCellValueEnum.O:
                    return PrismaBattleCellValue.O;
            }

        });

    }

    static toDomain(
        cells: readonly PrismaBattleCellValue[],
    ): BattleCellValueEnum[] {

        return cells.map(cell => {

            switch (cell) {

                case PrismaBattleCellValue.EMPTY:
                    return BattleCellValueEnum.EMPTY;

                case PrismaBattleCellValue.X:
                    return BattleCellValueEnum.X;

                case PrismaBattleCellValue.O:
                    return BattleCellValueEnum.O;
            }

        });

    }

}

export default BattleCellValueMapper;