import {AffectType} from "../affect/affectType"
import {newAffect} from "../affect/factory"
import ServiceBuilder from "../gameService/serviceBuilder"
import {Disposition} from "../mob/enum/disposition"
import {newMobLocation} from "../mob/factory"
import { Mob } from "../mob/model/mob"
import Shop from "../mob/model/shop"
import {Race} from "../mob/race/race"
import { newSkill } from "../skill/factory"
import { SkillType } from "../skill/skillType"
import {newSpell} from "../spell/factory"
import { SpellType } from "../spell/spellType"
import RoomBuilder from "./roomBuilder"

export default class MobBuilder {
  constructor(public readonly mob: Mob, private readonly serviceBuilder: ServiceBuilder) {}

  public asTrainer(): MobBuilder {
    this.mob.traits.trainer = true
    return this
  }

  public asPractice(): MobBuilder {
    this.mob.traits.practice = true
    return this
  }

  public asMerchant(): MobBuilder {
    this.mob.shop = new Shop()
    return this
  }

  public withRace(race: Race) {
    this.mob.race = race

    return this
  }

  public withMv(amount: number): MobBuilder {
    this.mob.vitals.mv = amount
    return this
  }

  public withLevel(level: number): MobBuilder {
    this.mob.level = level

    return this
  }

  public withDisposition(disposition: Disposition): MobBuilder {
    this.mob.disposition = disposition

    return this
  }

  public withSkill(skillType: SkillType, level: number = 1): MobBuilder {
    this.mob.skills.push(newSkill(skillType, level))
    return this
  }

  public withSpell(spellType: SpellType, level: number = 1): MobBuilder {
    this.mob.spells.push(newSpell(spellType, level))
    return this
  }

  public withGold(gold: number): MobBuilder {
    this.mob.gold = gold
    return this
  }

  public addAffect(affectType: AffectType, timeout: number = 1): MobBuilder {
    this.mob.addAffect(newAffect(affectType, timeout))
    return this
  }

  public addToRoom(roomBuilder: RoomBuilder): MobBuilder {
    this.serviceBuilder.addMobLocation(newMobLocation(this.mob, roomBuilder.room))
    return this
  }

  public getMobName(): string {
    return this.mob.name
  }

  public build(): Mob {
    this.serviceBuilder.addMob(this.mob)
    return this.mob
  }
}
