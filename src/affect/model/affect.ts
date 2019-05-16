import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import Attributes from "../../attributes/model/attributes"
import { Item } from "../../item/model/item"
import DamageSource from "../../mob/model/damageSource"
import { Mob } from "../../mob/model/mob"
import { AffectType } from "../enum/affectType"

@Entity()
export class Affect {
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(() => Mob, (mob) => mob.affects)
  public mob: Mob

  @ManyToOne(() => Item, (item) => item.affects)
  public item: Item

  @Column("text")
  public affectType: AffectType

  @Column("integer")
  public timeout: number

  @Column("integer")
  public level: number = 1

  @OneToOne(() => Attributes)
  @JoinColumn()
  public attributes: Attributes

  @OneToOne(() => DamageSource, { cascadeAll: true, eager: true })
  @JoinColumn()
  public immune: DamageSource = new DamageSource()

  @OneToOne(() => DamageSource, { cascadeAll: true, eager: true })
  @JoinColumn()
  public resist: DamageSource = new DamageSource()

  @OneToOne(() => DamageSource, { cascadeAll: true, eager: true })
  @JoinColumn()
  public vulnerable: DamageSource = new DamageSource()
}
