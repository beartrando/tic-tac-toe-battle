import Id from "../../common/value-objects/id.vo";

export class PlayerIds {
    constructor(
        readonly value: readonly Id[],
    ) {
        if (value.length < 1 || value.length > 2) {
            throw new Error(
                "Battle must contain one or two players",
            );
        }

        if (
            value.length === 2 &&
            value[0].equals(value[1])
        ) {
            throw new Error(
                "Players must be different",
            );
        }
    }
}

export default PlayerIds;
