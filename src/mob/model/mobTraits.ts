import {Column, Entity, Generated, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"

@Entity()
export class MobTraits {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("boolean")
  public isNpc: boolean = false

  @Column("boolean")
  public wanders: boolean = true

  @Column("boolean")
  public scavenger: boolean = false

  @Column("boolean")
  public aggressive: boolean = false

  @Column("boolean")
  public stayArea: boolean = false

  @Column("boolean")
  public wimpy: boolean = false

  @Column("boolean")
  public isPet: boolean = false

  @Column("boolean")
  public trainer: boolean = false

  @Column("boolean")
  public practice: boolean = false

  @Column("boolean")
  public undead: boolean = false

  @Column("boolean")
  public weaponsmith: boolean = false

  @Column("boolean")
  public armorer: boolean = false

  @Column("boolean")
  public cleric: boolean = false

  @Column("boolean")
  public mage: boolean = false

  @Column("boolean")
  public ranger: boolean = false

  @Column("boolean")
  public warrior: boolean = false

  @Column("boolean")
  public noAlign: boolean = false

  @Column("boolean")
  public noPurge: boolean = false

  @Column("boolean")
  public outdoors: boolean = false

  @Column("boolean")
  public indoors: boolean = false

  @Column("boolean")
  public mount: boolean = false

  @Column("boolean")
  public healer: boolean = false

  @Column("boolean")
  public gain: boolean = false

  @Column("boolean")
  public changer: boolean = false

  @Column("boolean")
  public noTrans: boolean = false
}
