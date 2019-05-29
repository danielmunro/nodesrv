import {Entity, JoinColumn, ManyToOne} from "typeorm"
import { Room } from "../../room/model/room"
import ItemReset from "./itemReset"

@Entity()
export class ItemRoomReset extends ItemReset {
  @ManyToOne(() => Room)
  @JoinColumn()
  public room: Room
}
