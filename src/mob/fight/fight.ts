import roll from "../../dice/dice"
import { createSkillTriggerEvent } from "../../skill/skillTrigger"
import { Trigger } from "../../trigger"
import { Mob } from "../model/mob"
import { Attack, AttackResult, getAttackResultFromSkillType } from "./attack"
import { Round } from "./round"

enum Status {
  InProgress,
  Done,
}

let fights: Fight[] = []

export function addFight(fight: Fight): void {
  fights.push(fight)
}

export function getFights() {
  return fights
}

export function filterCompleteFights() {
  fights = fights.filter((fight) => fight.isInProgress())
}

export function reset() {
  fights = []
}

export class Fight {
  public readonly aggressor: Mob
  public readonly target: Mob
  private status: Status = Status.InProgress
  private winner: Mob

  constructor(aggressor: Mob, target: Mob) {
    this.aggressor = aggressor
    this.target = target
  }

  public isParticipant(mob: Mob): boolean {
    return mob.uuid === this.aggressor.uuid || mob.uuid === this.target.uuid
  }

  public getOpponentFor(mob: Mob): Mob {
    if (!this.isParticipant(mob)) {
      return null
    }

    return mob === this.aggressor ? this.aggressor : this.target
  }

  public round(): Round {
    return new Round(
      this.turnFor(this.aggressor, this.target),
      this.status === Status.InProgress ? this.turnFor(this.target, this.aggressor) : null,
    )
  }

  public isInProgress(): boolean {
    return this.status === Status.InProgress
  }

  public getWinner() {
    return this.winner
  }

  private turnFor(x: Mob, y: Mob): Attack {
    const attack = this.attack(x, y)
    if (y.vitals.hp < 0) {
      this.status = Status.Done
      this.winner = x
    }

    return attack
  }

  private attack(attacker: Mob, defender: Mob): Attack {
    const initialEvent = createSkillTriggerEvent(defender, Trigger.ATTACKED_START)
    if (initialEvent.wasSkillInvoked()) {
      return new Attack(attacker, defender, getAttackResultFromSkillType(initialEvent.skill.skillType), 0)
    }

    const xAttributes = attacker.getCombinedAttributes()
    const yAttributes = defender.getCombinedAttributes()

    if (!this.isTargetAcDefeated(xAttributes.stats.str, xAttributes.hitroll.hit, yAttributes.ac.slash)) {
      return new Attack(attacker, defender, AttackResult.Miss, 0)
    }

    const damage = Math.random() * Math.pow(xAttributes.hitroll.dam, xAttributes.hitroll.hit)
    defender.vitals.hp -= damage

    return new Attack(attacker, defender, AttackResult.Hit, damage)
  }

  private isTargetAcDefeated(attackStr: number, modifier: number, ac: number): boolean {
    return roll(1, attackStr) + modifier > ac
  }
}
