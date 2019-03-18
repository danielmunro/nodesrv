import {AffectType} from "../affect/affectType"
import {newAffect} from "../affect/factory"
import {Affect} from "../affect/model/affect"
import ServiceBuilder from "../gameService/serviceBuilder"
import {Disposition} from "../mob/enum/disposition"
import {newMobLocation} from "../mob/factory"
import { Mob } from "../mob/model/mob"
import Shop from "../mob/model/shop"
import {Race} from "../mob/race/race"
import {defaultSpecializationLevels} from "../mob/specialization/specializationLevels"
import {SpecializationType} from "../mob/specialization/specializationType"
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

  public setAlignment(amount: number): MobBuilder {
    this.mob.alignment = amount
    return this
  }

  public setHp(amount: number): MobBuilder {
    this.mob.vitals.hp = amount
    return this
  }

  public setMv(amount: number): MobBuilder {
    this.mob.vitals.mv = amount
    return this
  }

  public setLevel(level: number): MobBuilder {
    this.mob.level = level
    return this
  }

  public setRace(race: Race): MobBuilder {
    this.mob.race = race
    return this
  }

  public setSpecialization(specialization: SpecializationType) {
    this.mob.specialization = specialization
    defaultSpecializationLevels.filter(specializationLevel => specializationLevel.specialization === specialization)
      .forEach(specializationLevel => {
        if (Object.values(SkillType).includes(specializationLevel.abilityType)) {
          this.mob.skills.push(newSkill(
            specializationLevel.abilityType as SkillType,
            1,
            specializationLevel.minimumLevel))
        } else if (Object.values(SpellType).includes(specializationLevel.abilityType)) {
          this.mob.spells.push(newSpell(
            specializationLevel.abilityType as SpellType,
            1,
            specializationLevel.minimumLevel))
        }
      })
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

  public addAffect(affect: Affect): MobBuilder {
    this.mob.affects.push(affect)
    return this
  }

  public addAffectType(affectType: AffectType, timeout: number = 1): MobBuilder {
    this.mob.addAffect(newAffect(affectType, timeout))
    return this
  }

  public hasAffect(affectType: AffectType): boolean {
    return !!this.mob.getAffect(affectType)
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
