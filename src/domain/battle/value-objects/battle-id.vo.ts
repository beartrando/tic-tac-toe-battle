import {randomUUID} from "crypto";

export class BattleId {
    constructor(
        readonly value: string,
    ) {
        if (!value) {
            throw new Error("BattleId cannot be empty");
        }

        if (/\s/.test(value)) {
            throw new Error("BattleId cannot contain whitespace");
        }
    }

    static create(): BattleId {
        return new BattleId(randomUUID());
    }

    equals(other: BattleId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}

export default BattleId;
