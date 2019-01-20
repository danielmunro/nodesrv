import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import EventService from "../../../event/eventService"
import {EventType} from "../../../event/eventType"
import MobEvent from "../../../mob/event/mobEvent"
import {Mob} from "../../../mob/model/mob"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {MESSAGE_FAIL_CANNOT_ATTACK_SELF, MESSAGE_FAIL_KILL_ALREADY_FIGHTING, Messages} from "../../constants"
import {
  MESSAGE_FAIL_KILL_NO_TARGET,
} from "../../constants"

export default class KillAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const target = request.getTarget() as Mob
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireMob(MESSAGE_FAIL_KILL_NO_TARGET)
      .capture()
      .require(request.mob !== target, MESSAGE_FAIL_CANNOT_ATTACK_SELF)
      .not().requireFight(MESSAGE_FAIL_KILL_ALREADY_FIGHTING)
      .create()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const request = checkedRequest.request
    await this.eventService.publish(new MobEvent(EventType.Attack, request.mob, request.getTarget()))

    return checkedRequest.respondWith().success(
      Messages.Kill.Success,
      { screamVerb: "scream", attackVerb: "attack", target: request.getTarget() },
      { screamVerb: "screams", attackVerb: "attacks", target: "you" },
      { screamVerb: "screams", attackVerb: "attacks", target: request.getTarget() })
  }

  protected getRequestType(): RequestType {
    return RequestType.Kill
  }
}
