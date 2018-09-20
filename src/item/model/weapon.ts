import { Column, Entity } from "typeorm"
import { DamageType } from "../../damage/damageType"
import { AttackVerb } from "../../mob/fight/attackVerb"
import { WeaponType } from "../weaponType"
import { Item } from "./item"

@Entity()
export default class Weapon extends Item {
  @Column("integer")
  public weaponType: WeaponType

  @Column("integer")
  public damageType: DamageType

  @Column("text")
  public attackVerb: AttackVerb
}
