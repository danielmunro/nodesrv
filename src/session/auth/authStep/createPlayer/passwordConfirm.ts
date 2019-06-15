import { PlayerEntity } from "../../../../player/entity/playerEntity"
import {CreationMessages} from "../../constants"
import Request from "../../request"
import Response from "../../response"
import CreationService from "../../service/creationService"
import AuthStep from "../authStep"
import PlayerAuthStep from "../playerAuthStep"
import Complete from "./complete"
import Password from "./password"

export default class PasswordConfirm extends PlayerAuthStep implements AuthStep {
  constructor(authService: CreationService, player: PlayerEntity, public readonly firstPassword: string) {
    super(authService, player)
  }

  /* istanbul ignore next */
  public getStepMessage(): string {
    return CreationMessages.Player.PasswordConfirm
  }

  public async processRequest(request: Request): Promise<Response> {
    const confirmPassword = request.input

    if (confirmPassword !== this.firstPassword) {
      return request.fail(new Password(this.creationService, this.player), CreationMessages.Player.PasswordMismatch)
    }

    this.player.setPassword(confirmPassword)

    return request.ok(new Complete(this.creationService, this.player))
  }
}
