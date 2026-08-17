import Id from "../../domain/common/value-objects/id.vo";
import AccessToken from "../../domain/common/value-objects/access-token.vo";

export interface TokenService {
    verifyAccessToken(
        token: AccessToken,
    ): Id;
}

export default TokenService;
