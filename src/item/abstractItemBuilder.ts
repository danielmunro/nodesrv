import {AffectType} from "../affect/affectType"
import {newAffect} from "../affect/factory"
import ServiceBuilder from "../gameService/serviceBuilder"
import MobBuilder from "../test/mobBuilder"
import PlayerBuilder from "../test/playerBuilder"
import RoomBuilder from "../test/roomBuilder"
import {Inventory} from "./model/inventory"
import {Item} from "./model/item"

export default class AbstractItemBuilder {
  constructor(private readonly serviceBuilder: ServiceBuilder, protected item: Item = new Item()) {}

  public addItemToContainerInventory(item: Item): AbstractItemBuilder {
    this.item.container.inventory.addItem(item)
    return this
  }

  public addToMobBuilder(mobBuilder: MobBuilder): AbstractItemBuilder {
    mobBuilder.mob.inventory.addItem(this.item)
    return this
  }

  public equipToMobBuilder(mobBuilder: MobBuilder): AbstractItemBuilder {
    mobBuilder.mob.equipped.addItem(this.item)
    return this
  }

  public addToPlayerBuilder(playerBuilder: PlayerBuilder): AbstractItemBuilder {
    playerBuilder.player.sessionMob.inventory.addItem(this.item)
    return this
  }

  public equipToPlayerBuilder(playerBuilder: PlayerBuilder): AbstractItemBuilder {
    playerBuilder.player.sessionMob.equipped.addItem(this.item)
    return this
  }

  public addToRoomBuilder(roomBuilder: RoomBuilder): AbstractItemBuilder {
    roomBuilder.room.inventory.addItem(this.item)
    return this
  }

  public addToInventory(inventory: Inventory): AbstractItemBuilder {
    inventory.addItem(this.item)
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

  public build(): Item {
    this.serviceBuilder.addItem(this.item)
    return this.item
  }
}
