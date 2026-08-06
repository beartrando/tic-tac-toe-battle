import {BattleCellValue} from "@prisma/client";
import BattleCellValueMapper from "./cell-value.mapper";
import Board from "../../../../domain/value-objects/battle/board.vo";

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
