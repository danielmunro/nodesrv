import { applyAffectModifier } from "../../affect/applyAffect"
import Attributes from "../../attributes/model/attributes"
import { newContainer } from "../../item/factory"
import { Item } from "../../item/model/item"
import roll, { simpleD4 } from "../../random/dice"
import { Room } from "../../room/model/room"
import { Messages } from "../../server/observers/constants"
import { createSkillTriggerEvent, createSkillTriggerEvents } from "../../skill/trigger/factory"
import { Resolution } from "../../skill/trigger/resolution"
import { format } from "../../support/string"
import { Disposition } from "../disposition"
import { Mob } from "../model/mob"
import { BodyPart, getBodyPartItem, getRandomBodyPartForRace } from "../race/bodyParts"
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
  filterCompleteFights()

  return fights
}

export function filterCompleteFights() {
  fights = fights.filter(fight => fight.isInProgress())
}

export function reset() {
  fights = []
}

async function createStartRoundDefenderTrigger(attacker, defender) {
  return await createSkillTriggerEvent(defender, Trigger.AttackRoundDefend, attacker)
}

export function getCorpse(mob: Mob): Item {
  const corpse = newContainer(
    format(Messages.Fight.Corpse.Name, mob.name),
    format(Messages.Fight.Corpse.Description, mob.name))
  mob.inventory.items.forEach(item =>
    corpse.container.getItemFrom(item, mob.inventory))
  mob.equipped.inventory.items.forEach(item =>
    corpse.container.getItemFrom(item, mob.equipped.inventory))

  return corpse
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

    let damage = Fight.calculateDamageFromAttackerToDefender(xAttributes, yAttributes)

    damage = applyAffectModifier(
      attacker.affects.map(a => a.affectType),
      Trigger.DamageModifier,
      damage)

    damage = applyAffectModifier(
      defender.affects.map(a => a.affectType),
      Trigger.DamageAbsorption,
      damage)

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
  private bodyPart: BodyPart

  constructor(
    public readonly aggressor: Mob,
    public readonly target: Mob,
    public readonly room: Room) {}

  public isParticipant(mob: Mob): boolean {
    return mob.uuid === this.aggressor.uuid || mob.uuid === this.target.uuid
  }

  public getOpponentFor(mob: Mob): Mob {
    if (!this.isParticipant(mob)) {
      return null
    }

    return mob === this.aggressor ? this.target : this.aggressor
  }

  public async round(): Promise<Round> {
    if (this.isInProgress()) {
      return new Round(
        this.status === Status.InProgress ? await this.turnFor(this.aggressor, this.target) : [],
        this.status === Status.InProgress ? await this.turnFor(this.target, this.aggressor) : [],
        this.bodyPart)
    }
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

  private async turnFor(x: Mob, y: Mob): Promise<Attack[]> {
    const attacks = []
    const events = await createSkillTriggerEvents(x, Trigger.AttackRound, y)
    for (let i = -1; i < events.length; i++) {
      const doAttack = i >= 0 ? events[i].skillEventResolution === Resolution.Invoked : true
      if (doAttack) {
        const attack = await Fight.attack(x, y)
        attacks.push(attack)
        if (y.vitals.hp < 0) {
          this.deathOccurred(x, y, attack)

          return attacks
        }
      }
    }

    return attacks
  }

  private deathOccurred(winner: Mob, vanquished: Mob, attack: Attack) {
    console.debug(`${vanquished.name} is killed by ${winner.name}`)

    this.status = Status.Done
    this.winner = winner

    if (winner.isPlayer) {
      winner.playerMob.experience += attack.experience
    }

    if (!vanquished.isPlayer) {
      vanquished.disposition = Disposition.Dead
    }

    this.room.inventory.addItem(getCorpse(vanquished))
    simpleD4(() => this.doBodyParts(vanquished))
  }

  private doBodyParts(vanquished: Mob) {
    this.bodyPart = getRandomBodyPartForRace(vanquished.race)
    this.room.inventory.items.push(getBodyPartItem(vanquished, this.bodyPart))
  }
}
