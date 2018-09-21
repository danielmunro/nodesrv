import { ActionType } from "../action/actionType"
import { DamageType } from "../damage/damageType"
import { addFight, Fight, getFights } from "../mob/fight/fight"
import { Check } from "./check"
import { SpellType } from "./spellType"

const DELAY_SUCCESS = 2
const DELAY_FAILURE = 1

export class SpellDefinition {
  private static addDelayToPlayer(check: Check): void {
    if (check.isSuccessful()) {
      check.request.player.delay += DELAY_SUCCESS
      return
    }

    check.request.player.delay += DELAY_FAILURE
  }

  public readonly spellType: SpellType
  public readonly level: number
  public readonly actionType: ActionType
  public readonly damageType: DamageType
  public readonly manaCost: number
  public readonly cast: (check: Check) => void

  constructor(
    spellType: SpellType,
    level: number,
    actionType: ActionType,
    manaCost: number,
    cast: (check: Check) => void,
    damageType: DamageType = null,
  ) {
    this.spellType = spellType
    this.level = level
    this.actionType = actionType
    this.manaCost = manaCost
    this.cast = cast
    this.damageType = damageType
  }

  public apply(check: Check) {
    check.applyManaCost()
    SpellDefinition.addDelayToPlayer(check)
    this.checkForNewFight(check)

    if (check.isSuccessful()) {
      this.cast(check)
    }
  }

  private checkForNewFight(check: Check): void {
    if (this.actionType === ActionType.Offensive
      && !getFights().find((f) => f.isParticipant(check.caster))
      && check.caster !== check.target) {
      addFight(new Fight(check.caster, check.target, check.request.getRoom()))
    }
  }
}
