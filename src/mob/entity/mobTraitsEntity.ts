import {Column, Entity, Generated, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"

@Entity()
export class MobTraitsEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string = v4()

  @Column()
  public isNpc: boolean = false

  @Column()
  public wanders: boolean = true

  @Column()
  public scavenger: boolean = false

  @Column()
  public aggressive: boolean = false

  @Column()
  public stayArea: boolean = false

  @Column()
  public wimpy: boolean = false

  @Column()
  public isPet: boolean = false

  @Column()
  public trainer: boolean = false

  @Column()
  public practice: boolean = false

  @Column()
  public undead: boolean = false

  @Column()
  public weaponsmith: boolean = false

  @Column()
  public armorer: boolean = false

  @Column()
  public cleric: boolean = false

  @Column()
  public mage: boolean = false

  @Column()
  public ranger: boolean = false

  @Column()
  public warrior: boolean = false

  @Column()
  public noAlign: boolean = false

  @Column()
  public noPurge: boolean = false

  @Column()
  public outdoors: boolean = false

  @Column()
  public indoors: boolean = false

  @Column()
  public mount: boolean = false

  @Column()
  public healer: boolean = false

  @Column()
  public gain: boolean = false

  @Column()
  public changer: boolean = false

  @Column()
  public noTrans: boolean = false
}
