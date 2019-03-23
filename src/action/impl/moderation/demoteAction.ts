import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import MobService from "../../../mob/mobService"
import {Mob} from "../../../mob/model/mob"
import {getAuthorizationLevelName} from "../../../player/authorizationLevel"
import {getNextDemotion} from "../../../player/authorizationLevels"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
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

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const target = checkedRequest.check.result
    const authorizationLevel = checkedRequest.getCheckTypeResult(CheckType.AuthorizationLevel)
    const responseBuilder = checkedRequest.request.respondWith()

    target.playerMob.authorizationLevel = authorizationLevel
    return responseBuilder.success(
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
