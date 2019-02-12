import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import ItemService from "../../../item/itemService"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {Exit} from "../../../room/model/exit"
import match from "../../../support/matcher/match"
import Action from "../../action"
import {Messages} from "../../constants"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

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
        request.room.exits.find(exit => exit.door && match(exit.door.name, request.getSubject())),
        ConditionMessages.All.Item.NotFound,
        CheckType.HasTarget)
      .capture()
      .require(
        exit => !exit.door.isLocked,
        ConditionMessages.Lock.Fail.AlreadyLocked)
      .require(
        exit =>
          this.itemService.getByCanonicalId(exit.door.unlockedByCanonicalId)
            .find(item => item.inventory === request.mob.inventory),
        ConditionMessages.Lock.Fail.NoKey)
      .create()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const exit = checkedRequest.getCheckTypeResult(CheckType.HasTarget) as Exit
    exit.door.isLocked = true

    return checkedRequest.respondWith().success(
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

  protected getRequestType(): RequestType {
    return RequestType.Lock
  }
}
