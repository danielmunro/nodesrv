import {Entity, JoinColumn, ManyToOne} from "typeorm"
import { RoomEntity } from "../../room/entity/roomEntity"
import ItemReset from "./itemReset"

@Entity()
export class ItemRoomReset extends ItemReset {
  @ManyToOne(() => RoomEntity, { eager: true })
  @JoinColumn()
  public room: RoomEntity
}
