import { UserService, UserUtils } from "@modules/core/user";
import { AuthTokenService } from "../auth.service";

export class LoginService {
  static basic = async (email: string, password: string) => {
    const user = await UserService.getByEmail(email);
    if (!user) throw new Error("No user found.");

    const matched = await UserUtils.comparePassword(
      password,
      user.passwordHash,
    );
    if (!matched) throw new Error("Wrong password.");

    return [
      AuthTokenService.createToken("ACCESS")({ id: user.id }),
      AuthTokenService.createToken("REFRESH")({ id: user.id }),
    ];
  };
}
