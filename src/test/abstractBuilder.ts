import { DamageType } from "../damage/damageType"
import { Equipment } from "../item/equipment"
import { newEquipment, newFood, newWeapon } from "../item/factory"
import { Item } from "../item/model/item"
import { WeaponType } from "../item/weaponType"
import ServiceBuilder from "../service/serviceBuilder"

export default class AbstractBuilder {
  constructor(private readonly serviceBuilder: ServiceBuilder) {}

  public withHelmetEq(): Item {
    const equipment = newEquipment("a baseball cap", "a baseball cap is here", Equipment.Head)
    equipment.value = 10
    this.serviceBuilder.addItem(equipment)

    return equipment
  }

  public withAxeEq(): Item {
    const equipment = newWeapon("a toy axe", "a toy axe", WeaponType.Axe, DamageType.Slash)
    equipment.value = 10
    this.serviceBuilder.addItem(equipment)

    return equipment
  }

  public withMaceEq(): Item {
    const equipment = newWeapon("a toy mace", "a toy mace", WeaponType.Mace, DamageType.Bash)
    equipment.value = 10
    this.serviceBuilder.addItem(equipment)

    return equipment
  }

  public withFood(): Item {
    const food = newFood("a muffin", "a muffin is here")
    this.serviceBuilder.addItem(food)

    return food
  }
}
