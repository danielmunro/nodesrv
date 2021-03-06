import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {ItemEntity} from "../../../item/entity/itemEntity"
import ItemService from "../../../item/service/itemService"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {ExitEntity} from "../../../room/entity/exitEntity"
import match from "../../../support/matcher/match"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import {ConditionMessages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class LockAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.ItemService) private readonly itemService: ItemService) {
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
        (exit: ExitEntity) => !exit.door.isLocked,
        ConditionMessages.Lock.Fail.AlreadyLocked)
      .require(
        (exit: ExitEntity) =>
          this.itemService.getByCanonicalId(exit.door.unlockedByCanonicalId as any)
            .find((item: ItemEntity) => item.inventory === request.mob.inventory),
        ConditionMessages.Lock.Fail.NoKey)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const exit = requestService.getResult<ExitEntity>()
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
