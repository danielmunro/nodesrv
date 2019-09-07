import AffectService from "../../affect/service/affectService"
import AttributesEntity from "../../attributes/entity/attributesEntity"
import {EventType} from "../../event/enum/eventType"
import {createDeathEvent, createFightEvent, createRoomMessageEvent} from "../../event/factory/eventFactory"
import EventResponse from "../../event/messageExchange/eventResponse"
import EventService from "../../event/service/eventService"
import ResponseMessageBuilder from "../../messageExchange/builder/responseMessageBuilder"
import {RoomEntity} from "../../room/entity/roomEntity"
import roll, {simpleD4} from "../../support/random/dice"
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

  private static isTargetAcDefeated(
    attackerAttributes: AttributesEntity, defenderAttributes: AttributesEntity): boolean {
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

  public async round(): Promise<Round> {
    return new Round(
      this,
      this.status === FightStatus.InProgress ? await this.turnFor(this.aggressor, this.target) : [],
      this.status === FightStatus.InProgress ? await this.turnFor(this.target, this.aggressor) : [])
  }

  public isInProgress(): boolean {
    return this.status === FightStatus.InProgress
  }

  public participantFled(mob: MobEntity) {
    if (!this.isParticipant(mob)) {
      throw new Error("Not part of the fight")
    }

    this.status = FightStatus.Done
  }

  public async attack(attacker: MobEntity, defender: MobEntity): Promise<Attack> {
    const eventResponse = await this.publishAttackRoundStart(attacker)

    if (eventResponse.isSatisfied()) {
      return Fight.attackDefeated(attacker, defender, getSuppressionAttackResultFromSkillType(eventResponse.context))
    }

    const xAttributes = attacker.attribute().combine()
    const yAttributes = defender.attribute().combine()

    if (!Fight.isTargetAcDefeated(xAttributes, yAttributes)) {
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
    const attacks = [await this.attack(attacker, defender)]
    const attackDeath = attacks.find(attack => !!attack.death)
    if (attackDeath) {
      const death = attackDeath.death as Death
      await this.eventService.publish(createDeathEvent(death))
      return attacks
    }
    await this.eventService.publish(createFightEvent(EventType.AttackRound, attacker, this, attacks))
    return attacks
  }

  private async createDeath(winner: MobEntity, vanquished: MobEntity): Promise<Death> {
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

    const corpse = death.createCorpse()
    this.room.inventory.addItem(corpse)
    if (winner.playerMob && winner.playerMob.autoLoot) {
      corpse.container.inventory.items.forEach(item => {
        winner.inventory.addItem(item)
        this.eventService.publish(createRoomMessageEvent(
          this.room,
          new ResponseMessageBuilder(winner, "{requestCreator} {verb} from {corpse}.")
            .addReplacementForRequestCreator("verb", "loot")
            .addReplacementForTarget("verb", "loots")
            .addReplacement("corpse", corpse.toString())
            .create()))
      })
    }
    simpleD4(() => death.createBodyPart())

    return death
  }
}
