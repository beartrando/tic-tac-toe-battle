import jwt, {JwtPayload} from "jsonwebtoken";
import config from "./config";

import AccessToken from "../../domain/value-objects/access-token.vo";

import TokenService from "../../application/ports/token-service.port";
import Id from "../../domain/value-objects/id.vo";


interface TokenPayload extends JwtPayload {
    sub: string;
}

export class AuthService implements TokenService {

    private readonly accessSecret: jwt.Secret = config.jwtAccessSecret;

    verifyAccessToken(
        token: AccessToken,
    ): Id {
        const payload = this.payload(token.value, this.accessSecret);

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
