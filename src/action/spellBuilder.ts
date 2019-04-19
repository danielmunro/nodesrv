import AffectBuilder from "../affect/affectBuilder"
import {AffectType} from "../affect/affectType"
import {Affect} from "../affect/model/affect"
import AbilityService from "../check/abilityService"
import CheckBuilder from "../check/checkBuilder"
import Cost from "../check/cost/cost"
import Request from "../request/request"
import RequestService from "../request/requestService"
import ResponseMessage from "../request/responseMessage"
import {SpellType} from "../spell/spellType"
import {Messages} from "./constants"
import {ActionType} from "./enum/actionType"
import Spell from "./impl/spell"

export default class SpellBuilder {
  private helpText: string
  private actionType: ActionType
  private affectType: AffectType
  private spellType: SpellType
  private costs: Cost[]
  private checkBuilder: (request: Request, checkBuilder: CheckBuilder) => void
  private successMessage: (requestService: RequestService) => ResponseMessage
  private applySpell: (requestService: RequestService, affectBuilder: AffectBuilder) => Promise<Affect | void>

  constructor(private readonly abilityService: AbilityService) {
    this.helpText = Messages.Help.NoActionHelpTextProvided
    this.applySpell = (_, affectBuilder) => Promise.resolve(affectBuilder ? affectBuilder.build() : undefined)
  }

  public setAffectType(affectType: AffectType): SpellBuilder {
    this.affectType = affectType
    return this
  }

  public setActionType(actionType: ActionType): SpellBuilder {
    this.actionType = actionType
    return this
  }

  public setSpellType(spellType: SpellType): SpellBuilder {
    this.spellType = spellType
    return this
  }

  public setCosts(costs: Cost[]): SpellBuilder {
    this.costs = costs
    return this
  }

  public addToCheckBuilder(checkBuilder: (request: Request, checkBuilder: CheckBuilder) => void): SpellBuilder {
    this.checkBuilder = checkBuilder
    return this
  }

  public setSuccessMessage(successMessage: (requestService: RequestService) => ResponseMessage): SpellBuilder {
    this.successMessage = successMessage
    return this
  }

  public setApplySpell(
    applySpell: (requestService: RequestService, affectBuilder: AffectBuilder) =>
      Promise<Affect | void>): SpellBuilder {
    this.applySpell = applySpell
    return this
  }

  public create(): Spell {
    return new Spell(
      this.abilityService,
      this.spellType,
      this.affectType,
      this.actionType,
      this.costs,
      this.successMessage,
      this.applySpell,
      this.checkBuilder,
      this.helpText)
  }
}
