import {Battle} from "@prisma/client";
import {BattleModel} from "../models/battle.model";
import logger from "@shared/logger";

// import pgBossManager from "@shared/pg-boss-manager";
// import {kafkaProducersConfig} from "../app/kafka.app";
// import {battleToGrpc} from "../utils/battle-grpc-prisma-converters";

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}

export async function upsert(profileId: string): Promise<Battle> {
    const existingMyBattle = await BattleModel.findBattleByProfile(profileId);

    // logger.log('upsert battle for profile: ', profileId);

    if (existingMyBattle) {
        return existingMyBattle;
    }

    let attempts = 3;

    while (attempts > 0) {
        const existingSomebodiesBattle = await BattleModel.findAvailableBattle(profileId);

        if (existingSomebodiesBattle) {
            try {

                return await BattleModel.joinBattle(existingSomebodiesBattle.id, profileId);
            } catch (e) {
                logger.log(e);
                // await pgBossManager.queue.enqueueTx(kafkaProducersConfig.battleStarted, battleToGrpc(battle), tx);

                // export const makeMove = (move: engineGrpc.BattleMoveRequest): Promise<emptyGrpc.Empty | null> => {
                //   return engineManager.call((client, cb) => client.battleMove(move, cb));
                // };
            }
            attempts--;
            continue;
        }


        return BattleModel.createBattle(profileId);
    }

    return BattleModel.createBattle(profileId);
}

export async function join(profileId: string, battleId: string): Promise<Battle | null> {
    const battle = await BattleModel.get(battleId);

    if (!battle) {
        throw new Error(`Battle ${battleId} not found.`);
    }

    if (battle.playerIds.includes(profileId)) {
        return battle;
    }


    try {
        return await BattleModel.joinBattle(battleId, profileId);
    } catch (e) {
        logger.log(e);
    }

    return await BattleModel.get(battleId);
}

