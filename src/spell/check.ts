import { ActionType } from "../action/actionType"
import { getFights } from "../mob/fight/fight"
import { Mob } from "../mob/model/mob"
import roll from "../random/dice"
import { Request } from "../request/request"
import { MESSAGE_FAIL, MESSAGE_NO_SPELL, MESSAGE_NO_TARGET, MESSAGE_NOT_ENOUGH_MANA } from "./constants"
import { Spell } from "./model/spell"
import SpellDefinition from "./spellDefinition"

export enum Status {
  NotEvaluated,
  Error,
  Fail,
  Success,
}

export class Check {
  public readonly status: Status = Status.NotEvaluated
  public readonly fail: string
  public readonly caster: Mob
  public readonly target: Mob
  public readonly spell: Spell
  public readonly spellDefinition: SpellDefinition
  public readonly request: Request

  constructor(request: Request, spellDefinition: SpellDefinition, chance = null) {
    this.request = request
    this.caster = request.mob
    this.target = this.findTarget(request, spellDefinition.actionType)
    this.spellDefinition = spellDefinition

    if (this.spellDefinition.actionType === ActionType.Offensive && !this.target) {
      this.status = Status.Error
      this.fail = MESSAGE_NO_TARGET
      return
    }

    this.spell = this.caster.spells.find((s) => s.spellType === this.spellDefinition.spellType)

    if (!this.spell) {
      this.status = Status.Error
      this.fail = MESSAGE_NO_SPELL
      return
    }

    if (this.caster.vitals.mana < spellDefinition.manaCost) {
      this.status = Status.Fail
      this.fail = MESSAGE_NOT_ENOUGH_MANA
      return
    }

    if (chance === null) {
      const reduction = this.spellDefinition.actionType === ActionType.Offensive ?
        roll(1, this.target.getCombinedAttributes().stats.int * 3) : 0
      chance = () => roll(this.spell.level / 2, this.spell.level) - reduction >= 0
    }

    if (!chance()) {
      this.status = Status.Fail
      this.fail = MESSAGE_FAIL
      return
    }

    this.status = Status.Success
  }

  public isSuccessful(): boolean {
    return this.status === Status.Success
  }

  public isFailure(): boolean {
    return this.status === Status.Fail
  }

  public isError(): boolean {
    return this.status === Status.Error
  }

  public applyManaCost(): void {
    this.caster.vitals.mana -= this.spellDefinition.manaCost
  }

  private findTarget(request: Request, actionType: ActionType): Mob {
    const caster = request.mob
    const fight = getFights().find(f => f.isParticipant(caster))
    if (fight) {
      return fight.getOpponentFor(caster)
    }

    if (request.getTarget()) {
      return request.getTarget() as Mob
    }

    if (actionType !== ActionType.Offensive) {
      return caster
    }
  }
}
