import {Column, Entity, Generated, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"

@Entity()
export class TickEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string = v4()

  @Column("timestamp")
  public created: Date

  @Column()
  public numberOfMobs: number

  @Column()
  public numberOfPlayers: number

  @Column()
  public timeOfDay: number
}
