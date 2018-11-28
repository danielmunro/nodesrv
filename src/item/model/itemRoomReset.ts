import { Entity, JoinColumn, OneToOne } from "typeorm"
import { Room } from "../../room/model/room"
import ItemReset from "./itemReset"

@Entity()
export class ItemRoomReset extends ItemReset {
  @OneToOne(type => Room, { eager: true })
  @JoinColumn()
  public room: Room
}
