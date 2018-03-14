import {Column, Entity, Generated, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Inventory } from "../../item/model/inventory"
import { Player } from "../../player/model/player"
import { Room } from "../../room/model/room"

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

    @ManyToOne((type) => Room, (room) => room.mobs)
    public room: Room

    @ManyToOne((type) => Player, (player) => player.mobs)
    public player: Player

    @OneToOne((type) => Inventory)
    public inventory = new Inventory()
}
