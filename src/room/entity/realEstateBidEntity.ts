import {Column, CreateDateColumn, Entity, Generated, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import uuid from "uuid"
import {MobEntity} from "../../mob/entity/mobEntity"
import {RealEstateBidStatus} from "../enum/realEstateBidStatus"
import {RealEstateListingEntity} from "./realEstateListingEntity"

@Entity()
export class RealEstateBidEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string = uuid()

  @OneToOne(() => RealEstateListingEntity)
  public listing: RealEstateListingEntity

  @OneToOne(() => MobEntity)
  public bidder: MobEntity

  @CreateDateColumn()
  public created: Date

  @Column({ type: "float" })
  public amount: number

  @Column({ type: "varchar" })
  public status: RealEstateBidStatus
}
