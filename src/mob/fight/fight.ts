import AffectService from "../../affect/service/affectService"
import {EventType} from "../../event/enum/eventType"
import {createDeathEvent, createFightEvent} from "../../event/factory/eventFactory"
import EventResponse from "../../event/messageExchange/eventResponse"
import EventService from "../../event/service/eventService"
import {RoomEntity} from "../../room/entity/roomEntity"
import roll from "../../support/random/dice"
import {MobEntity} from "../entity/mobEntity"
import {Disposition} from "../enum/disposition"
import {Trigger} from "../enum/trigger"
import DamageEvent, {calculateDamageFromEvent} from "../event/damageEvent"
import {Attack, getSuppressionAttackResultFromSkillType} from "./attack"
import DamageService from "./damageService"
import Death from "./death"
import {AttackResult} from "./enum/attackResult"
import {FightStatus} from "./enum/fightStatus"
import {Round} from "./round"

export class Fight {
  public static calculateDamageForOneHit(
    attacker: MobEntity,
    defender: MobEntity): number {
    const attackerAttributes = attacker.attribute().combine()
    let damage = roll(attackerAttributes.hit, attackerAttributes.dam)
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

  private static attackDefeated(attacker: MobEntity, defender: MobEntity, result: AttackResult) {
    return new Attack(attacker, defender, result, 0)
  }

  private static isTargetAcDefeated(attacker: MobEntity, defender: MobEntity): boolean {
    const attackerAttributes = attacker.attribute().combine()
    const defenderAttributes = defender.attribute().combine()
    const dex = attackerAttributes.dex
    const hit = attackerAttributes.hit
    const defense = defenderAttributes.acSlash || 0
    const attack = roll(1, dex) + hit
    return attack > defense
  }

  private status: FightStatus = FightStatus.InProgress

  constructor(
    public readonly eventService: EventService,
    public readonly aggressor: MobEntity,
    public readonly target: MobEntity,
    public readonly room: RoomEntity) {}

  public isParticipant(mob: MobEntity): boolean {
    return mob.uuid === this.aggressor.uuid || mob.uuid === this.target.uuid
  }

  public getOpponentFor(mob: MobEntity): MobEntity {
    if (!this.isParticipant(mob)) {
      throw new Error("mob not fighting")
    }
    return mob === this.aggressor ? this.target : this.aggressor
  }

  public async createFightRound(): Promise<Round> {
    return new Round(
      this,
      this.isInProgress() ? await this.turnFor(this.aggressor, this.target) : [],
      this.isInProgress() ? await this.turnFor(this.target, this.aggressor) : [])
  }

  public isInProgress(): boolean {
    return this.status === FightStatus.InProgress
  }

  public endFight() {
    this.status = FightStatus.Done
  }

  public async createAttack(attacker: MobEntity, defender: MobEntity): Promise<Attack> {
    const eventResponse = await this.publishAttackRoundStart(attacker)
    if (eventResponse.isSatisfied()) {
      return Fight.attackDefeated(attacker, defender, getSuppressionAttackResultFromSkillType(eventResponse.context))
    }

    if (!Fight.isTargetAcDefeated(attacker, defender)) {
      return Fight.attackDefeated(attacker, defender, AttackResult.Miss)
    }

    const event = await this.publishDamageEvent(attacker, defender, Fight.calculateDamageForOneHit(attacker, defender))
    const damage = calculateDamageFromEvent(event)
    defender.hp -= damage

    return new Attack(
      attacker,
      defender,
      AttackResult.Hit,
      damage,
      defender.hp < 0 ? await this.createDeath(attacker, defender) : undefined)
  }

  public isP2P(): boolean {
    return !!this.aggressor.playerMob && !!this.target.playerMob
  }

  private async publishAttackRoundStart(attacker: MobEntity): Promise<EventResponse> {
    return this.eventService.publish(createFightEvent(EventType.AttackRoundStart, attacker, this))
  }

  private async publishDamageEvent(
    attacker: MobEntity, defender: MobEntity, damage: number): Promise<DamageEvent> {
    const eventResponse = await this.eventService.publish(
      defender.createDamageEventBuilder(
        damage,
        new DamageService(attacker).getDamageType())
        .setSource(attacker)
        .build())
    return eventResponse.getDamageEvent()
  }

  private async turnFor(attacker: MobEntity, defender: MobEntity): Promise<Attack[]> {
    const attacks = [await this.createAttack(attacker, defender)]
    await this.eventService.publish(createFightEvent(EventType.AttackRound, attacker, this, attacks))
    const attack = attacks.find(a => a.death)
    if (attack) {
      await this.eventService.publish(createDeathEvent(attack.death as Death))
    }
    return attacks
  }

  private async createDeath(winner: MobEntity, vanquished: MobEntity): Promise<Death> {
    console.debug(`${vanquished.name} is killed by ${winner.name}`)
    this.endFight()
    if (vanquished.traits.isNpc) {
      vanquished.disposition = Disposition.Dead
    }
    return new Death(
      vanquished,
      winner,
      vanquished.playerMob && vanquished.playerMob.bounty ? vanquished.playerMob.bounty : 0)
  }
}
