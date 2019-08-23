import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {Types} from "../../../support/types"
import {Messages, Messages as ActionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class OwnedAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request).create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const room = requestService.getRoom()
    if (!room.isOwnable) {
      return requestService.respondWith()
        .success(ActionMessages.Owned.NotOwnable, { room: room.name })
    }

    if (!room.owner) {
      return requestService.respondWith()
        .success(ActionMessages.Owned.OwnableButNotOwned, { room: room.name })
    }

    return requestService.respondWith().success(
      ActionMessages.Owned.Info,
      { room: room.name, owner: room.owner })
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.ItemInInventory ]
  }

  public getRequestType(): RequestType {
    return RequestType.Owned
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
