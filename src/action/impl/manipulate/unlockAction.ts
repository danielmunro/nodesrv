import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {CheckType} from "../../../check/enum/checkType"
import ItemService from "../../../item/itemService"
import {Item} from "../../../item/model/item"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {Exit} from "../../../room/model/exit"
import match from "../../../support/matcher/match"
import Action from "../../action"
import {Messages} from "../../constants"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class UnlockAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly itemService: ItemService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .require(
        request.getSubject(),
        ConditionMessages.All.Arguments.Unlock,
        CheckType.HasArguments)
      .require(
        request.getRoomExits().find(exit => exit.door && match(exit.door.name, request.getSubject())),
        ConditionMessages.Unlock.Fail.NotFound,
        CheckType.HasTarget)
      .capture()
      .require(
        (exit: Exit) => exit.door.isLocked,
        ConditionMessages.Unlock.Fail.AlreadyUnlocked)
      .require(
        (exit: Exit) =>
          this.itemService.getByCanonicalId(exit.door.unlockedByCanonicalId as any)
            .find((item: Item) => item.inventory === request.mob.inventory),
        ConditionMessages.Unlock.Fail.NoKey)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const exit = requestService.getResult()
    exit.door.isLocked = false

    return requestService.respondWith().success(
      Messages.Unlock.Success, {
        direction: exit.direction,
        door: exit.door.name,
        unlockVerb: "unlock",
      }, {
        direction: exit.direction,
        door: exit.door.name,
        unlockVerb: "unlocks",
      })
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Thing ]
  }

  public getRequestType(): RequestType {
    return RequestType.Unlock
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
