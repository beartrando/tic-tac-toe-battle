// import { upsertBattle } from "../../../../src/orchestration/engine.service";
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
//   await prisma.engine.deleteMany();
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
//     const engine = await upsertBattle(userId2);
//
//     expect(engine.id).toEqual(battle1.id);
//     expect(engine.playerIdsCount).toEqual(2);
//     expect(engine.playerIds).toContain(userId1);
//     expect(engine.playerIds).toContain(userId2);
//   });
//
//   test("создание нового баттла для userId1", async () => {
//     const engine = await upsertBattle(userId1);
//
//     expect(engine.playerIds).toContain(userId1);
//     expect(engine.playerIdsCount).toBe(1);
//     expect(engine.status).toBe(BattleStatus.Active);
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
//     const engine = await upsertBattle(userId2);
//
//     expect(engine.playerIds).toContain(userId1);
//     expect(engine.playerIds).toContain(userId2);
//     expect(engine.playerIdsCount).toBe(2);
//   });
//
//   test("создание нового баттла для userId2, если чужих нет", async () => {
//     const battle1 = await upsertBattle(userId1);
//     // завершаем первый баттл вручную
//     await prisma.engine.update({
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
