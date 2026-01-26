import { UserService } from "@modules/core/user";
import { AuthTokenService } from "../auth.service";

export class RegisterService {
  static basic = async (email: string, password: string) => {
    const user = await UserService.create(email, password);
    if (!user) throw new Error("Email already used.");

    return [
      AuthTokenService.createToken("ACCESS")({ id: user.id }),
      AuthTokenService.createToken("REFRESH")({ id: user.id }),
    ];
  };
}
