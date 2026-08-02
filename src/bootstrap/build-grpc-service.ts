import DbService from "../infrastructure/db/db.service";
import MessageService from "../infrastructure/message/message.service";
import JobService from "../infrastructure/job/job.service";
import AuthService from "../infrastructure/auth/auth-service";
import PrismaProfileRepository from "../infrastructure/db/repositories/prisma-profile.repository";
import GetUseCase from "../application/use-cases/profile/get";
import GetMeUseCase from "../application/use-cases/profile/get-me";
import HealthUseCase from "../application/use-cases/health/health";
import StatusUseCase from "../application/use-cases/health/status";
import LivezUseCase from "../application/use-cases/health/livez";
import ReadyzUseCase from "../application/use-cases/health/readyz";
import ProfileHandler from "../infrastructure/grpc/handlers/profile.handler";
import HealthHandler from "../infrastructure/grpc/handlers/health.handler";
import GrpcService from "../infrastructure/grpc/grpc.service";
import {config as grpcConfig} from "../infrastructure/grpc/config";
import GetOrCreateUseCase from "../application/use-cases/profile/get-or-create";
import GetByUserUseCase from "../application/use-cases/profile/get-by-user";
import {kafkaProducersConfig} from "../infrastructure/message/config";


function buildGrpcService(dbService: DbService, messageService: MessageService, jobService: JobService) {

    const authService = new AuthService();

    const profileRepository = new PrismaProfileRepository(dbService.client);

    const getOrCreate = new GetOrCreateUseCase(profileRepository, jobService, kafkaProducersConfig.profileCreated);
    const getUseCase = new GetUseCase(profileRepository);
    const getByUserUseCase = new GetByUserUseCase(profileRepository);
    const getMeUseCase = new GetMeUseCase(profileRepository);

    const healthUseCase = new HealthUseCase(dbService, messageService, jobService);
    const statusUseCase = new StatusUseCase;
    const livezUseCase = new LivezUseCase;
    const readyzUseCase = new ReadyzUseCase;

    const profileHandler = new ProfileHandler(authService, getOrCreate, getByUserUseCase, getMeUseCase, getUseCase);
    const healthHandler = new HealthHandler(healthUseCase, statusUseCase, livezUseCase, readyzUseCase);

    return new GrpcService(grpcConfig.port, profileHandler, healthHandler);
}


export default buildGrpcService;
