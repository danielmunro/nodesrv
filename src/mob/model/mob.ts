import {Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Affect } from "../../affect/constants"
import { newAttributes, newHitroll, newStats, newVitals } from "../../attributes/factory"
import Attributes from "../../attributes/model/attributes"
import Vitals from "../../attributes/model/vitals"
import { Equipped } from "../../item/model/equipped"
import { Inventory } from "../../item/model/inventory"
import { Player } from "../../player/model/player"
import { Room } from "../../room/model/room"
import { modifiers } from "../race/modifier"
import { Race } from "../race/race"
import { Skill } from "./skill"

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

    @Column("simple-array")
    public affects: Affect[] = []

    @OneToOne((type) => Vitals, { cascadeInsert: true, eager: true })
    @JoinColumn()
    public vitals: Vitals = new Vitals()

    @OneToMany((type) => Attributes, (attributes) => attributes.mob, { cascadeInsert: true, eager: true })
    public attributes: Attributes[] = []

    @ManyToOne((type) => Room, (room) => room.mobs)
    public room: Room

    @ManyToOne((type) => Room)
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

    public getCombinedAttributes(): Attributes {
      let attributes = newAttributes(newVitals(0, 0, 0), newStats(0, 0, 0, 0, 0, 0), newHitroll(0, 0))
      this.attributes.map((a) => attributes = attributes.combine(a))
      this.equipped.inventory.items.map((i) => attributes = attributes.combine(i.attributes))
      modifiers.map((modifier) => attributes = modifier(this.race, attributes))

      return attributes
    }

    public matches(subject: string): boolean {
      return this.name.split(" ").find((word) => word.startsWith(subject)) ? true : false
    }
}
