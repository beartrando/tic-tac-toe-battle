import AnonymousSignInUseCase from "../application/use-cases/auth/anonymous-sign-in";
import GetMeUseCase from "../application/use-cases/auth/get-me";
import LogoutUseCase from "../application/use-cases/auth/logout";
import RefreshTokensUseCase from "../application/use-cases/auth/refresh-tokens";
import HealthUseCase from "../application/use-cases/health/health";
import StatusUseCase from "../application/use-cases/health/status";
import LivezUseCase from "../application/use-cases/health/livez";
import ReadyzUseCase from "../application/use-cases/health/readyz";
import HealthHandler from "../infrastructure/grpc/handlers/health.handler";
import GrpcService from "../infrastructure/grpc/grpc.service";
import {config as grpcConfig} from "../infrastructure/grpc/config";
import Application from "../application/application";
import AuthService from "../infrastructure/auth/auth-service";
import PrismaDeviceRepository from "../infrastructure/db/repositories/prisma-device.repository";
import PrismaUserRepository from "../infrastructure/db/repositories/prisma-user.repository";
import PrismaSessionRepository from "../infrastructure/db/repositories/prisma-session.repository";
import GetUseCase from "../application/use-cases/auth/get";
import AuthHandler from "../infrastructure/grpc/handlers/auth.handler";
import MessageService from "../infrastructure/message/message.service";
import JobService from "../infrastructure/job/job.service";
import DbService from "../infrastructure/db/db.service";
import {config as kafkaConfig, kafkaProducersConfig} from "../infrastructure/message/config";


function buildApplication() {

    const messageService = new MessageService(kafkaConfig);
    const jobService = new JobService(kafkaConfig, kafkaProducersConfig)
    const dbService = new DbService();

    const authService = new AuthService();

    const deviceRepository = new PrismaDeviceRepository(dbService.client);
    const userRepository = new PrismaUserRepository(dbService.client);
    const sessionRepository = new PrismaSessionRepository(dbService.client);


    const anonymousSignInUseCase = new AnonymousSignInUseCase(
        userRepository,
        deviceRepository,
        sessionRepository,
        jobService,
        dbService,
        authService,
        kafkaProducersConfig.userCreated
    );
    const getUseCase = new GetUseCase(userRepository);
    const getMeUseCase = new GetMeUseCase(userRepository);
    const logoutUseCase = new LogoutUseCase(sessionRepository);
    const refreshTokensUseCase = new RefreshTokensUseCase(authService, sessionRepository);


    const healthUseCase = new HealthUseCase(dbService, messageService, jobService);
    const statusUseCase = new StatusUseCase;
    const livezUseCase = new LivezUseCase;
    const readyzUseCase = new ReadyzUseCase;

    const authHandler = new AuthHandler(
        anonymousSignInUseCase,
        refreshTokensUseCase,
        logoutUseCase,
        getMeUseCase,
        getUseCase,
        authService
    );

    const healthHandler = new HealthHandler(healthUseCase, statusUseCase, livezUseCase, readyzUseCase);

    const grpcService = new GrpcService(grpcConfig.port, authHandler, healthHandler);

    return new Application(grpcService, dbService, jobService, messageService);
}


export default buildApplication;
