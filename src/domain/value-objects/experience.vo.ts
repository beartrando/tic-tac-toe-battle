export class Experience {
    constructor(
        public readonly value: number,
    ) {
        if (!Number.isInteger(value)) {
            throw new Error("Experience must be an integer");
        }

        if (value < 0) {
            throw new Error("Experience cannot be negative");
        }
    }

    equals(other: Experience): boolean {
        return this.value === other.value;
    }

    add(amount: number): Experience {
        return new Experience(this.value + amount);
    }

    subtract(amount: number): Experience {
        return new Experience(Math.max(0, this.value - amount));
    }
}

export default Experience;
