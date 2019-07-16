import {Column, CreateDateColumn, Entity, Generated, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {PlayerEntity} from "./playerEntity"

@Entity()
export class PaymentMethodEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string

  @ManyToOne(() => PlayerEntity, player => player.paymentMethods)
  public player: PlayerEntity

  @CreateDateColumn()
  public created: Date

  @Column()
  public stripePaymentMethodId: string

  @Column()
  public nickname: string
}
