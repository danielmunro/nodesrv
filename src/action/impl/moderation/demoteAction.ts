import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import {CheckType} from "../../../check/enum/checkType"
import {Mob} from "../../../mob/model/mob"
import MobService from "../../../mob/service/mobService"
import {getAuthorizationLevelName} from "../../../player/authorizationLevel"
import {getNextDemotion} from "../../../player/authorizationLevels"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import RequestService from "../../../request/requestService"
import Response from "../../../request/response"
import Maybe from "../../../support/functional/maybe"
import {format} from "../../../support/string"
import Action from "../../action"
import {MESSAGE_FAIL_CANNOT_DEMOTE_IMMORTALS, Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class DemoteAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    const mob = this.mobService.mobTable.find((m: Mob) => m.name === request.getSubject()) as Mob
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireMob()
      .capture()
      .requirePlayer(mob)
      .require(
        () => getNextDemotion(mob),
        format(Messages.Demote.Fail.NoMoreDemotions, mob.name),
        CheckType.AuthorizationLevel)
      .requireImmortal(request.getAuthorizationLevel())
      .not().requireImmortal(
        Maybe.if(mob, () => mob.getAuthorizationLevel()).get(),
        MESSAGE_FAIL_CANNOT_DEMOTE_IMMORTALS)
      .create()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const [ target, authorizationLevel ] = requestService.getResults(
      CheckType.HasTarget, CheckType.AuthorizationLevel)
    target.playerMob.authorizationLevel = authorizationLevel
    return requestService.respondWith().success(
    `You demoted ${target.name} to ${getAuthorizationLevelName(authorizationLevel)}.`)
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.PlayerMob ]
  }

  public getRequestType(): RequestType {
    return RequestType.Demote
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
