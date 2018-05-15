import { findPlayerMobByName } from "../../mob/repository/mob"
import { Request } from "../../server/request/request"
import AuthStep from "./authStep"
import { MESSAGE_NAME } from "./constants"
import NewMobConfirm from "./creation/newMobConfirm"
import Password from "./login/password"

export default class Name implements AuthStep {
  public getStepMessage(): string {
    return MESSAGE_NAME
  }

  public async processRequest(request: Request): Promise<any> {
    const name = request.command
    const mob = await findPlayerMobByName(name)

    if (mob) {
      return new Password(mob)
    }

    return new NewMobConfirm(name)
  }
}
