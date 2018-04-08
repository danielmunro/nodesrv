import { DamageType } from "../damage/damageType"
import { ActionType } from "../handler/constants"
import { addFight, Fight, getFights } from "../mob/fight/fight"
import { Request } from "../server/request/request"
import { Check } from "./check"
import { SpellType } from "./spellType"

const DELAY_SUCCESS = 2
const DELAY_FAILURE = 1

export class SpellDefinition {
  public readonly spellType: SpellType
  public readonly level: number
  public readonly actionType: ActionType
  public readonly damageType: DamageType
  public readonly manaCost: number
  public readonly cast: (request: Request, check: Check) => any

  constructor(
    spellType: SpellType,
    level: number,
    actionType: ActionType,
    manaCost: number,
    cast: (request: Request, check: Check) => any,
    damageType: DamageType = null,
  ) {
    this.spellType = spellType
    this.level = level
    this.actionType = actionType
    this.manaCost = manaCost
    this.cast = cast
    this.damageType = damageType
  }

  public check(request: Request) {
    return new Check(request, this)
  }

  public apply(check: Check) {
    this.addDelayToPlayer(check)
    this.checkForNewFight(check)
  }

  private addDelayToPlayer(check: Check): void {
    if (check.isSuccessful()) {
      check.request.player.delay += DELAY_SUCCESS
      return
    }

    check.request.player.delay += DELAY_FAILURE
  }

  private checkForNewFight(check: Check): void {
    if (this.actionType === ActionType.Offensive
      && !getFights().find((f) => f.isParticipant(check.caster))
      && check.caster !== check.target) {
      addFight(new Fight(check.caster, check.target))
    }
  }
}
