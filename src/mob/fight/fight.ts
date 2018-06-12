import Attributes from "../../attributes/model/attributes"
import roll from "../../dice/dice"
import { createSkillTriggerEvent } from "../../skill/trigger/factory"
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

async function createStartRoundDefenderTrigger(attacker, defender) {
  return await createSkillTriggerEvent(defender, Trigger.AttackRoundStart, attacker)
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

  public async round(): Promise<Round> {
    return new Round(
      await this.turnFor(this.aggressor, this.target),
      this.status === Status.InProgress ? await this.turnFor(this.target, this.aggressor) : null,
    )
  }

  public isInProgress(): boolean {
    return this.status === Status.InProgress
  }

  public getWinner() {
    return this.winner
  }

  private async turnFor(x: Mob, y: Mob): Promise<Attack> {
    const attack = await this.attack(x, y)
    if (y.vitals.hp < 0) {
      this.status = Status.Done
      this.winner = x
    }

    return attack
  }

  private async attack(attacker: Mob, defender: Mob): Promise<Attack> {
    const initialEvent = await createStartRoundDefenderTrigger(attacker, defender)
    if (initialEvent.wasSkillInvoked()) {
      return this.attackDefeated(attacker, defender, getAttackResultFromSkillType(initialEvent.skillType))
    }

    const xAttributes = attacker.getCombinedAttributes()
    const yAttributes = defender.getCombinedAttributes()

    if (!this.isTargetAcDefeated(xAttributes, yAttributes)) {
      return this.attackDefeated(attacker, defender, AttackResult.Miss)
    }

    const damage = this.calculateDamageFromAttackerToDefender(xAttributes, yAttributes)
    defender.vitals.hp -= damage
    return new Attack(attacker, defender, AttackResult.Hit, damage)
  }

  private attackDefeated(attacker, defender, result) {
    return new Attack(attacker, defender, result, 0)
  }

  private isTargetAcDefeated(attackerAttributes: Attributes, defenderAttributes: Attributes): boolean {
    const str = attackerAttributes.stats.str
    const hit = attackerAttributes.hitroll.hit
    const defense = defenderAttributes.ac.slash
    return roll(1, str) + hit > defense
  }

  private calculateDamageFromAttackerToDefender(
    attackerAttributes: Attributes,
    defenderAttributes: Attributes): number {
    return Math.random() * Math.pow(attackerAttributes.hitroll.dam, defenderAttributes.hitroll.hit)
  }
}
