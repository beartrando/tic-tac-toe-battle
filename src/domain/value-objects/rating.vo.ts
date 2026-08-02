export class Rating {
    constructor(
        public readonly value: number,
    ) {
        if (!Number.isInteger(value)) {
            throw new Error("Rating must be an integer");
        }

        if (value < 0) {
            throw new Error("Rating cannot be negative");
        }
    }

    equals(other: Rating): boolean {
        return this.value === other.value;
    }

    add(points: number): Rating {
        return new Rating(this.value + points);
    }

    subtract(points: number): Rating {
        return new Rating(Math.max(0, this.value - points));
    }
}

export default Rating;
