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
  public wanders: boolean = false

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

  public copy() {
    const traits = new MobTraits()
    traits.isNpc = this.isNpc
    traits.wanders = this.wanders
    traits.scavenger = this.scavenger
    traits.aggressive = this.aggressive
    traits.stayArea = this.stayArea
    traits.wimpy = this.wimpy
    traits.isPet = this.isPet
    traits.trainer = this.trainer
    traits.practice = this.practice
    traits.undead = this.undead
    traits.weaponsmith = this.weaponsmith
    traits.armorer = this.armorer
    traits.cleric = this.cleric
    traits.mage = this.mage
    traits.ranger = this.ranger
    traits.warrior = this.warrior
    traits.noAlign = this.noAlign
    traits.noPurge = this.noPurge
    traits.outdoors = this.outdoors
    traits.indoors = this.indoors
    traits.mount = this.mount
    traits.healer = this.healer
    traits.gain = this.gain
    traits.changer = this.changer
    traits.noTrans = this.noTrans
    return traits
  }
}
