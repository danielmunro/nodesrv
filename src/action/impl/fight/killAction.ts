import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import EventService from "../../../event/service/eventService"
import {RequestType} from "../../../messageExchange/enum/requestType"
import {ResponseStatus} from "../../../messageExchange/enum/responseStatus"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {Disposition} from "../../../mob/enum/disposition"
import {Types} from "../../../support/types"
import {
  ConditionMessages,
  Messages,
} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import SimpleAction from "../simpleAction"

@injectable()
export default class KillAction extends SimpleAction {
  constructor(
    @inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.EventService) private readonly eventService: EventService) {
    super(checkBuilderFactory, RequestType.Kill)
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .requireFromActionParts(this.getActionParts())
      .capture()
      .require((target: MobEntity) => request.mob !== target, ConditionMessages.All.Mob.CannotAttackSelf)
      .not().requireFight(ConditionMessages.All.Mob.Fighting)
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const target = requestService.getResult<MobEntity>(CheckType.HasTarget)
    const event = await this.eventService.publish(requestService.createAttackEvent(target))
    if (event.isSatisfied()) {
      return requestService.respondWith().response(ResponseStatus.ActionFailed, event.context)
    }

    return requestService.respondWith().success(
      Messages.Kill.Success,
      { screamVerb: "scream", attackVerb: "attack", target },
      { screamVerb: "screams", attackVerb: "attacks", target: "you" },
      { screamVerb: "screams", attackVerb: "attacks", target })
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Hostile ]
  }
}
