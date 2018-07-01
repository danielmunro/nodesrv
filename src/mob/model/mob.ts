import {Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { AffectType } from "../../affect/affectType"
import { Affect } from "../../affect/model/affect"
import { newAttributes, newHitroll, newStats, newVitals } from "../../attributes/factory"
import Attributes from "../../attributes/model/attributes"
import Vitals from "../../attributes/model/vitals"
import { Equipped } from "../../item/model/equipped"
import { Inventory } from "../../item/model/inventory"
import { Player } from "../../player/model/player"
import { Room } from "../../room/model/room"
import { Skill } from "../../skill/model/skill"
import { SkillType } from "../../skill/skillType"
import { Spell } from "../../spell/model/spell"
import { Disposition } from "../disposition"
import { modifiers } from "../race/modifier"
import { Race } from "../race/race"
import { SpecializationType } from "../specialization/specializationType"

@Entity()
export class Mob {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("text")
  public name: string

  @Column("text", { nullable: true })
  public description: string

  @Column("text")
  public race: Race

  @Column("text", { nullable: true })
  public specialization: SpecializationType

  @Column("integer")
  public level: number = 1

  @Column("boolean", {default: false})
  public wanders: boolean = false

  @Column("boolean", {default: false})
  public isPlayer: boolean = false

  @Column("integer", {default: 0})
  public gold: number = 0

  @Column("text", { nullable: true })
  public disposition = Disposition.Standing

  @OneToMany((type) => Affect, (affect) => affect.mob, { cascadeInsert: true, eager: true })
  public affects: Affect[] = []

  @OneToOne((type) => Vitals, { cascadeInsert: true, eager: true })
  @JoinColumn()
  public vitals: Vitals = new Vitals()

  @OneToMany((type) => Attributes, (attributes) => attributes.mob, { cascadeInsert: true, eager: true })
  public attributes: Attributes[] = []

  @ManyToOne((type) => Room, (room) => room.mobs, { eager: true })
  public room: Room

  @ManyToOne((type) => Room, { eager: true })
  @JoinColumn()
  public startRoom: Room

  @ManyToOne((type) => Player, (player) => player.mobs, { eager: true })
  public player: Player

  @OneToOne((type) => Inventory, { cascadeInsert: true, eager: true })
  @JoinColumn()
  public inventory = new Inventory()

  @OneToOne((type) => Equipped, { cascadeInsert: true, eager: true })
  @JoinColumn()
  public equipped = new Equipped()

  @OneToMany((type) => Skill, (skill) => skill.mob, { cascadeInsert: true, cascadeUpdate: true })
  public skills: Skill[] = []

  @OneToMany((type) => Spell, (spell) => spell.mob, { cascadeInsert: true, cascadeUpdate: true })
  public spells: Spell[] = []

  public getCombinedAttributes(): Attributes {
    let attributes = newAttributes(newVitals(0, 0, 0), newStats(0, 0, 0, 0, 0, 0), newHitroll(0, 0))
    this.attributes.forEach((a) => attributes = attributes.combine(a))
    this.equipped.inventory.items.forEach((i) => attributes = attributes.combine(i.attributes))
    modifiers.forEach((modifier) => attributes = modifier(this.race, attributes))

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

  public isMerchant(): boolean {
    return !this.isPlayer && this.skills.find((skill) => skill.skillType === SkillType.Haggle) !== undefined
  }
}
