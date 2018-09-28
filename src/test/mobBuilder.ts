import { Item } from "../item/model/item"
import { Mob } from "../mob/model/mob"
import ServiceBuilder from "../service/serviceBuilder"
import AbstractBuilder from "./abstractBuilder"

export default class MobBuilder extends AbstractBuilder {
  private equipNextEquipment = false

  constructor(public readonly mob: Mob, serviceBuilder: ServiceBuilder) {
    super(serviceBuilder)
  }

  public equip(): MobBuilder {
    this.equipNextEquipment = true

    return this
  }

  public withHelmetEq(): Item {
    return this.doEquip(super.withHelmetEq())
  }

  public withAxeEq(): Item {
    return this.doEquip(super.withAxeEq())
  }

  public withMaceEq(): Item {
    return this.doEquip(super.withMaceEq())
  }

  private doEquip(equipment) {
    if (this.equipNextEquipment) {
      this.equipNextEquipment = false
      this.mob.equipped.inventory.addItem(equipment)
      return equipment
    }

    this.mob.inventory.addItem(equipment)

    return equipment
  }
}
