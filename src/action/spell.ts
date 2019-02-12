import {AffectType} from "../affect/affectType"
import {newAffect} from "../affect/factory"
import Check from "../check/check"
import CheckBuilderFactory from "../check/checkBuilderFactory"
import CheckedRequest from "../check/checkedRequest"
import {CheckType} from "../check/checkType"
import Cost from "../check/cost/cost"
import EventService from "../event/eventService"
import SpecializationLevel from "../mob/specialization/specializationLevel"
import {SpecializationType} from "../mob/specialization/specializationType"
import roll from "../random/dice"
import {Request} from "../request/request"
import {RequestType} from "../request/requestType"
import Response from "../request/response"
import ResponseMessage from "../request/responseMessage"
import {ResponseStatus} from "../request/responseStatus"
import SkillEvent from "../skill/skillEvent"
import {SpellType} from "../spell/spellType"
import Action from "./action"
import {Messages} from "./constants"
import {ActionPart} from "./enum/actionPart"
import {ActionType} from "./enum/actionType"

export default abstract class Spell extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly eventService: EventService) {
    super()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    if (!this.roll(checkedRequest)) {
      await this.eventService.publish(
        new SkillEvent(checkedRequest.getCheckTypeResult(CheckType.HasSpell), checkedRequest.mob, false))
      return checkedRequest.responseWithMessage(
        ResponseStatus.ActionFailed,
        this.getFailureMessage(checkedRequest))
    }

    this.applySpell(checkedRequest)
    await this.eventService.publish(
      new SkillEvent(checkedRequest.getCheckTypeResult(CheckType.HasSpell), checkedRequest.mob, true))

    return checkedRequest.responseWithMessage(
      ResponseStatus.Success,
      this.getSuccessMessage(checkedRequest))
  }

  public roll(checkedRequest: CheckedRequest): boolean {
    const spell = checkedRequest.getCheckTypeResult(CheckType.HasSpell)
    return roll(4, spell.level) > spell.level * 2
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckTemplate(request)
      .cast(this)
      .create()
  }

  public getAffectType(): AffectType | undefined {
    return undefined
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return new ResponseMessage(
      checkedRequest.mob,
      Messages.Cast.Fail)
  }

  public abstract applySpell(checkedRequest: CheckedRequest): void
  public abstract getSpellType(): SpellType
  public abstract getSpecializationLevel(specializationType: SpecializationType): SpecializationLevel
  public abstract getCosts(): Cost[]
  public abstract getActionType(): ActionType
  public abstract getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage

  public getRequestType(): RequestType {
    return RequestType.Cast
  }

  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.Spell, ActionPart.Target]
  }

  protected applyAffectType(checkedRequest: CheckedRequest) {
    const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    target.addAffect(newAffect(this.getAffectType() as AffectType, checkedRequest.mob.level))
  }
}
