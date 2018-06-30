import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import Attributes from "../../attributes/model/attributes"
import { Mob } from "../../mob/model/mob"
import { AffectType } from "../affectType"
import { Item } from "../../item/model/item"

@Entity()
export class Affect {
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne((type) => Mob, (mob) => mob.affects)
  public mob: Mob

  @ManyToOne((type) => Item, (item) => item.affects)
  public item: Item

  @Column("text")
  public affectType: AffectType

  @Column("integer")
  public timeout: number

  @OneToOne((type) => Attributes)
  @JoinColumn()
  public attributes: Attributes = new Attributes()
}
