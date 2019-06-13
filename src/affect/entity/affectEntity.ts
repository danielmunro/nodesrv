import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import AttributesEntity from "../../attributes/entity/attributesEntity"
import { Item } from "../../item/model/item"
import DamageSourceEntity from "../../mob/entity/damageSourceEntity"
import { MobEntity } from "../../mob/entity/mobEntity"
import { AffectType } from "../enum/affectType"

@Entity()
export class AffectEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(() => MobEntity, (mob) => mob.affects)
  public mob: MobEntity

  @ManyToOne(() => Item, (item) => item.affects)
  public item: Item

  @Column("text")
  public affectType: AffectType

  @Column("integer")
  public timeout: number

  @Column("integer")
  public level: number = 1

  @OneToOne(() => AttributesEntity, { cascade: true, eager: true })
  @JoinColumn()
  public attributes: AttributesEntity

  @OneToOne(() => DamageSourceEntity, { cascade: true, eager: true })
  @JoinColumn()
  public immune: DamageSourceEntity = new DamageSourceEntity()

  @OneToOne(() => DamageSourceEntity, { cascade: true, eager: true })
  @JoinColumn()
  public resist: DamageSourceEntity = new DamageSourceEntity()

  @OneToOne(() => DamageSourceEntity, { cascade: true, eager: true })
  @JoinColumn()
  public vulnerable: DamageSourceEntity = new DamageSourceEntity()
}
