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
export default class UnlockAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.ItemService) private readonly itemService: ItemService) {
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
        (exit: ExitEntity) => exit.door.isLocked,
        ConditionMessages.Unlock.Fail.AlreadyUnlocked)
      .require(
        (exit: ExitEntity) =>
          this.itemService.getByCanonicalId(exit.door.unlockedByCanonicalId as any)
            .find((item: ItemEntity) => item.inventory === request.mob.inventory),
        ConditionMessages.Unlock.Fail.NoKey)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const exit = requestService.getResult<ExitEntity>()
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
