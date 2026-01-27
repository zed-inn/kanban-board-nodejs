import { UserService } from "@modules/core/user";
import { AuthTokenService } from "../auth.service";
import { AppError } from "@shared/utils/app-error";

export class RegisterService {
  static basic = async (email: string, password: string) => {
    try {
      const user = await UserService.create(email, password);

      return [
        AuthTokenService.createToken("ACCESS")({ id: user.id }),
        AuthTokenService.createToken("REFRESH")({ id: user.id }),
      ];
    } catch (error) {
      throw new AppError("Email already used.", 400);
    }
  };
}
