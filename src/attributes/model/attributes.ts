import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import { Mob } from "../../mob/model/mob"
import {newEmptyAttributes} from "../factory/attributeFactory"

@Entity()
export default class Attributes {
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(() => Mob, mob => mob.attributes)
  public mob: Mob

  @Column("integer", { default: 0 })
  public hit: number

  @Column("integer", { default: 0 })
  public dam: number

  @Column("integer", { default: 0 })
  public hp: number

  @Column("integer", { default: 0 })
  public mana: number

  @Column("integer", { default: 0 })
  public mv: number

  @Column("integer", { default: 0 })
  public str: number

  @Column("integer", { default: 0 })
  public int: number

  @Column("integer", { default: 0 })
  public wis: number

  @Column("integer", { default: 0 })
  public dex: number

  @Column("integer", { default: 0 })
  public con: number

  @Column("integer", { default: 0 })
  public sta: number

  @Column("integer", { default: 0 })
  public acPierce: number

  @Column("integer", { default: 0 })
  public acBash: number

  @Column("integer", { default: 0 })
  public acSlash: number

  @Column("integer", { default: 0 })
  public acMagic: number

  public combine(withAttributes: Attributes): Attributes {
    const attributes = newEmptyAttributes()
    attributes.hit = this.hit + withAttributes.hit
    attributes.dam = this.dam + withAttributes.dam

    attributes.str = this.str + withAttributes.str
    attributes.int = this.int + withAttributes.int
    attributes.wis = this.wis + withAttributes.wis
    attributes.dex = this.dex + withAttributes.dex
    attributes.con = this.con + withAttributes.con
    attributes.sta = this.sta + withAttributes.sta

    attributes.hp = this.hp + withAttributes.hp
    attributes.mana = this.mana + withAttributes.mana
    attributes.mv = this.mv + withAttributes.mv

    attributes.acBash = this.acBash + withAttributes.acBash
    attributes.acSlash = this.acSlash + withAttributes.acSlash
    attributes.acPierce = this.acPierce + withAttributes.acPierce
    attributes.acMagic = this.acMagic + withAttributes.acMagic

    return attributes
  }
}
