import {randomUUID} from "crypto";

export class Id {
    constructor(
        readonly value: string,
    ) {
        if (!value) {
            throw new Error("Id cannot be empty");
        }

        if (/\s/.test(value)) {
            throw new Error("Id cannot contain whitespace");
        }
    }

    static create(): Id {
        return new Id(randomUUID());
    }

    equals(other: Id): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}

export default Id;
