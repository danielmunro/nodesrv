import {AffectType} from "../../affect/enum/affectType"
import AbilityService from "../../check/abilityService"
import Cost from "../../check/cost/cost"
import RequestService from "../../request/requestService"
import ResponseMessage from "../../request/responseMessage"
import {SpellType} from "../../spell/spellType"
import {Messages} from "../constants"
import {ActionType} from "../enum/actionType"
import {ApplyAbility, CheckComponentAdder} from "../impl/action"
import Spell from "../impl/spell"

export default class SpellBuilder {
  private helpText: string
  private actionType: ActionType
  private affectType: AffectType
  private spellType: SpellType
  private costs: Cost[]
  private checkBuilder: CheckComponentAdder
  private successMessage: (requestService: RequestService) => ResponseMessage
  private applySpell: ApplyAbility

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

  public addToCheckBuilder(checkBuilder: CheckComponentAdder): SpellBuilder {
    this.checkBuilder = checkBuilder
    return this
  }

  public setSuccessMessage(successMessage: (requestService: RequestService) => ResponseMessage): SpellBuilder {
    this.successMessage = successMessage
    return this
  }

  public setApplySpell(applySpell: ApplyAbility): SpellBuilder {
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
