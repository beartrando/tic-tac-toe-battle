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
import jobConfig from "../infrastructure/job/config";
import PrismaBattleRepository from "../infrastructure/db/repositories/prisma-battle.repository";
import BattleGetUseCase from "../application/use-cases/battle/battle-get";
import BattleGetUnfinishedByProfileUseCase from "../application/use-cases/battle/battle-get-unfinished-by-profile";
import BattleInitUseCase from "../application/use-cases/battle/battle-init";
import BattleHandler from "../infrastructure/grpc/handlers/battle.handler";
import BattleUpdatedConsumer from "../infrastructure/message/consumers/battle-updated";
import BattleUpdateUseCase from "../application/use-cases/battle/battle-update";
import messageConfig from "../infrastructure/message/configs/message.config";
import messageProducersConfig from "../infrastructure/message/configs/producers.config";
import messageConsumersConfig from "../infrastructure/message/configs/consumers.config";
import AuthService from "../infrastructure/auth/service";
import authConfig from "../infrastructure/auth/config";
import BattleTerminatedConsumer from "../infrastructure/message/consumers/battle-terminated";
import BattleTerminateUseCase from "../application/use-cases/battle/battle-terminate";
import logger from "@shared/logger";


function buildApplication() {

    const jobService = new JobService(jobConfig, messageConfig, messageProducersConfig)

    const dbService = new DbService();

    const authService = new AuthService(authConfig);

    const battleRepository = new PrismaBattleRepository(dbService.client);

    const updateUseCase = new BattleUpdateUseCase(battleRepository);
    const battleTerminateUseCase = new BattleTerminateUseCase(battleRepository);
    const battleUpdatedConsumer = new BattleUpdatedConsumer(updateUseCase);
    const battleTerminatedConsumer = new BattleTerminatedConsumer(battleTerminateUseCase);
    const messageService = new MessageService(messageConfig);

    messageService.addConsumer(
        messageConsumersConfig.battleUpdated,
        battleUpdatedConsumer.execute.bind(battleUpdatedConsumer)
    );

    messageService.addConsumer(
        messageConsumersConfig.battleTerminated,
        battleTerminatedConsumer.execute.bind(battleTerminatedConsumer)
    );

    const battleGetUseCase = new BattleGetUseCase(battleRepository);
    const battleGetUnfinishedByProfileUseCase = new BattleGetUnfinishedByProfileUseCase(battleRepository);
    const battleCreateUseCase = new BattleInitUseCase(battleRepository, jobService, messageProducersConfig.battleMatched);

    const healthUseCase = new HealthUseCase(dbService, messageService, jobService);
    const statusUseCase = new StatusUseCase;
    const livezUseCase = new LivezUseCase;
    const readyzUseCase = new ReadyzUseCase;

    const battleHandler = new BattleHandler(
        battleGetUseCase,
        battleGetUnfinishedByProfileUseCase,
        battleCreateUseCase,
    );

    const healthHandler = new HealthHandler(healthUseCase, statusUseCase, livezUseCase, readyzUseCase);

    const grpcService = new GrpcService(grpcConfig.port, battleHandler, healthHandler);

    return new Application(grpcService, dbService, jobService, messageService);
}


export default buildApplication;


