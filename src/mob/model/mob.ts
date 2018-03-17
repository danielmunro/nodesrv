import {Column, Entity, Generated, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Equipped } from "../../item/model/equipped"
import { Inventory } from "../../item/model/inventory"
import { Player } from "../../player/model/player"
import { Room } from "../../room/model/room"
import { Race } from "../race/race"

@Entity()
export class Mob {
    @PrimaryGeneratedColumn()
    public id: number

    @Column("text")
    @Generated("uuid")
    public uuid: string

    @Column("text")
    public name: string

    @Column("text")
    public description: string

    @Column("text")
    public race: Race

    @ManyToOne((type) => Room, (room) => room.mobs)
    public room: Room

    @ManyToOne((type) => Player, (player) => player.mobs)
    public player: Player

    @OneToOne((type) => Inventory, (inventory) => inventory.mob)
    public inventory = new Inventory()

    @OneToOne((type) => Equipped, (equipped) => equipped.mob)
    public equipped = new Equipped()
}
