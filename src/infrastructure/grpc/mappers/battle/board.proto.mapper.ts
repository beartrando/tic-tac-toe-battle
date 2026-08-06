import * as battleProto from "../../../../contracts/proto/battle";
import Board from "../../../../domain/value-objects/battle/board.vo";
import CellValueProtoMapper from "./cell-value.proto.mapper";

export class BoardProtoMapper {

    static toProto(board: Board): battleProto.BattleCellValue[] {
        return board.cells.map(CellValueProtoMapper.toProto);
    }

    static toDomain(
        cells: readonly battleProto.BattleCellValue[],
    ): Board {
        return new Board(cells.map(CellValueProtoMapper.toDomain));
    }
}

export default BoardProtoMapper;
