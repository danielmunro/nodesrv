import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {Item} from "../../../item/model/item"
import ItemService from "../../../item/service/itemService"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {Exit} from "../../../room/model/exit"
import match from "../../../support/matcher/match"
import {Messages} from "../../constants"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class LockAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly itemService: ItemService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(
        request.getSubject(),
        ConditionMessages.All.Arguments.Lock,
        CheckType.HasArguments)
      .require(
        request.getRoomExits().find(exit => exit.door && match(exit.door.name, request.getSubject())),
        ConditionMessages.All.Item.NotFound,
        CheckType.HasTarget)
      .capture()
      .require(
        (exit: Exit) => !exit.door.isLocked,
        ConditionMessages.Lock.Fail.AlreadyLocked)
      .require(
        (exit: Exit) =>
          this.itemService.getByCanonicalId(exit.door.unlockedByCanonicalId)
            .find((item: Item) => item.inventory === request.mob.inventory),
        ConditionMessages.Lock.Fail.NoKey)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const exit = requestService.getResult()
    exit.door.isLocked = true

    return requestService.respondWith().success(
      Messages.Lock.Success, {
        direction: exit.direction,
        door: exit.door.name,
        lockVerb: "lock",
      }, {
        direction: exit.direction,
        door: exit.door.name,
        lockVerb: "locks",
      })
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Thing ]
  }

  public getRequestType(): RequestType {
    return RequestType.Lock
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
