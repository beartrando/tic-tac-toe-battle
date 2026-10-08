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
import BattleGetManyUseCase from "../application/use-cases/battle/battle-get-many";
import BattleTimeoutSweepUseCase from "../application/use-cases/battle/battle-timeout-sweep";
import { TimerService } from "@shared/timer";
import TimerCallbackFactoryHolder from "../infrastructure/timer/callback-factory-holder";
import BattleTimeoutCallbackFactory from "../infrastructure/timer/callbacks/battle-timeout-callback-factory";
import timeoutConfig from "../infrastructure/timer/config/config";


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
    const battleGetManyUseCase = new BattleGetManyUseCase(battleRepository);
    const battleInitUseCase = new BattleInitUseCase(battleRepository, jobService, messageProducersConfig.battleMatched);

    const battleTimeoutSweepUseCase = new BattleTimeoutSweepUseCase(
        battleRepository,
        jobService,
        messageProducersConfig.battleTimeout,
        timeoutConfig.statusTimeoutSeconds,
    );

    const battleTimeoutCallbackFactoryHolder = new TimerCallbackFactoryHolder<string>();

    const battleTimeoutTimerService = new TimerService<string, string>(
        battleTimeoutCallbackFactoryHolder,
        timeoutConfig.sweepSeconds,
    );

    const battleTimeoutCallbackFactory = new BattleTimeoutCallbackFactory(
        battleTimeoutSweepUseCase,
        battleTimeoutTimerService,
    );

    battleTimeoutCallbackFactoryHolder.factory = battleTimeoutCallbackFactory;

    const healthUseCase = new HealthUseCase(dbService, messageService, jobService);
    const statusUseCase = new StatusUseCase;
    const livezUseCase = new LivezUseCase;
    const readyzUseCase = new ReadyzUseCase;

    const battleHandler = new BattleHandler(
        battleGetUseCase,
        battleGetManyUseCase,
        battleInitUseCase,
    );

    const healthHandler = new HealthHandler(healthUseCase, statusUseCase, livezUseCase, readyzUseCase);

    const grpcService = new GrpcService(grpcConfig.port, battleHandler, healthHandler);

    return new Application(
        grpcService,
        dbService,
        jobService,
        messageService,
        battleTimeoutTimerService,
        timeoutConfig.sweepTimerKey,
    );
}


export default buildApplication;
