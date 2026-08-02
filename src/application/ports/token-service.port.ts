import Id from "../../domain/value-objects/id.vo";
import AccessToken from "../../domain/value-objects/access-token.vo";

export interface TokenService {
    verifyAccessToken(
        token: AccessToken,
    ): Id;
}

export default TokenService;
