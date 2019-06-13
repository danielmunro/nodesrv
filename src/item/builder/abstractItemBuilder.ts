import {AffectType} from "../../affect/enum/affectType"
import {newAffect} from "../../affect/factory/affectFactory"
import MobBuilder from "../../support/test/mobBuilder"
import {ItemEntity} from "../entity/itemEntity"
import {MaterialType} from "../enum/materialType"
import {createItem} from "../factory/itemFactory"

export default class AbstractItemBuilder {
  constructor(
    protected item: ItemEntity = createItem(),
    carriedBy?: any) {
    this.item.carriedBy = carriedBy
  }

  public addItemToContainerInventory(item: ItemEntity): AbstractItemBuilder {
    this.item.container.inventory.addItem(item)
    return this
  }

  public addToMobBuilder(mobBuilder: MobBuilder): AbstractItemBuilder {
    mobBuilder.mob.inventory.addItem(this.item, mobBuilder.mob)
    return this
  }

  public resetAffects(): AbstractItemBuilder {
    this.item.affects = []
    return this
  }

  public addAffect(affectType: AffectType): AbstractItemBuilder {
    this.item.affects.push(newAffect(affectType))
    return this
  }

  public notTransferrable(): AbstractItemBuilder {
    this.item.isTransferable = false
    return this
  }

  public withValue(value: number): AbstractItemBuilder {
    this.item.value = value
    return this
  }

  public setMaterial(material: MaterialType): AbstractItemBuilder {
    this.item.material = material
    return this
  }

  public build(): ItemEntity {
    return this.item
  }
}
