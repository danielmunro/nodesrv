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
import { Spell } from "../../spell/model/spell"
import { modifiers } from "../race/modifier"
import { Race } from "../race/race"

@Entity()
export class Mob {
    @PrimaryGeneratedColumn()
    public id: number

    @Column("text")
    @Generated("uuid")
    public uuid: string = v4()

    @Column("text")
    public name: string

    @Column("text")
    public description: string

    @Column("text")
    public race: Race

    @Column("integer")
    public level: number = 1

    @Column("boolean")
    public wanders: boolean = false

    @OneToMany((type) => Affect, (affect) => affect.mob, { cascadeInsert: true, eager: true })
    public affects: Affect[] = []

    @OneToOne((type) => Vitals, { cascadeInsert: true, eager: true })
    @JoinColumn()
    public vitals: Vitals = new Vitals()

    @OneToMany((type) => Attributes, (attributes) => attributes.mob, { cascadeInsert: true, eager: true })
    public attributes: Attributes[] = []

    @ManyToOne((type) => Room, (room) => room.mobs)
    public room: Room

    @ManyToOne((type) => Room, { eager: true })
    @JoinColumn()
    public startRoom: Room

    @ManyToOne((type) => Player, (player) => player.mobs)
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
      this.attributes.map((a) => attributes = attributes.combine(a))
      this.equipped.inventory.items.map((i) => attributes = attributes.combine(i.attributes))
      modifiers.map((modifier) => attributes = modifier(this.race, attributes))

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
}
