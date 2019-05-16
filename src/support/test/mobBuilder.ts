import {inject} from "inversify"
import {AffectType} from "../../affect/enum/affectType"
import {newAffect} from "../../affect/factory"
import {Affect} from "../../affect/model/affect"
import {Item} from "../../item/model/item"
import {Disposition} from "../../mob/enum/disposition"
import { Mob } from "../../mob/model/mob"
import Shop from "../../mob/model/shop"
import {RaceType} from "../../mob/race/enum/raceType"
import {SpecializationType} from "../../mob/specialization/enum/specializationType"
import SpecializationService from "../../mob/specialization/service/specializationService"
import { newSkill } from "../../skill/factory"
import { SkillType } from "../../skill/skillType"
import {newSpell} from "../../spell/factory"
import { SpellType } from "../../spell/spellType"
import {Types} from "../types"

export default class MobBuilder {
  constructor(
    @inject(Types.SpecializationService) private readonly specializationService: SpecializationService,
    public readonly mob: Mob) {}

  public asTrainer(): MobBuilder {
    this.mob.traits.trainer = true
    return this
  }

  public asHealer(): MobBuilder {
    this.mob.traits.healer = true
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

  public withRace(race: RaceType) {
    this.mob.raceType = race
    return this
  }

  public setName(name: string): MobBuilder {
    this.mob.name = name
    return this
  }

  public setAlignment(amount: number): MobBuilder {
    this.mob.alignment = amount
    return this
  }

  public getHp(): number {
    return this.mob.vitals.hp
  }

  public setHp(amount: number): MobBuilder {
    this.mob.vitals.hp = amount
    return this
  }

  public setMana(amount: number): MobBuilder {
    this.mob.vitals.mana = amount
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

  public setRace(race: RaceType): MobBuilder {
    this.mob.raceType = race
    return this
  }

  public setGold(gold: number): MobBuilder {
    this.mob.gold = gold
    return this
  }

  public setSpecialization(specialization: SpecializationType) {
    this.mob.specializationType = specialization
    this.specializationService.applyAllDefaults(this.mob)
    return this
  }

  public setAggressive(): MobBuilder {
    this.mob.traits.aggressive = true
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

  public addItem(item: Item): MobBuilder {
    this.mob.inventory.addItem(item, this.mob)
    return this
  }

  public addAffect(affect: Affect): MobBuilder {
    this.mob.affects.push(affect)
    return this
  }

  public addAffectType(affectType: AffectType, timeout: number = 1): MobBuilder {
    this.mob.affect().add(newAffect(affectType, timeout))
    return this
  }

  public removeAffectType(affectType: AffectType): MobBuilder {
    this.mob.affect().remove(affectType)
    return this
  }

  public hasAffect(affectType: AffectType): boolean {
    return this.mob.affect().has(affectType)
  }

  public getMobName(): string {
    return this.mob.name
  }

  public equip(item: Item): this {
    this.mob.equipped.addItem(item, this.mob)
    return this
  }

  public getItems(): Item[] {
    return this.mob.inventory.items
  }

  public get(): Mob {
    return this.mob
  }
}
