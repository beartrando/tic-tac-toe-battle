import BattleCellValueEnum from "../enums/battle-cell-value.enum";

export class BattleBoard {
    readonly cells: readonly BattleCellValueEnum[];

    constructor(cells: readonly BattleCellValueEnum[]) {
        // no cells received -> the battle is fresh, the board is empty
        if (cells.length === 0) {
            this.cells = Array(9).fill(BattleCellValueEnum.EMPTY);
            return;
        }

        if (cells.length !== 9) {
            throw new Error("BattleBoard must contain 9 cells");
        }

        if (
            cells.some(
                cell => !Object.values(BattleCellValueEnum).includes(cell),
            )
        ) {
            throw new Error("Invalid cell value");
        }

        this.cells = cells;
    }

    static empty(): BattleBoard {
        return new BattleBoard(
            Array(9).fill(BattleCellValueEnum.EMPTY),
        );
    }
}

export default BattleBoard;
