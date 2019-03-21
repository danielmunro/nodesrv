import AffectBuilder from "../../../affect/affectBuilder"
import {AffectType} from "../../../affect/affectType"
import {Affect} from "../../../affect/model/affect"
import AbilityService from "../../../check/abilityService"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import Cost from "../../../check/cost/cost"
import ResponseMessage from "../../../request/responseMessage"
import {SpellType} from "../../../spell/spellType"
import {ActionType} from "../../enum/actionType"
import Spell from "../../spell"

export default class AffectSpell extends Spell {
  constructor(
    abilityService: AbilityService,
    private readonly spellType: SpellType,
    private readonly affectType: AffectType,
    private readonly actionType: ActionType,
    private readonly costs: Cost[],
    private readonly successMessage: (checkedRequest: CheckedRequest) => ResponseMessage,
    private readonly createAffect: (checkedRequest: CheckedRequest, affectBuilder: AffectBuilder) => Affect,
    private readonly helpText: string) {
    super(abilityService)
  }

  public applySpell(checkedRequest: CheckedRequest): void {
    checkedRequest
      .getCheckTypeResult(CheckType.HasTarget)
      .addAffect(
        this.createAffect(
          checkedRequest,
          new AffectBuilder(this.affectType).setLevel(checkedRequest.mob.level)))
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

  public getSuccessMessage(checkedRequest: CheckedRequest): ResponseMessage {
    return this.successMessage(checkedRequest)
  }
}
