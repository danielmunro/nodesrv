import {Column, CreateDateColumn, Entity, Generated, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {PlayerEntity} from "./playerEntity"

@Entity()
export class SubscriptionEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string

  @ManyToOne(() => PlayerEntity, player => player.subscriptions)
  public player: PlayerEntity

  @CreateDateColumn()
  public created: Date
}
