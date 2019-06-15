import {createPlayer} from "../../../../player/factory/factory"
import {CreationMessages} from "../../constants"
import Request from "../../request"
import Response from "../../response"
import CreationService from "../../service/creationService"
import AuthStep from "../authStep"
import Password from "../createPlayer/password"
import Email from "./email"

export default class NewPlayerConfirm implements AuthStep {
  constructor(private readonly authService: CreationService, private readonly email: string) {}

  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.Player.Confirm
  }

  public async processRequest(request: Request): Promise<Response> {
    if (request.didDeny()) {
      return request.ok(new Email(this.authService))
    } else if (request.didConfirm()) {
      const player = createPlayer()
      player.email = this.email
      return request.ok(new Password(this.authService, player))
    }

    return request.fail(this, CreationMessages.All.ConfirmFailed)
  }
}
