import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Item } from "../../item/model/item"
import { Mob } from "../../mob/model/mob"
import Hitroll from "./hitroll"
import Stats from "./stats"
import Vitals from "./vitals"

@Entity()
export default class Attributes {
  public static withStats(stats: Stats): Attributes {
    const attributes = new Attributes()
    attributes.stats = stats

    return attributes
  }

  public static withVitals(vitals: Vitals): Attributes {
    const attributes = new Attributes()
    attributes.vitals = vitals

    return attributes
  }

  public static withHitrollStats(hitroll: Hitroll, stats: Stats) {
    const attributes = new Attributes()
    attributes.hitroll = hitroll
    attributes.stats = stats

    return attributes
  }

  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne((type) => Mob, (mob) => mob.attributes)
  public mob: Mob

  @OneToOne((type) => Item, (item) => item.attributes)
  public item: Item

  @OneToOne((type) => Hitroll)
  public hitroll = new Hitroll()

  @OneToOne((type) => Vitals)
  public vitals = new Vitals()

  @OneToOne((type) => Stats)
  public stats = new Stats()

  public combine(withAttributes: Attributes): Attributes {
    const attributes = new Attributes()
    attributes.hitroll.hit = this.hitroll.hit + withAttributes.hitroll.hit
    attributes.hitroll.dam = this.hitroll.dam + withAttributes.hitroll.dam

    attributes.stats.str = this.stats.str + withAttributes.stats.str
    attributes.stats.int = this.stats.int + withAttributes.stats.int
    attributes.stats.wis = this.stats.wis + withAttributes.stats.wis
    attributes.stats.dex = this.stats.dex + withAttributes.stats.dex
    attributes.stats.con = this.stats.con + withAttributes.stats.con
    attributes.stats.sta = this.stats.sta + withAttributes.stats.sta

    attributes.vitals.hp = this.vitals.hp + withAttributes.vitals.hp
    attributes.vitals.mana = this.vitals.mana + withAttributes.vitals.mana
    attributes.vitals.mv = this.vitals.mv + withAttributes.vitals.mv

    return attributes
  }
}
