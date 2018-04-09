import roll from "../dice/dice"
import { ActionType } from "../handler/constants"
import { getFights } from "../mob/fight/fight"
import { Mob } from "../mob/model/mob"
import { Request } from "../server/request/request"
import { Spell } from "./model/spell"
import { SpellDefinition } from "./spellDefiniton"

export const MESSAGE_NO_SPELL = "You don't know that spell."
export const MESSAGE_NO_TARGET = "You aren't fighting anyone!"
export const MESSAGE_FAIL = "You lose concentration."

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
  public readonly request: Request

  constructor(request: Request, spellDefinition: SpellDefinition) {
    this.request = request
    this.caster = request.player.sessionMob
    const target = this.findTarget(request, spellDefinition.actionType)

    if (spellDefinition.actionType === ActionType.Offensive && !target) {
      this.status = Status.Error
      this.fail = MESSAGE_NO_TARGET
      return
    }

    this.spell = this.caster.spells.find((s) => s.spellType === spellDefinition.spellType)

    if (!this.spell) {
      this.status = Status.Error
      this.fail = MESSAGE_NO_SPELL
      return
    }

    if (roll(1, this.spell.level) - roll(1, target.getCombinedAttributes().stats.int * 3) < 0) {
      this.status = Status.Fail
      this.fail = MESSAGE_FAIL
      return
    }

    this.status = Status.Success
    this.target = target
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

  private findTarget(request: Request, actionType: ActionType): Mob {
    const caster = request.player.sessionMob
    const fight = getFights().find((f) => f.isParticipant(caster))
    if (fight) {
      return fight.getOpponentFor(caster)
    }

    if (request.getTarget()) {
      return request.getTarget()
    }

    if (actionType !== ActionType.Offensive) {
      return caster
    }
  }
}
