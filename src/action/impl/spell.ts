import AffectBuilder from "../../affect/builder/affectBuilder"
import {AffectType} from "../../affect/enum/affectType"
import {Affect} from "../../affect/model/affect"
import AbilityService from "../../check/abilityService"
import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
import Cost from "../../check/cost/cost"
import {CheckType} from "../../check/enum/checkType"
import {createSkillEvent} from "../../event/factory"
import {Mob} from "../../mob/model/mob"
import {RequestType} from "../../request/enum/requestType"
import {ResponseStatus} from "../../request/enum/responseStatus"
import Request from "../../request/request"
import RequestService from "../../request/requestService"
import Response from "../../request/response"
import ResponseMessage from "../../request/responseMessage"
import {SpellType} from "../../spell/spellType"
import roll from "../../support/random/dice"
import {Messages} from "../constants"
import {ActionPart} from "../enum/actionPart"
import {ActionType} from "../enum/actionType"
import Action from "./action"

export default class Spell extends Action {
  constructor(
    protected readonly abilityService: AbilityService,
    protected readonly spellType: SpellType,
    protected readonly affectType: AffectType,
    protected readonly actionType: ActionType,
    protected readonly costs: Cost[],
    protected readonly successMessage: (requestService: RequestService) => ResponseMessage,
    protected readonly applySpell: (requestService: RequestService, affectBuilder: AffectBuilder) =>
      Promise<Affect | void>,
    protected readonly checkComponents: (request: Request, checkBuilder: CheckBuilder) => void,
    protected readonly helpText: string) {
    super()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const spell = requestService.getResult(CheckType.HasSpell)
    if (!this.roll(spell.level)) {
      await this.abilityService.publishEvent(
        createSkillEvent(spell, requestService.getMob(), false))
      return requestService.respondWith().response(
        ResponseStatus.ActionFailed,
        this.getFailureMessage(requestService.getMob()))
    }
    const affectType = this.getAffectType()
    const affect = await this.applySpell(requestService, new AffectBuilder(affectType ? affectType : AffectType.Noop))
    if (affect && affect.affectType !== AffectType.Noop) {
      requestService.getResult(CheckType.HasTarget).affect().add(affect)
    }
    await this.abilityService.publishEvent(
      createSkillEvent(spell, requestService.getMob(), true))
    return requestService.respondWith().response(
      ResponseStatus.Success,
      this.getSuccessMessage(requestService))
  }

  public roll(spellLevel: number): boolean {
    return roll(4, spellLevel) > spellLevel * 2
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

  public getFailureMessage(mob: Mob): ResponseMessage {
    return new ResponseMessage(mob, Messages.Cast.Fail)
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

  public getSuccessMessage(requestService: RequestService): ResponseMessage {
    return this.successMessage(requestService)
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ActionPart.Action, ActionPart.Spell, ActionPart.Target]
  }
}
