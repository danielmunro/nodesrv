import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { AffectType } from "../../affect/affectType"
import { applyAffectModifier } from "../../affect/applyAffect"
import { Affect } from "../../affect/model/affect"
import { newEmptyAttributes } from "../../attributes/factory"
import { default as Attributes } from "../../attributes/model/attributes"
import Vitals from "../../attributes/model/vitals"
import { Inventory } from "../../item/model/inventory"
import { AuthorizationLevel } from "../../player/authorizationLevel"
import { Player } from "../../player/model/player"
import roll from "../../random/dice"
import { BaseRegenModifier } from "../../server/observers/constants"
import { Skill } from "../../skill/model/skill"
import { Spell } from "../../spell/model/spell"
import Maybe from "../../support/functional/maybe"
import match from "../../support/matcher/match"
import { Disposition } from "../enum/disposition"
import { Gender } from "../enum/gender"
import { Standing } from "../enum/standing"
import { Trigger } from "../enum/trigger"
import { modifiers } from "../race/constants"
import { Race } from "../race/race"
import { SpecializationType } from "../specialization/specializationType"
import DamageSource from "./damageSource"
import MobReset from "./mobReset"
import {MobTraits} from "./mobTraits"
import OffensiveTraits from "./offensiveTraits"
import { PlayerMob } from "./playerMob"
import Shop from "./shop"

const ownedEntityOptions = { cascadeInsert: true, cascadeUpdate: true, eager: true }

@Entity()
export class Mob {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("text", { nullable: true })
  public canonicalId: string

  @Column("text")
  public name: string

  @Column("text", { nullable: true })
  public description: string

  @Column("text", { nullable: true })
  public brief: string

  @Column("text")
  public race: Race

  @Column("text", { nullable: true })
  public specialization: SpecializationType

  @Column("integer")
  public level: number = 1

  @Column("integer", { default: 0 })
  public gold: number = 0

  @Column("text", { default: Gender.Unspecified })
  public gender: Gender = Gender.Unspecified

  @Column("text", { nullable: true })
  public disposition = Disposition.Standing

  @Column("text", { nullable: true })
  public importId: string

  @Column("integer", { default: 0 })
  public alignment: number = 0

  public deathTimer: number = 0

  @OneToOne(() => DamageSource, { cascadeAll: true, eager: true })
  @JoinColumn()
  public immune: DamageSource = new DamageSource()

  @OneToOne(() => DamageSource, { cascadeAll: true, eager: true })
  @JoinColumn()
  public resist: DamageSource = new DamageSource()

  @OneToOne(() => DamageSource, { cascadeAll: true, eager: true })
  @JoinColumn()
  public vulnerable: DamageSource = new DamageSource()

  @OneToMany(() => Affect, affect => affect.mob, { ...ownedEntityOptions })
  public affects: Affect[] = []

  @OneToOne(() => MobTraits, { cascadeAll: true, eager: true })
  @JoinColumn()
  public traits: MobTraits = new MobTraits()

  @OneToOne(() => OffensiveTraits, { cascadeAll: true, eager: true })
  @JoinColumn()
  public offensiveTraits: OffensiveTraits = new OffensiveTraits()

  @OneToOne(() => Shop, { cascadeAll: true, eager: true })
  @JoinColumn()
  public shop: Shop

  @OneToOne(() => Vitals, { cascadeAll: true, eager: true })
  @JoinColumn()
  public vitals: Vitals = new Vitals()

  @OneToMany(() => Attributes, attributes => attributes.mob, { ...ownedEntityOptions })
  public attributes: Attributes[] = []

  @ManyToOne(() => Player, player => player.mobs)
  public player: Player

  @OneToOne(() => Inventory, { cascadeAll: true, eager: true })
  @JoinColumn()
  public inventory = new Inventory()

  @OneToOne(() => Inventory, { cascadeAll: true, eager: true })
  @JoinColumn()
  public equipped = new Inventory()

  @OneToMany(() => Skill, skill => skill.mob, { ...ownedEntityOptions })
  public skills: Skill[] = []

  @OneToMany(() => Spell, spell => spell.mob, { ...ownedEntityOptions })
  public spells: Spell[] = []

  @OneToOne(() => PlayerMob, playerMob => playerMob.mob, { nullable: true, ...ownedEntityOptions })
  public playerMob: PlayerMob

  @OneToOne(() => MobReset, reset => reset.mob)
  public mobReset: MobReset

  @OneToOne(() => Mob, { nullable: true })
  @JoinColumn()
  public pet: Mob

  public follows: Mob

  public findPractice(input: string): Skill | Spell | undefined {
    return new Maybe(this.skills.find((skill: Skill) => match(skill.skillType, input)))
      .or(() => this.spells.find((spell: Spell) => match(spell.spellType, input)))
      .get()
  }

  public getAuthorizationLevel(): AuthorizationLevel {
    return this.playerMob ? this.playerMob.authorizationLevel : AuthorizationLevel.None
  }

  public getStanding(): Standing {
    return this.playerMob ? this.playerMob.standing : Standing.Good
  }

  public getCombinedAttributes(): Attributes {
    let attributes = newEmptyAttributes()
    this.attributes.forEach(a => attributes = attributes.combine(a))
    this.equipped.items.forEach(i => attributes = attributes.combine(i.attributes))
    modifiers.forEach(modifier => attributes = modifier(this.race, attributes))
    if (this.playerMob) {
      attributes.combine(this.playerMob.trainedAttributes)
    }

    return attributes
  }

  public addAffect(affect: Affect) {
    const current = this.getAffect(affect.affectType)
    if (!current) {
      this.affects.push(affect)
      affect.mob = this
    }
  }

  public getAffect(affectType: AffectType) {
    return this.affects.find((a) => a.affectType === affectType)
  }

  public removeAffect(affectType: AffectType) {
    this.affects = this.affects.filter(affect => affect.affectType !== affectType)
  }

  public isMerchant(): boolean {
    return !!this.shop
  }

  public isHealer(): boolean {
    return this.traits.healer
  }

  public isTrainer(): boolean {
    return this.traits.trainer
  }

  public regen(): void {
    const combined = this.getCombinedAttributes()
    const regenModifier = applyAffectModifier(
      this.affects.map(a => a.affectType),
      Trigger.Tick,
      BaseRegenModifier)
    this.vitals.hp += roll(8, (combined.vitals.hp * regenModifier) / 8)
    this.vitals.mana += roll( 8, (combined.vitals.mana * regenModifier) / 8)
    this.vitals.mv += roll(8, (combined.vitals.mv * regenModifier) / 8)
    if (this.playerMob) {
      this.playerMob.regen()
    }
    this.normalizeVitals()
  }

  public normalizeVitals() {
    const combined = this.getCombinedAttributes()
    if (this.vitals.hp > combined.vitals.hp) {
      this.vitals.hp = combined.vitals.hp
    }
    if (this.vitals.mana > combined.vitals.mana) {
      this.vitals.mana = combined.vitals.mana
    }
    if (this.vitals.mv > combined.vitals.mv) {
      this.vitals.mv = combined.vitals.mv
    }
  }

  public toString(): string {
    return this.name
  }

  public describe(): string {
    return this.description + "\n\nEquipped:\n" + this.equipped.items.reduce(
      (previous, current) => previous + current.equipment + ": " + current.name + "\n", "")
  }

  public isDead(): boolean {
    return this.disposition === Disposition.Dead
  }

  public canDetectInvisible(): boolean {
    return this.affects.find(a => a.affectType === AffectType.DetectInvisible) !== undefined
  }
}
