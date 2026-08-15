import jwt, {JwtPayload} from "jsonwebtoken";

import AccessToken from "../../domain/value-objects/access-token.vo";

import TokenService from "../../application/ports/token-service.port";
import Id from "../../domain/value-objects/id.vo";
import TokenPayload from "./interfaces/token-payload";
import AuthConfig from "./interfaces/auth-config";

export class AuthService implements TokenService {
    constructor(private readonly config: AuthConfig) {
    }

    verifyAccessToken(token: AccessToken): Id {
        const payload = this.payload(token.value, this.config.accessSecret);

        return new Id(payload.sub);
    }

    private payload(
        token: string,
        secret: jwt.Secret,
    ): TokenPayload {
        const payload = jwt.verify(token, secret) as TokenPayload;

        if (!payload.sub) {
            throw new Error("JWT payload missing sub");
        }

        return payload;
    }
}

export default AuthService;
