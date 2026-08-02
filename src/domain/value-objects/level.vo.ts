export class Level {
    constructor(
        public readonly value: number,
    ) {
        if (!Number.isInteger(value)) {
            throw new Error("Level must be an integer");
        }

        if (value < 1) {
            throw new Error("Level must be greater than 0");
        }
    }

    equals(other: Level): boolean {
        return this.value === other.value;
    }

    next(): Level {
        return new Level(this.value + 1);
    }
}

export default Level;
