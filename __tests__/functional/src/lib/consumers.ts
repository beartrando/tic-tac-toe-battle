// import crypto from "crypto";
// import {prisma} from "../utils/prisma";
// import {battleUpdated} from "../services/battleUpdated";
// import {BattleCellValue, Status} from "@prisma/client";
//
// let userId1: string;
//
// beforeEach(async () => {
//     userId1 = crypto.randomUUID();
//     await prisma.battle.deleteMany();
// });
//
// afterAll(async () => {
//     await prisma.$disconnect();
// });
//
// test("успешно обновляет баттл", async () => {
//     // создаём баттл
//     const battle = await prisma.battle.create({
//         data: {
//             players: [userId1],
//             playersCount: 1,
//             status: Status.Active,
//         },
//     });
//
//     // сообщение для обновления
//     const message = {
//         id: battle.id,
//         cells: [BattleCellValue.CELL_X, BattleCellValue.CELL_O],
//         status: Status.Finished,
//         winner: userId1,
//     };
//
//     await battleUpdated("battle.updated", 0, message);
//
//     const updated = await prisma.battle.findUnique({where: {id: battle.id}});
//
//     expect(updated?.status).toBe(Status.Finished);
//     expect(updated?.winner).toBe(userId1);
//     expect(updated?.cells).toEqual(["X", "O"]);
// });
//
// test("ошибка при обновлении не ломает процесс", async () => {
//     // сообщение с несуществующим id
//     const message = {
//         id: crypto.randomUUID(),
//         cells: [],
//         status: Status.Active,
//         winner: null,
//         userId: userId1,
//     };
//
//     await expect(
//         battleUpdated("battle.updated", 0, message)
//     ).resolves.not.toThrow();
//
//     // проверяем, что в базе ничего не появилось
//     const battles = await prisma.battle.findMany();
//     expect(battles.length).toBe(0);
// });
