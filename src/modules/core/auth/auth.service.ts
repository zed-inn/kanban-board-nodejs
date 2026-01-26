import { TokenService } from "@shared/services/token.service";
import { AccessTokenDto, RefreshTokenDto } from "./dtos/auth-service.dto";

export const AuthTokenService = new TokenService<
  AccessTokenDto,
  RefreshTokenDto
>();
