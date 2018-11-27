import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Room } from "../../room/model/room"
import ItemReset from "./itemReset"

@Entity()
export class ItemRoomReset extends ItemReset {
  @PrimaryGeneratedColumn()
  public id: number

  @OneToOne(type => Room, { eager: true })
  @JoinColumn()
  public room: Room
}
