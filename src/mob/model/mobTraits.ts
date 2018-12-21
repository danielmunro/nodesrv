import {Column, Entity, Generated, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"
import {Mob} from "./mob"

@Entity()
export class MobTraits {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("boolean")
  public wanders: boolean = false

  @Column("boolean")
  public isNpc: boolean = true

  @OneToOne(() => Mob, mob => mob.traits)
  public mob
}
