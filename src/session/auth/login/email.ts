import { findOneByEmail } from "../../../player/repository/player"
import { Request } from "../../../server/request/request"
import AuthStep from "../authStep"
import { MESSAGE_EMAIL } from "../constants"
import Password from "../login/password"
import NewPlayerConfirm from "./newPlayerConfirm"

export default class Email implements AuthStep {
  public getStepMessage(): string {
    return MESSAGE_EMAIL
  }

  public async processRequest(request: Request): Promise<any> {
    const email = request.command
    const player = await findOneByEmail(email)

    if (player) {
      return new Password(player)
    }

    return new NewPlayerConfirm(email)
  }
}
