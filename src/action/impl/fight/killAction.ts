import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {CheckType} from "../../../check/checkType"
import EventService from "../../../event/eventService"
import {Disposition} from "../../../mob/enum/disposition"
import {Mob} from "../../../mob/model/mob"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import {ResponseStatus} from "../../../request/responseStatus"
import Action from "../../action"
import {MESSAGE_FAIL_CANNOT_ATTACK_SELF, MESSAGE_FAIL_KILL_ALREADY_FIGHTING, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class KillAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .requireFromActionParts(request, this.getActionParts())
      .capture()
      .require((target: Mob) => request.mob !== target, MESSAGE_FAIL_CANNOT_ATTACK_SELF)
      .not().requireFight(MESSAGE_FAIL_KILL_ALREADY_FIGHTING)
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const target = requestService.getResult(CheckType.HasTarget)
    const event = await this.eventService.publish(requestService.createAttackEvent(target))
    if (event.isSatisifed()) {
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

  public getRequestType(): RequestType {
    return RequestType.Kill
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
