import ServiceBuilder from "../gameService/serviceBuilder"
import {newFood} from "../item/factory"
import ItemBuilder from "../item/itemBuilder"
import { Item } from "../item/model/item"
import WeaponBuilder from "../item/weaponBuilder"

export default class AbstractBuilder {
  constructor(protected readonly serviceBuilder: ServiceBuilder) {}

  public withSatchelEq(): Item {
    return new ItemBuilder(this.serviceBuilder)
      .asSatchel()
      .build()
  }

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

  public withMaceEq(): Item {
    return new WeaponBuilder(this.serviceBuilder)
      .asMace()
      .build()
  }

  public withFood(): Item {
    const food = newFood("a muffin", "a muffin is here")
    this.serviceBuilder.addItem(food)

    return food
  }
}
