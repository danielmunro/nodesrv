import {applyAffectModifier} from "../../affect/applyAffect"
import Attributes from "../../attributes/model/attributes"
import {EventResponseStatus} from "../../event/eventResponseStatus"
import EventService from "../../event/eventService"
import {EventType} from "../../event/eventType"
import roll, {simpleD4} from "../../random/dice"
import {Room} from "../../room/model/room"
import {BASE_KILL_EXPERIENCE} from "../constants"
import {Disposition} from "../enum/disposition"
import {Trigger} from "../enum/trigger"
import {Mob} from "../model/mob"
import modifierNormalizer from "../multiplierNormalizer"
import {BodyPart} from "../race/bodyParts"
import {Attack, AttackResult, getAttackResultFromSkillType} from "./attack"
import Death from "./death"
import FightEvent from "./event/fightEvent"
import {Round} from "./round"
import {FightStatus} from "./fightStatus"



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
    const hit = attackerAttributes.hitroll
    return roll(hit.hit, hit.dam)
  }

  private static getExperienceFromKilling(attacker: Mob, defender: Mob) {
    const levelDelta = defender.level - attacker.level
    return BASE_KILL_EXPERIENCE * modifierNormalizer(levelDelta)
  }

  private status: FightStatus = FightStatus.InProgress
  private winner: Mob
  private bodyPart: BodyPart
  private death: Death

  constructor(
    public readonly eventService: EventService,
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
        this,
        this.status === FightStatus.InProgress ? await this.turnFor(this.aggressor, this.target) : [],
        this.status === FightStatus.InProgress ? await this.turnFor(this.target, this.aggressor) : [],
        this.bodyPart)
    }
  }

  public isInProgress(): boolean {
    return this.status === FightStatus.InProgress
  }

  public getWinner() {
    return this.winner
  }

  public participantFled(mob: Mob) {
    if (!this.isParticipant(mob)) {
      throw new Error("Not part of the fight")
    }

    this.status = FightStatus.Done
  }

  public async attack(attacker: Mob, defender: Mob): Promise<Attack> {
    const eventResponse = await this.eventService.publish(
      new FightEvent(EventType.AttackRoundStart, attacker, this))
    if (eventResponse.status === EventResponseStatus.Satisfied) {
      return Fight.attackDefeated(attacker, defender, getAttackResultFromSkillType(eventResponse.context))
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
    await this.eventService.publish(new FightEvent(EventType.AttackRound, attacker, this))

    return new Attack(
      attacker,
      defender,
      AttackResult.Hit,
      damage,
      defender.vitals.hp < 0 ? Fight.getExperienceFromKilling(attacker, defender) : 0)
  }

  private async turnFor(x: Mob, y: Mob): Promise<Attack[]> {
    const attacks = [await this.attack(x, y)]
    if (y.vitals.hp < 0) {
      this.deathOccurred(x, y)

      return attacks
    }
    await this.eventService.publish(new FightEvent(EventType.AttackRound, x, this, attacks))
    return attacks
  }

  private deathOccurred(winner: Mob, vanquished: Mob) {
    console.debug(`${vanquished.name} is killed by ${winner.name}`)

    this.status = FightStatus.Done
    this.winner = winner
    this.death = new Death(vanquished, this.room, winner)

    if (!winner.traits.isNpc) {
      winner.playerMob.experience += this.death.calculateKillerExperience()
    }

    if (vanquished.traits.isNpc) {
      vanquished.disposition = Disposition.Dead
    }

    this.room.inventory.addItem(this.death.createCorpse())
    simpleD4(() => this.death.createBodyPart())
  }
}
