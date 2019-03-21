import AffectBuilder from "../../../affect/affectBuilder"
import {AffectType} from "../../../affect/affectType"
import {Affect} from "../../../affect/model/affect"
import AbilityService from "../../../check/abilityService"
import CheckedRequest from "../../../check/checkedRequest"
import Cost from "../../../check/cost/cost"
import ResponseMessage from "../../../request/responseMessage"
import {SpellType} from "../../../spell/spellType"
import {Messages} from "../../constants"
import {ActionType} from "../../enum/actionType"
import AffectSpell from "./affectSpell"

export default class AffectSpellBuilder {
  private helpText: string
  private actionType: ActionType
  private affectType: AffectType
  private spellType: SpellType
  private costs: Cost[]
  private successMessage: (checkedRequest: CheckedRequest) => ResponseMessage
  private createAffect: (checkedRequest: CheckedRequest, affectBuilder: AffectBuilder) => Affect

  constructor(private readonly abilityService: AbilityService) {
    this.helpText = Messages.Help.NoActionHelpTextProvided
    this.createAffect = (_, affectBuilder) => affectBuilder.build()
  }

  public setAffectType(affectType: AffectType): AffectSpellBuilder {
    this.affectType = affectType
    return this
  }

  public setActionType(actionType: ActionType): AffectSpellBuilder {
    this.actionType = actionType
    return this
  }

  public setSpellType(spellType: SpellType): AffectSpellBuilder {
    this.spellType = spellType
    return this
  }

  public setCosts(costs: Cost[]): AffectSpellBuilder {
    this.costs = costs
    return this
  }

  public setSuccessMessage(successMessage: (checkedRequest: CheckedRequest) => ResponseMessage): AffectSpellBuilder {
    this.successMessage = successMessage
    return this
  }

  public setCreateAffect(
    createAffect: (checkedRequest: CheckedRequest, affectBuilder: AffectBuilder) => Affect): AffectSpellBuilder {
    this.createAffect = createAffect
    return this
  }

  public create(): AffectSpell {
    return new AffectSpell(
      this.abilityService,
      this.spellType,
      this.affectType,
      this.actionType,
      this.costs,
      this.successMessage,
      this.createAffect,
      this.helpText)
  }
}
