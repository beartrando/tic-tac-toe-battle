import {BattleService} from './generated/battle';
import {HealthService} from './generated/common/health';
import * as grpc from '@grpc/grpc-js';
import * as battleHandler from "./handlers/battle.handler";
import * as healthHandler from "./handlers/health.handler";

const server = new grpc.Server();

server.addService(BattleService, {
    get: battleHandler.get,
    getOrCreate: battleHandler.upsert,
    join: battleHandler.join,
});

server.addService(HealthService, {
    check: healthHandler.check,
    status: healthHandler.status,
    livez: healthHandler.livez,
    readyz: healthHandler.readyz,
});

export default server;

