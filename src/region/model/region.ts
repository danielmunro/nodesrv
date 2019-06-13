import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { RoomEntity } from "../../room/entity/roomEntity"
import { Terrain } from "../enum/terrain"

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("text", { nullable: true })
  public name: string

  @Column("integer")
  public terrain: Terrain = Terrain.Plains

  @OneToMany(() => RoomEntity, (room) => room.region)
  public rooms: RoomEntity[]
}
