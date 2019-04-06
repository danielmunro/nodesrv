import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import AffectService from "../../affect/affectService"
import { Affect } from "../../affect/model/affect"
import { default as Attributes } from "../../attributes/model/attributes"
import Vitals from "../../attributes/model/vitals"
import {Equipment} from "../../item/enum/equipment"
import { Inventory } from "../../item/model/inventory"
import {Item} from "../../item/model/item"
import { AuthorizationLevel } from "../../player/authorizationLevel"
import { Player } from "../../player/model/player"
import { Skill } from "../../skill/model/skill"
import {SkillType} from "../../skill/skillType"
import { Spell } from "../../spell/model/spell"
import { Disposition } from "../enum/disposition"
import { Gender } from "../enum/gender"
import { Standing } from "../enum/standing"
import { RaceType } from "../race/enum/raceType"
import createRaceFromRaceType from "../race/factory"
import Race from "../race/race"
import {createSpecializationFromType} from "../specialization/factory"
import {Specialization} from "../specialization/specialization"
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
  public raceType: RaceType

  @Column("text", { nullable: true })
  public specializationType: SpecializationType

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

  public specialization(): Specialization {
    return createSpecializationFromType(this.specializationType)
  }

  public race(): Race {
    return createRaceFromRaceType(this.raceType)
  }

  public affect(): AffectService {
    return new AffectService(this)
  }

  public getAuthorizationLevel(): AuthorizationLevel {
    return this.playerMob ? this.playerMob.authorizationLevel : AuthorizationLevel.None
  }

  public getStanding(): Standing {
    return this.playerMob ? this.playerMob.standing : Standing.Good
  }

  public getSkill(skillType: SkillType): Skill | undefined {
    return this.skills.find(skill => skill.skillType === skillType)
  }

  public getFirstEquippedItemAtPosition(equipment: Equipment): Item | undefined {
    return this.equipped.items.find(item => item.equipment === equipment)
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
}
