import Attributes from "../../attributes/model/attributes"
import roll from "../../random/dice"
import { createSkillTriggerEvent } from "../../skill/trigger/factory"
import { Disposition } from "../disposition"
import { Mob } from "../model/mob"
import { Trigger } from "../trigger"
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
  private static attackDefeated(attacker, defender, result) {
    return new Attack(attacker, defender, result, 0)
  }

  private static isTargetAcDefeated(attackerAttributes: Attributes, defenderAttributes: Attributes): boolean {
    const str = attackerAttributes.stats.str
    const hit = attackerAttributes.hitroll.hit
    const defense = defenderAttributes.ac.slash
    return roll(1, str) + hit > defense
  }

  private static calculateDamageFromAttackerToDefender(
    attackerAttributes: Attributes,
    defenderAttributes: Attributes): number {
    return Math.max(1, Math.random() * Math.pow(attackerAttributes.hitroll.dam, defenderAttributes.hitroll.hit))
  }

  private static async attack(attacker: Mob, defender: Mob): Promise<Attack> {
    const initialEvent = await createStartRoundDefenderTrigger(attacker, defender)
    if (initialEvent.wasSkillInvoked()) {
      return Fight.attackDefeated(attacker, defender, getAttackResultFromSkillType(initialEvent.skillType))
    }

    const xAttributes = attacker.getCombinedAttributes()
    const yAttributes = defender.getCombinedAttributes()

    if (!Fight.isTargetAcDefeated(xAttributes, yAttributes)) {
      return Fight.attackDefeated(attacker, defender, AttackResult.Miss)
    }

    const damage = Fight.calculateDamageFromAttackerToDefender(xAttributes, yAttributes)
    defender.vitals.hp -= damage
    return new Attack(
      attacker,
      defender,
      AttackResult.Hit,
      damage,
      defender.vitals.hp < 0 ? attacker.getExperienceFromKilling(defender) : 0)
  }

  private status: Status = Status.InProgress
  private winner: Mob

  constructor(
    public readonly aggressor: Mob,
    public readonly target: Mob) {}

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
      this.status === Status.InProgress ? await this.turnFor(this.aggressor, this.target) : null,
      this.status === Status.InProgress ? await this.turnFor(this.target, this.aggressor) : null,
    )
  }

  public isInProgress(): boolean {
    return this.status === Status.InProgress
  }

  public getWinner() {
    return this.winner
  }

  public participantFled(mob: Mob) {
    if (!this.isParticipant(mob)) {
      throw new Error("Not part of the fight")
    }

    this.status = Status.Done
  }

  private async turnFor(x: Mob, y: Mob): Promise<Attack> {
    const attack = await Fight.attack(x, y)
    if (y.vitals.hp < 0) {
      this.deathOccurred(x, y, attack)
    }

    return attack
  }

  private deathOccurred(winner: Mob, vanquished: Mob, attack: Attack) {
    this.status = Status.Done
    this.winner = winner
    if (winner.isPlayer) {
      winner.playerMob.experience += attack.experience
    }
    console.debug(`${vanquished.name} is killed by ${winner.name}`)
    if (!vanquished.isPlayer) {
      vanquished.disposition = Disposition.Dead
    }
  }
}
