import BattleEntity from "./battle.entity";
import BattleStatusEnum from "./enums/battle-status.enum";
import BattlePlayerIds from "./value-objects/battle-player-ids.vo";
import BattleStatus from "./value-objects/battle-status.vo";
import ProfileId from "../profile/value-objects/profile-id.vo";

function makeBattle(status: BattleStatusEnum): BattleEntity {
    return BattleEntity.create({
        playerIds: new BattlePlayerIds([new ProfileId("profile-1")]),
        status: BattleStatus.create(status),
    });
}

describe("BattleEntity", () => {
    test("timeout() переводит баттл в TimeOut", () => {
        const battle = makeBattle(BattleStatusEnum.Started);

        battle.timeout();

        expect(battle.status.value).toBe(BattleStatusEnum.TimeOut);
        expect(battle.final()).toBe(true);
    });

    test("final() истинно только для терминальных статусов", () => {
        const terminal = [
            BattleStatusEnum.Finished,
            BattleStatusEnum.Cancelled,
            BattleStatusEnum.TimeOut,
        ];

        for (const status of terminal) {
            expect(makeBattle(status).final()).toBe(true);
        }

        const notTerminal = [
            BattleStatusEnum.Created,
            BattleStatusEnum.Matched,
            BattleStatusEnum.Ready,
            BattleStatusEnum.Started,
        ];

        for (const status of notTerminal) {
            expect(makeBattle(status).final()).toBe(false);
        }
    });
});
