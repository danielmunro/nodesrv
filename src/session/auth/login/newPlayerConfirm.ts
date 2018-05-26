import { Player } from "../../../player/model/player"
import AuthStep from "../authStep"
import { MESSAGE_NEW_PLAYER_CONFIRM, MESSAGE_YN_FAILED } from "../constants"
import Password from "../createPlayer/password"
import Request from "../request"
import Response from "../response"
import Email from "./email"

export default class NewPlayerConfirm implements AuthStep {
  public readonly email: string

  constructor(email: string) {
    this.email = email
  }

  public getStepMessage(): string {
    return MESSAGE_NEW_PLAYER_CONFIRM
  }

  public async processRequest(request: Request): Promise<Response> {
    if (request.didDeny()) {
      return request.ok(new Email())
    } else if (request.didConfirm()) {
      const player = new Player()
      player.email = this.email
      return request.ok(new Password(player))
    }

    return request.fail(this, MESSAGE_YN_FAILED)
  }
}
