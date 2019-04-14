import AffectBuilder from "../../affect/affectBuilder"
import {AffectType} from "../../affect/affectType"
import {Affect} from "../../affect/model/affect"
import AbilityService from "../../check/abilityService"
import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import CheckedRequest from "../../check/checkedRequest"
import {CheckType} from "../../check/checkType"
import Cost from "../../check/cost/cost"
import AttackEvent from "../../mob/event/attackEvent"
import TouchEvent from "../../mob/event/touchEvent"
import {Request} from "../../request/request"
import {RequestType} from "../../request/requestType"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import {ResponseStatus} from "../../request/responseStatus"
import SkillEvent from "../../skill/skillEvent"
import {SkillType} from "../../skill/skillType"
import Action from "../action"
import {ActionPart} from "../enum/actionPart"
import {ActionType} from "../enum/actionType"

export default class Skill extends Action {
  constructor(
    protected readonly abilityService: AbilityService,
    protected readonly requestType: RequestType,
    protected readonly skillType: SkillType,
    protected readonly affectType: AffectType,
    protected readonly actionType: ActionType,
    protected readonly actionParts: ActionPart[],
    protected readonly costs: Cost[],
    protected readonly roll: (checkedRequest: CheckedRequest) => boolean,
    protected readonly successMessage: (checkedRequest: CheckedRequest) => ResponseMessage,
    protected readonly failureMessage: (checkedRequest: CheckedRequest) => ResponseMessage,
    protected readonly applySkill: (checkedRequest: CheckedRequest, affectBuilder: AffectBuilder) =>
      Promise<Affect | void>,
    protected readonly checkComponents: (request: Request, checkBuilder: CheckBuilder) => void,
    protected readonly touchesTarget: boolean,
    protected readonly helpText: string) {
    super()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const rollResultInitial = this.roll(checkedRequest)
    const eventResponse = await this.publishSkillEventFromCheckedRequest(checkedRequest, rollResultInitial)
    if (!(eventResponse.event as SkillEvent).rollResult) {
      return checkedRequest.responseWithMessage(
        ResponseStatus.ActionFailed,
        this.getFailureMessage(checkedRequest))
    }
    if (this.touchesTarget) {
      const touchEventResponse = await this.abilityService.publishEvent(
        new TouchEvent(checkedRequest.mob, checkedRequest.getTarget()))
      if (touchEventResponse.isSatisifed()) {
        return new Response(
          checkedRequest,
          ResponseStatus.ActionFailed,
          touchEventResponse.context)
      }
    }
    const affect = await this.applySkill(
      checkedRequest,
      new AffectBuilder(this.affectType)
        .setLevel(checkedRequest.mob.level))
    const checkTarget = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    if (affect) {
      const target = checkTarget || checkedRequest.mob
      target.affect().add(affect)
    }
    if (this.actionType === ActionType.Offensive) {
      await this.abilityService.publishEvent(new AttackEvent(checkedRequest.mob, checkTarget))
    }
    return checkedRequest.responseWithMessage(
      ResponseStatus.Success,
      this.successMessage(checkedRequest))
  }

  public check(request: Request): Promise<Check> {
    const checkBuilder = this.abilityService.createCheckTemplate(request)
      .perform(this)
      .requireFromActionParts(request, this.getActionParts())
    if (this.checkComponents) {
      this.checkComponents(request, checkBuilder)
    }
    return checkBuilder.create()
  }

  public getAffectType(): AffectType {
    return this.affectType
  }

  public getSkillType(): SkillType {
    return this.skillType
  }

  public getCosts(): Cost[] {
    return this.costs
  }

  public getActionType(): ActionType {
    return this.actionType
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return this.failureMessage(checkedRequest)
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return this.successMessage(checkedRequest)
  }

  public getHelpText(): string {
    return this.helpText
  }

  public getRequestType(): RequestType {
    return this.requestType
  }

  public getActionParts(): ActionPart[] {
    return this.actionParts
  }

  private publishSkillEventFromCheckedRequest(checkedRequest: CheckedRequest, rollResult: boolean) {
    return this.abilityService.publishEvent(
      new SkillEvent(checkedRequest.getCheckTypeResult(CheckType.HasSkill), checkedRequest.mob, rollResult))
  }
}
