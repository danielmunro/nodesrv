import {Entity, JoinColumn, ManyToOne} from "typeorm"
import { RoomEntity } from "../../room/entity/roomEntity"
import ItemResetEntity from "./itemResetEntity"

@Entity()
export class ItemRoomResetEntity extends ItemResetEntity {
  @ManyToOne(() => RoomEntity, { eager: true })
  @JoinColumn()
  public room: RoomEntity
}
