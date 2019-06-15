import {Column, Entity, Generated, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"

@Entity()
export default class OffensiveTraitsEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string = v4()

  @Column({ default: false })
  public areaAttack: boolean

  @Column({ default: false })
  public backstab: boolean

  @Column({ default: false })
  public bash: boolean

  @Column({ default: false })
  public berserk: boolean

  @Column({ default: false })
  public disarm: boolean

  @Column({ default: false })
  public dodge: boolean

  @Column({ default: false })
  public fade: boolean

  @Column({ default: false })
  public fast: boolean

  @Column({ default: false })
  public kick: boolean

  @Column({ default: false })
  public kickDirt: boolean

  @Column({ default: false })
  public parry: boolean

  @Column({ default: false })
  public rescue: boolean

  @Column({ default: false })
  public tail: boolean

  @Column({ default: false })
  public trip: boolean

  @Column({ default: false })
  public crush: boolean

  @Column({ default: false })
  public assistAll: boolean

  @Column({ default: false })
  public assistAlign: boolean

  @Column({ default: false })
  public assistRace: boolean

  @Column({ default: false })
  public assistPlayers: boolean

  @Column({ default: false })
  public assistGuard: boolean

  @Column({ default: false })
  public assistVnum: boolean

  @Column({ default: false })
  public offCharge: boolean

  @Column({ default: false })
  public assistElement: boolean
}
