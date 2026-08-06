import HealthUseCase from "../application/use-cases/health/health";
import StatusUseCase from "../application/use-cases/health/status";
import LivezUseCase from "../application/use-cases/health/livez";
import ReadyzUseCase from "../application/use-cases/health/readyz";
import HealthHandler from "../infrastructure/grpc/handlers/health.handler";
import GrpcService from "../infrastructure/grpc/service";
import {grpcConfig as grpcConfig} from "../infrastructure/grpc/config";
import Application from "../application/application";
import MessageService from "../infrastructure/message/service";
import JobService from "../infrastructure/job/service";
import DbService from "../infrastructure/db/service";
import {messageConfig,
    messageConsumersConfig,
    messageProducersConfig
} from "../infrastructure/message/config";
import jobConfig from "../infrastructure/job/config";
import PrismaBattleRepository from "../infrastructure/db/repositories/prisma-battle.repository";
import GetUseCase from "../application/use-cases/battle/get";
import GetActiveByProfileUseCase from "../application/use-cases/battle/get-active-by-profile";
import StartUseCase from "../application/use-cases/battle/start";
import BattleHandler from "../infrastructure/grpc/handlers/battle.handler";
import BattleUpdatedConsumer from "../infrastructure/message/consumers/battle-updated";
import UpdateUseCase from "../application/use-cases/battle/update";
// import {appConfig as authConfig} from "../infrastructure/auth/appConfig";
// import AuthService from "../infrastructure/auth/service";


function buildApplication() {

    const jobService = new JobService(jobConfig, messageConfig, messageProducersConfig)

    const dbService = new DbService();

    // const authService = new AuthService(authConfig);

    const battleRepository = new PrismaBattleRepository(dbService.client);

    const updateUseCase = new UpdateUseCase(battleRepository);
    const battleUpdatedConsumer = new BattleUpdatedConsumer(updateUseCase);
    const messageService = new MessageService(messageConfig, messageConsumersConfig, battleUpdatedConsumer);

    const getUseCase = new GetUseCase(battleRepository);
    const getActiveByProfileUseCase = new GetActiveByProfileUseCase(battleRepository);
    const startUseCase = new StartUseCase(battleRepository, jobService, messageProducersConfig.battleStarted);

    const healthUseCase = new HealthUseCase(dbService, messageService, jobService);
    const statusUseCase = new StatusUseCase;
    const livezUseCase = new LivezUseCase;
    const readyzUseCase = new ReadyzUseCase;

    const battleHandler = new BattleHandler(
        getUseCase,
        getActiveByProfileUseCase,
        startUseCase,
    );

    const healthHandler = new HealthHandler(healthUseCase, statusUseCase, livezUseCase, readyzUseCase);

    const grpcService = new GrpcService(grpcConfig.port, battleHandler, healthHandler);

    return new Application(grpcService, dbService, jobService, messageService);
}


export default buildApplication;
