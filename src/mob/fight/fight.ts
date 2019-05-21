import AffectService from "../../affect/service/affectService"
import Attributes from "../../attributes/model/attributes"
import {EventResponseStatus} from "../../event/enum/eventResponseStatus"
import {EventType} from "../../event/enum/eventType"
import EventService from "../../event/eventService"
import {createFightEvent} from "../../event/factory"
import {Room} from "../../room/model/room"
import roll, {simpleD4} from "../../support/random/dice"
import {Disposition} from "../enum/disposition"
import {Trigger} from "../enum/trigger"
import DamageEvent, {calculateDamageFromEvent} from "../event/damageEvent"
import {Mob} from "../model/mob"
import {Attack, getSuppressionAttackResultFromSkillType} from "./attack"
import DamageService from "./damageService"
import Death from "./death"
import {AttackResult} from "./enum/attackResult"
import {FightStatus} from "./enum/fightStatus"
import {Round} from "./round"

export class Fight {
  public static calculateDamageForOneHit(
    attacker: Mob,
    defender: Mob): number {
    const attackerAttributes = attacker.attribute().combine()
    const hit = attackerAttributes.hitroll
    let damage = roll(hit.hit, hit.dam)
    damage = AffectService.applyAffectModifier(
      attacker.affects.map(a => a.affectType),
      Trigger.DamageModifier,
      damage)
    damage = AffectService.applyAffectModifier(
      defender.affects.map(a => a.affectType),
      Trigger.DamageAbsorption,
      damage)
    return damage
  }

  private static attackDefeated(attacker: Mob, defender: Mob, result: AttackResult) {
    return new Attack(attacker, defender, result, 0)
  }

  private static isTargetAcDefeated(attackerAttributes: Attributes, defenderAttributes: Attributes): boolean {
    const str = attackerAttributes.stats.str
    const hit = attackerAttributes.hitroll.hit
    const defense = defenderAttributes.ac.slash
    return roll(1, str) + hit > defense
  }

  private status: FightStatus = FightStatus.InProgress

  constructor(
    public readonly eventService: EventService,
    public readonly aggressor: Mob,
    public readonly target: Mob,
    public readonly room: Room) {}

  public isParticipant(mob: Mob): boolean {
    return mob.uuid === this.aggressor.uuid || mob.uuid === this.target.uuid
  }

  public getOpponentFor(mob: Mob): Mob | undefined {
    if (!this.isParticipant(mob)) {
      return
    }

    return mob === this.aggressor ? this.target : this.aggressor
  }

  public async round(): Promise<Round> {
    return new Round(
      this,
      this.status === FightStatus.InProgress ? await this.turnFor(this.aggressor, this.target) : [],
      this.status === FightStatus.InProgress ? await this.turnFor(this.target, this.aggressor) : [])
  }

  public isInProgress(): boolean {
    return this.status === FightStatus.InProgress
  }

  public participantFled(mob: Mob) {
    if (!this.isParticipant(mob)) {
      throw new Error("Not part of the fight")
    }

    this.status = FightStatus.Done
  }

  public async attack(attacker: Mob, defender: Mob): Promise<Attack> {
    const eventResponse = await this.eventService.publish(
      createFightEvent(EventType.AttackRoundStart, attacker, this))
    if (eventResponse.status === EventResponseStatus.Satisfied) {
      return Fight.attackDefeated(attacker, defender, getSuppressionAttackResultFromSkillType(eventResponse.context))
    }

    const xAttributes = attacker.attribute().combine()
    const yAttributes = defender.attribute().combine()

    if (!Fight.isTargetAcDefeated(xAttributes, yAttributes)) {
      return Fight.attackDefeated(attacker, defender, AttackResult.Miss)
    }

    const initialDamageCalculation = Fight.calculateDamageForOneHit(attacker, defender)
    const response = await this.eventService.publish(
      defender.createDamageEventBuilder(
        initialDamageCalculation,
        new DamageService(attacker).getDamageType())
        .setSource(attacker)
        .build())
    const event = response.event as DamageEvent
    defender.vitals.hp -= event.amount

    return new Attack(
      attacker,
      defender,
      AttackResult.Hit,
      calculateDamageFromEvent(event),
      defender.vitals.hp < 0 ? this.createDeath(attacker, defender) : undefined)
  }

  private async turnFor(x: Mob, y: Mob): Promise<Attack[]> {
    const attacks = [await this.attack(x, y)]
    if (y.vitals.hp < 0) {
      return attacks
    }
    await this.eventService.publish(createFightEvent(EventType.AttackRound, x, this, attacks))
    return attacks
  }

  private createDeath(winner: Mob, vanquished: Mob): Death {
    console.debug(`${vanquished.name} is killed by ${winner.name}`)

    this.status = FightStatus.Done
    let bounty = 0

    if (!winner.traits.isNpc && !vanquished.traits.isNpc && vanquished.playerMob.bounty) {
      bounty = vanquished.playerMob.bounty
      winner.gold += bounty
      vanquished.playerMob.bounty = 0
    }

    const death = new Death(vanquished, this.room, winner, bounty)

    if (winner.playerMob) {
      winner.playerMob.addExperience(death.calculateKillerExperience())
    }

    if (vanquished.traits.isNpc) {
      vanquished.disposition = Disposition.Dead
    }

    this.room.inventory.addItem(death.createCorpse())
    simpleD4(() => death.createBodyPart())

    return death
  }
}
