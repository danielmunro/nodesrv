import ServiceBuilder from "../gameService/serviceBuilder"
import ItemBuilder from "../item/itemBuilder"
import { Item } from "../item/model/item"
import WeaponBuilder from "../item/weaponBuilder"

export default class AbstractBuilder {
  constructor(protected readonly serviceBuilder: ServiceBuilder) {}

  public withHelmetEq(): Item {
    return new ItemBuilder(this.serviceBuilder)
      .asHelmet()
      .build()
  }

  public withAxeEq(): Item {
    return new WeaponBuilder(this.serviceBuilder)
      .asAxe()
      .build()
  }
}
