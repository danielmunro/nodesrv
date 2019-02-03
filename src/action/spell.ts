import {AffectType} from "../affect/affectType"
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
    return roll(4, spell.level) > 25
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckTemplate(request)
      .cast(this)
      .create()
  }

  public getAffectType(): AffectType | undefined {
    return undefined
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    const spell = checkedRequest.getCheckTypeResult(CheckType.HasSpell)
    return new ResponseMessage(
      checkedRequest.mob,
      Messages.Cast.Success,
      { verb: "utter", spell: spell.spellType },
      { verb: "utters", spell: spell.spellType },
      { verb: "utters", spell: spell.spellType })
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

  protected getRequestType(): RequestType {
    return RequestType.Cast
  }
}
