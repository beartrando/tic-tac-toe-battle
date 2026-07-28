// import { upsertBattle } from "../../../../src/orchestration/battle.service";
// import pgBossManager from "@shared/pg-boss-manager";
// import { BattleStatus } from "@prisma/client";
// import prisma from "../../../../src/utils/prisma";
// import logger from "@shared/logger/dist";
//
// jest.mock("@shared/pg-boss-manager/src/enqueueEvent", () => ({
//  pgBossManager.queue.enqueueTx: jest.fn(),
// }));
//
//
// beforeEach(async () => {
//   await prisma.battle.deleteMany();
//   // при необходимости чистим и другие таблицы
// });
//
// describe("upsertBattle", () => {
//   let userId1: string;
//   let userId2: string;
//
//   beforeEach(() => {
//     jest.clearAllMocks();
//     userId1 = crypto.randomUUID()
//     userId2 = crypto.randomUUID()
//   });
//
//   test("golden hummer", async () => {
//     logger.log(userId1);
//     logger.log(userId2);
//     const battle1 = await upsertBattle(userId1);
//
//     expect(battle1.playerIds).toContain(userId1);
//     expect(battle1.playerIdsCount).toEqual(1);
//
//     const existingBattle = await upsertBattle(userId1);
//
//     expect(battle1).toEqual(existingBattle);
//
//     const battle = await upsertBattle(userId2);
//
//     expect(battle.id).toEqual(battle1.id);
//     expect(battle.playerIdsCount).toEqual(2);
//     expect(battle.playerIds).toContain(userId1);
//     expect(battle.playerIds).toContain(userId2);
//   });
//
//   test("создание нового баттла для userId1", async () => {
//     const battle = await upsertBattle(userId1);
//
//     expect(battle.playerIds).toContain(userId1);
//     expect(battle.playerIdsCount).toBe(1);
//     expect(battle.status).toBe(BattleStatus.Active);
//   });
//
//   test("возврат существующего баттла для userId1", async () => {
//     const battle1 = await upsertBattle(userId1);
//     const battle2 = await upsertBattle(userId1);
//
//     expect(battle2.id).toBe(battle1.id);
//     expect(battle2.playerIds).toContain(userId1);
//   });
//
//   test("присоединение второго игрока userId2 к баттлу userId1", async () => {
//     await upsertBattle(userId1);
//     const battle = await upsertBattle(userId2);
//
//     expect(battle.playerIds).toContain(userId1);
//     expect(battle.playerIds).toContain(userId2);
//     expect(battle.playerIdsCount).toBe(2);
//   });
//
//   test("создание нового баттла для userId2, если чужих нет", async () => {
//     const battle1 = await upsertBattle(userId1);
//     // завершаем первый баттл вручную
//     await prisma.battle.update({
//       where: { id: battle1.id },
//       data: { status: BattleStatus.Finished },
//     });
//
//     const battle2 = await upsertBattle(userId2);
//
//     expect(battle2.id).not.toBe(battle1.id);
//     expect(battle2.playerIds).toContain(userId2);
//     expect(battle2.playerIdsCount).toBe(1);
//   });
// });
