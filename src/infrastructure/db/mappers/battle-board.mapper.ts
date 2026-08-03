import {BattleCellValue} from "@prisma/client";

import BattleCellValueEnum from "../../../domain/enums/battle-cell-value.enum";
import BattleCellValueMapper from "./battle-cell-value.mapper";
import Board from "../../../domain/value-objects/board.vo";

export class BattleBoardMapper {

    static toPersistence(board: Board): BattleCellValue[] {
        return board.cells.map(BattleCellValueMapper.toPersistence);
    }

    static toDomain(
        cells: readonly BattleCellValue[],
    ): Board {
        return new Board(cells.map(BattleCellValueMapper.toDomain));
    }
}

export default BattleBoardMapper;
