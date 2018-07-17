import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Item } from "../../item/model/item"
import { Mob } from "../../mob/model/mob"
import { newAttributes, newHitroll, newStats, newVitals } from "../factory"
import Ac from "./ac"
import Hitroll from "./hitroll"
import Stats from "./stats"
import Vitals from "./vitals"

@Entity()
export default class Attributes {
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne((type) => Mob, (mob) => mob.attributes)
  public mob: Mob

  @OneToOne((type) => Item, (item) => item.attributes)
  public item: Item

  @OneToOne((type) => Hitroll, { eager: true, cascadeAll: true })
  @JoinColumn()
  public hitroll = new Hitroll()

  @OneToOne((type) => Vitals, { eager: true, cascadeAll: true })
  @JoinColumn()
  public vitals = new Vitals()

  @OneToOne((type) => Stats, { eager: true, cascadeAll: true })
  @JoinColumn()
  public stats = new Stats()

  @OneToOne((type) => Ac, { eager: true, cascadeAll: true })
  @JoinColumn()
  public ac = new Ac()

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

    attributes.ac.bash = this.ac.bash + withAttributes.ac.bash
    attributes.ac.slash = this.ac.slash + withAttributes.ac.slash
    attributes.ac.pierce = this.ac.pierce + withAttributes.ac.pierce
    attributes.ac.magic = this.ac.magic + withAttributes.ac.magic

    return attributes
  }

  public copy(): Attributes {
    return newAttributes(
      newVitals(this.vitals.hp, this.vitals.mana, this.vitals.mv),
      newStats(this.stats.str, this.stats.int, this.stats.wis, this.stats.dex, this.stats.con, this.stats.sta),
      newHitroll(this.hitroll.hit, this.hitroll.dam),
    )
  }
}
