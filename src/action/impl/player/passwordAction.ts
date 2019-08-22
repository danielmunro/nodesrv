import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import PlayerService from "../../../player/service/playerService"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export const minPasswordLength = 12

@injectable()
export default class PasswordAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.PlayerService) private readonly playerService: PlayerService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const password1 = request.getWord(1)
    const password2 = request.getWord(2)
    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(password1 === password2, Messages.Password.MustMatch)
      .require(password1.length > minPasswordLength, Messages.Password.TooShort)
      .capture(password1)
      .create()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Password, ActionPart.Password ]
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.Password
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const player = requestService.getMob().player
    const password: string = requestService.getResult()
    player.setPassword(password)
    await this.playerService.save(player)
    return requestService.respondWith().success(Messages.Password.Success)
  }
}
