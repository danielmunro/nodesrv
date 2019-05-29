import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Item } from "../../item/model/item"
import { Mob } from "../../mob/model/mob"
import {newEmptyAttributes} from "../factory/attributeFactory"
import Ac from "./ac"
import Stats from "./stats"

@Entity()
export default class Attributes {
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(() => Mob, mob => mob.attributes)
  public mob: Mob

  @OneToOne(() => Item, item => item.attributes)
  public item: Item

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

  @OneToOne(() => Stats, { eager: true, cascade: true })
  @JoinColumn()
  public stats = new Stats()

  @OneToOne(() => Ac, { eager: true, cascade: true })
  @JoinColumn()
  public ac = new Ac()

  public combine(withAttributes: Attributes): Attributes {
    const attributes = newEmptyAttributes()
    attributes.hit = this.hit + withAttributes.hit
    attributes.dam = this.dam + withAttributes.dam

    attributes.stats.str = this.stats.str + withAttributes.stats.str
    attributes.stats.int = this.stats.int + withAttributes.stats.int
    attributes.stats.wis = this.stats.wis + withAttributes.stats.wis
    attributes.stats.dex = this.stats.dex + withAttributes.stats.dex
    attributes.stats.con = this.stats.con + withAttributes.stats.con
    attributes.stats.sta = this.stats.sta + withAttributes.stats.sta

    attributes.str = this.str + withAttributes.str
    attributes.int = this.int + withAttributes.int
    attributes.wis = this.wis + withAttributes.wis
    attributes.dex = this.dex + withAttributes.dex
    attributes.con = this.con + withAttributes.con
    attributes.sta = this.sta + withAttributes.sta

    attributes.hp = this.hp + withAttributes.hp
    attributes.mana = this.mana + withAttributes.mana
    attributes.mv = this.mv + withAttributes.mv

    attributes.ac.bash = this.ac.bash + withAttributes.ac.bash
    attributes.ac.slash = this.ac.slash + withAttributes.ac.slash
    attributes.ac.pierce = this.ac.pierce + withAttributes.ac.pierce
    attributes.ac.magic = this.ac.magic + withAttributes.ac.magic

    attributes.acBash = this.acBash + withAttributes.acBash
    attributes.acSlash = this.acSlash + withAttributes.acSlash
    attributes.acPierce = this.acPierce + withAttributes.acPierce
    attributes.acMagic = this.acMagic + withAttributes.acMagic

    return attributes
  }
}
