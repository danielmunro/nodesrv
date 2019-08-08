import {Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"
import {AffectEntity} from "../../affect/entity/affectEntity"
import {AffectType} from "../../affect/enum/affectType"
import AffectService from "../../affect/service/affectService"
import {default as Attributes} from "../../attributes/entity/attributesEntity"
import AttributeService from "../../attributes/service/attributeService"
import {InventoryEntity} from "../../item/entity/inventoryEntity"
import {ItemEntity} from "../../item/entity/itemEntity"
import {Equipment} from "../../item/enum/equipment"
import {PlayerEntity} from "../../player/entity/playerEntity"
import {AuthorizationLevel} from "../../player/enum/authorizationLevel"
import {RoomEntity} from "../../room/entity/roomEntity"
import Describeable from "../../type/describeable"
import {Disposition} from "../enum/disposition"
import {Gender} from "../enum/gender"
import {Standing} from "../enum/standing"
import DamageEventBuilder from "../event/damageEventBuilder"
import {DamageType} from "../fight/enum/damageType"
import {RaceType} from "../race/enum/raceType"
import createRaceFromRaceType from "../race/factory"
import Race from "../race/race"
import AlignmentService from "../service/alignmentService"
import {SkillEntity} from "../skill/entity/skillEntity"
import {SkillType} from "../skill/skillType"
import {SpecializationType} from "../specialization/enum/specializationType"
import {createSpecializationFromType} from "../specialization/factory/factory"
import {Specialization} from "../specialization/specialization"
import {SpellEntity} from "../spell/entity/spellEntity"
import {SpellType} from "../spell/spellType"
import DamageSourceEntity from "./damageSourceEntity"
import MobResetEntity from "./mobResetEntity"
import {MobTraitsEntity} from "./mobTraitsEntity"
import OffensiveTraitsEntity from "./offensiveTraitsEntity"
import {PlayerMobEntity} from "./playerMobEntity"
import ShopEntity from "./shopEntity"

@Entity()
export class MobEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string = v4()

  @Column({ nullable: true })
  public canonicalId: string

  @Column()
  public name: string

  @Column({ nullable: true })
  public description: string

  @Column({ nullable: true })
  public brief: string

  @Column("text")
  public raceType: RaceType

  @Column("text", { nullable: true })
  public specializationType: SpecializationType

  @Column({ default: 1 })
  public level: number

  @Column({ default: 0 })
  public gold: number

  @Column("text", { default: Gender.Unspecified })
  public gender: Gender = Gender.Unspecified

  @Column("text", { default: Disposition.Standing })
  public disposition = Disposition.Standing

  @Column({ default: 0 })
  public alignment: number

  @Column("float")
  public hp: number

  @Column("float")
  public mana: number

  @Column("float")
  public mv: number

  @Column({ default: true })
  public allowFollow: boolean

  @OneToOne(() => DamageSourceEntity, { cascade: true, eager: true })
  @JoinColumn()
  public immune: DamageSourceEntity

  @OneToOne(() => DamageSourceEntity, { cascade: true, eager: true })
  @JoinColumn()
  public resist: DamageSourceEntity

  @OneToOne(() => DamageSourceEntity, { cascade: true, eager: true })
  @JoinColumn()
  public vulnerable: DamageSourceEntity

  @OneToMany(() => AffectEntity, affect => affect.mob, { cascade: true, eager: true })
  public affects: AffectEntity[]

  @OneToOne(() => MobTraitsEntity, { cascade: true, eager: true })
  @JoinColumn()
  public traits: MobTraitsEntity

  @OneToOne(() => OffensiveTraitsEntity, { cascade: true, eager: true })
  @JoinColumn()
  public offensiveTraits: OffensiveTraitsEntity

  @OneToOne(() => ShopEntity, { cascade: true, eager: true })
  @JoinColumn()
  public shop: ShopEntity

  @OneToMany(() => Attributes, attributes => attributes.mob, { cascade: true, eager: true })
  public attributes: Attributes[]

  @ManyToOne(() => PlayerEntity, player => player.mobs)
  public player: PlayerEntity

  @OneToOne(() => InventoryEntity, { cascade: true, eager: true })
  @JoinColumn()
  public inventory: InventoryEntity

  @OneToOne(() => InventoryEntity, { cascade: true, eager: true })
  @JoinColumn()
  public equipped: InventoryEntity

  @OneToMany(() => SkillEntity, skill => skill.mob, { cascade: true, eager: true })
  public skills: SkillEntity[]

  @OneToMany(() => SpellEntity, spell => spell.mob, { cascade: true, eager: true })
  public spells: SpellEntity[]

  @OneToOne(() => PlayerMobEntity, playerMob => playerMob.mob, { nullable: true, cascade: true, eager: true })
  public playerMob: PlayerMobEntity

  @OneToMany(() => MobResetEntity, reset => reset.mob)
  public mobResets: MobResetEntity[]

  @OneToMany(() => RoomEntity, room => room.owner)
  public ownedRooms: RoomEntity[]

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

  public getSkill(skillType: SkillType): SkillEntity | undefined {
    return this.skills.find(skill => skill.skillType === skillType)
  }

  public getSpell(spellType: SpellType): SpellEntity | undefined {
    return this.spells.find(spell => spell.spellType === spellType)
  }

  public getFirstEquippedItemAtPosition(equipment: Equipment): ItemEntity | undefined {
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

  public look(): string {
    if (this.playerMob) {
      return `${this.name} is here.`
    }

    return this.brief
  }

  public describe(): string {
    return this.description + "\n\nEquipped:\n" + this.equipped.items.reduce(
      (previous, current) => previous + current.equipment + ": " + current.brief + "\n", "")
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

  public canSee(thing: Describeable): boolean {
    const aff = this.affect()
    const thingAff = thing.affect()

    if (thingAff.has(AffectType.Hidden) && aff.has(AffectType.DetectHidden)) {
      return true
    }

    if (thingAff.has(AffectType.Invisible) && aff.has(AffectType.DetectInvisible)) {
      return true
    }

    return !thingAff.has(AffectType.Hidden) && !thingAff.has(AffectType.Invisible)
  }

  public is(mob: MobEntity) {
    return this.uuid === mob.uuid
  }
}
