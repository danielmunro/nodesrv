import { Column, Entity } from "typeorm"
import { DamageType } from "../../damage/damageType"
import { WeaponType } from "../weaponType"
import { Item } from "./item"
import { AttackVerb } from "../../mob/fight/attackVerb"

@Entity()
export default class Weapon extends Item {
  @Column("integer")
  public weaponType: WeaponType

  @Column("integer")
  public damageType: DamageType

  @Column("text")
  public attackVerb: AttackVerb
}
