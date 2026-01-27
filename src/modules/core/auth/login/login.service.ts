import { UserService, UserUtils } from "@modules/core/user";
import { AuthTokenService } from "../auth.service";
import { AppError } from "@shared/utils/app-error";

export class LoginService {
  static basic = async (email: string, password: string) => {
    const user = await UserService.getByEmail(email);

    const matched = await UserUtils.comparePassword(
      password,
      user.passwordHash,
    );
    if (!matched) throw new AppError("Unauthorized.", 401);

    return [
      AuthTokenService.createToken("ACCESS")({ id: user.id }),
      AuthTokenService.createToken("REFRESH")({ id: user.id }),
    ];
  };
}
