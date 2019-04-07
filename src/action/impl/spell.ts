import AffectBuilder from "../../affect/affectBuilder"
import {AffectType} from "../../affect/affectType"
import {Affect} from "../../affect/model/affect"
import AbilityService from "../../check/abilityService"
import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import CheckedRequest from "../../check/checkedRequest"
import {CheckType} from "../../check/checkType"
import Cost from "../../check/cost/cost"
import {Request} from "../../request/request"
import {RequestType} from "../../request/requestType"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import {ResponseStatus} from "../../request/responseStatus"
import SkillEvent from "../../skill/skillEvent"
import {SpellType} from "../../spell/spellType"
import roll from "../../support/random/dice"
import Action from "../action"
import {Messages} from "../constants"
import {ActionPart} from "../enum/actionPart"
import {ActionType} from "../enum/actionType"

export default class Spell extends Action {
  constructor(
    protected readonly abilityService: AbilityService,
    protected readonly spellType: SpellType,
    protected readonly affectType: AffectType,
    protected readonly actionType: ActionType,
    protected readonly costs: Cost[],
    protected readonly successMessage: (checkedRequest: CheckedRequest) => ResponseMessage,
    protected readonly applySpell: (checkedRequest: CheckedRequest, affectBuilder: AffectBuilder) =>
      Promise<Affect | void>,
    protected readonly checkComponents: (request: Request, checkBuilder: CheckBuilder) => void,
    protected readonly helpText: string) {
    super()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    if (!this.roll(checkedRequest)) {
      await this.abilityService.publishEvent(
        new SkillEvent(checkedRequest.getCheckTypeResult(CheckType.HasSpell), checkedRequest.mob, false))
      return checkedRequest.responseWithMessage(
        ResponseStatus.ActionFailed,
        this.getFailureMessage(checkedRequest))
    }
    const affectType = this.getAffectType()
    const affect = await this.applySpell(checkedRequest, new AffectBuilder(affectType ? affectType : AffectType.Noop))
    if (affect && affect.affectType !== AffectType.Noop) {
      checkedRequest.getCheckTypeResult(CheckType.HasTarget).affect().add(affect)
    }
    await this.abilityService.publishEvent(
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
    const checkBuilder = this.abilityService.createCheckTemplate(request)
      .cast(this)
      .capture(this)
    if (this.checkComponents) {
      this.checkComponents(request, checkBuilder)
    }
    return checkBuilder.create()
  }

  public getFailureMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return new ResponseMessage(
      checkedRequest.mob,
      Messages.Cast.Fail)
  }

  public getActionType(): ActionType {
    return this.actionType
  }

  public getAffectType(): AffectType | undefined {
    return this.affectType
  }

  public getCosts(): Cost[] {
    return this.costs
  }

  public getHelpText(): string {
    return this.helpText
  }

  public getSpellType(): SpellType {
    return this.spellType
  }

  public getRequestType(): RequestType {
    return RequestType.Cast
  }

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return this.successMessage(checkedRequest)
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.Spell, ActionPart.Target]
  }
}
