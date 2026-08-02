export class PlayerIds {
    constructor(
        readonly value: readonly Id[],
    ) {
        if (value.length !== 2) {
            throw new Error(
                "Battle must contain exactly two players",
            );
        }

        if (value[0].equals(value[1])) {
            throw new Error(
                "Players must be different",
            );
        }
    }
}

export default PlayerIds;
