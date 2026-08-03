import BattleCellValueEnum from "../enums/battle-cell-value.enum";

export class Board {
    constructor(
        readonly cells: readonly BattleCellValueEnum[],
    ) {
        if (cells.length !== 9) {
            throw new Error("Board must contain 9 cells");
        }

        if (
            cells.some(
                cell => !Object.values(BattleCellValueEnum).includes(cell),
            )
        ) {
            throw new Error("Invalid cell value");
        }
    }

    static empty(): Board {
        return new Board(
            Array(9).fill(BattleCellValueEnum.EMPTY),
        );
    }
}

export default Board;
