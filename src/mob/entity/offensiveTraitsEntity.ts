import {Column, Entity, Generated, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"

@Entity()
export default class OffensiveTraitsEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("boolean")
  public areaAttack: boolean = false

  @Column("boolean")
  public backstab: boolean = false

  @Column("boolean")
  public bash: boolean = false

  @Column("boolean")
  public berserk: boolean = false

  @Column("boolean")
  public disarm: boolean = false

  @Column("boolean")
  public dodge: boolean = false

  @Column("boolean")
  public fade: boolean = false

  @Column("boolean")
  public fast: boolean = false

  @Column("boolean")
  public kick: boolean = false

  @Column("boolean")
  public kickDirt: boolean = false

  @Column("boolean")
  public parry: boolean = false

  @Column("boolean")
  public rescue: boolean = false

  @Column("boolean")
  public tail: boolean = false

  @Column("boolean")
  public trip: boolean = false

  @Column("boolean")
  public crush: boolean = false

  @Column("boolean")
  public assistAll: boolean = false

  @Column("boolean")
  public assistAlign: boolean = false

  @Column("boolean")
  public assistRace: boolean = false

  @Column("boolean")
  public assistPlayers: boolean = false

  @Column("boolean")
  public assistGuard: boolean = false

  @Column("boolean")
  public assistVnum: boolean = false

  @Column("boolean")
  public offCharge: boolean = false

  @Column("boolean")
  public assistElement: boolean = false
}
