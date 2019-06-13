import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Affect } from "../../affect/model/affect"
import AffectService from "../../affect/service/affectService"
import { default as Attributes } from "../../attributes/model/attributes"
import AttributeService from "../../attributes/service/attributeService"
import {Equipment} from "../../item/enum/equipment"
import { Inventory } from "../../item/model/inventory"
import {Item} from "../../item/model/item"
import {AuthorizationLevel} from "../../player/enum/authorizationLevel"
import { Player } from "../../player/model/player"
import { Skill } from "../../skill/model/skill"
import {SkillType} from "../../skill/skillType"
import { Spell } from "../../spell/model/spell"
import {SpellType} from "../../spell/spellType"
import { Disposition } from "../enum/disposition"
import { Gender } from "../enum/gender"
import { Standing } from "../enum/standing"
import DamageEventBuilder from "../event/damageEventBuilder"
import {DamageType} from "../fight/enum/damageType"
import { RaceType } from "../race/enum/raceType"
import createRaceFromRaceType from "../race/factory"
import Race from "../race/race"
import AlignmentService from "../service/alignmentService"
import { SpecializationType } from "../specialization/enum/specializationType"
import {createSpecializationFromType} from "../specialization/factory"
import {Specialization} from "../specialization/specialization"
import DamageSourceEntity from "./damageSourceEntity"
import MobResetEntity from "./mobResetEntity"
import {MobTraitsEntity} from "./mobTraitsEntity"
import OffensiveTraitsEntity from "./offensiveTraitsEntity"
import { PlayerMobEntity } from "./playerMobEntity"
import ShopEntity from "./shopEntity"

@Entity()
export class MobEntity {
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

  @Column("integer")
  public hp: number

  @Column("integer")
  public mana: number

  @Column("integer")
  public mv: number

  @OneToOne(() => DamageSourceEntity, { cascade: true, eager: true })
  @JoinColumn()
  public immune: DamageSourceEntity

  @OneToOne(() => DamageSourceEntity, { cascade: true, eager: true })
  @JoinColumn()
  public resist: DamageSourceEntity

  @OneToOne(() => DamageSourceEntity, { cascade: true, eager: true })
  @JoinColumn()
  public vulnerable: DamageSourceEntity

  @OneToMany(() => Affect, affect => affect.mob, { cascade: true, eager: true })
  public affects: Affect[]

  @OneToOne(() => MobTraitsEntity, { cascade: true, eager: true })
  @JoinColumn()
  public traits: MobTraitsEntity

  @OneToOne(() => OffensiveTraitsEntity, { cascade: true, eager: true })
  @JoinColumn()
  public offensiveTraits: OffensiveTraitsEntity

  @OneToOne(() => ShopEntity, { cascade: true })
  @JoinColumn()
  public shop: ShopEntity

  @OneToMany(() => Attributes, attributes => attributes.mob, { cascade: true, eager: true })
  public attributes: Attributes[]

  @ManyToOne(() => Player, player => player.mobs)
  public player: Player

  @OneToOne(() => Inventory, { cascade: true, eager: true })
  @JoinColumn()
  public inventory: Inventory

  @OneToOne(() => Inventory, { cascade: true, eager: true })
  @JoinColumn()
  public equipped: Inventory

  @OneToMany(() => Skill, skill => skill.mob, { cascade: true, eager: true })
  public skills: Skill[]

  @OneToMany(() => Spell, spell => spell.mob, { cascade: true, eager: true })
  public spells: Spell[]

  @OneToOne(() => PlayerMobEntity, playerMob => playerMob.mob, { nullable: true, cascade: true, eager: true })
  public playerMob: PlayerMobEntity

  @OneToMany(() => MobResetEntity, reset => reset.mob)
  public mobResets: MobResetEntity[]

  public pet: MobEntity

  public follows: MobEntity

  public deathTimer: number = 0

  public getCreationPoints(): number {
    return this.playerMob.getCreationPoints() + this.race().creationPoints
  }

  public specialization(): Specialization {
    return createSpecializationFromType(this.specializationType)
  }

  public race(): Race {
    return createRaceFromRaceType(this.raceType)
  }

  public affect(): AffectService {
    return new AffectService(this)
  }

  public align(): AlignmentService {
    return new AlignmentService(this)
  }

  public attribute(): AttributeService {
    return new AttributeService(this)
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

  public getSpell(spellType: SpellType): Spell | undefined {
    return this.spells.find(spell => spell.spellType === spellType)
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

  public createDamageEventBuilder(amount: number, damageType: DamageType): DamageEventBuilder {
    return new DamageEventBuilder(
      this,
      amount,
      damageType)
  }
}
