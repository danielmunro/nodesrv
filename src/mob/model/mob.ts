import {Column, Entity, Generated, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
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
}
