import {Column, CreateDateColumn, Entity, Generated, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import * as uuid from "uuid"
import {MobEntity} from "../../mob/entity/mobEntity"
import {RoomEntity} from "./roomEntity"

@Entity()
export class RealEstateListingEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string = uuid()

  @OneToOne(() => RoomEntity)
  public room: RoomEntity

  @OneToOne(() => MobEntity)
  public agent: MobEntity

  @CreateDateColumn()
  public created: Date

  @Column({ type: "float" })
  public offeringPrice: number
}
