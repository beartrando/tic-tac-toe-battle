import CellValueEnum from "../../enums/battle/cell-value.enum";

export class BattleBoard {
    constructor(
        readonly cells: readonly CellValueEnum[],
    ) {
        if (cells.length !== 9) {
            throw new Error("Board must contain 9 cells");
        }

        if (
            cells.some(
                cell => !Object.values(CellValueEnum).includes(cell),
            )
        ) {
            throw new Error("Invalid cell value");
        }
    }

    static empty(): BattleBoard {
        return new BattleBoard(
            Array(9).fill(CellValueEnum.EMPTY),
        );
    }
}

export default BattleBoard;
