import { Column, Entity } from "typeorm"
import { AttackVerb } from "../../mob/enum/attackVerb"
import { DamageType } from "../../mob/fight/enum/damageType"
import {SpellType} from "../../spell/spellType"
import { WeaponType } from "../enum/weaponType"
import { ItemEntity } from "./itemEntity"

@Entity()
export default class WeaponEntity extends ItemEntity {
  @Column("integer")
  public weaponType: WeaponType

  @Column("integer")
  public damageType: DamageType

  @Column("text")
  public attackVerb: AttackVerb

  @Column()
  public maxCharges: number

  @Column()
  public currentCharges: number

  @Column("text")
  public spellType: SpellType

  @Column()
  public castLevel: number
}
